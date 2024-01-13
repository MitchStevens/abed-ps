module Game.Board.Operation where

import Data.Lens
import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError)
import Control.Monad.Except (ExceptT, runExceptT)
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
import Data.Maybe (Maybe(..), isJust, isNothing, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Set as S
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Debug (trace)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Game.Board.PieceInfo (PieceInfo, _rotation)
import Game.Board.Query (adjacentRelativeEdge, getPortOnEdge, isInsideBoard)
import Game.Board.RelativeEdge (RelativeEdge(..), relative)
import Game.Board.Types (Board(..), BoardError(..), _pieces)
import Game.Direction (allDirections)
import Game.Direction as Direction
import Game.Edge (Edge(..), edgeLocation)
import Game.GameEvent (BoardEvent(..))
import Game.Location (Location(..), location)
import Game.Piece (Piece(..), pieceLookup, updatePort)
import Game.Port (PortType, portType)
import Game.Rotation (Rotation(..), rotation)
import Type.Proxy (Proxy(..))

emptyBoard :: Int -> Either BoardError Board
emptyBoard n = 
  if odd n && n >= 1
    then Right $ Board { size: n, pieces: M.empty }
    else Left $ InvalidBoardInitialisation n

-- should return either boarderror
getPieceInfo :: forall m. MonadState Board m => MonadError BoardError m => Location -> m PieceInfo
getPieceInfo loc =
  use (_pieces <<< at loc) >>= 
    maybe (throwError (LocationNotOccupied loc)) pure

getPiece :: forall m. MonadState Board m => MonadError BoardError m => Location -> m Piece
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

updateRelEdge :: forall m. MonadState Board m => RelativeEdge -> Maybe PortType -> m Unit
updateRelEdge (Relative (Edge {dir, loc})) portType = do
  use (_pieces <<< at loc) >>= traverse_ \info -> do
    for_ (updatePort dir portType info.piece) \piece ->
      _pieces <<< ix loc <<< prop (Proxy :: Proxy "piece") .= piece

updatePortsAround :: forall m. MonadState Board m => Location -> m Unit
updatePortsAround loc = do
  for_ allDirections \dir -> do
    let relEdge = relative loc dir
    maybePort <- getPortOnEdge relEdge
    relEdge' <- adjacentRelativeEdge relEdge
    updateRelEdge relEdge' (portType <$> maybePort)

addPieceNoUpdate :: forall m. MonadError BoardError m => MonadState Board m 
  => Location -> Piece -> Rotation -> m Unit
addPieceNoUpdate loc piece rotation = do
  checkInsideBoard loc
  pieceInfo <- use (_pieces <<< at loc)
  case pieceInfo of
    Nothing -> _pieces <<< at loc .= Just { piece, rotation }
    Just _ -> throwError (LocationOccupied loc)

addPiece :: forall m. MonadError BoardError m => MonadState Board m => Location -> Piece -> m Unit
addPiece loc piece = do
   addPieceNoUpdate loc piece (rotation 0)
   updatePortsAround loc

removePieceNoUpdate :: forall m. MonadError BoardError m => MonadState Board m => Location -> m Piece
removePieceNoUpdate loc = do
  checkInsideBoard loc
  maybePieceInfo <- use (_pieces <<< at loc)
  case maybePieceInfo of
    Nothing -> throwError (LocationNotOccupied loc)
    Just pieceInfo -> do
      _pieces <<< at loc .= Nothing
      pure pieceInfo.piece

removePiece :: forall m. MonadError BoardError m => MonadState Board m => Location -> m Piece
removePiece loc = do
  piece <- removePieceNoUpdate loc
  updatePortsAround loc
  pure piece


movePiece :: forall m. MonadError BoardError m => MonadState Board m
  => Location -> Location -> m Piece
movePiece src dst = do
  use (_pieces <<< at src) >>= case _ of
    Just pieceInfoSrc -> do
      whenM (isJust <$> use (_pieces <<< at dst)) do
        throwError (LocationOccupied dst)

      _pieces <<< at src .= Nothing
      _pieces <<< at dst .= Just pieceInfoSrc
      updatePortsAround src
      updatePortsAround dst
      pure $ pieceInfoSrc.piece
    Nothing ->
      throwError (LocationNotOccupied src)

pieceDropped :: forall m. MonadState Board m => MonadError BoardError m
  => Location -> Maybe Location -> m Piece
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
  _pieces <<< ix loc <<< _rotation <>= rot
  updatePortsAround loc

{-
  change size
-}
validBoardSize :: forall m. MonadThrow BoardError m => Int -> m Int
validBoardSize n =
  if even n || n < 3 || n > 9
    then throwError (BadBoardSize n)
    else pure n

decreaseSize :: forall m. MonadState Board m => MonadError BoardError m => m Unit
decreaseSize = do
  Board {size: n, pieces} <- get
  newSize <- validBoardSize (n-2)
  let insideSquare (Location {x, y}) = all (between 1 n) [x, y]
  let firstPieceOusideSquare = find (not <<< insideSquare) (M.keys pieces) 
  case firstPieceOusideSquare of
    Just loc -> throwError (LocationOccupied loc)
    Nothing -> put $ Board
      { size: newSize
      , pieces: unsafeMapKey (\(Location {x, y}) -> location (x-1) (y-1)) pieces }

increaseSize :: forall m. MonadState Board m => MonadError BoardError m => m Unit
increaseSize = do
  Board { size: n, pieces } <- get
  newSize <- validBoardSize (n+2)
  put $ Board
    { size: newSize
    , pieces: unsafeMapKey (\(Location {x, y}) -> location (x+1) (y+1)) pieces }

--buildEvaluationOrder :: forall m. MonadError BoardError m =>
--  Map RelativeEdge RelativeEdge -> m (List Location)
--buildEvaluationOrder M.Leaf = pure Nil
--buildEvaluationOrder connections = pure Nil
--  -- get locations with no incoming nodes




applyBoardEvent :: forall m. MonadState Board m => MonadError BoardError m => BoardEvent -> m Unit
applyBoardEvent = case _ of
  AddedPiece loc pieceId -> addPiece loc (pieceLookup pieceId)
  --AddedPieceWithRotation loc pieceId rot -> addPieceWithRotation loc (pieceLookup pieceId) rot
  RemovedPiece loc _ -> void $ removePiece loc
  MovedPiece src dst -> void $ movePiece src dst
  RotatedPiece loc rot -> rotatePieceBy loc rot
  UndoBoardEvent -> pure unit
  IncrementSize -> increaseSize
  DecrementSize -> decreaseSize
  {-
    for some 
  -}
  Multiple boardEvents -> do
    trace ("board events: " <> show boardEvents) \_ -> for_ (boardEvents) \boardEvent ->
      trace ("applying board event " <> show boardEvent) \_ -> applyBoardEvent boardEvent
