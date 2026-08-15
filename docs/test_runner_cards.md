# Test runner: index cards

A visual redesign of the test runner (currently a table, see
`Component/TestRunner/Render.purs`) as a single index card that fades into a
"testing slot" one test at a time. The underlying state machine is
unchanged — see `test_runner.md` for that; this is purely about how it's
drawn.

## The idea

Instead of a table row per test case, picture a small, fixed slot next to
the board — a narrow carved groove, always visible, like the opening on a
card catalogue drawer. The current test's card fades in above it, bigger
than the opening on every side, so it reads as a card standing up out of
the slot rather than a card dropped into a pit sized to match it. When a
test finishes successfully, that card is cleared and the next one fades in.
When a test fails, the card stays put, showing the mismatch, until the
player retries.

```
        ┌─────────────┐
        │  Test 3 of 8│          (the card: bigger than the slot on
        │   Running...│           every side, fades in above it)
        │  In:     01 │
        │  Expected:10│
        └──────═════──┘
             (  slot  )          (a fixed, narrow groove -- always
                                   on screen, card or no card)
```

## Card anatomy

Each card shows, top to bottom:

- **Header**: `Test N of M` plus a status pill (`Pending` / `Running...` /
  `Passed` / `Failed`).
- **Inputs**: one row listing every input direction's signal, formatted in
  whatever `Base` the player has selected (same
  `SignalRepresentation`/`printSignal` machinery the table used).
- **Expected outputs**: same, for the expected signal per output direction.
- **Received outputs** — only once the test has actually run: on `Passed`
  these equal `expected` (shown in the same neutral tone); on `Failed`
  the whole row turns red, plus a "Mismatch" banner underneath.

## State machine → card behaviour

This is exactly `TestRunner`'s existing `State`/`Action`/`Query` (see
`Component/TestRunner/Types.purs`) — nothing about the state machine itself
changes, only what gets rendered for each state:

1. **User initiates tests** — the `RunAllTests` action (existing "Run
   tests" button). Before this, the slot sits empty — just the groove, no
   card yet.
2. **A card fades into the slot** — whenever `state.currentIndex` advances
   to a new test, that test's card mounts fresh and plays a fade-in.
   Implemented by keying the card's element on `currentIndex`
   (`Halogen.HTML.Elements.Keyed`), so Halogen tears down and remounts the
   DOM node instead of patching it in place — a plain attribute/text update
   wouldn't retrigger a CSS "enter" animation, a fresh element will. The
   animation itself is `animate.css`'s existing `fadeIn` keyframes (already
   vendored and used elsewhere, e.g. `.piece-component`'s own mount
   animation) rather than a new one, so there's still just one fade-in
   effect in the codebase.
3. **Card shows number/status/inputs/expected, status starts `NotStarted`**
   — this is `currentTestCase state` the instant `RunCurrentTest` sets its
   status but before the board has actually been asked to evaluate it.
4. **Test in progress** — `TestCase.InProgress`, set by `RunCurrentTest`
   right before it raises `TestCaseData` up to `Level`/`Board` to actually
   run the circuit. Card header reads "Running...".
5. **a. Passed** — `TestCase.Completed Passed`. Card flashes green
   momentarily, then (after `delayBetweenTests`, already a 1s pause baked
   into `handleQuery`) `currentIndex` increments and the *next* card fades
   in per step 2. If it was the last test, `AllTestsPassed` fires instead
   and the last card just stays in the slot showing "Passed".
   **b. Failed** — `TestCase.Completed (Failed { received })`. Card turns
   red, shows the received-vs-expected mismatch, and stays in the slot
   (`testSuiteFailed = true` blocks auto-advance). The existing "Rerun test
   N" / "Retry tests" buttons (already gated on `testSuiteFailed`) sit below
   the slot; clicking either keys a fresh card for the same or first index,
   so it re-plays the fade-in on retry too.

## Where it's wired in

`TestRunner.component` is already the thing `Sidebar.Render`'s
`renderCompletionStatus` slots in for both the `ReadyForTesting` and
`Completed` cases — swapping the table for cards didn't require any change
to `Sidebar.Render` or the `Level`/`Board` round-trip that actually runs
each test.

The slot-and-fading-card mechanism itself now lives in its own component,
`Component.CardStack` (`src/Component/CardStack.purs`), rather than being
baked into `TestRunner`'s own render. It's deliberately generic — its
`CardContent` record (title, a `CardStatus`/`statusLabel` pair, labelled
rows, an optional banner) has no notion of tests or `TestCase`, just "a card
with a status pill and some rows." `TestRunner` slots it in and drives it
with a single query:

```purescript
data Query a = PushCard Int CardContent a
```

The `Int` is a caller-chosen identity for "which card is this" — `TestRunner`
uses `currentIndex`. Pushing the same identity again patches the displayed
card's content in place (a status change within the same test); pushing a
different identity mounts a fresh card and replays the fade-in (moving to a
new test). `TestRunner.Types.cardContentFor` does the `TestCase` ->
`CardContent` translation and lives next to the other pure `State` helpers.

Because `CardStack` only knows about generic card content, anything else
that wants to hand the player card-shaped feedback (an achievement, a
one-off error banner, whatever comes up later) can slot the same component
in and push its own cards — it's not test-runner-specific machinery with a
test-runner-specific name.

## Scope note

`renderCompletionStatus` has other branches too (`FailedRestriction`,
`NotEvaluable`, `PortMismatch`, `NotStarted`) that could plausibly become
cards of their own one day — a "no restriction," "port mismatch," etc. card
before testing even starts. Left alone for now; this pass is just the
test-runner table.
