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
import Game.Expression (Expression(..), Signal(..), evaluate, raw, ref)
import Game.Piece.APiece (APiece(..), mkPiece)
import Game.Piece.Class (class Piece, PieceId(..), defaultGetCapacity, defaultUpdateCapacity, updateCapacity)
import Game.Piece.Port (Capacity(..), Port(..), inputPort, isInput, outputPort)

data BasicPort = BasicInput | BasicOutput Expression

newtype BasicPiece = Basic
  { name :: String
  , capacity :: Capacity
  , ports :: Map CardinalDirection BasicPort
  }

derive instance Newtype BasicPiece _

instance Piece BasicPiece where
  name (Basic piece) = PieceId piece.name
  eval (Basic piece) inputs = flip M.mapMaybe piece.ports $ case _ of
    BasicInput  -> Nothing
    BasicOutput expression -> Just (evaluate inputs expression)

  getCapacity = defaultGetCapacity
  updateCapacity = defaultUpdateCapacity

  getPorts (Basic piece) = piece.ports <#> case _ of
    BasicInput -> inputPort piece.capacity
    BasicOutput _ -> outputPort piece.capacity
  updatePort _ _ _ = Nothing -- basic pieces do not change on port update


allBasicPieces :: Array APiece
allBasicPieces =
  [ notPiece, orPiece, andPiece, xorPiece
  , crossPiece, cornerCutPiece, chickenPiece
  ]


notPiece :: APiece
notPiece = mkPiece $ Basic 
  { name: "not"
  , capacity: OneBit
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Right $ BasicOutput (not (ref Left))
    ]
  }

orPiece :: APiece
orPiece = mkPiece $ Basic 
  { name: "or"
  , capacity: OneBit
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left || ref Up)
    ]
  }

andPiece :: APiece
andPiece = mkPiece $ Basic 
  { name: "and" 
  , capacity: OneBit
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left && ref Up)
    ]
  }

crossPiece :: APiece
crossPiece = mkPiece $ Basic
  { name: "cross" 
  , capacity: OneBit
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left)
    , Tuple Down $ BasicOutput (ref Up)
    ]
  }

cornerCutPiece :: APiece
cornerCutPiece = mkPiece $ Basic
  { name: "corner-cut"
  , capacity: OneBit
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Up)
    , Tuple Down $ BasicOutput (ref Left)
    ]

  }

chickenPiece :: APiece
chickenPiece = mkPiece $ Basic
  { name: "chicken"
  , capacity: OneBit
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput 
    , Tuple Right $ BasicInput 
    , Tuple Up $ BasicOutput  (ref Right)
    , Tuple Down $ BasicOutput (ref Left) 
    ]
  }

xorPiece :: APiece
xorPiece = mkPiece $ Basic 
  { name: "xor" 
  , capacity: OneBit
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Left `Xor` ref Up)
    ]
  }

halfAdder :: APiece
halfAdder = mkPiece $ Basic
  { name: "half-adder"
  , capacity: OneBit
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Left `Xor` ref Up)
    , Tuple Down $ BasicOutput (ref Left && ref Up)

    ]
  }

sourcePiece :: Signal -> Capacity -> APiece
sourcePiece (Signal s) capacity = mkPiece $ Basic
  { name: "source"
  , capacity
  , ports: M.singleton Right (BasicOutput (raw s))
  }