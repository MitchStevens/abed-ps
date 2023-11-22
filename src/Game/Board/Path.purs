module Game.Board.Path where

import Prelude

import Control.Alt (class Alt, alt, (<|>))
import Control.Alternative (guard)
import Control.Extend (extend)
import Control.Monad.Error.Class (class MonadError, liftEither, throwError)
import Control.Monad.Except (runExcept, runExceptT)
import Control.Monad.List.Trans (ListT, lift, nil)
import Control.Monad.List.Trans as ListT
import Control.Monad.Maybe.Trans (MaybeT)
import Control.Monad.State (class MonadState, StateT, evalState, evalStateT)
import Data.Array (cons, find, foldMap, head, last, length, snoc, (!!))
import Data.Array as A
import Data.Either (Either(..), either, hush, note)
import Data.Foldable (fold, null)
import Data.Lens (use)
import Data.Lens.At (at)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.PQueue as PQ
import Data.Set as S
import Data.Traversable (for, sequence, traverse)
import Data.Tuple (Tuple(..), snd)
import Data.Tuple.Nested (Tuple3, tuple3, uncurry3, (/\))
import Data.Unfoldable (unfoldr)
import Data.Zipper (Zipper(..))
import Data.Zipper as Z
import Debug (debugger, trace)
import Effect.Aff (Aff, error)
import Game.Board (Board(..), PieceInfo, _pieces, buildBoardGraph)
import Game.Board.Query (directPredecessors, directSuccessors)
import Game.GameEvent (BoardEvent(..))
import Game.Location (CardinalDirection, Location(..), Rotation(..), allDirections, clockwiseRotation, directionTo, followDirection, oppositeDirection, rotateDirection, rotation)
import Game.Location as Direction
import Game.Piece (APiece(..), PieceId(..), getPort, name, chickenPiece, cornerCutPiece, crossPiece, leftPiece, rightPiece, idPiece)
import Game.Piece.Port (isInput)

data PathError
  = ObstructedByAnotherPiece Location
  | LocationsAreNotAdjacent Location Location
  | PathIsEmpty
  | WireInputEqualsOutput CardinalDirection CardinalDirection
  | NoOverlay Wire Wire
  | Other String
derive instance Eq PathError
-- TODO: improve error messages
instance Show PathError where
  show = case _ of
    ObstructedByAnotherPiece loc -> "obstructed by piece at " <> show loc
    LocationsAreNotAdjacent l1 l2 -> "locations " <> show l1 <> " and " <> show l2 <> " are not adjacent"
    PathIsEmpty -> "path is empty"
    WireInputEqualsOutput inputDirection outputDirection -> "expected that " <> show inputDirection <> " and " <> show outputDirection <> " are not equal"
    NoOverlay wire extant -> "no overlay between " <> show wire <> " and " <> show extant
    Other str -> "patherror: " <> str
instance Semigroup PathError where
  append a _ = a


type Wire =
  { inputDirection :: CardinalDirection
  , outputDirection :: CardinalDirection
  , location :: Location
  }


getWireAt :: forall m. MonadError PathError m => MonadState Board m => Location -> m (Maybe Wire)
getWireAt location = do
  (maybePieceInfo :: Maybe PieceInfo) <- use (_pieces <<< at location)
  for maybePieceInfo \info -> do
    let inputDirection = rotateDirection Direction.Left info.rotation
    if info.piece == idPiece
      then pure { inputDirection, outputDirection: rotateDirection Direction.Right info.rotation, location }
    else if info.piece == leftPiece
      then pure { inputDirection, outputDirection: rotateDirection Direction.Up info.rotation, location }
    else if info.piece == rightPiece
      then pure { inputDirection, outputDirection: rotateDirection Direction.Down info.rotation, location }
    else throwError (ObstructedByAnotherPiece location)

overlayWires :: forall m. MonadError PathError m => Alt m => Wire -> Maybe Wire -> m (List BoardEvent)
overlayWires wire Nothing = do
  pieceId <- case clockwiseRotation wire.inputDirection wire.outputDirection of
    Rotation 1 -> pure $ name leftPiece
    Rotation 2 -> pure $ name idPiece
    Rotation 3 -> pure $ name rightPiece
    _ -> throwError (WireInputEqualsOutput wire.inputDirection wire.outputDirection)
  pure $
    AddedPiece wire.location pieceId : RotatedPiece wire.location (clockwiseRotation Direction.Left wire.inputDirection) : Nil
--- fuckkk
-- start by finding the rotation such that there is one input on the left and one input on the side
-- then figure out whether it's a crossover or a corner cut
overlayWires wire (Just extant) = do
  ensureAllPortsFilled
  isCrossOver <|> isCornerCut <|> isChicken

  where
    noOverlay = NoOverlay wire extant

    wireRotation = clockwiseRotation wire.inputDirection wire.outputDirection
    extantRotation = clockwiseRotation extant.inputDirection extant.outputDirection

    ensureAllPortsFilled :: m Unit
    ensureAllPortsFilled =
      unless (S.fromFoldable [wire.inputDirection, wire.outputDirection, extant.inputDirection, extant.outputDirection] == S.fromFoldable allDirections) do
        throwError (Other "all ports not filled")

    isCrossOver :: m (List BoardEvent)
    isCrossOver = do
      unless (wireRotation == rotation 2 && extantRotation == rotation 2) (throwError (Other "not a cross over"))
      rot <- case clockwiseRotation wire.inputDirection extant.inputDirection of
        Rotation 1 -> pure (clockwiseRotation wire.inputDirection Direction.Left)
        Rotation 3 -> pure (clockwiseRotation extant.inputDirection Direction.Left)
        _ -> throwError (noOverlay)
      pure $
        RemovedPiece extant.location (PieceId "whatever")
        : AddedPiece extant.location (name crossPiece)
        : RotatedPiece extant.location rot : Nil

    isCornerCut :: m (List BoardEvent)
    isCornerCut = do
      unless (wireRotation <> extantRotation == rotation 0) (throwError (Other ("not a cornercut" <> (show $ wireRotation <> extantRotation))))
      rot <- case clockwiseRotation wire.inputDirection extant.inputDirection of
        Rotation 1 -> pure (clockwiseRotation wire.inputDirection Direction.Left)
        Rotation 3 -> pure (clockwiseRotation extant.inputDirection Direction.Left)
        _ -> throwError (noOverlay)
      pure $
        RemovedPiece extant.location (PieceId "whatever")
        : AddedPiece extant.location (name cornerCutPiece)
        : RotatedPiece extant.location rot : Nil

    isChicken :: m (List BoardEvent)
    isChicken = do
      unless (wireRotation == extantRotation) (throwError (Other "not a chicken"))
      let rot = clockwiseRotation wire.inputDirection Direction.Left
      pure $
        RemovedPiece extant.location (PieceId "whatever")
        : AddedPiece extant.location (name chickenPiece)
        : RotatedPiece extant.location rot : Nil



rotateWire :: Rotation -> Wire -> Wire
rotateWire rot wire = wire { inputDirection = rotateDirection wire.inputDirection rot, outputDirection = rotateDirection wire.outputDirection rot}

triples :: forall a. List a -> List (Tuple3 a a a)
triples = case _ of
  a : b : c : xs -> tuple3 a b c : triples (b : c : xs)
  _ -> Nil

-- board path builds along all the locations
{-
  2. generate a list of board operations to add the pieces to the board
  3. ensure that every piece can be added to the board
  4. return the list of board events
-}
boardPath :: forall m. MonadState Board m
  => CardinalDirection -> Array Location -> CardinalDirection -> m (Maybe (List BoardEvent))
boardPath initialDir path terminalDir = hush <$> do
  e <- runExceptT (boardPathWithError initialDir path terminalDir)
  trace (show e) \_ -> pure e


boardPathWithError :: forall m. MonadError PathError m => MonadState Board m => Alt m
  => CardinalDirection -> Array Location -> CardinalDirection -> m (List BoardEvent)
boardPathWithError initialDir path terminalDir = do
  h <- liftEither $ note PathIsEmpty (head path)
  l <- liftEither $ note PathIsEmpty (last path)
  let initial  = followDirection h initialDir
  let terminal = followDirection l terminalDir
  let locations =  L.fromFoldable $ [ initial ] <> path <> [ terminal ]
  join <$> traverse (uncurry3 createBoardEvents) (triples locations) -- m (List (List ))
  

  --boardEvents :: (List BoardEvent) <- map join <<< traverse wirePiece $ wires 
  --pure boardEvents

-- wirePiece :: Wire -> m (List BoardEvent)
-- overlayWires :: forall m. MonadError PathError m => Alt m => Wire -> Maybe Wire -> m (List BoardEvent)
-- getWireAt :: forall m. MonadError PathError m => MonadState Board m => Location -> m (Maybe Wire)

createBoardEvents :: forall m. MonadError PathError m => MonadState Board m => Alt m =>
  Location -> Location -> Location -> m (List BoardEvent)
createBoardEvents l v r = do
  wire <- createWire l v r
  maybeExtant <- getWireAt v
  overlayWires wire maybeExtant


createWire :: forall m. MonadError PathError m => Location -> Location -> Location -> m Wire
createWire l v r = liftEither do
  inputDirection  <- note (LocationsAreNotAdjacent v l) (directionTo v l)
  outputDirection <- note (LocationsAreNotAdjacent v r) (directionTo v r)
  when (inputDirection == outputDirection)
    (Left $ WireInputEqualsOutput inputDirection outputDirection)
  pure $ { inputDirection, outputDirection, location: v }