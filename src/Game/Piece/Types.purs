module Game.Piece.Types where

import Prelude

import Data.Foldable (and, fold)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Game.Direction (CardinalDirection)
import Game.Piece.Complexity (Complexity)
import Game.Piece.Port (Capacity, Port(..), PortType, isInput, isOutput)
import Game.Signal (Signal(..))


newtype PieceId = PieceId String
derive instance Newtype PieceId _
derive instance Eq PieceId
derive instance Ord PieceId
instance Show PieceId where
  show (PieceId id) = id

{-
  what is a piece?
    a piece has at least 1 output (or else what the hell does it do?)
    a piece has at least 1 input
    a piece can be evaluated
    a piece has ports
    a piece has a unique identifier
    a piece might have a capacity, and if it does, this capacity should be modifiable

-}
newtype Piece = Piece
  { name :: PieceId
  , eval :: Map CardinalDirection Signal -> Map CardinalDirection Signal
  , complexity :: Complexity
  
  {-
    When capacity of a port is changed, we want to do one of the following:
      - the capacity should change, and the capacity should ripple to adjacent pieces 
      - the capacity should change, but the capacity should *not* ripple
      - the capacity shouldn't change
  -}
  , shouldRipple :: Boolean
  , updateCapacity :: CardinalDirection -> Capacity -> Maybe Piece

  {-
    We also need a way to tell if a piece changed after a port was updated. Originally `updatePort` had the type signature:
      `updatePort :: Piece p => CardinalDirection -> Maybe Port -> p -> p`
    
    Unfortunately, from this type signature there was no was to tell whether the piece was actually modified when a port was updated.

      The new type of `updatePort` is:
      `updatePort :: Piece p => CardinalDirection -> Maybe PortType -> p -> Maybe p`
    
    The function will now output `Just Piece` if the `Piece` was modified and `Nothing` if it's not modified. Also note that the `Maybe Port` parameter was changed to `Maybe PortType`, this was to ensure that `updatePort` cannot possibly change capacity (because the piece doesn't know what the adjacent port capacity is)
  -}
  , ports :: Map CardinalDirection Port
  , updatePort :: CardinalDirection -> Maybe PortType -> Maybe Piece
  }
instance Eq Piece where
  eq (Piece p1) (Piece p2) = and
    [ p1.name == p2.name
    , p1.ports == p2.ports
    ]
instance Ord Piece where
  compare (Piece p1) (Piece p2) = fold
    [ compare p1.name p2.name
    , compare p1.ports p2.ports
    ]

instance Show Piece where
  show (Piece p) = "(Piece " <> show p.name <> ")"

name :: Piece -> PieceId
name (Piece p) = p.name

eval :: Piece -> Map CardinalDirection Signal -> Map CardinalDirection Signal
eval (Piece p) = p.eval

shouldRipple :: Piece -> Boolean
shouldRipple (Piece p) = p.shouldRipple

updateCapacity :: CardinalDirection -> Capacity -> Piece -> Maybe Piece
updateCapacity dir capacity (Piece p) = p.updateCapacity dir capacity

getPorts :: Piece -> Map CardinalDirection Port
getPorts (Piece p) = p.ports

updatePort :: CardinalDirection -> Maybe PortType -> Piece -> Maybe Piece
updatePort dir port (Piece p) = p.updatePort dir port

getPort :: Piece -> CardinalDirection -> Maybe Port
getPort (Piece p) dir = M.lookup dir p.ports

getInputDirs :: Piece -> Set CardinalDirection
getInputDirs (Piece p) = M.keys $ M.filter isInput p.ports

getOutputDirs :: Piece -> Set CardinalDirection
getOutputDirs (Piece p) = M.keys $ M.filter isOutput p.ports