module Game.Piece where

import Prelude

import Data.Function (on)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe, fromMaybe)
import Data.Set (Set)
import Data.Traversable (class Foldable, class Traversable, foldMap, for)
import Game.Expression (Expression, Signal(..))
import Game.Location (CardinalDirection)

newtype Capacity = Capacity Int
derive instance Eq Capacity

instance Show Capacity where
  show (Capacity n) = "Capacity " <> show n

instance Semigroup Capacity where
  append (Capacity a) (Capacity b) = Capacity (a+b)

instance Monoid Capacity where
  mempty = Capacity 0

data Port
  = Input Capacity
  | Output Capacity
derive instance Eq Port

instance Show Port where
  show = case _ of
    Input capacity -> "Input (" <> show capacity <> ")"
    Output capacity -> "Output ("<> show capacity <>")"

isInput :: Port -> Boolean
isInput (Input _) = true
isInput _ = false

matchingPort :: Port -> Port
matchingPort (Input c) = Output c
matchingPort (Output c) = Input c

portMatches :: Port -> Port -> Boolean
portMatches port otherPort = port == matchingPort otherPort 

portCapacity :: Port -> Capacity
portCapacity = case _ of
  Input  capacity -> capacity
  Output capacity -> capacity


{-
  what is a piece?
    a piece can be evaluated
    a piece has ports
    a piece can modified by adjacent ports
-}
class Piece p where
  name  :: p -> String
  eval  :: p -> Map CardinalDirection Signal -> Map CardinalDirection Signal
  ports :: p -> Map CardinalDirection Port

getPort :: forall p. Piece p => p -> CardinalDirection -> Maybe Port
getPort p dir = M.lookup dir (ports p)

getOutputDirs :: forall p. Piece p => p -> Set CardinalDirection
getOutputDirs p = M.keys $ M.filter (not <<< isInput) (ports p)

class Piece p <= ReactivePiece p where
  onPortChange :: CardinalDirection -> Maybe Port -> p -> p

-- abstract piece
newtype APiece = APiece (forall r. (forall p. Piece p => p -> r) -> r)
instance Eq APiece where
  eq = eq `on` name
instance Ord APiece where
  compare = compare `on` name
instance Show APiece where
  show p = "Piece " <> (name p)

mkPiece :: forall p. Piece p => p -> APiece
mkPiece piece = APiece (_ $ piece)

unPiece :: forall r. (forall p. Piece p => p -> r) -> APiece -> r
unPiece f (APiece piece) = piece f

instance Piece APiece where
  name = unPiece name
  eval = unPiece eval
  ports = unPiece ports