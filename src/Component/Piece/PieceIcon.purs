module Component.Piece.PieceIcon where

import Prelude

import Data.Map (Map)
import Data.Map as M
import Data.Maybe (fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Piece (PieceId(..), name)
import Game.Piece.BasicPiece (andPiece, crossPiece, falsePiece, idPiece, notPiece, orPiece, truePiece, xorPiece)
import Halogen.HTML (ClassName(..), HTML)
import Halogen.HTML as HE
import Halogen.Svg.Attributes (Baseline(..), TextAnchor(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

lookupIcon :: forall p i. PieceId -> HTML p i
lookupIcon pieceId = fromMaybe defaultIcon (M.lookup pieceId icons)
  where
    defaultIcon = defaultSvg
      [ defaultBackdrop
      , defaultText "xx"
      ]

icons :: forall p i. Map PieceId (HTML p i)
icons = M.fromFoldable
  [ Tuple (name idPiece) $ defaultSvg
    [ defaultBackdrop
    , defaultText "="
    ]
  , Tuple (name notPiece) $ defaultSvg
    [ defaultBackdrop
    , defaultText "~"
    ]
  , Tuple (name orPiece) $ defaultSvg
    [ defaultBackdrop
    , defaultText "∨"
    ]
  , Tuple (name andPiece) $ defaultSvg
    [ defaultBackdrop
    , defaultText "&"
    ]
  , Tuple (name xorPiece) $ defaultSvg
    [ defaultBackdrop
    , defaultText "⊕"
    ]
  , Tuple (name crossPiece) $ defaultSvg
    [ defaultBackdrop
    , defaultText "⌀"
    ]
  ]

defaultSvg = SE.svg
  [ SA.viewBox 0.0 0.0 100.0 100.0
  , SA.height 50.0
  , SA.width 50.0
  , SA.class_ (ClassName "piece-icon")
  ]

defaultBackdrop = SE.circle 
  [ SA.r 50.0
  , SA.cx 50.0
  , SA.cy 50.0
  , SA.class_ (ClassName "backdrop")]

defaultText text = SE.text
  [ SA.x 50.0
  , SA.y 50.0
  , SA.textAnchor AnchorMiddle
  , SA.dominantBaseline BaselineMiddle ]
  [ HE.text text ] 

