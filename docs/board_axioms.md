# Board operation axioms

> **Status:** draft. Board-level analogue of `docs/piece_axioms.md`, but for
> `Game.Board.Operation` (`addPiece`, `removePiece`, `movePiece`,
> `rotatePieceBy`, `increaseSize`/`decreaseSize`/`setBoardSize`,
> `adaptPortsAround`). Nothing here is tested yet — most of it is conjecture to
> be checked, not settled law.

Notation: `loc`, `src`, `dst` are `Location`s; `p` is a `Piece`; `r` is a
`Rotation`; `==` on `Board`/`_pieces` means structural equality of the
underlying map (see `Eq Board`/`Eq1 BoardF`); `≡` (borrowed from
`piece_axioms.md`) means eval-equivalent, not structurally equal.

---

## 0. Naming note (TODO)

The current names conflate two different things: a *raw structural mutation*
of `_pieces`, and that mutation *plus* the neighbour-port sync
(`adaptPortsAround`). Right now that split is spelled inconsistently:

- `addPiece` / `addPieceNoUpdate` and `removePiece` / `removePieceNoUpdate`
  make the split explicit via a `NoUpdate` suffix.
- `movePiece` and `rotatePieceBy` have **no** `NoUpdate` sibling — each
  inlines its own raw `_pieces` mutation directly rather than composing from
  `addPieceNoUpdate`/`removePieceNoUpdate` (see §1 below), so there's no way
  to move or rotate a piece without also triggering `adaptPortsAround`.
- `setBoardSize` doesn't fit either pattern: it's a raw mutation that never
  calls `adaptPortsAround` at all (§4).

We should probably rename around this split at some point — e.g. a
consistent `*Raw` (or `*NoUpdate`) / plain pair for every operation, or split
"structural mutation" and "port sync" into two composable primitives
everywhere instead of only for add/remove. Revisit once the axioms below are
tested and we know what the port-sync primitive actually guarantees.

---

## 1. Primitives

The board operations are not one flat set — they're four raw structural
mutations on `_pieces`, each (except resize) followed by the shared
port-sync primitive:

| Raw mutation | Function | Port sync after? |
| --- | --- | --- |
| insert at empty location | `addPieceNoUpdate` | `addPiece` adds `adaptPortsAround loc` |
| delete at occupied location | `removePieceNoUpdate` | `removePiece` adds `adaptPortsAround loc` |
| move record between locations | inlined in `movePiece` | always, at both `src` and `dst` |
| append rotation (`<>=`) | inlined in `rotatePieceBy` | always |
| resize + re-key `_pieces` | `setBoardSize` | **never** (see §4) |

`movePiece` and `rotatePieceBy` do *not* reuse `addPieceNoUpdate`/
`removePieceNoUpdate` — worth double-checking whether that's deliberate
(atomicity/perf) or just duplication (see the open question at the end of
this doc).

`adaptPortsAround loc` itself is not a new primitive: it's `Game.Piece.adapt`
applied at each of `loc`'s four edges (via `adaptRelEdge`), so its laws are
inherited from `piece_axioms.md` §D (the adaptation semilattice: `adapt d
noPort p ⊑ p`, `p ⊑ adapt d port p`, commuting across directions, etc).

---

## 2. Occupancy preconditions

**OP1 — Add fails iff occupied/outside.** `addPiece loc p` (and
`addPieceNoUpdate`) throws `LocationOccupied loc` iff `loc ∈ M.keys _pieces`,
and `InvalidLocation loc` iff `loc` is outside the board. Symmetric case for
`removePiece`/`removePieceNoUpdate`: throws `LocationNotOccupied loc` iff
`loc` is empty.

**OP2 — Move fails iff src empty or dst occupied.** `movePiece src dst`
throws `LocationNotOccupied src` or `LocationOccupied dst` under the obvious
conditions.

**OP2a — `movePiece loc loc` always fails.** Since `dst` is checked for
occupancy *after* confirming `src` is occupied, and `src == dst`, this always
hits `LocationOccupied`. Not a no-op — a hard failure. Easy to assume
otherwise; stated explicitly so nobody relies on it being a no-op.

**OP3 — Rotate fails iff `loc` empty/outside.** Same occupancy/bounds check
as the others (`checkInsideBoard` + `getPiece`).

---

## 3. Round trips

Split deliberately into a "storage" half (conjectured exact) and a "ports"
half (conjectured *not* generally exact) — these should not be stated as one
combined law until tested.

**OP4 — Storage round-trips (conjectured exact).**
- `addPiece loc p >> removePiece loc` restores `_pieces` at `loc` to empty:
  `removePieceNoUpdate` deletes exactly the `{piece: pureBoard p, rotation:
  rotation 0}` that `addPieceNoUpdate` inserted.
- `movePiece a b >> movePiece b a` (`a ≠ b`) restores the full `pieceInfo`
  record at `a`, including rotation — `movePiece` carries the whole record,
  unlike `addPiece` (see OP6 below).

**OP5 — Port round-trips (conjectured NOT exact — a candidate "non-axiom").**
Both halves of OP4 also call `adaptPortsAround`, i.e. `adapt`, on neighbours.
By `piece_axioms.md` D1, `adapt d Nothing p ⊑ p`, **not** `≡ p` — un-adapting
is a downgrade, not guaranteed to reconstruct the exact prior piece. So there
is no general guarantee that `addPiece;removePiece` or
`movePiece;movePiece⁻¹` restores neighbours' ports byte-for-byte, only that
it restores them to *something at least as general*. Needs a property test
before this is asserted either way.

**OP6 — `addPiece`/`removePiece` are not a true inverse pair when rotation
matters.** `addPiece` hardcodes `rotation 0` (`addPieceNoUpdate loc piece
(rotation 0)`), while `removePiece` hands back the piece's *actual*
rotation. So "remove, then add back what you got" is not a round trip
through `addPiece` alone if the piece was rotated — you need
`addPieceNoUpdate loc piece rotation` to reconstruct it. Any stated
round-trip axiom involving `addPiece` needs to say "at rotation 0" or name
`addPieceNoUpdate` explicitly.

**OP7 — Rotation composes monoidally on storage.** `rotatePieceBy loc r1 >>
rotatePieceBy loc r2 == rotatePieceBy loc (r1 <> r2)` on the stored rotation
field (it's `<>=`). Same OP5-style caveat applies to whether neighbour ports
come back exactly after rotating by `r` then by `ginverse r` — untested.

---

## 4. Resize

**OP8 — `increaseSize >> decreaseSize == id` on `_pieces` (conjectured
exact).** `increaseSize` shifts every location by `+1` (`dSize = -1`);
`decreaseSize` back to the same size shifts by `-1` — these cancel exactly.
Decreasing back can never fail here since nothing occupies the
newly-added outer ring yet.

**Non-axiom / likely bug — resize always drops the wormhole.**
`setBoardSize` unconditionally sets `wormhole: Nothing` regardless of the
prior value. This is *not* being written up as an intended law ("resize
clears the wormhole") — it looks like an oversight (the destructure at the
top of `setBoardSize` doesn't even bind the existing `wormhole` field) and
should probably be fixed rather than documented as correct behaviour.

**OP9 — Resize never calls `adaptPortsAround`.** Unlike every other
operation in §1, `setBoardSize` doesn't touch ports at all — it only
re-keys `_pieces` and fails via `LocationOccupied` if a piece would fall
outside the new square. `decreaseSize` can throw for this reason where
`increaseSize` never can (increasing only grows the board); both can throw
via `validBoardSize`'s odd-size `[3, 9]` bound at the extremes.

---

## Open questions

- Is `movePiece`/`rotatePieceBy` inlining its own raw mutation (instead of
  composing from `addPieceNoUpdate`/`removePieceNoUpdate`) deliberate, or
  just duplication? If deliberate, why (atomicity? avoiding two
  `adaptPortsAround` calls when one would do for `addPieceNoUpdate` +
  `addPiece`-style composition)?
- OP5/OP7's port round-trip claims need actual property tests before this
  doc calls them axioms one way or the other.
- Should `setBoardSize` preserve the wormhole when it still fits inside the
  new size, instead of unconditionally dropping it?
