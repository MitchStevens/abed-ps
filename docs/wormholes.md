# Wormholes

> **Status:** draft / design sketch. Terminology is lifted from the current
> codebase (`Board`, `EvaluableBoard`, `RelativeEdge`, connection map,
> `layerDecomposition`, `Cyclic`, `PortInfo`, `Signal`, `Capacity`,
> pseudo-pieces, `psuedoPieceLocations`). Nothing here is implemented yet.

## 1. Concept

A **wormhole** is an alternative to a normal board **port**. A board has four
sides (`Up`, `Right`, `Down`, `Left`); each side can carry one port. A port
connects that side to the outside world (the test harness injects an input or
reads an output). A wormhole instead connects two sides *to each other*,
internally, with a one-tick delay.

A wormhole always comes as a **pair**, occupying two sides:

- the **mouth** (entrance) — sits on one side and *consumes* whatever the board
  drives at that side, exactly like an output port would
- the **tail** (exit) — sits on another side and *emits* a signal into the
  board, exactly like an input port would

The pair behaves like a single one-tick delay wire stretched between two sides
of the board:

```
signal consumed at the mouth at tick t   ==>   signal emitted at the tail at tick t+1
```

Two rules:

1. **Unidirectional.** Signal only flows mouth → tail. The tail never consumes,
   the mouth never emits. A bidirectional link would need two pairs, and there
   is only ever room for one (see rule 2).
2. **Zero or one pair.** A board always has at least one output port, so at most
   three sides are free, and a pair needs two of them — you cannot fit a second
   pair. We run out of sides. So a level has either no wormhole endpoints or
   exactly one mouth + one tail.

### Why it is interesting

The rest of the game is **combinational**: `toEvaluableBoard` builds a DAG of
`RelativeEdge -> RelativeEdge` connections, `layerDecomposition` topologically
sorts it, and a cyclic board is rejected with `BoardError.Cyclic` ("ABED does
not admit cyclic boards"). Signals have no notion of time; a board is a pure
function `Map CardinalDirection Signal -> Map CardinalDirection Signal`.

A wormhole breaks that in one bounded way: the `t → t+1` delay means the mouth
and the tail are **not** in the same dependency graph. The tail's output at tick
`t` depends only on what the mouth captured at tick `t-1`, so:

- a wormhole is a **cut** in the dependency graph — it never contributes an edge
  to `layerDecomposition`, so it cannot cause a `Cyclic` error;
- a board with a wormhole is **sequential**: evaluating it means ticking, and it
  retains one unit of state (the buffered signal).

This is the smallest step from combinational to sequential logic: one 1-deep
register, with its two ends routed to whichever board sides the level wants.

## 2. Relationship to ports

| | normal port | wormhole endpoint |
|---|---|---|
| location | one board side | one board side |
| talks to | test harness (outside) | the other endpoint (inside) |
| direction | input *or* output | mouth = consumes, tail = emits |
| delay | n/a | 1 tick, mouth → tail |
| count | one per side | one pair per level, or none |
| in dependency graph | pseudo-piece, yes | no — it is a graph cut |
| retains state | no | yes (1 `Signal`) |

From the perspective of the board interior, a mouth looks exactly like an output
pseudo-piece and a tail looks exactly like an input pseudo-piece. Adjacency,
`portMatches`, and connection rules for the interior edge are unchanged.

## 3. Semantics

### 3.1 The delay and the tick

Let `buf :: Signal` be the wormhole's retained value, `zero` initially.

On each tick `t`:

1. **emit** — the tail drives `buf` into the board at its side.
2. ...board evaluates as normal...
3. **capture** — whatever signal is present at the mouth's side at end of
   evaluation becomes `buf'`.
4. `buf := buf'`.

So the tail always emits what the mouth saw one tick earlier. **At `t = 0` the
tail emits `zero`**, because nothing has been captured yet. This is fixed — there
is no way to preset `buf`.

### 3.2 What is a "tick"?

The game has no clock today. Likely model:

- **Per test-case frame.** A `TestCase` for a wormhole level is a *sequence* of
  input/output frames; each frame is one tick. Frame `k`'s expected output may
  legitimately depend on frame `k-1`'s input, and frame `0`'s output cannot
  depend on any input yet (the tail emits `zero`).

The visual layer can still animate the mouth → tail hand-off between ticks using
the existing segment-array interpolation code, but the authoritative tick is the
test frame.

`tick` is not a concept the `Piece` abstraction has yet. See §4.

### 3.3 Capacity

The wormhole carries `Signal` at a `Capacity`, like a wire. You can think of the
wormhole's capacity as being the mouth's (input-side) capacity, but the
semantics are identical whether you regard it as set by the mouth or by the
tail — the buffered value is one `Signal`, truncated to that capacity via
`canonical`.

If the capacity of the piece port feeding the mouth and the capacity expected at
the tail disagree, the signal simply does not propagate — same as any mismatched
port pair today. No truncation-on-entry, no special case, no error.

### 3.4 Feedback

Because the wormhole is a graph cut, this is legal and does **not** raise
`Cyclic`:

```
[input] ─▶ [xor] ─▶ (mouth side)
             ▲
             └────── (tail side) ◀── routed back through the interior
```

That is a 1-bit accumulator / toggle. This is the main creative reason a level
would include a wormhole.

## 4. Evaluation model changes

Sketch of the changes, mostly in `Game.Board.EvaluableBoard` and the `Piece`
abstraction:

- **`Piece` gains a `tick` operation.** `evaluableBoardPiece` currently builds a
  `Piece` with just `eval`. A wormhole board is stateful, so the piece needs to
  advance its retained state when `tick` is called. `mkPieceNoAdapt` / the
  `Piece` record grows a `tick :: SomeState -> SomeState` (or the eval type
  becomes state-threaded). Combinational pieces implement `tick` as identity.
- **`EvaluableBoard` gains a wormhole field**, e.g.
  `wormhole :: Maybe { mouth :: CardinalDirection, tail :: CardinalDirection, capacity :: Capacity }`.
  `Maybe`, because a level has zero or one.
- **`buildConnectionMap` ignores wormhole endpoints.** They never appear as key
  or value in `connections`, so `layerDecomposition` and the `Cyclic` check are
  untouched. The mouth still connects to whatever interior piece drives its side
  (like an output pseudo-piece); the tail still connects to whatever interior
  piece it feeds (like an input pseudo-piece).
- **`psuedoPieceLocations` / pseudo-piece handling** extends to place a
  consuming pseudo-piece at the mouth side and an emitting one at the tail side,
  distinct from real I/O ports so `injectInputs` / `extractOutputs` skip them.
- **Evaluation threads `buf`.** Instead of
  `Map CardinalDirection Signal -> Map CardinalDirection Signal`, a wormhole
  board is
  `Signal -> Map .. Signal -> Tuple (Map .. Signal) Signal`
  (`buf` in, outputs + `buf'` out). Combinational boards ignore the `Signal`.
- **`evalWithPortInfo` order:**
  1. seed the tail side's edge in the `PortInfo` map with `buf`
     (`{ connected: true, signal: buf, port: outputPort capacity }`);
  2. run the existing layer-by-layer sweep;
  3. read the mouth side's edge from the `PortInfo` map → `buf'`;
  4. return outputs and `buf'`.
  The mouth read must happen **after the full sweep**, not when the mouth's
  layer is reached — layer order within an antichain is arbitrary.
- **Multi-tick runner.** A helper that folds a list of input frames through the
  board, threading `buf` and calling `tick`, producing one output frame per
  tick. Wormhole-level test cases run through this instead of the single-shot
  path.
- **`Completion` marks the level sequential** so the harness interprets test
  cases as frame sequences and accounts for the 1-tick latency.

## 5. Creating a wormhole in the UI

### 5.1 Where it comes from

A wormhole is not a piece from the vault (you can't have many, and the two ends
are linked). A level that permits a wormhole shows a single **wormhole
affordance** in the sidebar, visually distinct from the piece list, present only
when at least two sides are free.

### 5.2 Placement flow

Ports live on board sides, so placing a wormhole is picking two free sides and
designating them mouth and tail.

1. Player activates the wormhole affordance (drag it out, or press `w` for
   **w**ormhole mode).
2. Free board sides highlight as targets. Sides already carrying a port are not
   selectable.
3. First target → **mouth**. The side shows a "consume" glyph (funnel pointing
   inward) and a pulsing link stub. The affordance switches to "place the tail".
4. Second free side → **tail**. The side shows an "emit" glyph (burst pointing
   inward). The pair commits to `boardHistory` as **one** undo step.
5. `Esc` / clicking the affordance again before step 4 cancels; nothing is
   committed (see §6.1).

No rotation: a side has exactly one inward direction, so the endpoint's facing
is fixed by which side it is on.

### 5.3 Visual language

- The two endpoints share a **portal colour / glyph** (only one pair, so one
  colour suffices) — chosen to read as "portal", not "port".
- Mouth: signal flows *in from the board* → funnel / arrow pointing off-board.
  Tail: signal flows *into the board* → burst / arrow pointing on-board.
- A faint **link arc** connects mouth → tail across the board behind the pieces,
  with a direction arrow, so unidirectionality is obvious.
- The port-state background from commit *"outlines now have a background that
  shows state of ports"* applies to the endpoint's port as usual (grey vs blue
  for signal off/on).
- Optionally animate the buffered signal travelling mouth → tail over one tick.

### 5.4 Editing after creation

- `Capacity` hotkeys (`1`/`2`/`3`/`4`, or `e`/`E`) on either endpoint set the
  pair's capacity.
- Deleting either endpoint deletes **both** — one object, one undo step. The
  sidebar affordance returns to "place wormhole".
- Re-assigning an endpoint to a different free side is a move: one undo step, the
  link arc follows.

## 6. Edge cases

### 6.1 Incomplete pair (one side designated, other not)

- Only reachable mid-interaction. The half-placed mouth lives in component state,
  is **not** written to `boardHistory`, and is **not** in the `Board` handed to
  evaluation. Cancel / `Esc` / navigating away / starting another drag discards
  it. No error type is needed for a dangling endpoint — it never reaches the
  model.

### 6.2 Mouth side with nothing driving it

- Legal. The mouth captures `zero` every tick, so the tail emits `zero` forever
  after tick 1. Draw the mouth's port as unconnected (no outline).

### 6.3 Tail side with nothing consuming it

- Legal but pointless — the tail emits `buf` into the void. Optional soft hint in
  the sidebar; not an error.

### 6.4 Capacity mismatch

- If the interior port feeding the mouth and the capacity at the tail disagree,
  the signal does not propagate — identical to a mismatched port pair today.
  Nothing special to implement.

### 6.5 Mouth and tail on adjacent sides

- e.g. mouth on `Up`, tail on `Right`. Still a **1-tick** delay. This is the
  case where a wormhole differs from just wiring across the board: it is a
  register, not a wire.

### 6.6 Both endpoints on the same side

- Impossible: a side carries one port/endpoint, and it is consumed once it is
  designated.

### 6.7 Feedback loop that is only the wormhole

```
(tail side) ─▶ [wire] ─▶ (mouth side)
```

- Legal, no `Cyclic`. `buf` circulates unchanged — it stays `zero` forever
  (constant-zero source). Put a transforming piece (e.g. `not`) in the loop and
  you get a tick-by-tick oscillator. The multi-tick runner needs a bounded frame
  count so it terminates.

### 6.8 A 0-delay cycle that does not pass through the wormhole

- Still triggers `Cyclic` as today. The wormhole only cuts the path that goes
  through it.

### 6.9 Signal changing every tick

- The wormhole is depth 1. A stream at the mouth reappears at the tail shifted
  by one tick; there is no queue. Each tick's capture overwrites the last —
  values do not back up.

### 6.10 Reset of `buf`

- `buf` resets to `zero` on: any board edit (history push), test-frame-sequence
  start, `Clear`, `Undo`, `Redo`, level (re)load. Otherwise the displayed state
  depends on interaction history and levels become non-deterministic.

### 6.11 Undo / redo

- Placing the pair, deleting the pair, and moving an endpoint are each one
  history entry. `boardHistory` never holds a lone endpoint.

### 6.12 Multimeter

- Probing the mouth's port shows what is *about to be captured* this tick;
  probing the tail shows what was *emitted* this tick (last tick's capture). A
  tooltip should call out the 1-tick offset so it is not read as a bug.

### 6.13 Level definition / serialization

- A level stores a wormhole section: which side is the mouth, which is the tail,
  and the capacity. The loader accepts zero or two endpoints. The level is
  flagged sequential so `Completion` runs frame-sequence test cases.

### 6.14 Demonstration / tutorial

- Add a "placing a wormhole" demonstration (cf. `docs/board_events.md`), shown
  the first time a wormhole level is played.

## 7. Open questions for the author

1. Tick model: is per-test-frame the whole story, or is an explicit clock port
   wanted later?
2. Exact shape of the new `Piece.tick` — state-threaded `eval`, or a separate
   `tick` field, and what the state type is.
3. Is "zero or one pair" permanent, or could a larger board (more sides? interior
   endpoints?) ever want more?
