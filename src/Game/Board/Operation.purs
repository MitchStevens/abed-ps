module Game.Board.Operation where

import Data.Lens
import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError)
import Control.Monad.Except (ExceptT, runExceptT)
import Control.Monad.State (class MonadState, class MonadTrans, StateT, get, gets, lift, put, runStateT)
import Data.Either (Either(..))
import Data.Foldable (all, find, for_, traverse_)
import Data.Identity (Identity)
import Data.Int (even, odd)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Map as M
import Data.Maybe (Maybe(..), isJust, isNothing, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Tuple (Tuple(..), fst, snd)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Game.Board (Board(..), PieceInfo, _pieces, _rotation, unsafeMapKey)
import Game.Board.Query (insideBoard)
import Game.GameEvent (BoardEvent(..))
import Game.Location (Location(..), Rotation(..), location, rotation)
import Game.Piece (APiece(..))
import Game.Piece.PieceLookup (pieceLookup)

data BoardError
  = LocationOccupied Location
  | LocationNotOccupied Location
  | InvalidLocation Location
  | InvalidBoardInitialisation Int
  | BadBoardSize Int
  | Cyclic Location
derive instance Eq BoardError

instance Show BoardError where
  show = case _ of
    LocationOccupied loc -> "Location Occupied: " <> show loc
    LocationNotOccupied loc ->  "Location Not Occupied: " <> show loc
    InvalidLocation loc -> "Location " <> show loc <> " is outside range of the board"
    InvalidBoardInitialisation n -> "Invalid Board Initialisation: " <> show n <> " is not a valid board size"
    BadBoardSize n -> "Boards of size " <>  show n <>" are not valid"
    Cyclic _ -> "ABED does not admit cyclic boards"

newtype BoardT m a = BoardT (StateT Board (ExceptT BoardError m) a)
derive instance Newtype (BoardT m a) _
derive newtype instance Functor m => Functor (BoardT m)
derive newtype instance Monad m => Apply (BoardT m)
derive newtype instance Monad m => Applicative (BoardT m)
derive newtype instance Monad m => Bind (BoardT m)
derive newtype instance Monad m => Monad (BoardT m)
derive newtype instance Monad m => MonadState Board (BoardT m)
derive newtype instance Monad m => MonadThrow BoardError (BoardT m)
derive newtype instance Monad m => MonadError BoardError (BoardT m)
derive newtype instance MonadEffect m => MonadEffect (BoardT m)
derive newtype instance MonadAff m => MonadAff (BoardT m)
instance MonadTrans BoardT where
  lift m = BoardT (lift $ lift m)

type BoardM a = BoardT Identity a

runBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError (Tuple a Board))
runBoardT boardM b = runExceptT $ runStateT (unwrap boardM) b

evalBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError a)
evalBoardT boardM b = map fst <$> runBoardT boardM b

execBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError Board)
execBoardT boardM b = map snd <$> runBoardT boardM b

runBoardM :: forall a. BoardM a -> Board -> Either BoardError (Tuple a Board)
runBoardM boardM b = unwrap $ runBoardT boardM b

evalBoardM :: forall a. BoardM a -> Board -> Either BoardError a
evalBoardM boardM b = unwrap $ evalBoardT boardM b

execBoardM :: forall a. BoardM a -> Board -> Either BoardError Board
execBoardM boardM b = unwrap $ execBoardT boardM b


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

getPiece :: forall m. MonadState Board m => MonadError BoardError m => Location -> m APiece
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

isInsideBoard :: forall m. MonadError BoardError m => MonadState Board m => Location -> m Unit
isInsideBoard loc = whenM (not <$> insideBoard loc) (throwError (InvalidLocation loc))

addPiece :: forall m. MonadError BoardError m => MonadState Board m => Location -> APiece -> m Unit
addPiece loc piece = do
  isInsideBoard loc
  pieceInfo <- use (_pieces <<< at loc)
  case pieceInfo of
    Nothing -> _pieces <<< at loc .= Just { piece, rotation: rotation 0 }
    Just _ -> throwError (LocationOccupied loc)

removePiece :: forall m. MonadError BoardError m => MonadState Board m => Location -> m APiece
removePiece loc = do
  isInsideBoard loc
  maybePieceInfo <- use (_pieces <<< at loc)
  case maybePieceInfo of
    Nothing -> throwError (LocationNotOccupied loc)
    Just pieceInfo -> do
      _pieces <<< at loc .= Nothing
      pure pieceInfo.piece

movePiece :: forall m. MonadError BoardError m => MonadState Board m => Location -> Location -> m Unit
movePiece src dst = do
  pieceInfoSrc <- use (_pieces <<< at src)
  when (isNothing pieceInfoSrc) do
    throwError (LocationNotOccupied src)

  whenM (isJust <$> use (_pieces <<< at dst)) do
    throwError (LocationOccupied dst)

  _pieces <<< at src .= Nothing
  _pieces <<< at dst .= pieceInfoSrc

rotatePieceBy :: forall m. MonadError BoardError m => MonadState Board m => Location -> Rotation -> m Unit
rotatePieceBy loc rot = do
  _ <- getPiece loc
  _pieces <<< ix loc <<< _rotation <>= rot

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

applyBoardEvent :: forall m. MonadState Board m => MonadError BoardError m => BoardEvent -> m Unit
applyBoardEvent = case _ of
  AddedPiece loc pieceId -> traverse_ (addPiece loc) (pieceLookup pieceId)
  RemovedPiece loc _ -> void $ removePiece loc
  MovedPiece src dst -> movePiece src dst
  RotatedPiece loc rot -> rotatePieceBy loc rot
  UndoBoardEvent -> pure unit
  IncrementSize -> increaseSize
  DecrementSize -> decreaseSize
  Multiple boardEvents -> for_ boardEvents applyBoardEvent 
