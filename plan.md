
## Engine Logic Plan

### 1. Instance Creation

An external event arrives (HTTP request, MQTT message, cron tick, manual API call). The engine must resolve **which instance** should handle it.

**Steps:**

```
TriggerArrival(definitionId, triggerNodeId, rawPayload)
│
├─ 1. Load WorkflowDefinition from cache (by definitionId + latest version)
│
├─ 2. Validate payload against definition.inputSchema (if set)
│     → reject early with 400 if invalid
│
├─ 3. Resolve CorrelationKey
│     Read trigger's correlationExpression from the definition
│     Apply to rawPayload:
│       - JSONPath ($.body.order_id) → extract string
│       - $topic[n] (MQTT) → extract topic segment
│       - null expression → key = null (behaves like AlwaysCreate)
│
├─ 4. Route to Instance (onMatch strategy)
│     Query store: find active instance WHERE definitionId AND correlationKey match
│
│     MapOrCreate:
│       found → use existing instance
│       not found → create new instance
│
│     MapOrDiscard:
│       found → use existing instance
│       not found → drop payload, return, done
│
│     AlwaysCreate:
│       always → create new instance (ignore key entirely)
│
│     MapOrReplace:
│       found → terminate existing (status=Terminated), then create new instance
│       not found → create new instance
│
├─ 5. Enforce maxActiveInstances
│     If creating new, count active instances for this definitionId
│     If at cap → reject or queue (depending on config)
│
├─ 6. Initialize Context (on new instance only)
│     Create InstanceContext = {}
│     Write trigger payload: $.triggers.<triggerNodeId> = rawPayload
│
├─ 7. On existing instance (MapOrCreate found match):
│     Write new arrival into InstanceContext: $.triggers.<triggerNodeId> = rawPayload
│     (Existing context is preserved, just enriched)
│
├─ 8. Create initial ExecutionPointer
│     { nodeId: triggerNodeId, incomingPort: null, status: Active, branchContextId: null }
│
└─ 9. Enqueue pointer → enter Execution Loop
```

**New instance entity:**
```
WorkflowInstance {
    instanceId: new Guid,
    definitionId,
    definitionVersion: definition.version,   // pinned
    correlationKey,
    status: Running,
    createdAt: now
}
```

---

### 2. Execution Loop (the Orchestrator)

The core loop that processes pointers. This is a `while` loop that drains all active pointers for an instance before returning control. Pointers created mid-loop are enqueued and processed in the same pass.

```
ExecutionLoop(instanceId)
│
├─ while (queue has Active pointers for this instance):
│   │
│   ├─ 1. Dequeue next pointer (ordered by priority if definition has priority set)
│   │
│   ├─ 2. Check for matching Bookmark
│   │     If pointer's targetPort matches an existing bookmark on this nodeId:
│   │       → this is a RESUME, not a fresh run
│   │       → load the suspended pointer, cancel the bookmark
│   │       → the executor receives a flag: isResuming = true
│   │
│   ├─ 3. Load node definition from WorkflowDefinition.nodes[pointer.nodeId]
│   │
│   ├─ 4. Resolve INodeExecutor from the node type registry
│   │
│   ├─ 5. Build NodeExecutionContext
│   │     {
│   │       pointer,
│   │       nodeDefinition (property bag),
│   │       instanceContext (read/write),
│   │       branchContext (read/write, may be null),
│   │       globalContext (read-only),
│   │       expressionEngine,
│   │       isResuming
│   │     }
│   │
│   ├─ 6. Execute: result = executor.ExecuteAsync(context)
│   │
│   ├─ 7. Apply result (see "Node Execution Result" below)
│   │     - Apply ContextMutations to appropriate context tier
│   │     - Process EmittedPorts → create new pointers
│   │     - Process Suspend → create bookmark
│   │     - Process Error → route to error handler
│   │
│   ├─ 8. Persist atomically
│   │     Single transaction: pointer status, context changes, new pointers, bookmarks
│   │     Optimistic concurrency on instance row to prevent double-processing
│   │
│   └─ 9. New pointers created in step 7 → enqueue into this loop
│
├─ After queue is drained:
│   Check: are ALL pointers for this instance in terminal states (Completed|Faulted)?
│     yes → instance.status = Completed, instance.completedAt = now
│     no  → at least one pointer is WaitingForSignal → instance stays Running
│
└─ Return
```

**Concurrency safety:** only one thread processes one instance at a time. A lock per `instanceId` (in-memory `ConcurrentDictionary<Guid, SemaphoreSlim>` or a distributed lock for multi-node) prevents two trigger arrivals from racing on the same instance's context.

---

### 3. Pointer Logic — Creation, Propagation, Completion

**Pointer creation from emitted ports:**

When a node result includes `EmittedPorts: ["onIteration", "onComplete"]`:

```
for each emittedPort:
    connections = definition.connections
        .Where(c => c.sourceNodeId == pointer.nodeId && c.sourcePort == emittedPort)

    for each connection:
        newPointer = {
            pointerId: new Guid,
            instanceId: pointer.instanceId,
            nodeId: connection.targetNodeId,
            incomingPort: connection.targetPort,
            status: Active,
            branchContextId: ???  // see below
        }
        enqueue(newPointer)
```

**BranchContext propagation rules:**

| Scenario | branchContextId on new pointer |
|----------|-------------------------------|
| Single connection (1:1 pass-through) | Inherit from source pointer |
| Fan-out from loop (N pointers, N BranchContexts) | Each pointer gets a NEW BranchContext, pre-seeded by the executor |
| Non-loop fan-out (1 port → N connections) | All share the SAME branchContextId as the source |
| Root path (no branch) | null |

The distinction: **loop fan-out** creates per-iteration contexts. **Non-loop fan-out** (e.g. one output port wired to 3 different nodes) shares context because they're parallel branches of the same logical step, not iterations.

How the engine knows which is which: the `NodeResult` explicitly says — see section 5.

**Pointer completion:**

A pointer is marked `Completed` when:
- Its executor returned `EmittedPorts` (successfully fired downstream) and `Suspend = false`
- Or: it returned no emitted ports and no suspension (terminal node)
- Or: it was a FanIn counter-increment that didn't meet the threshold

A pointer is marked `Faulted` when:
- The executor threw an unhandled exception
- And: the definition's `defaultRetryPolicy` has been exhausted
- And: no `globalErrorHandlerNodeId` is configured (or it too failed)

---

### 4. Bookmark Logic

**When a bookmark is created:**

The executor returns `Suspend = true`. The engine:

```
bookmark = {
    bookmarkId: new Guid,
    instanceId,
    nodeId: pointer.nodeId,
    pointerId: pointer.pointerId,
    awaitingPort: result.AwaitPort,        // e.g. "continue"
    createdAt: now,
    expiresAt: result.TimeoutMs > 0 ? now + result.TimeoutMs : null
}

pointer.status = WaitingForSignal
pointer.bookmarkId = bookmark.bookmarkId

persist(bookmark)
persist(pointer)
```

**When a bookmark is matched (signal arrives at a suspended node):**

During pointer creation (step 3 of execution loop), **before** creating a new pointer for a target node, the engine checks:

```
existingBookmarks = store.FindBookmarks(instanceId, targetNodeId, targetPort)

if (existingBookmarks.Any()):
    // RESUME path — don't create a new pointer
    bookmark = existingBookmarks.First()
    suspendedPointer = store.GetPointer(bookmark.pointerId)
    suspendedPointer.status = Active
    suspendedPointer.incomingPort = targetPort   // update to the resuming port
    delete(bookmark)

    // Cancel sibling bookmarks (e.g. timeout bookmark)
    siblingBookmarks = store.FindBookmarks(instanceId, targetNodeId)
        .Where(b => b.bookmarkId != bookmark.bookmarkId)
    foreach (sibling): delete(sibling)

    enqueue(suspendedPointer)   // re-enters execution loop
else:
    // No bookmark — create fresh pointer as normal
    create new ExecutionPointer, enqueue
```

**Timeout bookmarks:**

A background `BookmarkTimeoutService` (a `BackgroundService` / hosted service) periodically scans for bookmarks where `expiresAt <= now`:

```
expiredBookmarks = store.FindExpiredBookmarks(now)

for each expired:
    pointer = store.GetPointer(expired.pointerId)
    pointer.status = Active
    pointer.incomingPort = expired.timeoutPort   // e.g. "onIterationTimeout"
    delete(expired)
    // Cancel sibling bookmarks for this pointer
    cancelSiblings(expired)
    // Trigger execution loop for this instance
    enqueue(pointer)
```

This is the same resumption path as a normal signal, just triggered by a timer instead of a connection.

**Crash recovery on startup:**

```
allWaitingPointers = store.FindPointers(status: WaitingForSignal)

for each pointer:
    bookmark = store.GetBookmark(pointer.bookmarkId)
    if (bookmark.expiresAt != null && bookmark.expiresAt <= now):
        // Already expired during downtime — resume as timeout immediately
        resume as timeout
    else:
        // Re-register with timeout service if expiry is set
        // Otherwise just leave it — it will be matched when the next signal arrives
```

---

### 5. Node Execution Result — The Contract

The `INodeExecutor` interface:

```csharp
interface INodeExecutor
{
    Task<NodeResult> ExecuteAsync(NodeExecutionContext context);
}
```

**NodeExecutionContext** — what the executor receives:

```csharp
class NodeExecutionContext
{
    ExecutionPointer Pointer;           // current pointer (id, nodeId, incomingPort, etc.)
    JsonObject NodeProperties;          // design-time config from the definition
    InstanceContext InstanceContext;     // read/write
    BranchContext? BranchContext;        // read/write, null if root path
    GlobalContext GlobalContext;         // read-only
    IExpressionEngine Expressions;      // resolve JSONPath, evaluate boolean rules
    bool IsResuming;                    // true if resuming from a bookmark
}
```

**NodeResult** — what the executor returns:

```csharp
class NodeResult
{
    // --- Output ---
    List<EmittedPort> EmittedPorts;     // port names to fire downstream
    List<ContextMutation> Mutations;    // writes to context

    // --- Suspension ---
    bool Suspend;                       // true = park this pointer
    string? AwaitPort;                  // which input port to wait for
    int? TimeoutMs;                     // optional timeout → creates expiring bookmark
    string? TimeoutPort;               // port to fire on timeout (e.g. "onIterationTimeout")

    // --- Error ---
    bool Faulted;                       // true = node failed
    string? ErrorMessage;

    // --- Branch ---
    List<BranchSeed>? BranchSeeds;     // if set, engine creates per-pointer BranchContexts
}
```

**EmittedPort:**
```csharp
class EmittedPort
{
    string PortName;                    // e.g. "onIteration", "onComplete"
}
```

**ContextMutation:**
```csharp
class ContextMutation
{
    ContextTier Tier;                   // Instance or Branch (never Global)
    string Key;                         // JSONPath target, e.g. "$.loop1.currentIndex"
    object Value;
    MutationOp Operation;              // Set, Merge, Increment, Append, Clear
}
```

**BranchSeed** — tells the engine to create per-pointer BranchContexts on fan-out:
```csharp
class BranchSeed
{
    string PortName;                    // which emitted port this seed applies to
    Dictionary<string, object> Data;   // initial data for the BranchContext
}
```

How the engine uses `BranchSeeds`:
```
If result.BranchSeeds is not null:
    for each emittedPort in result.EmittedPorts:
        seeds = result.BranchSeeds.Where(s => s.PortName == emittedPort)
        if seeds exist:
            // This is a loop/parallel fan-out — each connection gets its own BranchContext
            for each (connection, seed) pair:
                newBranchContext = create({ data: seed.Data, parentBranchContextId: pointer.branchContextId })
                newPointer.branchContextId = newBranchContext.id
        else:
            // Normal fan-out — inherit source pointer's branchContextId
            newPointer.branchContextId = pointer.branchContextId
```

---

### 6. Stores — Persistence Interfaces

```csharp
interface IDefinitionStore
{
    Task<WorkflowDefinition?> GetAsync(Guid definitionId, int? version = null);
    Task SaveAsync(WorkflowDefinition definition);
    Task<List<WorkflowDefinition>> ListDeployedAsync();
}

interface IInstanceStore
{
    Task<WorkflowInstance?> GetAsync(Guid instanceId);
    Task<WorkflowInstance?> FindByCorrelationAsync(Guid definitionId, string correlationKey);
    Task<int> CountActiveAsync(Guid definitionId);
    Task SaveAsync(WorkflowInstance instance);               // optimistic concurrency
    Task<List<WorkflowInstance>> ListAsync(Guid definitionId, InstanceStatus? status);
}

interface IContextStore
{
    // Global
    Task<GlobalContext> GetGlobalAsync();

    // Instance
    Task<InstanceContext> GetInstanceContextAsync(Guid instanceId);
    Task SaveInstanceContextAsync(Guid instanceId, InstanceContext context);

    // Branch
    Task<BranchContext> GetBranchContextAsync(Guid branchContextId);
    Task SaveBranchContextAsync(BranchContext context);
    Task<List<BranchContext>> GetBranchContextsForFanInAsync(Guid instanceId, List<Guid> branchContextIds);
}

interface IPointerStore
{
    Task<List<ExecutionPointer>> GetActiveAsync(Guid instanceId);
    Task<List<ExecutionPointer>> GetAllAsync(Guid instanceId);
    Task SaveAsync(ExecutionPointer pointer);
    Task SaveBatchAsync(List<ExecutionPointer> pointers);
}

interface IBookmarkStore
{
    Task SaveAsync(Bookmark bookmark);
    Task DeleteAsync(Guid bookmarkId);
    Task<List<Bookmark>> FindAsync(Guid instanceId, string nodeId, string? awaitingPort = null);
    Task<List<Bookmark>> FindExpiredAsync(DateTime now);
    Task DeleteByPointerAsync(Guid pointerId);   // cancel all bookmarks for a pointer
}
```

Two implementations planned:
- **InMemoryStore** — `ConcurrentDictionary`-backed, for tests and Ephemeral instances
- **EfCoreStore** — EF Core with SQL Server/PostgreSQL, for Persistent instances

The orchestrator doesn't pick the implementation — the `instanceMode` in the definition determines which store is injected at runtime. An ephemeral instance uses `InMemoryStore`; a persistent instance uses `EfCoreStore`. Both implement the same interfaces.
