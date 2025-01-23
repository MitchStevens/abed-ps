module Game.Piece.Types
  ( MkPieceNoGlob
  , Piece(..)
  , PieceId(..)
  , Simplification(..)
  , defaultPortInfo
  , eval
  , getInputDirs
  , getOutputDirs
  , getPort
  , getPorts
  , glob
  , isSimplifiable
  , mkPieceNoGlob
  , name
  , shouldRipple
  , truncateInputs
  , truncateOutputs
  , unglob
  , updateCapacity
  )
  where

import Prelude

import Control.Alternative (guard)
import Control.Lazy (fix)
import Data.Array (fold)
import Data.Foldable (and)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Generic.Rep (class Generic)
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.Show.Generic (genericShow)
import Data.TraversableWithIndex (forWithIndex)
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection)
import Game.Piece.Complexity (Complexity(..))
import Game.Piece.Complexity as Complexity
import Game.Port (Port(..), PortType, isInput, isOutput, portCapacity)
import Game.PortInfo (PortInfo)
import Game.Signal (Signal(..), canonical, mkSignal)
import Prim.Row (class Union)
import Record.Unsafe.Union (unsafeUnion)

newtype PieceId = PieceId String
derive instance Newtype PieceId _
derive instance Eq PieceId
derive instance Ord PieceId
instance Show PieceId where
  show (PieceId id) = id

{-
  This "Simplification" data type is kinda confusing

  A `Simplification` is a short hand way of describing *some* simple pieces. These simplifications are used when compiling an `EvaluableBoard` into a more effecient `CompiledBoard`. Simplifications come in two forms:
  
  - If a piece can be simplified to `Constant`, the outputs of the  


  An obvious question: why not define `Simplification`:
  ```
  type Simplification = Map CardinalDirection (Either CardinalDirection Signal)
  ```
  Which would allow for the simplification of pieces that are a combination of `Constant` and `Connection`?

    1. Such a piece would be rare and not worth the additional complexity, and
    2. It's useful for creating paths (See `PathSegment.purs`)
-}
data Simplification
  = Constant (Map CardinalDirection Signal)
  | Connection (Map CardinalDirection CardinalDirection)
derive instance Generic Simplification _
derive instance Eq Simplification
instance Show Simplification where
  show = genericShow


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
  , eval :: Map CardinalDirection Signal -> Map CardinalDirection Signal
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
  , ports :: Map CardinalDirection Port

  {-
  rules forglobbing :
    unglob p <= p <= glob d t p
    glob d1 t1 <<< glob d2 t2 = glob d2 t2 <<< glob d1 t1
    unglob <<< unglob = unglob
    unglob <<< glob d t = unglob


  -}
  , glob :: CardinalDirection -> Maybe PortType -> Maybe Piece
  , unglob :: Lazy Piece
  {-
    To effeciently compile a board, we need to know whether a piece can be simplified. Since our `eval` function is non-symbolic, we need to encode this information into the piece type. 

      - constant pieces don't have to be evaluated, their values can be added to the initial signal map during compilation
      - connection pieces don't have to be evaluated either, their functionality can be added to the connection map during compilation
    
    TODO: the simplification should uniquely determine the piece, thus there should exist a function
      fromSimplification :: Simplification -> Piece
    such that:
      forall piece. fromSimplification piece.isSimplifiable == piece
    this would require a more sophisticated instance for `Eq Piece` to implement

  -}
  , isSimplifiable :: Maybe Simplification
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

type MkPieceNoGlob =
  { name :: PieceId
  , eval :: Map CardinalDirection Signal -> Map CardinalDirection Signal
  , ports :: Map CardinalDirection Port
  , complexity :: Complexity
  , shouldRipple :: Boolean
  , updateCapacity :: CardinalDirection -> Capacity -> Maybe Piece
  , isSimplifiable :: Maybe Simplification
  }

mkPieceNoGlob :: MkPieceNoGlob -> Piece
mkPieceNoGlob piece = Lazy.force (fix go)
  where
    go :: Lazy Piece -> Lazy Piece
    go this = Lazy.defer \_ -> Piece
      { name: piece.name
      , eval: piece.eval
      , ports: piece.ports
      , complexity: piece.complexity
      , shouldRipple: piece.shouldRipple
      , updateCapacity: piece.updateCapacity
      , glob: \_ _ -> Nothing
      , unglob: this
      , isSimplifiable: piece.isSimplifiable
      }


name :: Piece -> PieceId
name (Piece p) = p.name

{-
  

-}
eval :: Piece -> Map CardinalDirection Signal -> Map CardinalDirection Signal
eval (Piece p) inputs = p.eval inputs

shouldRipple :: Piece -> Boolean
shouldRipple (Piece p) = p.shouldRipple

updateCapacity :: CardinalDirection -> Capacity -> Piece -> Maybe Piece
updateCapacity dir capacity (Piece p) = p.updateCapacity dir capacity

getPorts :: Piece -> Map CardinalDirection Port
getPorts (Piece p) = p.ports

{-

  glob d1 Nothing >>> glob d2 Nothing == glob d2 Nothing >>> glob d1 Nothing

  glob d Nothing p <= p
  p <= glob d (Just t) p
-}
glob :: CardinalDirection -> Maybe PortType -> Piece -> Piece
glob dir port (Piece p) = fromMaybe (Piece p) (p.glob dir port)


{-
  unglob >>> unglob = unglob
  unglob p <= p
  unglob p <= glob d t 
-}
unglob :: Piece -> Piece
unglob (Piece p) = Lazy.force p.unglob

isSimplifiable :: Piece -> Maybe Simplification
isSimplifiable (Piece p) = p.isSimplifiable

defaultPortInfo :: Piece -> Map CardinalDirection PortInfo
defaultPortInfo piece = getPorts piece <#> \port ->
  { connected: false, port, signal: mkSignal 0}

getPort :: Piece -> CardinalDirection -> Maybe Port
getPort (Piece p) dir = M.lookup dir p.ports

getInputDirs :: Piece -> Set CardinalDirection
getInputDirs (Piece p) = M.keys $ M.filter isInput p.ports

getOutputDirs :: Piece -> Set CardinalDirection
getOutputDirs (Piece p) = M.keys $ M.filter isOutput p.ports

truncateInputs :: Piece -> Map CardinalDirection Signal -> Map CardinalDirection Signal
truncateInputs (Piece p) inputs =
  flip M.mapMaybeWithKey p.ports \dir port -> do
    guard (isInput port)
    canonical (portCapacity port) <$> M.lookup dir inputs

truncateOutputs :: Piece -> Map CardinalDirection Signal -> Map CardinalDirection Signal 
truncateOutputs (Piece p) outputs = 
  flip M.mapMaybeWithKey p.ports \dir port -> do
    guard (isOutput port)
    canonical (portCapacity port) <$> M.lookup dir outputs
    