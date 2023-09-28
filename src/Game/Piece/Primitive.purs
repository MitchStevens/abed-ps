module Game.Piece.Primitive where

import Prelude

import Data.Array (fromFoldable)
import Data.Bifunctor (lmap)
import Data.Lens (Lens', view, (.~), (^.))
import Data.Lens.At (at)
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Tuple (Tuple(..))
import Game.Expression (Signal(..), ref)
import Game.Location (CardinalDirection)
import Game.Location as Direction


{-
  has one output facing right
  has 0-2 inputs facing anywhere
  automatically configures capacity basic on adjacent ports
  can't accept input from different capacities
-}
--newtype CommutativePiece a = Commutative
--  { portStructure :: Map a Port
--  , outputPortLocation :: a
--  , capacity :: Capacity
--  , evalFunction :: Array Signal -> Signal
--  }
--derive instance Newtype (CommutativePiece a) _
--
--_portStructure :: forall a. Lens' (CommutativePiece a) (Map a Port)
--_portStructure = _Newtype <<< prop (Proxy :: Proxy "portStructure")
--
--instance PieceOperations CommutativePiece where
--  eval inputs (Commutative piece) =
--    M.singleton piece.outputPortLocation (piece.evalFunction $ fromFoldable (const <$> inputs <*> inputPorts))
--    where
--      inputPorts = M.filter isInput piece.portStructure 
--
--  getPort dir = view (_portStructure <<< at dir)
--
--  adjacentPort dir Nothing piece = (_portStructure <<< at dir .~ Nothing) piece
--  adjacentPort dir (Just (Input capacity)) (Commutative piece) =
--    if capacity == piece.capacity 
--      then (_portStructure <<< at dir .~ Just (Input capacity)) (Commutative piece)
--      else Commutative piece
--  adjacentPort _ (Just (Output _)) commutativePiece = commutativePiece
--
--  changeBasis f (Commutative piece) = Commutative $ piece
--    { outputPortLocation = f piece.outputPortLocation
--    , portStructure = M.fromFoldable $ map (lmap f) $ (M.toUnfoldable piece.portStructure :: Array _)
--    }
  
--not :: Piece CardinalDirection
--not = piece 
--  { up: Nothing
--  , right: Just $ Output (Capacity 1) (HeytingAlgebra.not (ref Direction.Left))
--  , down: Nothing
--  , left: Just $ Input (Capacity 1)
--  }
--
--and :: Piece CardinalDirection
--and = piece 
--  { up: Just $ Input (Capacity 1)
--  , right: Just $ Output (Capacity 1) (ref Direction.Up && ref Direction.Left)
--  , down: Nothing
--  , left: Just $ Input (Capacity 1)
--  }
--
--or :: Piece CardinalDirection
--or = piece 
--  { up: Just $ Input (Capacity 1)
--  , right: Just $ Output (Capacity 1) (ref Direction.Up || ref Direction.Left)
--  , down: Nothing
--  , left: Just $ Input (Capacity 1)
--  }