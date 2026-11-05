module Game.Piece.Types
  ( MkPieceNoAdapt
  , Piece(..)
  , PieceId(..)
  , Simplification(..)
  , adapt
  , defaultPortInfo
  , eval
  , getInputDirs
  , getOutputDirs
  , getPort
  , getPorts
  , getWormhole
  , isSimplifiable
  , mkPieceNoAdapt
  , name
  , shouldRipple
  , stepPiece
  , tick
  , truncateInputs
  , truncateOutputs
  , updateCapacity
  )
  where

import Prelude

import Control.Alternative (guard)
import Control.Monad.State (State, get, put)
import Data.Array (fold)
import Data.Array as A
import Data.Foldable (and)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Generic.Rep (class Generic)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Set (Set)
import Data.Set as S
import Data.Show.Generic (genericShow)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity)
import Game.Direction (CardinalDirection, oppositeDirection)
import Game.Frame (class Evaluable, Frame)
import Game.Frame as Frame
import Game.Piece.Complexity (Complexity(..))
import Game.Piece.Complexity as Complexity
import Game.Piece.Operation (PieceOperation)
import Game.Piece.Operation as Operation
import Game.Port (Port(..), PortType(..), getPortType, hasPort, isInput, isOutput, isReadable, isWritable, portCapacity)
import Game.PortInfo (PortInfo, noPortInfo)
import Game.Signal (Signal(..), mkSignal)
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
  = Constant (Frame Signal)
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
    This name should be unique. If pieces with the same name are added to the `pieceVault`, pieceVault will not contain all of Pieces available.
  -}
  { name :: PieceId
  {-
    The operation of a `Piece` names its `eval` function (see `Game.Piece.Operation`), which is a function
      Signal^4 -> Signal^4
    which is exactly what `Frame Signal -> Frame Signal` is: one signal per side in, one per side out.

    Before the input signals are provided to the piece, the `Game` should truncate or zero out everything
    the piece doesn't read (see `Game.Frame.Framing`). A side the piece doesn't read is `zero`, and a side
    it doesn't write should be left `zero`.

    Imagine that `NOT4` is a piece that takes a 4 bit signal on the `Left` and outputs a 4 bit signal on the `Right`.
    ```
    -> NOT4 ->
    ```
    The operation of such a piece would be the same as the 1 bit and 8 bit not pieces: `Operation.Not`, whose `eval` is `\m -> Frame.singleton zero Right (not (Frame.index Left m))`.
  -}
  , op :: PieceOperation
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
  , ports :: Frame Port
  , adapt :: CardinalDirection -> Port -> Maybe Piece
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
    , p1.op == p2.op
    ]
instance Ord Piece where
  compare (Piece p1) (Piece p2) = fold
    [ compare p1.name p2.name
    , compare p1.ports p2.ports
    , compare p1.op p2.op
    ]
instance Show Piece where
  show (Piece p) = "(Piece " <> show p.name <> ")"
derive instance Newtype Piece _

type MkPieceNoAdapt =
  { name :: PieceId
  , op :: PieceOperation
  , ports :: Frame Port
  , complexity :: Complexity
  , shouldRipple :: Boolean
  , updateCapacity :: CardinalDirection -> Capacity -> Maybe Piece
  , isSimplifiable :: Maybe Simplification
  }

mkPieceNoAdapt :: MkPieceNoAdapt -> Piece
mkPieceNoAdapt piece = Piece
  { name: piece.name
  , op: piece.op
  , ports: piece.ports
  , complexity: piece.complexity
  , shouldRipple: piece.shouldRipple
  , updateCapacity: piece.updateCapacity
  , adapt: \_ _ -> Nothing
  , isSimplifiable: piece.isSimplifiable
  }


name :: Piece -> PieceId
name (Piece p) = p.name

eval :: Piece -> Frame Signal -> Frame Signal
eval (Piece p) = Operation.eval p.op

-- `Game.Frame` can't provide this itself (it would have to import this module
-- back); see the note on `Evaluable`.
instance Evaluable Piece where
  eval (Piece p) = Operation.eval p.op

{-
  Advance a piece by one tick, as an `EvaluableBoard` would, injecting this
  tick's external `inputs` and returning the piece's full output frame for the
  tick.

  A piece with a wormhole feeds a signal from a `WormholeIn` port back into the
  `WormholeOut` port on the *opposite* side, delayed by one tick. `stepPiece`
  evaluates the piece against `inputs` on every side but a `WormholeOut` (the
  tail), which reads the signal buffered from the previous tick (held in the
  `State`), then stores this tick's wormhole signals for the next one.

  Thread an input sequence with `traverse`:

    evalState (traverse (stepPiece piece <<< Frame.singleton zero dir) signals) initialBuffer
-}
stepPiece
  :: Piece
  -> Frame Signal
  -> State (Frame Signal) (Frame Signal)
stepPiece piece inputs = do
  buffered <- get
  let
    ports = getPorts piece
    isTail dir = getPortType (Frame.index dir ports) == WormholeOut
    seen = Frame.tabulate \dir -> Frame.index dir (if isTail dir then buffered else inputs)
    outputs = eval piece seen
    wormholeOutDirs = A.fromFoldable (Frame.directionsWhere (\p -> getPortType p == WormholeOut) ports)
  put $ Frame.fromFoldable zero $ wormholeOutDirs # A.mapMaybe \outDir -> do
    let inDir = oppositeDirection outDir
    guard (getPortType (Frame.index inDir ports) == WormholeIn)
    pure (Tuple outDir (Frame.index inDir outputs))
  pure outputs

{-
  `stepPiece` with no external inputs, discarding the output frame -- suitable for
  `replicateM`/`sequence_` when every tick is identical (e.g. a self-driven
  counter):

    execState (sequence_ (replicate n (tick piece))) initialBuffer
-}
tick :: Piece -> State (Frame Signal) Unit
tick piece = void (stepPiece piece (pure zero))

shouldRipple :: Piece -> Boolean
shouldRipple (Piece p) = p.shouldRipple

updateCapacity :: CardinalDirection -> Capacity -> Piece -> Maybe Piece
updateCapacity dir capacity (Piece p) = p.updateCapacity dir capacity

getPorts :: Piece -> Frame Port
getPorts (Piece p) = p.ports

{-
  rules for adapting:
    if d1 /= d2 then adapt d1 t1 <<< adapt d2 t2 = adapt d2 t2 <<< adapt d1 t1
    adapt is idempotent: adapt d t <<< adapt d t = adapt d t
    adapt d noPort p <= p
    p <= adapt d port p      (for any real port)
-}
-- | Adapt `piece` to whatever port its neighbour presents on side `dir`:
-- | `noPort` when the neighbour has none.
adapt :: CardinalDirection -> Port -> Piece -> Piece
adapt dir port (Piece p) = fromMaybe (Piece p) (p.adapt dir port)

isSimplifiable :: Piece -> Maybe Simplification
isSimplifiable (Piece p) = p.isSimplifiable

defaultPortInfo :: Piece -> Frame PortInfo
defaultPortInfo piece = getPorts piece <#> \port ->
  if hasPort port then { connected: false, port, signal: mkSignal 0 } else noPortInfo

getPort :: Piece -> CardinalDirection -> Maybe Port
getPort (Piece p) dir = Frame.lookupWhere hasPort dir p.ports

getInputDirs :: Piece -> Set CardinalDirection
getInputDirs (Piece p) = Frame.directionsWhere isInput p.ports

getOutputDirs :: Piece -> Set CardinalDirection
getOutputDirs (Piece p) = Frame.directionsWhere isOutput p.ports

{-
  A piece's own `WormholeIn`/`WormholeOut` ports, if it has one of each -- see
  `stepPiece` above. `wormholeIn` names the direction typed `WormholeIn` --
  the mouth: the piece writes its captured-next value there. `wormholeOut`
  names the direction typed `WormholeOut` -- the tail: the piece reads the
  buffered value there, one tick after it was written to `wormholeIn`. Same
  convention everywhere a wormhole is named, including `Game.Board.Types`'s
  `Wormhole` and `Game.Board.Compiled`'s tail/mouth resolution.
-}
getWormhole :: Piece -> Maybe { wormholeIn :: CardinalDirection, wormholeOut :: CardinalDirection }
getWormhole (Piece p) = do
  wormholeIn <- S.findMin $ Frame.directionsWhere (\port -> getPortType port == WormholeIn) p.ports
  wormholeOut <- S.findMin $ Frame.directionsWhere (\port -> getPortType port == WormholeOut) p.ports
  pure { wormholeIn, wormholeOut }

{-
  Restrict a signal frame to the directions `piece` actually reads from each
  tick: its `Input` ports (driven by a neighbor) and `WormholeOut` ports
  (driven by the wormhole buffer, see `getWormhole` above) -- zeroing
  anything else, such as a stale signal left sitting on one of the piece's
  own output directions.
-}
truncateInputs :: Piece -> Frame Signal -> Frame Signal
truncateInputs (Piece p) inputs =
  (\port signal -> if isReadable port then signal else zero) <$> p.ports <*> inputs

{-
  Restrict a signal frame (typically `eval`'s result) to the directions `piece`
  actually produces each tick: its `Output` ports (read by a neighbor) and
  `WormholeIn` ports (captured into the wormhole buffer) -- zeroing
  anything else, such as a stray value on one of the piece's own input
  directions.
-}
truncateOutputs :: Piece -> Frame Signal -> Frame Signal
truncateOutputs (Piece p) outputs =
  (\port signal -> if isWritable port then signal else zero) <$> p.ports <*> outputs