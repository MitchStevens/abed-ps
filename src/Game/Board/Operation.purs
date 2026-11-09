module Game.Board.Operation where

import Data.Lens
import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError)
import Control.Monad.Except (ExceptT, runExceptT)
import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.State (class MonadState, class MonadTrans, StateT, get, gets, lift, put, runStateT)
import Data.Array (foldMap)
import Data.Either (Either(..))
import Data.Foldable (all, find, foldr, for_, traverse_)
import Data.Identity (Identity)
import Data.Int (even, odd)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Record (prop)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Set as S
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Debug (trace)
import Debug as Debug
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Game.Board.Edge (AbsoluteEdge, RelativeEdge(..), absolute, adjacent, adjacentAbsoluteEdge, fromAbsoluteEdge, getPortOnEdge, relative)
import Game.Board.Query (getBoardPorts, isInsideBoard)
import Game.Board.Types (Board, Cell(..), BoardF(BoardF), BoardError(..), Wormhole, _boardF, _pieces, _ports, _size, _wormhole, mkBoard)
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Game.Location (Location(..), location)
import Game.Piece (Piece(..), adapt, pieceLookup)
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Port (Port, hasPort, isInput, isOutput, noPort, portCapacity)
import Game.Rotation (Rotation(..), rotation)
import Type.Proxy (Proxy(..))

emptyBoard :: Int -> Either BoardError Board
emptyBoard n =
  if odd n && n >= 1
    then Right $ mkBoard $ BoardF { size: n, ports: pure noPort, pieces: M.empty, wormhole: Nothing }
    else Left $ InvalidBoardInitialisation n

-- should return either boarderror
getPieceInfo :: forall m. MonadState Board m => MonadError BoardError m => Location -> m { rotation :: Rotation, piece :: Cell }
getPieceInfo loc =
  use (_pieces <<< at loc) >>=
    maybe (throwError (LocationNotOccupied loc)) pure

-- a location's contents: a leaf piece or a nested board -- see `Game.Board.Types.Cell`.
getPiece :: forall m. MonadState Board m => MonadError BoardError m => Location -> m Cell
getPiece loc = (_.piece) <$> getPieceInfo loc

{- 
  piece add/rotate/remove
  Note that all of these operations can possibly fail and thus require the constraint:
    => MonadError BoardError m
  
  operations that don't modify the board only have the constraint: 
    => MonadState Board
  
  This means that the operation can never fail and re don't have to handle the error case.
  Very useful to seperate the board operations this way.
-}

checkInsideBoard :: forall m. MonadError BoardError m => MonadState Board m => Location -> m Unit
checkInsideBoard loc = whenM (not <$> isInsideBoard loc) (throwError (InvalidLocation loc))

adaptRelEdge :: forall m. MonadState Board m => AbsoluteEdge -> Port -> MaybeT m Unit
adaptRelEdge absEdge port = do
  Relative { loc, dir } <- fromAbsoluteEdge absEdge
  { piece } <- MaybeT $ use (_pieces <<< at loc)
  -- adapting only makes sense for a leaf piece; a nested board has no
  -- adaptable port yet, so leave it alone.
  case piece of
    Leaf p -> _pieces <<< ix loc <<< prop (Proxy :: Proxy "piece") .= Leaf (adapt dir port p)
    Nested _ -> MaybeT $ pure Nothing

adaptPortsAround :: forall m. MonadState Board m => Location -> m Unit
adaptPortsAround loc =
  for_ allDirections \dir -> do
    let edge = absolute loc dir
    let adj = adjacentAbsoluteEdge edge
    maybePort <- runMaybeT (getPortOnEdge edge)
    void $ runMaybeT $ adaptRelEdge adj (fromMaybe noPort maybePort)

addPieceNoUpdate :: forall m. MonadError BoardError m => MonadState Board m 
  => Location -> Piece -> Rotation -> m Unit
addPieceNoUpdate loc piece = addCellNoUpdate loc (Leaf piece)

addCellNoUpdate :: forall m. MonadError BoardError m => MonadState Board m
  => Location -> Cell -> Rotation -> m Unit
addCellNoUpdate loc cell rotation = do
  checkInsideBoard loc
  pieceInfo <- use (_pieces <<< at loc)
  case pieceInfo of
    Nothing -> _pieces <<< at loc .= Just { piece: cell, rotation }
    Just _ -> throwError (LocationOccupied loc)

addPiece :: forall m. MonadError BoardError m => MonadState Board m => Location -> Piece -> m Unit
addPiece loc piece = addCell loc (Leaf piece)

addCell :: forall m. MonadError BoardError m => MonadState Board m => Location -> Cell -> m Unit
addCell loc cell = do
   addCellNoUpdate loc cell (rotation 0)
   adaptPortsAround loc

removePieceNoUpdate :: forall m. MonadError BoardError m => MonadState Board m => Location -> m { rotation :: Rotation, piece :: Cell }
removePieceNoUpdate loc = do
  checkInsideBoard loc
  maybePieceInfo <- use (_pieces <<< at loc)
  case maybePieceInfo of
    Nothing -> throwError (LocationNotOccupied loc)
    Just pieceInfo -> do
      _pieces <<< at loc .= Nothing
      pure pieceInfo

removePiece :: forall m. MonadError BoardError m => MonadState Board m => Location -> m { rotation :: Rotation, piece :: Cell }
removePiece loc = do
  piece <- removePieceNoUpdate loc
  adaptPortsAround loc
  pure piece


movePiece :: forall m. MonadError BoardError m => MonadState Board m
  => Location -> Location -> m { rotation :: Rotation, piece :: Cell }
movePiece src dst = do
  use (_pieces <<< at src) >>= case _ of
    Just pieceInfoSrc -> do
      whenM (isJust <$> use (_pieces <<< at dst)) do
        throwError (LocationOccupied dst)

      _pieces <<< at src .= Nothing
      _pieces <<< at dst .= Just pieceInfoSrc
      adaptPortsAround src
      adaptPortsAround dst
      pure $ pieceInfoSrc
    Nothing ->
      throwError (LocationNotOccupied src)

pieceDropped :: forall m. MonadState Board m => MonadError BoardError m
  => Location -> Maybe Location -> m { rotation :: Rotation, piece :: Cell }
pieceDropped src maybeDst =
  -- when a piece is dropped, it can be dropped over a new location or outside the game board 
  case maybeDst of
    -- if the piece is dropped over a new location, attempt to add the piece to the board
    Just dst -> movePiece src dst 
    -- if the piece is dropped somewhere that is not a location, remove it from the board
    Nothing -> removePiece src




rotatePieceBy :: forall m. MonadError BoardError m => MonadState Board m => Location -> Rotation -> m Unit
rotatePieceBy loc rot = do
  checkInsideBoard loc
  _ <- getPiece loc
  _pieces <<< ix loc <<< prop (Proxy :: Proxy "rotation") <>= rot
  adaptPortsAround loc

{-
  change size
-}
validBoardSize :: forall m. MonadThrow BoardError m => Int -> m Int
validBoardSize n =
  if even n || n < 3 || n > 9
    then throwError (BadBoardSize n)
    else pure n


{-
  The user should be able to switch between 3x3 games of size 3x3, 5x5, 7x7, and 9x9. Any circuit that requires larger games should be split into sub pieces (functionality not implemented yet).


  When we toggle between size, we want to ensure that we don't lose any of the piece on the outside of the board.
-}
decreaseSize :: forall m. MonadState Board m => MonadError BoardError m => m Unit
decreaseSize = do
  n <- use _size
  setBoardSize (n-2)

increaseSize :: forall m. MonadState Board m => MonadError BoardError m => m Unit
increaseSize = do
  n <- use _size
  setBoardSize (n+2)

setBoardSize :: forall m. MonadState Board m => MonadError BoardError m => Int -> m Unit
setBoardSize n = do
  -- the wormhole doesn't survive a resize, and takes its sides' ports with it
  -- (see `removeWormhole`)
  removeWormhole
  BoardF { size, ports, pieces } <- use _boardF
  newSize <- validBoardSize n
  let dSize = -(newSize - size) `div` 2

  let insideSquare (Location {x, y}) = all (between 0 (newSize-1)) [x, y]
  let shiftLocation (Location {x, y}) = location (x-dSize) (y - dSize)
  let firstPieceOusideSquare = find (not <<< insideSquare <<< shiftLocation) (M.keys pieces)

  case firstPieceOusideSquare of
    Just loc -> throwError (LocationOccupied loc)
    Nothing -> _boardF .= BoardF
      { size: newSize
      , ports
      , pieces: unsafeMapKey shiftLocation pieces
      , wormhole: Nothing }


{-
  wormholes
-}

-- | The wormhole joining `from` to `to`, given the ports the pieces on the
-- | board's edges offer there (`getBoardPorts`). The mouth's side needs an
-- | output and the tail's an input, of the same capacity -- or no port yet,
-- | for one to be wired up later. Where the ports allow either way round, the
-- | signal goes from `from` to `to`. `Nothing` if neither way works.
wormholeBetween :: Frame Port -> CardinalDirection -> CardinalDirection -> Maybe Wormhole
wormholeBetween edges from to
  | from == to = Nothing
  | otherwise = find fits
      [ { wormholeIn: from, wormholeOut: to }
      , { wormholeIn: to, wormholeOut: from }
      ]
  where
  fits { wormholeIn, wormholeOut } =
    allows isOutput mouth && allows isInput tail && sameCapacity
    where
    mouth = Frame.index wormholeIn edges
    tail = Frame.index wormholeOut edges
    sameCapacity = not (hasPort mouth && hasPort tail) || portCapacity mouth == portCapacity tail

  allows isRole port = not (hasPort port) || isRole port

-- | Join two sides of the board with a wormhole, replacing the one it had.
addWormhole :: forall m. MonadState Board m => MonadError BoardError m => Wormhole -> m Unit
addWormhole wormhole = do
  when (wormhole.wormholeIn == wormhole.wormholeOut) do
    throwError (WormholeInvalid wormhole)
  removeWormhole
  _wormhole .= Just wormhole
  syncWormholePorts

-- | Close the board's wormhole, if it has one. Its two sides go back to having
-- | no port: right for the root, whose wormhole can only be on sides the goal
-- | leaves empty, and a nested board's ports are rederived from its edges
-- | anyway (`Game.Board.Zoom.runAtFocus`).
removeWormhole :: forall m. MonadState Board m => m Unit
removeWormhole = use _wormhole >>= traverse_ \{ wormholeIn, wormholeOut } -> do
  _wormhole .= Nothing
  _ports %= Frame.set wormholeIn noPort >>> Frame.set wormholeOut noPort

-- | Declare the wormhole's sides as whatever the pieces on those edges offer,
-- | so the mouth is an output and the tail an input once they're wired up. A
-- | nested board rederives all its ports this way; this is for the root, whose
-- | other sides are the goal's.
syncWormholePorts :: forall m. MonadState Board m => m Unit
syncWormholePorts = use _wormhole >>= traverse_ \{ wormholeIn, wormholeOut } -> do
  edges <- getBoardPorts
  _ports %= Frame.set wormholeIn (Frame.index wormholeIn edges)
    >>> Frame.set wormholeOut (Frame.index wormholeOut edges)
