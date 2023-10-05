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
import Game.Location (CardinalDirection(..))
import Game.Location as Direction
import Game.Piece (class Piece, Capacity(..), Port(..))

data BasicPort = BasicInput | BasicOutput Expression

newtype BasicPiece = Basic
  { name :: String
  , capacity :: Capacity
  , ports :: Map CardinalDirection BasicPort
  }

derive instance Newtype BasicPiece _

instance Piece BasicPiece where
  name (Basic piece) = piece.name
  eval (Basic piece) f = flip M.mapMaybe piece.ports $ case _ of
    BasicInput  -> Nothing
    BasicOutput expression -> Just (evaluate f expression)
  ports (Basic piece) = piece.ports <#> case _ of
    BasicInput -> Input piece.capacity
    BasicOutput _ -> Output piece.capacity

idPiece :: BasicPiece
idPiece = Basic 
  { name: "id"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Right $ BasicOutput (ref Left)
    ]
  }

notPiece :: BasicPiece
notPiece = Basic 
  { name: "not"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Right $ BasicOutput (not (ref Left))
    ]
  }

orPiece :: BasicPiece
orPiece = Basic 
  { name: "or"
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left || ref Up)
    ]
  }

andPiece :: BasicPiece
andPiece = Basic 
  { name: "and" 
  , capacity: Capacity 1 
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left && ref Up)
    ]
  }

crossPiece :: BasicPiece
crossPiece = Basic
  { name: "cross" 
  , capacity: Capacity 1 
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Up $ BasicInput 
    , Tuple Right $ BasicOutput (ref Left)
    , Tuple Down $ BasicOutput (ref Up)
    ]
  }

dupPiece :: BasicPiece
dupPiece = Basic
  { name: "dup" 
  , capacity: Capacity 1 
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput  
    , Tuple Right $ BasicOutput (ref Left)
    , Tuple Down $ BasicOutput (ref Left)
    ]
  }

xorPiece :: BasicPiece
xorPiece = Basic 
  { name: "xor" 
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Left $ BasicInput
    , Tuple Up $ BasicInput
    , Tuple Right $ BasicOutput (ref Left `Xor` ref Up)
    ]
  }

truePiece :: BasicPiece
truePiece = Basic 
  { name: "true" 
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Right $ BasicOutput tt
    ]
  }

falsePiece :: BasicPiece
falsePiece = Basic 
  { name: "false" 
  , capacity: Capacity 1
  , ports: M.fromFoldable
    [ Tuple Right $ BasicOutput ff
    ]
  }