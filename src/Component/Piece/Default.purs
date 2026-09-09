module Component.Piece.Default
  ( renderDefaultPiece
  ) where

import Prelude

import Component.Piece.Types as Piece
import Render.Port (portPath)
import Render.Segment (renderPath)
import Data.Array as A
import Data.Int (toNumber)
import Data.Map as M
import Game.Direction (allDirections, clockwiseRotation)
import Game.Direction as Direction
import Game.Piece (PieceId(..), name)
import Game.Rotation (Rotation(..))
import Halogen (ComponentHTML)
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

renderDefaultPiece :: forall action s m. Piece.State -> ComponentHTML action s m
renderDefaultPiece state = SE.g [] (allPorts <> [ center ])
  where
    allPorts = do
      dir <- allDirections
      let Rotation r = clockwiseRotation Direction.Up dir

      pure $ SE.g
        [ SA.transform
          [ Rotate (toNumber r * 90.0) 50.0 50.0
          , Translate 25.0 0.0 ]
        ] $
        do
          portInfo <- A.fromFoldable (M.lookup dir state.portStates)
          [ renderPath (portPath portInfo) ]
    center = SE.g
      [ SA.transform [ Translate 30.0 30.0 ] ]
      [ SE.svg [ SA.width 50.0, SA.height 50.0 ]
        [ renderPieceCenter (name state.piece) ]
      ]

    renderPieceCenter (PieceId id) = SE.image
      [ SA.href ("./static/images/" <> id <> ".png")
      , SA.width 40.0
      , SA.height 40.0
      ]
