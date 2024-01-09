module Game.Piece.BasicPiece where

import Prelude

import Control.Alt ((<|>))
import Data.HeytingAlgebra (ff, tt)
import Data.List (List)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Traversable (class Foldable, traverse)
import Data.Tuple (Tuple(..))
import Data.Unfoldable (fromMaybe)
import Game.Direction (CardinalDirection(..))
import Game.Direction as Direction
import Game.Expression (Expression(..), evaluate, ref)
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Port (Capacity(..), Port(..), inputPort, isInput, outputPort)
import Game.Piece.Types (Piece(..), PieceId(..))
import Game.Rotation (Rotation(..))

data BasicPort = BasicInput | BasicOutput Expression

type BasicPiece =
  { name :: PieceId
  , capacity :: Capacity
  , complexity :: Complexity
  , ports :: Map CardinalDirection BasicPort
  }

basicPiece :: BasicPiece -> Piece
basicPiece basic = Piece
  { name: basic.name
  , eval: \inputs -> flip M.mapMaybe basic.ports $ case _ of
      BasicInput  -> Nothing
      BasicOutput expression -> Just (evaluate inputs expression)
  , complexity: basic.complexity

  , shouldRipple: true
  , updateCapacity: \_ capacity -> Just $ basicPiece (basic { capacity = capacity })
  
  , ports: basic.ports <#> case _ of
      BasicInput -> inputPort basic.capacity
      BasicOutput _ -> outputPort basic.capacity
  , updatePort: \_ _ -> Nothing
  }



allBasicPieces :: Array Piece
allBasicPieces =
  [ notPiece, orPiece, andPiece
  , crossPiece, cornerCutPiece, chickenPiece
  , xorPiece
  ]


notPiece :: Piece
notPiece = basicPiece
  { name: PieceId "not-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Right $ BasicOutput (not (ref Left))
    ]
  }

orPiece :: Piece
orPiece = basicPiece
  { name: PieceId "or-piece"
  , capacity: OneBit
  , complexity: Complexity.space 3.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left || ref Up)
    ]
  }

andPiece :: Piece
andPiece = basicPiece
  { name: PieceId "and-piece" 
  , capacity: OneBit
  , complexity: Complexity.space 3.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left && ref Up)
    ]
  }

crossPiece :: Piece
crossPiece = basicPiece
  { name: PieceId "cross-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left BasicInput
    , Tuple Up   BasicInput
    , Tuple Right $ BasicOutput (ref Left)
    , Tuple Down  $ BasicOutput (ref Up)
    ]
  }

cornerCutPiece :: Piece
cornerCutPiece = basicPiece
  { name: PieceId "corner-cut-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Up)
    , Tuple Down $ BasicOutput (ref Left)
    ]

  }

chickenPiece :: Piece
chickenPiece = basicPiece
  { name: PieceId "chicken-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput 
    , Tuple Right $ BasicInput 
    , Tuple Up $ BasicOutput  (ref Right)
    , Tuple Down $ BasicOutput (ref Left) 
    ]
  }

reverseChickenPiece :: Piece
reverseChickenPiece = basicPiece
  { name: PieceId "reverse-chicken-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput 
    , Tuple Right $ BasicInput 
    , Tuple Up $ BasicOutput  (ref Left)
    , Tuple Down $ BasicOutput (ref Right) 
    ]
  }

xorPiece :: Piece
xorPiece = basicPiece 
  { name: PieceId "xor-piece" 
  , capacity: OneBit
  , complexity: Complexity.space 5.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Left `Xor` ref Up)
    ]
  }