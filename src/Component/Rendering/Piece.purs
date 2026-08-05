module Component.Rendering.Piece where

import Prelude

import Component.Piece.Default (renderDefaultPiece)
import Component.Piece.Types (Action, State)
import Component.Rendering.Background (eggshellBackground, renderBackground)
import Component.Rendering.CrossOver (renderChicken, renderCornerCut, renderCrossOver, renderReverseChicken)
import Component.Rendering.Icon (renderIcon)
import Component.Rendering.Outline (renderOutline)
import Component.Rendering.PieceConfig (pieceRenderConfig)
import Component.Rendering.Wire (renderWire)
import Data.Foldable (elem)
import Data.Maybe (Maybe(..), maybe)
import Data.Number (pi)
import Game.Piece (Piece, andPiece, chickenPiece, cornerCutPiece, crossPiece, isWirePiece, name, notPiece, orPiece, reverseChickenPiece, superPiece, xorPiece)
import Game.Rotation (toDegrees)
import Halogen (ComponentHTML)
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
  name piece `elem` [ name superPiece, name notPiece, name andPiece, name orPiece, name xorPiece ]

renderPiece :: forall s m. State -> ComponentHTML Action s m
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

    render
      | isMigratedPiece state.piece =
          let config = pieceRenderConfig state.piece
          in SE.g []
               [ renderBackground config.background
               , renderOutline config.outline state.portStates
               , renderIcon config.icon state.portStates
               ]
      | isWirePiece state.piece = renderWire state.piece state.portStates
      | name state.piece == name crossPiece = renderCrossOver state.portStates
      | name state.piece == name cornerCutPiece = renderCornerCut state.portStates
      | name state.piece == name chickenPiece = renderChicken state.portStates
      | name state.piece == name reverseChickenPiece = renderReverseChicken state.portStates
      | otherwise = renderDefaultPiece state
