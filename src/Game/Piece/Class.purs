module Game.Piece.Class where

import Prelude

import Data.Foldable (any)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe)
import Data.Set (Set)
import Game.Expression (Signal(..))
import Game.Location (CardinalDirection)
import Game.Location as Direction
import Game.Piece.Port (Port, isInput, isOutput)

newtype PieceId = PieceId String
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
-}
class Piece p where
  name  :: p -> PieceId
  eval  :: p -> Map CardinalDirection Signal -> Map CardinalDirection Signal
  getPorts :: p -> Map CardinalDirection Port
  updatePort :: CardinalDirection -> Maybe Port -> p -> p

{-
  standard ports are
    - an input on the left
    - an output on the right
  
  almost every piece has these standard ports, so it's nice to have a function that can automatically preserve
-}
preserveStandardPorts :: forall p. (CardinalDirection -> Maybe Port -> p -> p) -> CardinalDirection -> Maybe Port -> p -> p
preserveStandardPorts updatePort dir port p = case dir of
  Direction.Left  -> if any isInput  port then updatePort dir port p else p
  Direction.Right -> if any isOutput port then updatePort dir port p else p
  _ -> updatePort dir port p


getPort :: forall p. Piece p => p -> CardinalDirection -> Maybe Port
getPort p dir = M.lookup dir (getPorts p)

getOutputDirs :: forall p. Piece p => p -> Set CardinalDirection
getOutputDirs p = M.keys $ M.filter (not <<< isInput) (getPorts p)
