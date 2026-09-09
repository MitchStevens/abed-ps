module Component.Piece.Render where

import Prelude

import Component.Piece.Outline as Outline
import Component.Piece.Default (renderDefaultPiece)
import Component.Piece.Types (State)
import Render.Background (eggshellBackground, renderBackground)
import Render.CrossOver (crossOverLegPairs)
import Render.Icon (renderIcon)
import Render.Outline (renderOutline, renderTrace)
import Render.PieceConfig (pieceRenderConfig)
import Render.PortColours (portColoursFillRef, renderPortColoursPattern, renderWirePortColoursPatterns, wirePortColoursFillRef)
import Render.Segment (Segment)
import Render.Wire (renderWire, wirePath, wirePieceFrame)
import Data.Array as Array
import Data.Bifunctor (bimap)
import Data.Foldable (elem)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Number (pi)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Game.Direction (CardinalDirection)
import Game.Piece (Piece, andPiece, chickenPiece, cornerCutPiece, crossPiece, isWirePiece, name, notPiece, orPiece, reverseChickenPiece, xorPiece)
import Game.PortInfo (PortInfo)
import Game.Rotation (toDegrees)
import Halogen (ComponentHTML)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Elements as SE

svgBackgroundStyle :: String -> String
svgBackgroundStyle background =
  "background: " <> background <> "; width: 100%; height: 100%; display: block"

-- | Every piece that shares the wire-frame look: the simple wire pieces plus the
-- | dual-input/dual-output crossover pieces (cross, corner-cut, chicken, reverse-chicken).
isWireFamilyPiece :: Piece -> Boolean
isWireFamilyPiece piece =
  isWirePiece piece
    || name piece `elem` [ name crossPiece, name cornerCutPiece, name chickenPiece, name reverseChickenPiece ]

-- | Pieces already migrated onto Render.PieceConfig's scaffold --
-- | these draw their own background/frame as elements, so they get no root style.
isMigratedPiece :: Piece -> Boolean
isMigratedPiece piece =
  name piece `elem` [ name notPiece, name andPiece, name orPiece, name xorPiece ]

-- | The Array Segment outline for a piece whose shape is a single continuous
-- | path -- every basic wire piece (including the super piece -- it's a wire
-- | piece with three outputs instead of one, nothing more), plus every
-- | currently-migrated piece (`pieceRenderConfig` gives each of those exactly
-- | one Trace today). `Nothing` for anything else: crossover pieces draw two
-- | independent paths (see `crossOverSegmentsFor`), and default-rendered
-- | pieces (arithmetic/comparison/etc.) don't have a single outline in this
-- | sense at all.
outlineSegmentsFor :: Piece -> Map CardinalDirection PortInfo -> Maybe (Array Segment)
outlineSegmentsFor piece portStates
  | isWirePiece piece =
      Just (wirePath portStates)
  | isMigratedPiece piece =
      (\trace -> renderTrace trace portStates) <$> Array.head (pieceRenderConfig piece).outline.shape
  | otherwise =
      Nothing

-- | The two independent wire loops making up a crossover piece (cross,
-- | corner-cut, chicken, reverse-chicken), each as the subset of
-- | `portStates` for just its own two legs -- callers use this both to draw
-- | each loop's path and to colour it by its own input alone, independent of
-- | the other loop sharing the piece. `Nothing` for any piece that isn't one
-- | of the four crossover pieces.
crossOverLoopsFor
  :: Piece
  -> Map CardinalDirection PortInfo
  -> Maybe (Tuple (Map CardinalDirection PortInfo) (Map CardinalDirection PortInfo))
crossOverLoopsFor piece portStates =
  (\(Tuple (Tuple to1 from1) (Tuple to2 from2)) ->
    Tuple
      (M.filterKeys (_ `elem` [ to1, from1 ]) portStates)
      (M.filterKeys (_ `elem` [ to2, from2 ]) portStates)
  ) <$> crossOverLegPairs piece

-- | Same as `crossOverLoopsFor`, but as the two loops' drawn paths rather
-- | than their port-state subsets -- what `Component.Piece.Visual` diffs
-- | against to decide whether either loop needs to crossfade.
crossOverSegmentsFor :: Piece -> Map CardinalDirection PortInfo -> Maybe (Tuple (Array Segment) (Array Segment))
crossOverSegmentsFor piece portStates = bimap wirePath wirePath <$> crossOverLoopsFor piece portStates

-- | The slots a rendered piece can mount. Every piece `outlineSegmentsFor`
-- | covers (migrated + wire) mounts exactly one, at index 0; crossover
-- | pieces mount two (indices 0 and 1, one per independent wire loop) so
-- | each can crossfade on its own via `Component.Piece.Outline`.
type ChildSlots = ( outline :: H.Slot Outline.Query Void Int )

-- | Polymorphic in `action`: nothing here ever raises one, so callers can
-- | embed this directly at their own action type with no bridging.
renderPiece :: forall action m. MonadAff m => State -> ComponentHTML action ChildSlots m
renderPiece state =
    SE.svg
      ( [ SA.viewBox 0.0 0.0 100.0 100.0 ] <> rootBgAttrs )
      [ SE.g
        attributes
        ([ render ] <> animations)
      ]
  where
    rootBgAttrs
      | isMigratedPiece state.piece =
          []   -- migrated to PieceConfig/Background: drawn as an element now, not a root style
      | isWireFamilyPiece state.piece =
          [ HP.style (svgBackgroundStyle (SA.printColor eggshellBackground)) ]
      | otherwise =
          []

    pieceRotation =   maybe (toDegrees state.rotation) (_.currentRotation >>> mul (180.0 / pi)) state.isRotating

    attributes = [ SA.transform [Rotate pieceRotation 50.0 50.0] ]

    animations = []

    -- | Pieces with a single continuous outline (migrated + wire) draw it
    -- | through the Outline component's own slot, so a shape change animates;
    -- | crossover pieces do the same but through two independent slots, one
    -- | per wire loop; everything else (default-rendered pieces) still
    -- | renders statically, same as before.
    render :: ComponentHTML action ChildSlots m
    render = case outlineSegmentsFor state.piece state.portStates of
      Just segments | isMigratedPiece state.piece ->
        let config = pieceRenderConfig state.piece
        in SE.g []
             [ renderBackground config.background
             , renderPortColoursPattern state.portStates
             , outlineSlot 0 segments (portColoursFillRef state.portStates)
             , renderIcon config.icon state.portStates
             ]
      Just segments | isWirePiece state.piece ->
        SE.g []
          [ wirePieceFrame
          , renderWirePortColoursPatterns [ state.portStates ]
          , outlineSlot 0 segments (wirePortColoursFillRef state.portStates)
          ]
      _ -> case crossOverLoopsFor state.piece state.portStates of
        Just (Tuple loop1 loop2) ->
          SE.g []
            [ wirePieceFrame
            , renderWirePortColoursPatterns [ loop1, loop2 ]
            , outlineSlot 0 (wirePath loop1) (wirePortColoursFillRef loop1)
            , outlineSlot 1 (wirePath loop2) (wirePortColoursFillRef loop2)
            ]
        Nothing -> renderStatic

    outlineSlot :: Int -> Array Segment -> String -> ComponentHTML action ChildSlots m
    outlineSlot idx segments fill = HH.slot_ Outline.slot idx Outline.component { segments, fill }

    renderStatic
      | isMigratedPiece state.piece =
          let config = pieceRenderConfig state.piece
          in SE.g []
               [ renderBackground config.background
               , renderOutline config.outline state.portStates
               , renderIcon config.icon state.portStates
               ]
      | isWirePiece state.piece = renderWire state.portStates
      | otherwise = renderDefaultPiece state
