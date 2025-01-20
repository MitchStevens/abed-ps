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
import Data.Maybe (Maybe(..), isJust, isNothing, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Set as S
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..), fst, snd)
import Debug (trace)
import Debug as Debug
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Game.Board.Edge (AbsoluteEdge, RelativeEdge(..), absolute, adjacent, adjacentAbsoluteEdge, fromAbsoluteEdge, getPortOnEdge, relative)
import Game.Board.PieceInfo (PieceInfo, _rotation)
import Game.Board.Query (isInsideBoard)
import Game.Board.Types (Board(..), BoardError(..), _pieces, _size)
import Game.Direction (allDirections)
import Game.Direction as Direction
import Game.Location (Location(..), location)
import Game.Piece (Piece(..), glob, pieceLookup)
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

globRelEdge :: forall m. MonadState Board m => AbsoluteEdge -> Maybe PortType -> MaybeT m Unit
globRelEdge absEdge portType = do
  Relative { loc, dir } <- fromAbsoluteEdge absEdge
  { piece, rotation } <- MaybeT $ use (_pieces <<< at loc)
  _pieces <<< ix loc <<< prop (Proxy :: Proxy "piece") .= glob dir portType piece

globPortsAround :: forall m. MonadState Board m => Location -> m Unit
globPortsAround loc =
  for_ allDirections \dir -> do
    let edge = absolute loc dir
    let adj = adjacentAbsoluteEdge edge
    maybePort <- runMaybeT (getPortOnEdge edge)
    void $ runMaybeT $ globRelEdge adj (portType <$> maybePort)

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
   globPortsAround loc

removePieceNoUpdate :: forall m. MonadError BoardError m => MonadState Board m => Location -> m PieceInfo
removePieceNoUpdate loc = do
  checkInsideBoard loc
  maybePieceInfo <- use (_pieces <<< at loc)
  case maybePieceInfo of
    Nothing -> throwError (LocationNotOccupied loc)
    Just pieceInfo -> do
      _pieces <<< at loc .= Nothing
      pure pieceInfo

removePiece :: forall m. MonadError BoardError m => MonadState Board m => Location -> m PieceInfo
removePiece loc = do
  piece <- removePieceNoUpdate loc
  globPortsAround loc
  pure piece


movePiece :: forall m. MonadError BoardError m => MonadState Board m
  => Location -> Location -> m PieceInfo
movePiece src dst = do
  use (_pieces <<< at src) >>= case _ of
    Just pieceInfoSrc -> do
      whenM (isJust <$> use (_pieces <<< at dst)) do
        throwError (LocationOccupied dst)

      _pieces <<< at src .= Nothing
      _pieces <<< at dst .= Just pieceInfoSrc
      globPortsAround src
      globPortsAround dst
      pure $ pieceInfoSrc
    Nothing ->
      throwError (LocationNotOccupied src)

pieceDropped :: forall m. MonadState Board m => MonadError BoardError m
  => Location -> Maybe Location -> m PieceInfo
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
  globPortsAround loc

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
  Board {size, pieces} <- get
  newSize <- validBoardSize n
  let dSize = -(newSize - size) `div` 2

  let insideSquare (Location {x, y}) = all (between 0 (newSize-1)) [x, y]
  let shiftLocation (Location {x, y}) = location (x-dSize) (y - dSize)
  let firstPieceOusideSquare = find (not <<< insideSquare <<< shiftLocation) (M.keys pieces) 

  case firstPieceOusideSquare of
    Just loc -> throwError (LocationOccupied loc)
    Nothing -> put $ Board
      { size: newSize
      , pieces: unsafeMapKey shiftLocation pieces }
