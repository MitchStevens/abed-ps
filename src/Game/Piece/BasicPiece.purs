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
import Game.Piece.APiece (APiece(..), mkPiece)
import Game.Piece.Class (class Piece, PieceId(..), defaultGetCapacity, defaultUpdateCapacity, getCapacity, shouldRipple, updateCapacity)
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Port (Capacity(..), Port(..), inputPort, isInput, outputPort)
import Game.Rotation (Rotation(..))

data BasicPort = BasicInput | BasicOutput Expression

newtype BasicPiece = Basic
  { name :: String
  , capacity :: Capacity
  , complexity :: Complexity
  , ports :: Map CardinalDirection BasicPort
  }

derive instance Newtype BasicPiece _

instance Piece BasicPiece where
  name (Basic piece) = PieceId piece.name
  eval (Basic piece) inputs = flip M.mapMaybe piece.ports $ case _ of
    BasicInput  -> Nothing
    BasicOutput expression -> Just (evaluate inputs expression)
  complexity (Basic piece) = piece.complexity
  
  shouldRipple _  = true
  getCapacity = defaultGetCapacity
  updateCapacity = defaultUpdateCapacity
  getPorts (Basic piece) = piece.ports <#> case _ of
    BasicInput -> inputPort piece.capacity
    BasicOutput _ -> outputPort piece.capacity
  updatePort _ _ _ = Nothing



allBasicPieces :: Array APiece
allBasicPieces =
  [ notPiece, orPiece, andPiece
  , crossPiece, cornerCutPiece, chickenPiece
  , xorPiece
  ]


notPiece :: APiece
notPiece = mkPiece $ Basic 
  { name: "not-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Right $ BasicOutput (not (ref Left))
    ]
  }

orPiece :: APiece
orPiece = mkPiece $ Basic 
  { name: "or-piece"
  , capacity: OneBit
  , complexity: Complexity.space 3.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left || ref Up)
    ]
  }

andPiece :: APiece
andPiece = mkPiece $ Basic 
  { name: "and-piece" 
  , capacity: OneBit
  , complexity: Complexity.space 3.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left && ref Up)
    ]
  }

crossPiece :: APiece
crossPiece = mkPiece $ Basic
  { name: "cross-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left BasicInput
    , Tuple Up   BasicInput
    , Tuple Right $ BasicOutput (ref Left)
    , Tuple Down  $ BasicOutput (ref Up)
    ]
  }

cornerCutPiece :: APiece
cornerCutPiece = mkPiece $ Basic
  { name: "corner-cut-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Up)
    , Tuple Down $ BasicOutput (ref Left)
    ]

  }

chickenPiece :: APiece
chickenPiece = mkPiece $ Basic
  { name: "chicken-piece"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput 
    , Tuple Right $ BasicInput 
    , Tuple Up $ BasicOutput  (ref Right)
    , Tuple Down $ BasicOutput (ref Left) 
    ]
  }

reverseChickenPiece :: APiece
reverseChickenPiece = mkPiece $ Basic
  { name: "chicken"
  , capacity: OneBit
  , complexity: Complexity.space 2.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput 
    , Tuple Right $ BasicInput 
    , Tuple Up $ BasicOutput  (ref Left)
    , Tuple Down $ BasicOutput (ref Right) 
    ]
  }

xorPiece :: APiece
xorPiece = mkPiece $ Basic 
  { name: "xor-piece" 
  , capacity: OneBit
  , complexity: Complexity.space 5.0
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Left `Xor` ref Up)
    ]
  }