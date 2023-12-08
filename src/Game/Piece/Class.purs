module Game.Piece.Class where

import Prelude

import Data.Foldable (any)
import Data.Lens (Lens')
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype, over, under, unwrap, wrap)
import Data.Set (Set)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Piece.Port (Capacity, Port, PortType, isInput, isOutput)
import Game.Signal (Signal(..))

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
    a piece might have a capacity, and if it does, this capacity should be modifiable

-}

class Piece p where
  name  :: p -> PieceId
  eval  :: p -> Map CardinalDirection Signal -> Map CardinalDirection Signal
{-
  When capacity of a piece is changed, we want to do one of the following:
    - the capacity should change, and the capacity should ripple to adjacent pieces 
    - the capacity should change, but the capacity should *not* ripple
    - the capacity shouldn't change
-}
  getCapacity :: p -> Maybe Capacity
  shouldRipple :: p -> Boolean
  updateCapacity :: CardinalDirection -> Capacity -> p -> Maybe p
{-
  We also need a way to tell if a piece changed after a port was updated. Originally `updatePort` had the type signature:
    `updatePort :: Piece p => CardinalDirection -> Maybe Port -> p -> p`
  
  Unfortunately, from this type signature there was no was to tell whether the piece was actually modified when a port was updated.

    The new type of `updatePort` is:
    `updatePort :: Piece p => CardinalDirection -> Maybe PortType -> p -> Maybe p`
  
  The function will now output `Just Piece` if the `Piece` was modified and `Nothing` if it's not modified. Also note that the `Maybe Port` parameter was changed to `Maybe PortType`, this was to ensure that `updatePort` cannot possibly change capacity (because the piece doesn't know what the adjacent port capacity is)
-}
  getPorts :: p -> Map CardinalDirection Port
  updatePort :: CardinalDirection -> Maybe PortType -> p -> Maybe p

{-
  standard ports are
    - an input on the left
    - an output on the right
-}
--preserveStandardPorts :: forall p. (CardinalDirection -> Maybe Port -> p -> p) -> CardinalDirection -> Maybe Port -> p -> p
--preserveStandardPorts updatePort dir port p = case dir of
--  Direction.Left  -> if any isInput  port then updatePort dir port p else p
--  Direction.Right -> if any isOutput port then updatePort dir port p else p
--  _ -> updatePort dir port p


{-
  Most pieces are newtype wrappers over a record with a capacity field.
-}
defaultGetCapacity :: forall p r. Newtype p { capacity :: Capacity | r }
  => p -> Maybe Capacity
defaultGetCapacity piece = Just (unwrap piece).capacity

defaultUpdateCapacity :: forall p r. Newtype p { capacity :: Capacity | r }
  => CardinalDirection -> Capacity -> p -> Maybe p
defaultUpdateCapacity _ capacity piece = Just $ over wrap (_ { capacity = capacity }) piece

getPort :: forall p. Piece p => p -> CardinalDirection -> Maybe Port
getPort p dir = M.lookup dir (getPorts p)

getInputDirs :: forall p. Piece p => p -> Set CardinalDirection
getInputDirs p = M.keys $ M.filter isInput (getPorts p)

getOutputDirs :: forall p. Piece p => p -> Set CardinalDirection
getOutputDirs p = M.keys $ M.filter isOutput (getPorts p)
