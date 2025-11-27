/*

Requirements ===================================
- widgets resize
- layout adjust / reflow
- drag and drop re-arrange - selected widget highlight
- where we are dropping - highlight
- hand icon
- dragging handles
- possible drag end positions highlights
- corners + sides drag
- should other widgets shrink?? Or just reflow - find the next slot
- should the order remain same? Or widgets can find any slot available to drop? 
    *Doesn't look like good exp.. may be avoid. Let user arrange.

- add widget
- responsive breakpoints (l/m/s)
- collision handling - auto compaction (no overlaps)
- edit mode / view mode
- keyboard support / multi-select widgets
- real time collaboration - presence + live layout edits?
- snapping

NFR
- perf 60fps, tti < 2 s, layout ops < 16ms
- reliability - layout persistence with optimistic ui updates + server reconciliation
- accessibility - focus, aria roles, keyboard ops, contrast
- security - RBAC for editing, audit logs
- observability - telemetry for drag durations, save errors, usage
- browser support - latest evergreen, graceful degradation for older versions



Scope ===================================
- widgets resize
- layout reflow
- drag and drop - rearrange

- Grid layout enginer + collision resolution
- Widget SDK
- basic real time via websockets (optional toggle)

Out
- cross dashboard linking / templating
- SSR of dynamic canvas??


Assumptions ===================================
- React
- Redux / zustand store management
- Design system exists
- Widgets are react components


HLD ===================================
Layout Container
- prop: layout config base
- onChange prop callback - to save config to server?
- state management of layout
- children (widgets) - drag/resize callbacks

Widget
- callbacks on resize

LLD ===================================

LayoutContainer
    Props
        - initial config (server based)
        - onChange - updating config to server

    State
        - layout config
        - update to layout
        - currWidget being modified
        - position (if left, should fallback)
    
    Methods
        - onDrag
        - onResize

Widget
    - id
    - content
    - drag/drop/resize handlers
    - className (to highlight if this is one)
*/