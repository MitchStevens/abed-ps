module Game.Piece.Types
  ( IsSimplifiable(..)
  , MkPiece
  , Piece(..)
  , PieceId(..)
  , eval
  , getInputDirs
  , getOutputDirs
  , getPort
  , getPorts
  , immutablePiece
  , mkPiece
  , name
  , shouldRipple
  , updateCapacity
  , updatePort
  )
  where

import Prelude

import Data.Foldable (and, fold)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Game.Piece.Capacity (Capacity)
import Game.Piece.Complexity (Complexity)
import Game.Piece.Complexity as Complexity
import Game.Piece.Direction (CardinalDirection)
import Game.Piece.Port (Port(..), PortType, isInput, isOutput)
import Game.Piece.Signal (Signal(..))
import Prim.Row (class Union)
import Record.Unsafe.Union (unsafeUnion)


newtype PieceId = PieceId String
derive instance Newtype PieceId _
derive instance Eq PieceId
derive instance Ord PieceId
instance Show PieceId where
  show (PieceId id) = id


data IsSimplifiable
  = IsConstant (Map CardinalDirection Signal)
  | IsConnection (Map CardinalDirection CardinalDirection)

type Directional a = ( u :: a, r :: a, d :: a, l :: a)


{-
  What is a piece?

  - a piece has ports
  - A Piece MUST have at least one output
  - a piece has at least 1 output (or else what the hell does it do?)
  - a piece has at least 1 input
  - a piece can be evaluated
  - a piece has a unique identifier

-}
newtype Piece = Piece
  {-
    This name should be unique. If pieces with the same name are added to the `pieceVault`, the application will crash.

    TODO: figure out how to 
  -}
  { name :: PieceId
  {-
    The `eval` function for a `Piece` should be modelled as a function
      Signal^4 -> Signal^4
    
    However before the input signals are provided to the piece, the `Game` should truncate or zero out.

    Imagine that `NOT4` is a piece that takes a 4 bit signal on the `Left` and outputs a 4 bit signal on the `Right`.
    ```
    -> NOT4 ->
    ```
    The `eval` function for such a piece would be the same as the 1 bit and 8 bit not pieces: `\{l} -> {r: not l}`.
  -}
  , eval :: Record (Directional Signal) -> Record (Directional Signal)
  {-
    The complexity of a piece is a 
  -}
  , complexity :: Complexity
  {-
    When capacity of a port is changed, we want to do one of the following:
      - the capacity should change, and the capacity should ripple to adjacent pieces 
      - the capacity should change, but the capacity should *not* ripple
      - the capacity shouldn't change
  -}
  , shouldRipple :: Boolean
  , updateCapacity :: CardinalDirection -> Capacity -> Maybe Piece
  , ports :: Record (Directional Port)
  {-
    The `updatePort` function asks: if there was suddenly a `port` in the direction `dir`, how should the piece react?. In general we don't want the piece to do anything, but if the piece is a wire piece, it's desirable to add/remove output ports if a change in the matching port is detected.

    HISTORY:
    We also need a way to tell if a piece changed after a port was updated. Originally `updatePort` had the type signature:

    ```updatePort :: CardinalDirection -> Maybe Port -> Piece```
    
    Unfortunately, from this type signature there was no was to tell whether the piece was actually modified when a port was updated.
    To rememdy, `updatePort` was modified to return a maybe type if it was modified:

    ```updatePort :: CardinalDirection -> Maybe Port -> Maybe Piece```

    The function will now output `Just Piece` if the `Piece` was modified and `Nothing` if it's not modified. Also note that the `Maybe Port` parameter was changed to `Maybe PortType`, this was to ensure that `updatePort` cannot possibly change capacity (because the piece doesn't know what the adjacent port capacity is)
  -}
  , updatePort :: CardinalDirection -> Maybe PortType -> Maybe Piece
  {-
    To effeciently compile a board, we need to know whether a piece can be simplified. Since our `eval` function is non-symbolic, we need to encode this information into the piece type. 

      - constant pieces don't have to be evaluated, their values can be added to the initial signal map during compilation
      - connection pieces don't have to be evaluated either, their functionality can be added to the connection map during compilation
  -}
  , isSimplifiable :: Maybe IsSimplifiable
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
derive instance Newtype Piece _

class LiftEval a b where
  liftEval :: (a -> b) -> Record (Directional Signal) -> Record (Directional Signal)


type MkPiece a b r =
  ( name :: PieceId
  , eval :: a -> b
  , ports :: Map CardinalDirection Port
  | r )
mkPiece :: forall r1 r2 r3
  .  Union (MkPiece r1) r2 r3 => Newtype Piece (Record r3) => Record (MkPiece r1) -> Piece
mkPiece piece = Piece (unsafeUnion piece defaultPiece)
  where
    defaultPiece =
      { complexity: Complexity.space 0.0
      , shouldRipple: false
      , updateCapacity: \_ _ -> Nothing
      , updatePort: \_ _ -> Nothing
      , isSimplifiable: Nothing
      }


--type DirectionalSignals = { u :: Signal, d :: Signal, l :: Signal, r :: Signal }
--type MkPiece2 r =
--  ( name :: PieceId
--  , eval :: Directional Signals -> Directional Signals
--  , ports :: Map CardinalDirection Port
--  | r )
--mkPiece2 :: forall r1 r2 r3. Union (MkPiece2 r1) r2 r3 => Newtype Piece (Record r3) => Record (MkPiece2 r1) -> Piece
--mkPiece2 piece = Piece (unsafeUnion piece defaultPiece)
--  where
--    defaultPiece =
--      { complexity: Complexity.space 0.0
--      , shouldRipple: false
--      , updateCapacity: \_ _ -> Nothing
--      , updatePort: \_ _ -> Nothing
--      , isSimplifiable: Nothing
--      }

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

immutablePiece :: Piece -> Piece
immutablePiece (Piece p) = Piece $ p
  { shouldRipple = false
  , updateCapacity = \_ _ -> Nothing
  , updatePort = \_ _ -> Nothing
  }