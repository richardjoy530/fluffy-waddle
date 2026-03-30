

You're right — a bookmark is **purely port-based**. It says: "this pointer, on this node, is parked and will wake up when a signal arrives at this specific input port." There's no external key, no notification ID, no pub/sub. It's a connection delivering a signal to a port — same mechanism as everything else in the engine — the only difference is that the receiving node already has a suspended pointer waiting for it instead of needing a new one.

---

## Bookmark — Complete Definition

```
Bookmark {
    bookmarkId:     Guid        // unique identifier
    instanceId:     Guid        // which workflow instance this belongs to
    nodeId:         string      // which node is suspended
    pointerId:      Guid        // the specific ExecutionPointer that is parked
    awaitingPort:   string      // the input port name that will wake this up
    timeoutPort:    string?     // if this is a timeout bookmark, which port to fire on expiry
    createdAt:      DateTime    // when the bookmark was created
    expiresAt:      DateTime?   // null = wait forever; set = BookmarkTimeoutService fires at this time
}
```

---

## The 4 Lifecycle Events

### 1. Creation — a node suspends itself

A node executor returns `Suspend = true`. This is the node saying: "I've done what I can for now. I need an external signal to arrive at a specific port before I can continue."

```
// Node executor returns:
NodeResult {
    EmittedPorts:  ["onIteration"],        // fire downstream NOW
    Suspend:       true,                   // park this pointer
    AwaitPort:     "continue",             // wake me when "continue" receives a signal
    TimeoutMs:     5000,                   // optional: give up after 5 seconds
    TimeoutPort:   "onIterationTimeout"    // optional: which port to fire on timeout
}
```

The engine creates **one or two** bookmarks from this:

```
// Always created — the "ack" bookmark
Bookmark_A {
    bookmarkId:   new Guid,
    instanceId:   pointer.instanceId,
    nodeId:       pointer.nodeId,
    pointerId:    pointer.pointerId,
    awaitingPort: "continue",              // ← the port that will wake this up
    timeoutPort:  null,
    createdAt:    now,
    expiresAt:    null                     // waits forever for the signal
}

// Only created if TimeoutMs > 0 — the "timeout" bookmark
Bookmark_B {
    bookmarkId:   new Guid,
    instanceId:   pointer.instanceId,
    nodeId:       pointer.nodeId,
    pointerId:    pointer.pointerId,       // ← same pointer as Bookmark_A
    awaitingPort: "onIterationTimeout",    // ← different port
    timeoutPort:  "onIterationTimeout",
    createdAt:    now,
    expiresAt:    now + 5000ms             // expires if ack doesn't arrive in time
}

// The pointer itself:
pointer.status = WaitingForSignal
pointer.bookmarkId = Bookmark_A.bookmarkId
```

Two bookmarks, same pointer, same node — two possible wakeup paths. **Whichever fires first wins**, and cancels the other.

---

### 2. Resumption — a signal arrives at the awaited port

Some downstream node completes and emits a signal. That signal travels along a connection that targets the suspended node's `continue` port. During the pointer creation step, before creating a new pointer, the engine checks:

```
incoming signal → targets (nodeId: "loop1", port: "continue")

engine checks: any bookmarks WHERE instanceId AND nodeId="loop1" AND awaitingPort="continue"?

YES → Bookmark_A matches
  1. Load the suspended pointer (Bookmark_A.pointerId)
  2. Set pointer.status = Active
  3. Set pointer.incomingPort = "continue"
  4. Delete Bookmark_A
  5. Cancel siblings: delete Bookmark_B (the timeout one — no longer needed)
  6. Enqueue the pointer back into the execution loop
  7. Do NOT create a new pointer — the resumed one takes its place

NO bookmark matches →
  Create a fresh ExecutionPointer as normal
```

The critical point: **the port name is the matching key**. The engine doesn't need to know what node sent the signal, or why. It just sees "a signal arrived at `(loop1, continue)`" and checks if anyone is waiting there.

---

### 3. Expiration — timeout fires before the ack arrives

The `BookmarkTimeoutService` (a background hosted service) periodically scans:

```
expiredBookmarks = store.FindBookmarks(WHERE expiresAt <= now)

For each expired bookmark (Bookmark_B in our example):
  1. Load the suspended pointer (Bookmark_B.pointerId)
  2. Set pointer.status = Active
  3. Set pointer.incomingPort = "onIterationTimeout"   // the timeout port
  4. Delete Bookmark_B
  5. Cancel siblings: delete Bookmark_A (the ack one — ack didn't arrive in time)
  6. Enqueue the pointer → execution loop runs → executor handles the timeout
```

Same resumption mechanism — just triggered by a timer instead of a connection signal. The executor receives `incomingPort: "onIterationTimeout"` and `isResuming: true`, so it knows this is a timeout and can emit on `onIterationTimeout` output port to route execution to an error branch.

---

### 4. Cancellation — siblings cleaned up

Cancellation is not a standalone event — it always happens as a side effect of resumption:

```
When ANY bookmark for a pointer is matched (by signal or by timer expiry):
  → delete ALL other bookmarks for the same pointerId
```

This prevents the timeout from firing after the ack already resumed the pointer, or vice versa. One pointer can only be resumed once — the first bookmark to match wins and all others are deleted.

---

## Where Bookmarks Are Used

| Node / Scenario | Awaits Port | Has Timeout? | Why |
|----------------|-------------|-------------|-----|
| **StaticForLoop** (ack=true) | `continue` | Yes (ackTimeoutMs) | Loop fired downstream, needs ack before next iteration |
| **StaticForLoop** (paused) | `continue` | No | Loop was paused externally, waits for resume |
| **ScheduledTrigger** | `onSchedule` (internal) | Yes (next cron tick) | Timer-based: bookmark expires at the next scheduled time, fires the trigger |
| **FanIn** (waitTimeoutMs > 0) | `onTimeout` | Yes (waitTimeoutMs) | Counter-based node normally doesn't need bookmarks, but the timeout arm does — if N signals don't arrive in time, the timeout bookmark fires `onTimeout` |
| **Any future node** that needs to wait for an input signal after emitting output | whatever port | optional | The pattern is general-purpose |

---

## Where Bookmarks Are NOT Used

| Node / Scenario | Why Not |
|----------------|---------|
| **FanIn** (counting arrivals, no timeout) | No suspension — the node executes N times, atomically increments a counter in context, and fires on the Nth run. No pointer is ever parked. |
| **LogicGate / SwitchGate** | Synchronous — reads context, evaluates, emits immediately. Single pass, never waits. |
| **SetContext** | Synchronous — writes to context, emits `onComplete`. No waiting. |
| **HTTP Webhook Trigger** | The trigger handler writes to context and creates the initial pointer. The trigger itself doesn't suspend — it's the *source* of signals, not a consumer. |
| **Any node that completes in a single execution** | Bookmarks only exist for nodes that can't complete until something external happens. If a node reads, thinks, writes, and emits — no bookmark. |

---

## The Port Connection — Why This Matters

The bookmark is **always** tied to a specific port on a specific node. The signal that resumes it arrives via a normal connection in the definition graph:

```
DownstreamNode.output ──connection──→ Loop.continue
```

This means:
- **At design time**, the user draws this connection on the canvas. The ack path is part of the visible graph.
- **At runtime**, the engine doesn't need special "ack" infrastructure. It's just a connection like any other — the only difference is that the target node has a parked pointer instead of needing a fresh one.
- **The user controls the ack path.** They could wire the ack through intermediate nodes (e.g. a LogicGate that only acks if a condition is met). The bookmark doesn't care what's upstream — it just waits for the port.

This is NOT a notification system with a correlation key or a message bus topic. There is no "send ack with ID X to loop Y." The ack is a connection drawn on the canvas — same system, same rules, same visual model.

```
Bookmark is not:   "waiting for message with key ABC-123"
Bookmark IS:       "pointer P7 on node Loop1 is parked until port 'continue' receives a signal"
```

The signal arrives because a connection exists in the definition graph. No connection to that port = the bookmark waits forever (or times out). That's a design error the user would see on the canvas — a suspended node with no return path wired.