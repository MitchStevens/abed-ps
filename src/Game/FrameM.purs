module Game.FrameM where

import Prelude

import Control.Monad.Reader (ReaderT, ask, local, runReaderT)
import Control.Monad.State (State, get, modify_, runState)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..), fst, snd)
import Game.Frame (class Framing, Frame, PieceIndex, PortIndex, index)
import Game.Port (Port, isReadable, isWritable, noPort)
import Game.Signal (Signal)

-- | What never changes while a `FrameM` runs, per piece: the ports it has on
-- | each side (`noPort` where it has none -- what reads and writes are
-- | truncated against), and where the
-- | value on each side comes from -- an input's neighbouring output, or the
-- | side's own slot when there's nothing to route to. Same shape as
-- | `CompiledBoard.frames`, one `Frame` per piece.
type FrameShape =
  { ports :: Map PieceIndex (Frame Port)
  , routing :: Map PieceIndex (Frame (Maybe PortIndex))
  }

-- | The reader half is `at` (which piece is in focus -- `Nil` at the root) and
-- | the `FrameShape`; the state is every piece's current `Frame`. It starts
-- | as whatever the `...From` runners are given (`M.empty` for the plain
-- | ones), and a missing entry reads as `zero`. Starting non-empty is how
-- | values that come from outside a piece's own writes get in: a board's
-- | external inputs, a wormhole tail seeded from last tick's mouth.
newtype FrameM a = FrameM
  ( ReaderT { at :: PieceIndex, shape :: FrameShape }
      (State (Map PieceIndex (Frame Signal)))
      a
  )

derive newtype instance Functor FrameM
derive newtype instance Apply FrameM
derive newtype instance Applicative FrameM
derive newtype instance Bind FrameM
derive newtype instance Monad FrameM

-- | A piece missing from the `FrameShape` is treated as having no ports at all
-- | -- reads `zero`, writes go nowhere -- rather than crashing.
-- |
-- | `writeFrame` merges rather than replaces: only a writable side takes the
-- | new value, every other side keeps whatever the slot already held. That's
-- | what stops a piece's own write from wiping a value seeded into one of its
-- | input slots from outside (see the state note on `FrameM`).
instance Framing FrameM where
  writeFrame frame = FrameM do
    { at, shape } <- ask
    signals <- get
    let
      ports = fromMaybe (pure noPort) (M.lookup at shape.ports)
      existing = fromMaybe (pure zero) (M.lookup at signals)
      takeIfWritable port old new = if isWritable port then new else old
    modify_ (M.insert at (takeIfWritable <$> ports <*> existing <*> frame))

  readFrame = FrameM do
    { at, shape } <- ask
    signals <- get
    let
      ports = fromMaybe (pure noPort) (M.lookup at shape.ports)
      routes = fromMaybe (pure Nothing) (M.lookup at shape.routing)
      signalAt (Tuple piece dir) = fromMaybe zero (index dir <$> M.lookup piece signals)
      readSide port route = case route of
        Just source | isReadable port -> signalAt source
        _ -> zero
    pure (readSide <$> ports <*> routes)

  -- `snoc`, not `Cons`: a `PieceIndex` runs root-first (see `appendLocation`).
  withLocation loc (FrameM m) = FrameM (local (\env -> env { at = L.snoc env.at loc }) m)

-- | Run from an explicit starting state. A piece missing from `initial` starts
-- | at `zero`, same as one missing at any later point.
runFrameMFrom :: forall a. FrameShape -> Map PieceIndex (Frame Signal) -> FrameM a -> Tuple a (Map PieceIndex (Frame Signal))
runFrameMFrom shape initial (FrameM m) = runState (runReaderT m { at: Nil, shape }) initial

evalFrameMFrom :: forall a. FrameShape -> Map PieceIndex (Frame Signal) -> FrameM a -> a
evalFrameMFrom shape initial m = fst (runFrameMFrom shape initial m)

execFrameMFrom :: forall a. FrameShape -> Map PieceIndex (Frame Signal) -> FrameM a -> Map PieceIndex (Frame Signal)
execFrameMFrom shape initial m = snd (runFrameMFrom shape initial m)

-- | Run from an empty state: every piece starts all-`zero`.
runFrameM :: forall a. FrameShape -> FrameM a -> Tuple a (Map PieceIndex (Frame Signal))
runFrameM shape = runFrameMFrom shape M.empty

evalFrameM :: forall a. FrameShape -> FrameM a -> a
evalFrameM shape = evalFrameMFrom shape M.empty

execFrameM :: forall a. FrameShape -> FrameM a -> Map PieceIndex (Frame Signal)
execFrameM shape = execFrameMFrom shape M.empty
