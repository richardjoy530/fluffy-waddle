Searched codebase for "what about branches? what if i have parallel branches same 10 branchs created by the for loop mode=parallel. now down the flow there is a node that need a signal from another node in the same sub-branch. so the bookmark also needs to be branch-specific right?
", no results



Exactly right. The current bookmark design has a bug. Let me show you why, then fix it.

---

## The problem

10 parallel branches, all running through the **same node definitions** in the graph. Each branch hits a node that suspends (say a sub-loop with ack, or any emit-and-wait pattern):

```
Branch 0:  NodeA → NodeB(suspends, awaits "continue") → ...
Branch 1:  NodeA → NodeB(suspends, awaits "continue") → ...
Branch 2:  NodeA → NodeB(suspends, awaits "continue") → ...
...
Branch 9:  NodeA → NodeB(suspends, awaits "continue") → ...
```

All 10 branches run through the same `nodeId: "NodeB"` in the definition. They create 10 bookmarks:

```
Bookmark_0: { instanceId, nodeId: "NodeB", awaitingPort: "continue", pointerId: P0 }
Bookmark_1: { instanceId, nodeId: "NodeB", awaitingPort: "continue", pointerId: P1 }
...
Bookmark_9: { instanceId, nodeId: "NodeB", awaitingPort: "continue", pointerId: P9 }
```

Now Branch 3's downstream node completes and sends a signal to `NodeB.continue`. The engine searches:

```
FindBookmarks(instanceId, nodeId: "NodeB", awaitingPort: "continue")
→ returns ALL 10 bookmarks
→ which one to resume??
```

The current matching key `(instanceId, nodeId, awaitingPort)` is **ambiguous**. It can't distinguish which branch's ack this is.

---

## The fix — add `branchContextId` to Bookmark

```
Bookmark {
    bookmarkId:       Guid
    instanceId:       Guid
    nodeId:           string
    pointerId:        Guid
    awaitingPort:     string
    branchContextId:  Guid?      // ← NEW: scopes the bookmark to its branch
    timeoutPort:      string?
    createdAt:        DateTime
    expiresAt:        DateTime?
}
```

When the engine creates the bookmark, it copies the `branchContextId` from the suspended pointer:

```
Bookmark {
    ...
    nodeId:          pointer.nodeId,
    pointerId:       pointer.pointerId,
    awaitingPort:    result.AwaitPort,
    branchContextId: pointer.branchContextId    // null if root path, Guid if in a branch
}
```

---

## Matching with branch awareness

When a signal arrives at a port, the **incoming pointer also carries a `branchContextId`** (because it inherited it from the same branch chain). The engine uses it as part of the lookup:

```
incoming signal targets (nodeId: "NodeB", port: "continue")
incoming pointer's branchContextId = BranchContext_3

engine searches:
  FindBookmarks(instanceId, nodeId: "NodeB", awaitingPort: "continue", branchContextId: BranchContext_3)
  → returns only Bookmark_3
  → resumes P3
  → cancels P3's timeout bookmark (if any)
  → Branch 3 continues, branches 0-2 and 4-9 remain suspended
```

Each branch's ack wakes up **only its own** suspended pointer. No ambiguity.

---

## The full matching key

```
Old:  (instanceId, nodeId, awaitingPort)                          ← broken for parallel
New:  (instanceId, nodeId, awaitingPort, branchContextId)         ← branch-safe
```

For the root path (no branch), `branchContextId = null` and the match is effectively the old behavior — which is fine because there's only one pointer per node on the root path.

---

## How the signal "knows" its branch

This happens naturally through pointer propagation:

```
Loop creates 10 branches:
  Pointer P0 (branchContextId: BC_0) → NodeA → NodeB (suspends, bookmark has BC_0)
                                                  ↓ emits onIteration
                                              DownstreamNode (pointer inherits BC_0)
                                                  ↓ completes, emits ack
                                              signal to NodeB.continue
                                              new pointer to NodeB has BC_0
                                                  ↓
                                              engine matches bookmark with BC_0 → resumes P0
```

The `branchContextId` flows through the entire branch chain like a thread color. Every pointer in Branch 0's chain carries `BC_0`. When the ack signal loops back, the pointer that carries it still has `BC_0`, so it matches the right bookmark.

---

## Nested branches

If a branch itself fans out (a loop inside a branch), child pointers get a **new** `branchContextId` with `parentBranchContextId` pointing to the outer branch. The bookmark matching uses the **immediate** `branchContextId`, not the parent — so inner-branch bookmarks don't collide with outer-branch bookmarks.

```
Outer Branch BC_0:
  Inner Branch BC_0_A:  NodeX suspends, bookmark has branchContextId = BC_0_A
  Inner Branch BC_0_B:  NodeX suspends, bookmark has branchContextId = BC_0_B

Ack from inner branch A carries BC_0_A → matches only BC_0_A's bookmark
```

---

## Updated bookmark store interface

```csharp
interface IBookmarkStore
{
    Task SaveAsync(Bookmark bookmark);
    Task DeleteAsync(Guid bookmarkId);
    Task<List<Bookmark>> FindAsync(
        Guid instanceId, 
        string nodeId, 
        string awaitingPort, 
        Guid? branchContextId);        // ← branch-scoped lookup
    Task<List<Bookmark>> FindExpiredAsync(DateTime now);
    Task DeleteByPointerAsync(Guid pointerId);
}
```

Let me update the plan: 

Updated memory file [](file:///c%3A/Users/rjoy/AppData/Roaming/Code/User/workspaceStorage/110c1af046cf6fbdb0ca2510913ccb32/GitHub.copilot-chat/memory-tool/memories/ODVlZTBiZDUtMDEwYy00ZTk5LTkzMjgtOTUwMjU2ODI5NmJi/plan.md)

Plan updated. The bookmark is now branch-aware with `branchContextId` as part of the matching key. The signal arriving at a suspended port can only wake the pointer from its own branch — no cross-branch ambiguity even when 10 branches run through the same node definition.