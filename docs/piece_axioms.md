# Piece axioms

> **Status:** draft. A proposed set of laws that every `Piece` (and the board
> evaluator that runs pieces) should satisfy. Terminology from the current
> codebase (`Piece`, `eval`, `ports`, `adapt`, `updateCapacity`,
> `isSimplifiable`, `Simplification`, `Capacity`, `Signal`, `stepPiece`,
> `PortType`, `EvaluableBoard`).
>
> **Author's assessment (2026-09-10):** happy with this set. A7, B1–B4, E
> (including E4), G1, G2 are accepted as-is. B5 is reframed — truncation is the
> board's job, not the piece's. A5 is *not* an axiom; it became
> [issue #21](https://github.com/MitchStevens/abed-ps/issues/21) instead. The
> `adapt` laws (D) are good; the wormhole-adapt cases still need a look. F is
> iffy and is left for later. G3/G4 were dropped as not worth stating. H
> (embedding & rotation) is new. Complexity laws are deferred but expected to be
> straightforward once `Complexity` has a spec.

Notation: `p`, `q` are pieces; `inputs`, `m` are signal maps;
`d` is a `CardinalDirection`; `≡` means "eval-equivalent" (agree on all outputs
for all inputs); `⊑` is the adaptation order defined in §D.

---

## A. Port structure

**A1 — At least one output.** `getOutputDirs p ≠ ∅` (an `Output`, or a
`WormholeIn` the piece drives). A piece with nothing to say is not a piece.

**A2 — At least one readable port.**
`getInputDirs p ∪ wormholeOutDirs p ≠ ∅`. The old "≥ 1 `Input`" phrasing is
already broken by `Game.Piece.Wormhole.counter`, which reads only a
`WormholeOut`; the readable-port form covers it.

**A3 — One port per side.** At most four ports, keyed by distinct cardinal
directions (already guaranteed by `Map CardinalDirection Port`).

**A4 — `eval` never invents a port.**
`M.keys (eval p inputs) ⊆ getOutputDirs p ∪ wormholeInDirs p` for all `inputs`.

**A5 — (not an axiom).** "`eval` is total over its outputs" was proposed here.
Rather than add it as a law over partial `Map`s, the map is being replaced with
a total record — see
[issue #21](https://github.com/MitchStevens/abed-ps/issues/21). Once that lands,
totality is a type property, not an axiom to check.

**A6 — Wormhole ports are opposite-side matched pairs.**
`p` has a `WormholeOut` on `d` **iff** it has a `WormholeIn` on
`oppositeDirection d`, and the two ports have equal capacity. This is exactly
what `stepPiece` assumes (`inDir = oppositeDirection outDir`).

**A7 — Port-type partition.** The four `PortType`s split by *who writes*:

| Piece reads | Piece writes |
| --- | --- |
| `Input`, `WormholeOut` | `Output`, `WormholeIn` |

`isInput` / `isOutput` in `Game.Port` currently split only on `Input`, so both
wormhole types read as "output". A7 says that helper is wrong and should follow
this table.

---

## B. `eval` semantics

**B1 — Purity / determinism.** `eval p` is a pure function of its input map:
same inputs ⇒ same outputs, no effects, no hidden state. (The type says so; it
is stated because nested sub-boards must not break it — see
`docs/wormholes.md`.)

**B2 — Extra inputs are ignored.**
`eval p inputs ≡ eval p (truncateInputs p inputs)`. Signals on directions that
are not input ports have no effect.

**B3 — Absent input ≡ zero input.** For an input direction `d` with
`d ∉ M.keys inputs`, `eval p inputs == eval p (M.insert d zero inputs)`.
"Missing" and "zero" are indistinguishable.

**B4 — Input capacity irrelevance.** A piece may not depend on bits above a
port's capacity: `eval p inputs ≡ eval p inputs'` when `inputs'` is `inputs`
with each key canonicalised to that input port's `Capacity`.

**B5 — Canonicalisation / truncation is the *board's* job, not the piece's.**
Pieces may return whatever they like — non-canonical signals (bits set above a
port's capacity), and (until issue #21) partial or total maps. Before a piece's
outputs are consumed, and before its inputs are supplied, the board applies a
truncation `trunc` that canonicalises every signal to the relevant port's
`Capacity`. `trunc` must satisfy:

- **(a) idempotent:** `trunc ∘ trunc == trunc`.
- **(b) capacity-bounded:** `trunc m ! d` is canonical for the capacity of the
  port at `d`.
- **(c) fixed point for well-behaved pieces:** if `p`'s outputs are always
  already canonical, then `trunc ∘ eval p == eval p`.

Consequence: `not-piece` on `OneBit` returning `not 0x00 == 0xFF` is fine — the
board truncates it to `0x01`.

**B6 — No rest-state law.** Deliberately *not* required:
`eval p (all zeros)` need not be all zeros (`not-piece` outputs `1`). Listed so
it is not added by accident.

---

## C. `updateCapacity`

> Not yet reviewed by the author — carried over from the proposal for
> completeness.

**C1 — Domain.** `updateCapacity d c p == Just _` ⟹ `d ∈ M.keys (ports p)`.

**C2 — The asked-for change lands.** `updateCapacity d c p == Just p'` ⟹
`portCapacity (ports p' ! d) == c`. This is per-port, *not* "only `d` changes":
`basicPiece` retypes every port to one capacity; `fuse`/`sever` move the paired
port by the double/halve relation.

**C3 — Structure preserved.** `updateCapacity d c p == Just p'` ⟹
`name p' == name p`, same port key set, same per-direction port type; only
capacities differ.

**C4 — `Nothing` means "no change / not allowed", consistently.** Pick one
meaning across all pieces (today `fuse`/`sever`/`wire` guard on
`c /= current` and return `Nothing` for a no-op; `basicPiece` returns `Just`
unconditionally). Proposed: no-op ⇒ `Nothing`, and if
`updateCapacity d c p == Just p'` then `updateCapacity d c p' == Nothing`.

**C5 — `shouldRipple` gates neighbour-driven changes only.** A piece with
`shouldRipple == false` has its capacity changed only by a direct
`updateCapacity` call, never as a ripple from an adjacent piece.

---

## D. `adapt`

Define the **adaptation order** `p1 ⊑ p2` ("`p2` is at least as adapted as
`p1`"): for all `inputs` truncated to `p1`'s input directions,
`eval p1 inputs` and `eval p2 inputs` agree on every
`d ∈ M.keys (eval p1 inputs)`.

**D1** `adapt d noPort p ⊑ p`. *(tested)*
**D2** `p ⊑ adapt d port p` for any real `port`. *(tested)*
**D3** `d1 ≠ d2` ⟹
`adapt d1 x (adapt d2 y p) ≡ adapt d2 y (adapt d1 x p)`. *(tested for
`x = y = noPort`; propose extending to arbitrary ports)*
**D4** Idempotence: `adapt d t (adapt d t p) ≡ adapt d t p`. *(claimed in the
source comment, not tested)*
**D5** `name (adapt d t p) == name p`, and `adapt d t p` differs from `p` only
at port `d`.
**D6** When `adapt` changes anything: `adapt d port p` yields
`getPortType (ports ! d) == getPortType port` for a real `port`; `adapt d noPort p`
removes port `d`.

**Open:** the wormhole cases. `Game.Piece.WirePiece` currently rejects
`adapt _ port` outright when `port` is a `WormholeIn`/`WormholeOut`. D6 should permit
"adapt to a wormhole type is always `Nothing`" as a legal implementation, but
whether *some* piece should accept it, and how that interacts with A6 (pairs),
is unresolved.

### Why "`adapt` forms a semilattice"

`⊑` is a partial order on pieces (up to `≡`): reflexive, and — modulo checking —
transitive and antisymmetric. `adapt d port` only ever moves a piece *up*
this order (D2), `adapt d noPort` only *down* (D1), and adapts on different
directions commute (D3). If, in addition, for a fixed piece the set of
"reachable by adapting" pieces has a **least upper bound** for any two elements
— i.e. given two adaptations of `p` there is a single most-general piece that is
at least as adapted as both — then that reachable set is a **join-semilattice**:
a poset where every pair has a join (`⊔`). Concretely the join would be "apply
both adaptations", and D3 (commutativity) plus D4 (idempotence) are exactly the
laws that make "apply this set of adaptations" a well-defined join independent
of order. It is only a *semilattice*, not a lattice, because there is no
meaningful *meet* (greatest lower bound) — un-adapting is not symmetric with
adapting. Establishing this gives you a clean algebra: board wiring computes a
join of the adaptations each neighbour demands, and the result is
order-independent.

---

## E. `isSimplifiable`

**E1 — `Constant` soundness.** `isSimplifiable p == Just (Constant m)` ⟹
`∀ inputs. eval p inputs == m`.

**E2 — `Connection` soundness.** `isSimplifiable p == Just (Connection c)` ⟹
`∀ inputs. ∀ (out ↦ in) ∈ c. eval p inputs ! out == fromMaybe zero (inputs ! in)`,
and `M.keys (eval p inputs) == M.keys c`.

**E3 — `Connection` well-formedness.** Every key of `c` is an output direction
of `p`, every value is an input direction of `p`, and the capacities of the two
ends match.

**E4 — Simplification determines behaviour.** There is
`fromSimplification :: Simplification -> Piece` with
`fromSimplification s ≡ p` for any `p` with `isSimplifiable p == Just s`.
(This is the standing TODO in `Game.Piece.Types`.)

---

## F. Identity

> The author considers this section iffy — revisit later.

**F1 — Names are unique in the vault.**
`length allPieces == size pieceVault`. *(tested)*

**F2 — `Eq` / `Ord` faithfulness.** `Eq Piece` compares `name` + `ports` only.
So the law this forces is: **`name` + `ports` determine `eval`**. Two pieces
equal under `Eq` must be eval-equivalent, or `Eq` is lying — and `adapt` /
`updateCapacity` hand back fresh pieces that must respect this.

---

## G. Sequential evaluation (`tick` / wormholes)

**G1 — Combinational pieces are tick-invariant.** If `p` has no wormhole ports,
then for every buffer state `s` and every `inputs`,
`evalState (stepPiece p inputs) s == eval p inputs`, and the buffer is left
unchanged. `tick` is a no-op on such a piece.

**G2 — One-tick delay.** The signal read at `WormholeOut d` on tick `t` equals
the signal the piece wrote at `WormholeIn (oppositeDirection d)` on tick
`t − 1`. On `t = 0` it is `zero`. (This is the property `counter` and
`risingEdge` are tested against.)

---

## H. Embedding and rotation

The idea: a piece has no `rotate :: Piece -> Piece` primitive. Rotation — and
equivalence in general — is defined by *embedding a piece in an evaluable
board*.

**H1 — Trivial embedding is transparent.** There is a way to wrap any piece `p`
as a single-piece `EvaluableBoard` `embed p` whose four sides carry exactly
`p`'s ports, wired straight through. Then `embed p ≡ p`: evaluating the board on
some inputs gives `eval p` on those inputs (modulo the board truncation of §B5).

**H2 — Pieces are black boxes under embedding.** More generally, embedding `p`
into a board `q` that connects `p`'s ports to other pieces and to `q`'s sides
yields a composite whose behaviour is fully determined by `eval p` together with
`q`'s wiring. `q` never inspects `p` beyond its ports and `eval`.

**H3 — Rotation equivariance via embedding.** Rotating a piece is *defined* as
rotating the wiring harness it sits in. For a composite "`p` embedded in `q`":
rotating `p` by `r` and rotating `q`'s surrounding wiring by `−r` leaves the
composite's behaviour unchanged, up to relabelling the composite's own sides by
`r`. Consequently rotation lives entirely in board wiring; no `Piece`-level
rotation operator is needed, and any two rotations that "cancel" across the
`p` / `q` boundary produce equivalent composites.

**H4 — Truncation is idempotent.** `truncateInputs p (truncateInputs p m) ==
truncateInputs p m`, and likewise the board's `trunc` (§B5a). Composing the
embedding of §H1–H2 must not let truncation error accumulate: one pass is a
fixed point.

---

## Deferred

**Complexity laws.** `complexity :: Complexity` is a monoid value meant to track
space/time cost. Expected laws once `Complexity` has a spec: `complexity ≥
mempty`; complexity of a composite board is (sub)additive in the complexities of
its pieces; the trivial embedding of §H1 adds a bounded constant. Not pinned
down yet.
