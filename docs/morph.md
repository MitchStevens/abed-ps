# Morphing between two paths

This is a first-principles look at what we actually want when we animate a
piece's outline changing shape (`adapt`/`revert` growing or shrinking a leg).
Two implementations of this have now produced visibly wrong results (a leg
detaching from the body and shrinking into empty space; a whole-path reflow
that wobbles stretches that never actually changed) — both symptoms of never
having written down what a *correct* morph even means. This document works
that out before we touch code again.

## 1. Definitions

**A path** is a continuous function `γ : [0, 1] → ℝ²`. `γ(0)` is where the pen
starts, `γ(1)` is where it ends. A path is **closed** if `γ(0) = γ(1)` — every
piece outline we draw is a closed path (it's a loop around the piece).

Two different functions can trace the same picture — `γ` and `γ ∘ ψ` for any
continuous, non-decreasing `ψ : [0,1] → [0,1]` with `ψ(0)=0, ψ(1)=1` (a
*reparametrization*) draw the identical curve, just at different speeds. This
matters a lot below: **a path's shape doesn't pin down its parametrization**,
and that slack is exactly the freedom (and the difficulty) in morphing.

**A morph** between `γ₀` and `γ₁` is a homotopy: a continuous function
`H : [0,1] × [0,1] → ℝ²` with `H(s, 0) = γ₀(s)` and `H(s, 1) = γ₁(s)`. Read
`H(s, t)` as "where the point that started at parameter `s` on `γ₀` is, at
time `t` through the animation." For every fixed `t`, `H(·, t)` is itself a
path — that's the frame drawn on screen at that instant.

A morph we'd actually want to render should also satisfy:

- **Continuity in `t`**: no popping — `H` continuous jointly in `(s,t)`, not
  just continuous in `s` for each fixed `t`.
- **Closedness preserved**: if `γ₀` and `γ₁` are both closed, `H(·, t)` should
  be closed for every `t` too (`H(0,t) = H(1,t)`), or the outline visibly
  splits open mid-animation.
- **(Aspirational) simplicity**: `H(·, t)` shouldn't self-intersect. This is
  a much harder property to guarantee in general and we're not going to solve
  it here — noted as a real risk, not a requirement we're enforcing yet.

## 2. The naive approach, and why it needs a correspondence

If `γ₀` and `γ₁` happen to already share a parametrization — the same `s`
means "the same fraction of the way around" on both — the obvious morph is
pointwise linear interpolation:

```
H(s, t) = (1 - t) · γ₀(s) + t · γ₁(s)
```

This is continuous, hits both endpoints, and (see §3) turns out to be
*optimal* once a parametrization is fixed. The entire difficulty is that
**"the same `s`" isn't given to us** — `γ₀` and `γ₁` are handed to us as two
different sequences of `Segment`s, generally with a different number of
pieces, different lengths, different shapes. Nothing tells us which point of
`γ₁` a given point of `γ₀` "is." Choosing that correspondence — a
reparametrization of one curve relative to the other — is the actual content
of the problem. Interpolation itself is trivial once it's chosen.

## 3. Defining "minimal": an energy functional

"Minimise the amount we have to morph" needs a number to minimise. The
natural physical analogy: think of every point on the curve as a particle
that has to travel from its position at `t=0` to its position at `t=1` over
the course of the animation, and charge it the standard *kinetic energy* for
doing so. Total cost of a morph `H`:

```
E[H] = ∫₀¹ ∫₀¹ |∂H/∂t (s, t)|² dt ds
```

(the inner integral is one point's motion cost over time; the outer integral
sums that over every point on the curve.) This is a good choice because it's
convex and has a clean closed-form minimiser:

**Claim.** For a fixed point that must go from `a` to `b` over `t ∈ [0,1]`,
the path `t ↦ (1-t)a + tb` (straight line, constant speed) uniquely minimises
`∫₀¹ |velocity(t)|² dt`.

*Why*: by Cauchy–Schwarz, `∫₀¹ |v(t)| dt ≥ |∫₀¹ v(t) dt| = |b - a|`, with
equality iff `v` has constant direction; and for fixed total length,
`∫|v|²dt` is minimised by constant *speed* too (Jensen's inequality, `|v|²` is
convex). Constant direction and constant speed together is exactly the
straight line traversed at a uniform rate.

**Consequence**: given a correspondence — a choice of which point of `γ₁`
each point of `γ₀` moves to — the energy-minimising way to realise it actually
is the pointwise lerp from §2. So the whole optimisation problem collapses to
one thing:

```
E* = min over monotonic φ : [0,1] → [0,1], φ(0)=0, φ(1)=1, of
       ∫₀¹ |γ₀(s) - γ₁(φ(s))|² ds
```

— find the *reparametrization* `φ` of `γ₁` (equivalently: the correspondence)
that makes corresponding points as close together as possible, then lerp.

This is a real, studied problem: it's the continuous analogue of **Dynamic
Time Warping**, and it's the starting point of an entire field (elastic shape
analysis / the Fréchet-distance and Square-Root-Velocity-Function literature
— Younes, Michor–Mumford, Srivastava). It doesn't have a cheap closed-form
answer for arbitrary curves, and we don't need one — see §5.

(A close cousin worth knowing about: instead of the L² average above, the
**Fréchet distance** minimises the *worst* point's displacement,
`min_φ max_s |γ₀(s) - γ₁(φ(s))|`. That's a better model if the thing we
actually want to avoid is "any single point jumps a long way," rather than
"the average point moves a lot." Worth keeping in mind if the L² choice ever
produces a frame where one bit of the outline visibly lurches while
everything else barely moves.)

## 4. Why our LCS-based diff was the wrong tool

The version we just ripped out picked a correspondence by running an
LCS-style diff (`Data.Diff`) over the two `Array Segment`s and calling
exactly-equal segments "kept." That's optimising a *different* objective than
§3: LCS maximises the count of **exactly-equal** tokens matched, with zero
credit for "close but not identical." Two consequences, both of which we hit:

1. **All-or-nothing, no partial credit.** A segment that's 99% the same as
   its neighbour gets *zero* benefit from that — LCS either matches it
   exactly or throws it entirely into the "changed" pile. Real geometry
   doesn't work that way; two nearby-but-not-identical segments should
   correspond *well*, not not-at-all.
2. **Spurious matches fragment the path.** LCS is happy to match a segment
   deep inside a to-be-removed detour against some unrelated, coincidentally
   -identical segment somewhere else, splitting the diff into more, smaller
   runs than the geometry actually warrants. That's almost certainly how we
   ended up with a `Changed` run whose `inserted` side was completely empty
   (§5 below explains why that shouldn't usually happen for our actual piece
   shapes) — the fix-on-top-of-that (collapsing the empty side to a point)
   then had no correct anchor to collapse *to*, because nothing in the
   surrounding "kept" segments was obligated to still connect to it once it
   started moving. That's the detached-leg bug.

Geometric correspondence should be scored by **distance**, not by boolean
equality. Whatever we do next should reflect that.

## 5. Exploiting the structure we actually have

We're not morphing arbitrary curves — piece outlines are closed loops built
by gluing a small number of **legs** together at junctions (see
`Component.Rendering.Outline.renderTrace`), one leg per cardinal direction.
`adapt`/`revert` changes the presence of *exactly one* leg; every other leg,
and the junction curves between untouched neighbours, is **byte-identical**
before and after. That's a much stronger and more useful fact than "these two
arrays happen to share some equal segments" — it's known structurally, not
discovered by diffing.

Two ways to use that:

**(a) Diff at the leg level, not the segment level.** A piece's outline is
really a small sequence keyed by direction (`Up`, `Right`, `Down`, `Left`,
whichever subset is present). Comparing *that* between two pieces is exact,
cheap, and never fragments — for each direction, either both sides have an
identical leg (trivially shared, no interpolation needed at all) or exactly
one side does. The only place that ever needs to *morph* is the single
direction whose presence changed.

**(b) Represent "leg absent" honestly.** The critical fix: when a leg is
absent, that's not "nothing is there" — it's "the two neighbouring legs are
joined *directly*" (the same `curvedJunction`/`straightJunction` machinery
`renderTrace` already uses between any two adjacent present legs). That
direct join is a real path with the *same two endpoints* the leg's own
junction curves attach to — the point on the rim where the leg would start,
and the point on the rim where it would end. So the two things we're ever
asked to morph between are:

```
γ_leg  : rim-point-A ⇝ rim-point-B    (the full leg: stub/arrow, out, back)
γ_none : rim-point-A ⇝ rim-point-B    (the direct junction curve)
```

— **two paths that already share both endpoints.** There is no empty side,
no arbitrary point to collapse to, nothing to detach from. The correspondence
problem from §3 is now posed on a bounded, endpoint-pinned pair, which is a
much easier version of the problem (and is exactly what "minimise the amount
we have to morph" should mean here: everything outside this one leg is
provably identical already and needn't move at all; only this span has any
freedom in the first place).

If restructuring pieces around an explicit notion of "leg" is more than we
want to take on right now, there's a cheaper approximation of the same idea
purely at the `Array Segment` level, with none of the LCS machinery: take the
**longest common prefix** and **longest common suffix** of `oldSegs` and
`newSegs` (two linear scans, no `Data.Diff`, no combinatorial alignment).
Whatever's left in the middle on each side is, by construction, bounded by
the *same* two endpoints (the last point of the shared prefix, the first
point of the shared suffix) on both the old and new side — because the prefix
and suffix are literally identical arrays. This doesn't understand "legs" as
a concept, but it gets the one property that actually matters for free:
**the changed middle region always has matching endpoints on both sides**, so
there's never a degenerate empty-vs-point case to invent an answer for.
(This should also mostly avoid LCS's fragmentation problem in practice, since
it only trusts a shared boundary when it's *contiguous* from the very start
or very end — it can't be fooled by a coincidental match buried in the
middle.)

## 6. Interpolating within a bounded, endpoint-matched span

Either approach above leaves us with a smaller version of the §3 problem:
two paths, `p` and `q`, sharing both endpoints, generally with a different
number of segments and different shapes in between. We still need a
correspondence `φ` to lerp along.

What we had (`normaliseSegments`) is **arc-length-proportional matching**:
walk both paths together, always splitting whichever side's current piece is
proportionally larger, so segment `i` of the normalised `p'` always covers
the same *fraction* of `p`'s total length as segment `i` of `q'` covers of
`q`'s. This is not the §3-optimal `φ` in general (it ignores actual Euclidean
distance between candidate matches entirely — it's a length-based heuristic,
not a distance-minimising one), but it's cheap, has a simple closed form, is
well-behaved when both paths are pinned at the same two endpoints, and is
reasonable specifically *because* the span is now local and bounded: with
endpoints fixed on both ends, there's much less room for a length-proportional
guess to go badly wrong than there was matching two whole, independently-
shaped paths against each other.

Where it can still look bad: if `p` is a long winding detour and `q` is a
short direct line, proportional matching is fine (the detour just smoothly
straightens out — this is precisely the "shrinking leg" case, and it's a good
fit). It's more questionable if `p` and `q` take *opposite* turns — e.g. `p`
detours left-then-right and `q` detours right-then-left between the same two
endpoints — where a distance-minimising `φ` might want to "cross over" in a
way proportional matching can't express. Not a case we expect to hit for
legs growing/shrinking, but worth naming as a known limitation rather than
discovering it later as another mystery bug.

## 7. A concrete proposal

1. Represent "no leg in direction `d`" using the same junction-curve
   machinery already used between two present legs, so every leg comparison
   is between two paths sharing the same two rim endpoints — never against
   nothing. (Leg-level diff, §5a, is the principled version of this; the
   common-prefix/suffix split, §5b, is the fallback if we don't want to
   restructure how pieces are represented right now.)
2. For each place the old and new outlines actually differ, normalise
   (§6) and `lerpPathSteps` *that span only*, keeping its two endpoints fixed
   for every intermediate frame — never a collapse-to-a-point.
3. Everywhere else, reproduce the shared segments verbatim at every frame —
   they're already provably identical, so there's nothing to compute *or*
   render differently frame to frame.
4. Reassemble in order for each of the `count` frames.

This keeps the actual constraint we started with — a `Kept` stretch shouldn't
wobble just because something elsewhere changed — but ties every interpolated
span to real, fixed anchor points instead of an ad hoc collapse target, and
replaces exact-equality diffing (wrong objective, prone to fragmenting) with
either a structural leg-level comparison or a much simpler prefix/suffix
split that can't produce a dangling, endpoint-less span in the first place.

## 8. Open questions

- **Tangent continuity at the seams.** Endpoint *position* is pinned by
  construction (§5), but nothing here pins the *tangent direction* the
  interpolated span leaves/enters those endpoints with, relative to its
  `Kept` neighbours. Purely positional continuity (`isChained`) is enough to
  avoid a visible gap; it is not enough to avoid a visible kink. Worth a look
  once the basic version is back on screen — may or may not be worth the
  complexity of matching derivatives too.
- **Which anchor points, exactly, for a leg?** §5a assumes there's an
  obvious "rim point A / rim point B" a leg attaches at. Confirm that's
  actually well-defined for every leg shape we have (including the
  crossover pieces, which are out of scope for morphing today but might not
  always be).
- **Simplicity (no self-intersection).** Not addressed here at all. A leg
  retracting straight back along roughly its own path is unlikely to cross
  itself; nothing guarantees that in general.
- **Is L² the right energy?** §3's Fréchet-distance alternative (minimise the
  worst point's displacement rather than the average) might match "looks
  right" better than L² does — flagged, not decided.
