# Wormholes

> **Status:** draft / design sketch. Terminology is from the current codebase
> (`Board`, `EvaluableBoard`, `Port`, `terminalPiece`, `RelativeEdge`, connection
> map, `layerDecomposition`, `Cyclic`, `PortInfo`, `Signal`, `Capacity`).
> Nothing here is implemented yet.

## 1. Concept

A **wormhole is a special case of a board port.** A board has four sides
(`Up`, `Right`, `Down`, `Left`), each carrying one `Port`
(`{ portType :: Input | Output, capacity :: Capacity }`). Normally a port
connects its side to the outside world — the test harness injects a signal into
an `Input` port and reads a signal out of an `Output` port.

A wormhole is a **pair** of side ports that the board evaluator cross-links to
*each other*, internally, with a one-tick delay, instead of exposing them to the
harness:

- the **mouth** — an `Output` port on one side. It *consumes* whatever the board
  drives at that side (like any output port), but the value goes into a buffer
  instead of to the harness.
- the **tail** — an `Input` port on another side. It *drives* a signal into the
  board (like any input port), but the value comes from the buffer instead of
  from the harness.

```
signal consumed at the mouth at tick t   ==>   signal emitted at the tail at tick t+1
```

Two rules:

1. **Unidirectional.** Signal flows mouth → tail only. A bidirectional link would
   need two pairs, and there is never room for a second (rule 2).
2. **Zero or one pair.** A board always has at least one harness output, so at
   most three sides are free; a pair needs two of them (one `Output`, one
   `Input`). You cannot fit a second pair — we run out of sides. So a level has
   either no wormhole or exactly one mouth + one tail.

## 2. From a piece's perspective: nothing is special

A piece next to a wormhole endpoint sees an ordinary input or output edge and
reads/writes it exactly as it would against any neighbour. The mouth is just an
`Output` port; the tail is just an `Input` port. `portMatches`, capacity
matching, connection rules, `PortInfo`, rendering — all unchanged.

Everything wormhole-specific — the buffer, the cross-link, "not harness I/O" —
lives in the board evaluator. So:

- **`Piece` / `Piece.eval` — unchanged.** Still
  `Map CardinalDirection Signal -> Map CardinalDirection Signal`, pure.
- **`Port` — unchanged.** Capacity is already a `Port` field, so the wormhole's
  capacity is just its two ports' capacities. If they disagree, or if a
  neighbouring piece's port doesn't match, the signal simply does not propagate —
  same as any mismatched port pair today. No truncation, no special case, no
  error.
- **`terminalPiece` — reused as-is.** During `buildEvaluableBoard` each side port
  already expands to a terminal piece: an `Input` port → `terminal-input` (drives
  the board), an `Output` port → `terminal-output` (consumes from the board). The
  mouth *is* a `terminal-output`; the tail *is* a `terminal-input`.
- **`buildConnectionMap`, `layerDecomposition`, `Cyclic` — unchanged.** A
  terminal-input has no inputs and a terminal-output has no outputs, so the pair
  contributes no edge across the graph. The wormhole is a graph **cut**: it
  cannot cause `Cyclic`, and a board with one is *sequential* (it ticks and
  retains one `Signal`).

This is the smallest step from combinational to sequential logic: one 1-deep
register whose two ends are routed to whichever board sides the level wants.
Flip-flops, counters, etc. are built as boards that use this mechanic — no
further primitives are added.

## 3. Semantics

### 3.1 The delay and the tick

Let `buf :: Signal` be the retained value, `zero` initially.

On each tick `t`:

1. **emit** — the tail drives `buf` into the board at its side.
2. ...board evaluates as normal...
3. **capture** — whatever signal is present at the mouth's side at end of
   evaluation becomes `buf'`. This read happens *after the full layer sweep*,
   not when the mouth's layer is reached (layer order within an antichain is
   arbitrary).
4. `buf := buf'`.

The tail always emits what the mouth saw one tick earlier. **At `t = 0` the tail
emits `zero`** — nothing has been captured yet, and there is no way to preset
`buf`.

### 3.2 What is a "tick"?

Per **test-case frame.** A `TestCase` for a wormhole level is a sequence of
input/output frames; each frame is one tick. Frame `k`'s expected output may
depend on frame `k-1`'s input; frame `0`'s output cannot depend on any input.
`Completion` flags such a level sequential so the harness runs frame sequences.

The render layer can animate the mouth → tail hand-off between ticks (segment
interpolation), but the authoritative tick is the test frame.

### 3.3 Feedback

Because the wormhole is a graph cut, this is legal and does **not** raise
`Cyclic`:

```
[input] ─▶ [xor] ─▶ (mouth side)
             ▲
             └────── (tail side) ◀── routed back through the interior
```

A 1-bit accumulator / toggle. This is the main reason a level includes a
wormhole.

## 4. Evaluation model changes

All at the board-evaluator level; the `Piece` interface is untouched.

- **`Board` gains** `wormhole :: Maybe { mouth :: CardinalDirection, tail :: CardinalDirection }`
  — which two side ports are internally linked. `Maybe`: zero or one.
- **`EvaluableBoard`** records the two terminal-piece locations for the pair and
  a buffer slot. The buffer is keyed by an **id that can later become an instance
  path** (`WormholeId`), not hardcoded as "the board's one wormhole" — so
  reusing a wormhole board as a piece (§5) doesn't churn the evaluator.
- **`injectInputs`** skips the tail side; instead seeds the tail's edge in the
  `PortInfo` map with `buf` (`{ connected: true, signal: buf, port: outputPort capacity }`).
- **`extractOutputs`** skips the mouth side; instead reads the mouth's edge →
  `buf'`.
- **Evaluation threads the buffer.** *(Implemented for the piece-level
  `WormholeIn`/`WormholeOut` ports in `Game.Board.EvaluableBoard.Tick`.)* Rather
  than widening `EvaluableM`'s `State` (still just `Map RelativeEdge PortInfo`),
  one tick takes the buffer as a value and returns next tick's:
  `stepEvaluableBoard :: EvaluableBoard -> WormholeBuffer -> Map .. Signal -> Tuple (Map .. Signal) WormholeBuffer`.
  A board with no wormhole piece ignores the buffer and returns an empty one.
  Inside a tick: seed every `WormholeOut` edge from the buffer, run the normal
  layer sweep, then read every `WormholeIn` edge back off the board as the next
  buffer (stored against the opposite `WormholeOut` side, matching
  `Game.Piece.Types.stepPiece`).
- **`WormholeBuffer`** = `Map (List Location) (Map CardinalDirection Signal)` —
  every buffer in the nesting tree, keyed by instance path (see Nesting below).
- **`tick`** — advancing the buffer is `buf := buf'`, i.e. the multi-tick runner
  simply feeds each tick's returned buffer into the next call; there is no
  separate mutating operation.
- **Multi-tick runner** — `runEvaluableBoardTicks :: EvaluableBoard -> Array (Map .. Signal) -> Array (Map .. Signal)`
  folds input frames through the board, one output frame per tick, threading the
  buffer between frames (starts empty, so a `WormholeOut` emits `zero` on frame
  0). Wormhole-level test cases run through this instead of the single-shot path.
  *(Wiring `Completion`'s frame-sequence test cases to it is still pending.)*
- **`checkPortMismatch`** (`Completion`) excludes wormhole sides from "the ports
  the level requires."
- **Buffer resets to `zero`** on: any board edit (history push), test-frame
  sequence start, `Clear`, `Undo`, `Redo`, level (re)load. It is transient
  component/evaluator state (sibling to `lastEvalWithPortInfo`), never stored in
  `Board` / `boardHistory` — otherwise every tick pollutes undo.

### Nesting (flip-flops built from wormhole boards)

> **Status:** the evaluator half is implemented in
> `Game.Board.EvaluableBoard.Tick`; the build half (discovering which locations
> hold a board-as-piece) is not, so `EvaluableBoard.subBoards` is always empty
> for a board built straight from the model. `evaluableBoardPiece` still wraps a
> board as an opaque `Piece` for `Completion`'s port-mismatch check only.

`evaluableBoardPiece` wraps a board as an opaque `Piece` whose `eval` does
`evalState (...) M.empty` — fresh state every call. A stateful sub-board cannot
be an opaque `inputs -> outputs` closure, and `Piece.eval` must stay pure.

**Resolution: recurse at eval, don't flatten.** `EvaluableBoard` gains
`subBoards :: Map Location EvaluableBoard`. During a tick, when the layer sweep
reaches a location in `subBoards`, `Tick` runs that sub-board for the same tick
in its *own* fresh `PortInfo` state (the sub-board's local `Location`s would
collide in a shared edge map — the one thing flattening would have to remap),
gathers its input signals from the parent edges, and writes its outputs back
onto the parent edges. Only the **buffer** threads through, and it is keyed by
the **instance path**: the `List Location` from the root board through each
`subBoards` step to the piece that owns the buffer. A wormhole piece directly in
the root is keyed `pure loc`; the same piece one level down at `L` is keyed
`L : pure loc`.

So every buffer in the whole nesting tree lives in one flat `WormholeBuffer`
owned by the root call, `Piece.eval` never sees state, and there is no
coordinate remapping. Flattening at build time (inlining sub-board pieces into
the parent graph) remains a possible later optimisation — same relationship as
`EvaluableBoard` → `CompiledBoard` — and would not change the buffer key type.

## 5. Creating a wormhole in the UI

Ports live on board sides, so making a wormhole is designating two free sides as
a linked `Output`/`Input` pair.

1. A level that permits a wormhole shows a single **wormhole affordance** in the
   sidebar, distinct from the piece list, present only when at least two sides
   are free.
2. Activate it (drag out, or press `w`). Free sides highlight; sides that
   already carry a port are not selectable.
3. First free side → **mouth** (`Output`, "consume" glyph, pulsing link stub).
   The affordance switches to "place the tail".
4. Second free side → **tail** (`Input`, "emit" glyph). The pair commits to
   `boardHistory` as one undo step.
5. `Esc` / clicking the affordance again before step 4 cancels; nothing is
   committed.

No rotation — a side has one inward direction, so facing is fixed by which side.

### Visual language

- The two endpoints share a **portal colour / glyph** (one pair, so one colour),
  chosen to read as "portal", not "port".
- Mouth: arrow pointing off-board (signal leaves the interior). Tail: arrow
  pointing on-board (signal enters the interior).
- A faint **link arc** connects mouth → tail behind the pieces, with a direction
  arrow, so unidirectionality is obvious.
- The port-state background ("outlines now have a background that shows state of
  ports") applies to each endpoint's port as usual.
- Optionally animate the buffered signal travelling mouth → tail over one tick.

### Editing

- `Capacity` hotkeys (`1`/`2`/`3`/`4`, `e`/`E`) on either endpoint set that
  end's port capacity.
- Deleting either endpoint deletes both — one object, one undo step; the
  affordance returns to "place wormhole".
- Re-assigning an endpoint to a different free side is one undo step; the arc
  follows.

## 6. Edge cases

### 6.1 Incomplete pair (one side designated, other not)

Only reachable mid-interaction. The half-placed mouth lives in component state,
is not in `boardHistory`, is not in the `Board` handed to evaluation. Cancel /
`Esc` / navigating away / starting another drag discards it. No error type is
needed — a lone endpoint never reaches the model.

### 6.2 Mouth side with nothing driving it

Legal. Captures `zero` every tick, so the tail emits `zero` after tick 1. Draw
its port as unconnected.

### 6.3 Tail side with nothing consuming it

Legal but pointless — emits into the void. Optional soft sidebar hint; not an
error.

### 6.4 Capacity mismatch

Mouth capacity ≠ tail capacity, or a neighbouring piece's port doesn't match:
the signal does not propagate. Identical to a mismatched port pair today.
Nothing special to implement.

### 6.5 Mouth and tail on adjacent sides

e.g. mouth `Up`, tail `Right`. Still a **1-tick** delay — a register, not a
wire. This is the case where a wormhole differs from routing a signal across the
board with pieces.

### 6.6 Both endpoints on the same side

Impossible — a side carries one port and it is consumed once designated.

### 6.7 Feedback loop that is only the wormhole

`(tail side) ─▶ [wire] ─▶ (mouth side)`: legal, no `Cyclic`. `buf` circulates
unchanged — stays `zero` forever. Put a transforming piece (e.g. `not`) in the
loop and you get a tick-by-tick oscillator. The multi-tick runner needs a
bounded frame count so it terminates.

### 6.8 A 0-delay cycle that does not pass through the wormhole

Still triggers `Cyclic`, as today. The wormhole only cuts the path through it.

### 6.9 Signal changing every tick

Depth 1. A stream at the mouth reappears at the tail shifted one tick; there is
no queue. Each tick's capture overwrites the last — values do not back up.

### 6.10 Undo / redo

Placing the pair, deleting the pair, moving an endpoint: each one history entry.
`boardHistory` never holds a lone endpoint. The buffer is not in history and
resets on any of these.

### 6.11 Multimeter

Probing the mouth shows what is about to be captured this tick; probing the tail
shows what was emitted this tick (last tick's capture). A tooltip should call out
the 1-tick offset so it is not read as a bug.

### 6.12 Level definition / serialization

A level stores which side is the mouth, which is the tail, and each side's port
capacity. The loader accepts zero or two endpoints. The level is flagged
sequential so `Completion` runs frame-sequence test cases.

### 6.13 Demonstration / tutorial

Add a "placing a wormhole" demonstration (cf. `docs/board_events.md`), shown the
first time a wormhole level is played.

## 7. Open questions for the author

1. Tick model: is per-test-frame the whole story, or is an explicit clock port
   wanted later?
2. ~~Exact shape of `tick` at the evaluator level, and the buffer-collection
   type.~~ Settled for the piece-level ports: buffer passed in / returned per
   tick (no separate `tick` op), collection
   `Map (List Location) (Map CardinalDirection Signal)` keyed by instance path.
   See §4 and `Game.Board.EvaluableBoard.Tick`.
3. Is "zero or one pair" permanent, or could a future board shape want more?
