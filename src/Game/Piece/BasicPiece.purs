module Game.Piece.BasicPiece where

import Prelude

import Control.Alt ((<|>))
import Data.HeytingAlgebra (ff, tt)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Data.Unfoldable (fromMaybe)
import Game.Expression (Expression(..), evaluate, raw, ref)
import Game.Location (CardinalDirection(..), Rotation(..))
import Game.Location as Direction
import Game.Piece (class Piece, APiece(..), PieceId(..), mkPiece)
import Game.Piece.Port (Capacity(..), Port(..))

data BasicPort = BasicInput | BasicOutput Expression

newtype BasicPiece = Basic
  { name :: String
  , capacity :: Capacity
  , ports :: Map CardinalDirection BasicPort
  }

derive instance Newtype BasicPiece _

instance Piece BasicPiece where
  name (Basic piece) = PieceId piece.name
  eval (Basic piece) f = flip M.mapMaybe piece.ports $ case _ of
    BasicInput  -> Nothing
    BasicOutput expression -> Just (evaluate f expression)
  ports (Basic piece) = piece.ports <#> case _ of
    BasicInput -> Input piece.capacity
    BasicOutput _ -> Output piece.capacity

allBasicPieces :: Array APiece
allBasicPieces =
  [ idPiece, leftPiece, rightPiece, superPiece
  , notPiece, orPiece, andPiece
  , crossPiece, cornerCutPiece, chickenPiece
  , dupPiece, xorPiece
  , truePiece, falsePiece
  ]


idPiece :: APiece
idPiece = mkPiece $ Basic 
  { name: "id"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Right $ BasicOutput (ref Left)
    ]
  }

leftPiece :: APiece
leftPiece = mkPiece $ Basic
  { name: "left"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicOutput (ref Left)
    ]
  }

rightPiece :: APiece
rightPiece = mkPiece $ Basic
  { name: "right"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Down $ BasicOutput (ref Left)
    ]
  }

notPiece :: APiece
notPiece = mkPiece $ Basic 
  { name: "not"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Right $ BasicOutput (not (ref Left))
    ]
  }

orPiece :: APiece
orPiece = mkPiece $ Basic 
  { name: "or"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left || ref Up)
    ]
  }

andPiece :: APiece
andPiece = mkPiece $ Basic 
  { name: "and" 
  , capacity: Capacity 1 
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left && ref Up)
    ]
  }

superPiece :: APiece
superPiece = mkPiece $ Basic
  { name: "super"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left BasicInput
    , Tuple Up    $ BasicOutput (ref Left)
    , Tuple Right $ BasicOutput (ref Left)
    , Tuple Down  $ BasicOutput (ref Left)
    ]
  }

crossPiece :: APiece
crossPiece = mkPiece $ Basic
  { name: "cross" 
  , capacity: Capacity 1 
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
  , capacity: Capacity 1
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
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput 
    , Tuple Right $ BasicInput 
    , Tuple Up $ BasicOutput  (ref Right)
    , Tuple Down $ BasicOutput (ref Left) 
    ]
  }



dupPiece :: APiece
dupPiece = mkPiece $ Basic
  { name: "dup" 
  , capacity: Capacity 1 
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Right $ BasicOutput (ref Left)
    , Tuple Down $ BasicOutput (ref Left)
    ]
  }

xorPiece :: APiece
xorPiece = mkPiece $ Basic 
  { name: "xor" 
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Left `Xor` ref Up)
    ]
  }

truePiece :: APiece
truePiece = mkPiece $ Basic 
  { name: "true" 
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Right $ BasicOutput tt
    ]
  }

falsePiece :: APiece
falsePiece = mkPiece $ Basic 
  { name: "false" 
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Right $ BasicOutput ff
    ]
  }