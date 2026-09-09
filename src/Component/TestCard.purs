-- | Builds a `CardStack.CardContent` for one `TestCase`, the same way
-- | `Component.Feedback`'s `testCardFor` does, but trading the plain
-- | "In: ... / Expected: ..." text rows for a small live diagram: the
-- | goal piece's own up/right/down/left quadrant split (see
-- | `Render.PortColours`, which bakes the same shape into a piece's board
-- | outline), redrawn here as SVG so an output wedge can carry a verdict
-- | colour and, while a test is running, flicker between the two it could
-- | resolve to.
-- |
-- | Not wired into `Feedback`'s `testCardFor` yet -- this only builds the
-- | content; whoever swaps it in later also decides how `CardStack`'s new
-- | `ReplaceCard` query should drive it test-to-test.
module Component.TestCard
  ( TestCardInput
  , testCardContent
  , renderDiagram
  , renderReadout
  ) where

import Prelude

import Component.CardStack as CardStack
import Data.Array (mapMaybe)
import Data.Array as Array
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.String as String
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection(..), allDirections)
import Game.Piece (Piece, getPorts)
import Game.Port (Port(..), PortType(..))
import Game.Signal (Base, Signal, SignalRepresentation(..), printSignal)
import Game.TestCase (TestCase, TestCaseOutcome(..), TestCaseStatus(..))
import Halogen (AttrName(..))
import Halogen.HTML (ClassName(..), HTML, PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Core (ElemName(..))
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Baseline(..), TextAnchor(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Render.Background (frameCornerRadius, frameInset)
import Render.Colours as Colours

-- | Everything one card needs: which of the goal's ports sit on which
-- | side, the test itself (inputs are always known; expected/received
-- | depend on `testCase.status`), how to print a `Signal`, and where this
-- | card sits in the run for its title.
-- |
-- | `instanceKey` disambiguates the SVG `<clipPath>` id `renderDiagram`
-- | generates -- `CardStack` can have several of these mounted at once
-- | (the current card, the one fading out behind it, a few more peeking
-- | out of the stack), and two clip paths sharing an id would make the
-- | browser resolve every `url(#...)` reference to whichever one it saw
-- | first. The zipper index `CardStack.render` already keys each card
-- | slot on is a natural choice.
type TestCardInput =
  { instanceKey :: String
  , base :: Base
  , goal :: Piece
  , testCase :: TestCase
  , index :: Int
  , total :: Int
  }

testCardContent :: TestCardInput -> CardStack.CardContent
testCardContent input =
  { title: "Test " <> show input.index <> " of " <> show input.total
  , statusBar: Just { status: cardStatus, text: cardStatusLabel }
  , text: []
  , diagram: Just (renderCardBody input)
  , demonstration: Nothing
  }
  where
  cardStatus = case input.testCase.status of
    NotStarted -> CardStack.Pending
    InProgress -> CardStack.Active
    Completed Passed -> CardStack.Success
    Completed (Failed _) -> CardStack.Failure

  cardStatusLabel = case input.testCase.status of
    NotStarted -> "Pending"
    InProgress -> "Running..."
    Completed Passed -> "Passed"
    Completed (Failed _) -> "Failed"

renderCardBody :: TestCardInput -> PlainHTML
renderCardBody input =
  HH.div
    [ HP.class_ (ClassName "test-card-body") ]
    ( [ HH.div [ HP.class_ (ClassName "test-diagram-mount") ] [ renderDiagram input ]
      , renderReadout input
      ]
        <> renderSeal input
    )

-- | An ink stamp slammed across the card the moment a test passes -- the
-- | wedge colours and read-out text already carry the verdict, but neither
-- | is big or sudden enough to read as "done" at a glance while the suite
-- | is rattling through several tests in a row. Deliberately pass-only: a
-- | failure needs its read-out legible so the player can see what actually
-- | came back, not a seal sitting on top of it -- the dark output wedge and
-- | the mismatched value are the failure's whole story.
renderSeal :: forall w i. TestCardInput -> Array (HTML w i)
renderSeal { testCase } = case testCase.status of
  Completed Passed -> [ sealSvg ]
  _ -> []

-- | Drawn as flat SVG shapes -- rather than a photoreal wax render pushed
-- | green through a `filter` chain -- so it can be a plain fill the same
-- | way the diagram wedges above are, and reads at a glance the way the
-- | game's other flat glyphs (see the piece art in `dist/static/images`)
-- | do. The rough-edged blob and knockout tick keep the "official stamp"
-- | idea the old wax seal had without pretending to be an actual photo.
sealSvg :: forall w i. HTML w i
sealSvg =
  SE.svg
    [ SA.viewBox 0.0 0.0 132.0 132.0
    , SA.classes [ ClassName "test-seal" ]
    ]
    [ SE.path [ pathD sealOutline, SA.classes [ ClassName "test-seal-shape" ] ]
    , SE.circle [ SA.cx 66.0, SA.cy 66.0, SA.r 47.0, SA.classes [ ClassName "test-seal-ring" ] ]
    , SE.circle [ SA.cx 30.0, SA.cy 40.0, SA.r 1.6, SA.classes [ ClassName "test-seal-fleck" ] ]
    , SE.circle [ SA.cx 98.0, SA.cy 88.0, SA.r 1.3, SA.classes [ ClassName "test-seal-fleck" ] ]
    , SE.circle [ SA.cx 94.0, SA.cy 36.0, SA.r 1.1, SA.classes [ ClassName "test-seal-fleck" ] ]
    , SE.path [ pathD sealCheck, SA.classes [ ClassName "test-seal-check" ] ]
    ]
  where
  -- A single rough, wavering loop -- an irregular stamp edge rather than a
  -- clean circle -- built from eight arcs of varying reach around (66, 66).
  sealOutline =
    "M66 6 C82 4 96 12 100 26 C114 24 126 34 126 48 C126 62 116 68 118 78 "
      <> "C120 92 110 104 96 104 C94 118 80 128 66 126 C52 130 38 122 34 108 "
      <> "C20 110 8 100 8 86 C8 74 16 68 14 58 C12 44 22 32 36 32 C38 18 52 8 66 6 Z"

  -- Stroked rather than filled -- a checkmark drawn as one confident tick
  -- reads clearer at this size than a solid knockout shape would.
  sealCheck = "M40 68 L58 86 L94 44"

-- | `Halogen.Svg.Attributes.d` takes a typed `Array PathCommand`; for a
-- | hand-drawn multi-curve outline like `sealOutline` above, a plain SVG
-- | path string is far more legible than building the same thing out of
-- | `c`/`l` combinators, and `HP.attr` reaches the same attribute just as
-- | safely -- exactly the trick `clipPathRef` below already relies on for
-- | `clip-path`.
pathD :: forall r i. String -> HP.IProp r i
pathD = HP.attr (AttrName "d")

--------------------------------------------------------------------------------
-- Diagram

-- | A 100x100 square split into four triangles meeting at its centre --
-- | the same quadrant convention `Render.PortColours`' baked masks use --
-- | drawn live so an output wedge's fill can depend on more than just "is
-- | the signal non-zero": pending draws a dashed, unanswered outline;
-- | running flickers between the bad and good verdict colours; resolved
-- | settles on whichever one it turned out to be.
renderDiagram :: forall w i. TestCardInput -> HTML w i
renderDiagram { instanceKey, goal, testCase } =
  SE.svg
    [ SA.viewBox 0.0 0.0 100.0 100.0
    , SA.classes [ ClassName "test-diagram" ]
    ]
    [ SE.defs [] [ clipPathElement clipId [ frame [] ] ]
    , frame [ SA.classes [ ClassName "test-diagram-frame" ] ]
    -- Every wedge corner sits at the viewBox's edge, outside the squircle
    -- `frame` draws (its corners are rounded off) -- without this clip
    -- they'd overhang past it at every corner instead of reading as
    -- inscribed inside one shared boundary.
    , SE.g [ clipPathRef clipId ] (wedges <> [ hub ])
    ]
  where
  clipId = "test-diagram-clip-" <> instanceKey
  ports = getPorts goal

  frame extra =
    SE.rect
      ( [ SA.x frameInset
        , SA.y frameInset
        , SA.width (100.0 - 2.0 * frameInset)
        , SA.height (100.0 - 2.0 * frameInset)
        , SA.rx frameCornerRadius
        , SA.ry frameCornerRadius
        ]
          <> extra
      )

  wedges :: Array (HTML w i)
  wedges = mapMaybe wedgeFor allDirections

  wedgeFor :: CardinalDirection -> Maybe (HTML w i)
  wedgeFor dir = do
    Port { portType } <- M.lookup dir ports
    let pts = wedgePoints dir
    pure case portType of
      -- Always the same blue, on or off -- this wedge's colour marks the
      -- side as an input, not the signal riding on it (that's the
      -- read-out's job); only an output wedge's colour carries a verdict.
      Input -> wedgePolygon pts [] [ SA.fill Colours.portOn ]
      Output -> case testCase.status of
        NotStarted -> pendingWedge dir pts
        InProgress -> wedgePolygon pts [ ClassName "test-diagram-wedge-flicker" ] []
        Completed Passed -> wedgePolygon pts [] [ SA.fill Colours.testCardGood ]
        Completed (Failed _) -> wedgePolygon pts [] [ SA.fill Colours.testCardBad ]

  wedgePolygon pts extraClasses extraAttrs =
    SE.polygon
      ( [ SA.points pts
        , SA.classes ([ ClassName "test-diagram-wedge" ] <> extraClasses)
        ]
          <> extraAttrs
      )

  -- Given but not yet judged: no verdict colour to show at all, just the
  -- shape of what's about to be checked -- an unfilled, dashed outline
  -- with a plain "is this it?" mark in place of a reading.
  pendingWedge :: CardinalDirection -> Array (Tuple Number Number) -> HTML w i
  pendingWedge dir pts =
    SE.g []
      [ wedgePolygon pts [ ClassName "test-diagram-wedge-pending" ] []
      , SE.text
          [ SA.x qx
          , SA.y qy
          , SA.textAnchor AnchorMiddle
          , SA.dominantBaseline BaselineMiddle
          , SA.classes [ ClassName "test-diagram-question" ]
          ]
          [ HH.text "?" ]
      ]
    where
    Tuple a b = wedgeCorners dir
    Tuple qx qy = centroid3 a b center

  hub = SE.circle [ SA.cx 50.0, SA.cy 50.0, SA.r 8.0, SA.classes [ ClassName "test-diagram-hub" ] ]

center :: Tuple Number Number
center = Tuple 50.0 50.0

-- | The two viewBox corners a direction's wedge spans, in an order that
-- | keeps `[a, b, center]` wound the same way (clockwise) for all four --
-- | doesn't matter for `SE.polygon`'s fill, but keeps the pending glyph's
-- | centroid landing in the same relative spot on every side.
wedgeCorners :: CardinalDirection -> Tuple (Tuple Number Number) (Tuple Number Number)
wedgeCorners = case _ of
  Up -> Tuple (Tuple 0.0 0.0) (Tuple 100.0 0.0)
  Right -> Tuple (Tuple 100.0 0.0) (Tuple 100.0 100.0)
  Down -> Tuple (Tuple 100.0 100.0) (Tuple 0.0 100.0)
  Left -> Tuple (Tuple 0.0 100.0) (Tuple 0.0 0.0)

wedgePoints :: CardinalDirection -> Array (Tuple Number Number)
wedgePoints dir = [ a, b, center ]
  where
  Tuple a b = wedgeCorners dir

centroid3 :: Tuple Number Number -> Tuple Number Number -> Tuple Number Number -> Tuple Number Number
centroid3 (Tuple ax ay) (Tuple bx by) (Tuple cx cy) = Tuple ((ax + bx + cx) / 3.0) ((ay + by + cy) / 3.0)

-- | `Halogen.Svg.Elements` doesn't wrap `<clipPath>` (there's no clean
-- | element/attribute pairing for it the way there is for `<mask>`), but
-- | it exports the same `element` primitive it builds every other tag
-- | from, so this is exactly as safe as any of the library's own.
clipPathElement :: forall w i. String -> Array (HTML w i) -> HTML w i
clipPathElement clipId = SE.element (ElemName "clipPath") [ SA.id clipId ]

clipPathRef :: forall r i. String -> HP.IProp r i
clipPathRef clipId = HP.attr (AttrName "clip-path") ("url(#" <> clipId <> ")")

--------------------------------------------------------------------------------
-- Read-out

-- | The exact value behind every wedge, in the same up/right/down/left
-- | order, monospaced -- a wedge's colour is a glance-length summary, but
-- | it can't carry a multi-bit bus, and it shouldn't be the only copy of
-- | "passed" or "failed" either.
renderReadout :: forall w i. TestCardInput -> HTML w i
renderReadout { base, goal, testCase } =
  HH.div [ HP.class_ (ClassName "test-readout") ] (mapMaybe rowFor sortedDirections)
  where
  ports = getPorts goal

  -- Inputs listed above outputs -- matches how a player reasons about a
  -- test ("given these inputs, verify this output") rather than the
  -- arbitrary up/right/down/left order `allDirections` enumerates in.
  -- `Array.partition` keeps each group in that original board order, it
  -- just moves every input ahead of every output.
  sortedDirections :: Array CardinalDirection
  sortedDirections = bySide.yes <> bySide.no
    where
    bySide = Array.partition isInputSide allDirections

  isInputSide :: CardinalDirection -> Boolean
  isInputSide dir = case M.lookup dir ports of
    Just (Port { portType: Input }) -> true
    _ -> false

  rowFor :: CardinalDirection -> Maybe (HTML w i)
  rowFor dir = do
    Port { portType, capacity } <- M.lookup dir ports
    let
      rep = SignalRepresentation base capacity
      dirLabel = String.take 1 (show dir)
      print = printSignal rep
    pure case portType of
      Input ->
        readoutRow dirLabel "IN"
          [ HH.text (print (signalAt dir testCase.data.inputs)) ]
      Output ->
        readoutRow dirLabel "OUT" (outputValue print dir)

  outputValue :: (Signal -> String) -> CardinalDirection -> Array (HTML w i)
  outputValue print dir = case testCase.status of
    NotStarted ->
      [ HH.span [ HP.class_ (ClassName "test-readout-dash") ] [ HH.text "\x2013" ] ]
    InProgress ->
      [ HH.span [ HP.class_ (ClassName "test-readout-run") ] [ HH.text "\x2026" ] ]
    Completed Passed ->
      [ HH.span [ HP.class_ (ClassName "test-readout-ok") ] [ HH.text (print (signalAt dir testCase.data.expected)) ]
      , HH.text " "
      , HH.span [ HP.class_ (ClassName "test-readout-check") ] [ HH.text "\x2713" ]
      ]
    Completed (Failed { received }) ->
      [ HH.span [ HP.class_ (ClassName "test-readout-exp") ] [ HH.text (print (signalAt dir testCase.data.expected)) ]
      , HH.span [ HP.class_ (ClassName "test-readout-sep") ] [ HH.text "\x2192" ]
      , HH.span [ HP.class_ (ClassName "test-readout-got") ] [ HH.text (print (signalAt dir received)) ]
      ]

  signalAt :: CardinalDirection -> Map CardinalDirection Signal -> Signal
  signalAt dir signals = fromMaybe zero (M.lookup dir signals)

  readoutRow :: String -> String -> Array (HTML w i) -> HTML w i
  readoutRow dirLabel roleLabel valueEls =
    HH.div [ HP.class_ (ClassName "test-readout-row") ]
      ( [ HH.span [ HP.class_ (ClassName "test-readout-dir") ] [ HH.text dirLabel ]
        , HH.span [ HP.class_ (ClassName "test-readout-role") ] [ HH.text roleLabel ]
        ]
          <> valueEls
      )
