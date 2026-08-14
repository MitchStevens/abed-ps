module Component.Piece.Render where

import Prelude

import Component.Piece.Outline as Outline
import Component.Piece.Default (renderDefaultPiece)
import Component.Piece.Types (State)
import Component.Rendering.Background (eggshellBackground, renderBackground)
import Component.Rendering.CrossOver (renderChicken, renderCornerCut, renderCrossOver, renderReverseChicken)
import Component.Rendering.Icon (renderIcon)
import Component.Rendering.Outline (renderOutline, renderTrace)
import Component.Rendering.PieceConfig (pieceRenderConfig)
import Component.Rendering.Segment (Segment)
import Component.Rendering.Wire (renderWire, wirePath, wirePieceFrame)
import Data.Array as Array
import Data.Foldable (elem)
import Data.Map (Map)
import Data.Maybe (Maybe(..), maybe)
import Data.Number (pi)
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

-- | Pieces already migrated onto Component.Rendering.PieceConfig's scaffold --
-- | these draw their own background/frame as elements, so they get no root style.
isMigratedPiece :: Piece -> Boolean
isMigratedPiece piece =
  name piece `elem` [ name notPiece, name andPiece, name orPiece, name xorPiece ]

-- | The Array Segment outline for a piece whose shape is a single continuous
-- | path -- every basic wire piece (including the super piece -- it's a wire
-- | piece with three outputs instead of one, nothing more), plus every
-- | currently-migrated piece (`pieceRenderConfig` gives each of those exactly
-- | one Trace today). `Nothing` for anything else: crossover pieces draw two
-- | independent paths, and default-rendered pieces (arithmetic/comparison/
-- | etc.) don't have a single outline in this sense at all. Callers that need
-- | this to morph between two shapes just don't animate those -- no
-- | regression, since they don't animate today either.
outlineSegmentsFor :: Piece -> Map CardinalDirection PortInfo -> Maybe (Array Segment)
outlineSegmentsFor piece portStates
  | isWirePiece piece =
      Just (wirePath portStates)
  | isMigratedPiece piece =
      (\trace -> renderTrace trace portStates) <$> Array.head (pieceRenderConfig piece).outline.shape
  | otherwise =
      Nothing

-- | The slots a rendered piece can mount -- currently just its outline path,
-- | shared by every piece `outlineSegmentsFor` covers (migrated + wire), so
-- | a shape change animates via `Component.Piece.Outline` instead of snapping.
type ChildSlots = ( outline :: H.Slot Outline.Query Void Unit )

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
    -- | everything else (crossovers, default-rendered pieces) still renders
    -- | statically, same as before.
    render :: ComponentHTML action ChildSlots m
    render = case outlineSegmentsFor state.piece state.portStates of
      Just segments | isMigratedPiece state.piece ->
        let config = pieceRenderConfig state.piece
        in SE.g []
             [ renderBackground config.background
             , outlineSlot segments
             , renderIcon config.icon state.portStates
             ]
      Just segments | isWirePiece state.piece ->
        SE.g [] [ wirePieceFrame, outlineSlot segments ]
      _ -> renderStatic

    outlineSlot :: Array Segment -> ComponentHTML action ChildSlots m
    outlineSlot segments = HH.slot_ Outline.slot unit Outline.component segments

    renderStatic
      | isMigratedPiece state.piece =
          let config = pieceRenderConfig state.piece
          in SE.g []
               [ renderBackground config.background
               , renderOutline config.outline state.portStates
               , renderIcon config.icon state.portStates
               ]
      | isWirePiece state.piece = renderWire state.portStates
      | name state.piece == name crossPiece = renderCrossOver state.portStates
      | name state.piece == name cornerCutPiece = renderCornerCut state.portStates
      | name state.piece == name chickenPiece = renderChicken state.portStates
      | name state.piece == name reverseChickenPiece = renderReverseChicken state.portStates
      | otherwise = renderDefaultPiece state
