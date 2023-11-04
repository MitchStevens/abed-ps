module Component.Board where

import Data.Lens
import Prelude

import Capability.GlobalKeyDown (globalKeyDownEventEmitter)
import Component.DataAttribute (attr)
import Component.DataAttribute as DataAttr
import Component.Piece as Piece
import Control.Monad.Except (ExceptT, lift)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.State (class MonadState, get, gets, modify, modify_, put, runState, runStateT)
import Data.Array (elem, intercalate, (..))
import Data.Array as A
import Data.Either (Either(..), blush, either, fromRight, hush, isRight)
import Data.Enum (fromEnum)
import Data.Foldable (foldMap, for_, traverse_)
import Data.Int (toNumber)
import Data.List (List(..))
import Data.List.NonEmpty as NE
import Data.List.Types (NonEmptyList)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Traversable (for, traverse)
import Data.Tuple (Tuple(..), uncurry)
import Data.Tuple.Nested (Tuple3, tuple3, tuple4, (/\))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Board (Board(..), BoardError, BoardM, BoardT, PieceInfo, RelativeEdge(..), _pieces, _size, addPiece, allOccupiedLocations, decreaseSize, evalBoardM, evalBoardT, execBoardM, getConnectedPorts, getPiece, getPieceInfo, increaseSize, relativeEdgeDirection, removePiece, rotatePieceBy, runBoardM, runBoardT, standardBoard)
import Game.Expression (Signal(..))
import Game.GameEvent (BoardEvent(..), GameEvent(..), GameEventStore, boardEventLocationsChanged)
import Game.Location (CardinalDirection, Location(..), Rotation(..), allDirections, location, oppositeDirection, rotation)
import Game.Location as Direction
import Game.Piece (APiece(..), PieceId(..), getPort, name)
import Game.Piece.Port (Port, matchingPort)
import Game.Piece.Port as Port
import Halogen (AttrName(..), ClassName(..), Component, HalogenM(..), HalogenQ, Slot)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HA
import Halogen.HTML.Properties as HP
import Halogen.Store.Monad (class MonadStore, updateStore)
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Type.Proxy (Proxy(..))
import Web.DOM.Document (toEventTarget)
import Web.Event.Event (Event, preventDefault)
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML.Common (ClassName(..))
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, ctrlKey, fromEvent, key)

type Input = Maybe Board

type State = 
  { boardHistory :: Zipper Board
  , mouseOverLocation :: Maybe Location
  , goalPorts :: Map CardinalDirection Port
  }

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location APiece
  | RemovePiece Location
  | GetMouseOverLocation (Location -> a)
  | SetGoalPorts (Map CardinalDirection Port)
  | IncrementBoardSize (Board -> a)
  | DecrementBoardSize (Board -> a)

data Action
  = Initialise
  | PieceOutput Piece.Output
  | Undo
  | Redo
  | UpdateBoard BoardEvent Board
  | GlobalOnKeyDown KeyboardEvent
  | LocationOnDragEnter Location DragEvent
  | LocationOnDragOver Location DragEvent
  | LocationOnDragLeave DragEvent
  | LocationOnDrop Location DragEvent


data Output
  = NewBoardState Board

type Slots = ( piece :: Slot Piece.Query Piece.Output Location )

_piece = Proxy :: Proxy "piece"

_board = H.gets (_.boardHistory >>> Z.head)

--component :: forall m. MonadEffect m => GlobalKeyDown m => H.Component Query Input Output m
component :: forall m. MonadStore GameEvent GameEventStore m => MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState board =
    { boardHistory: Z.singleton $ fromMaybe standardBoard board
    , mouseOverLocation: Nothing
    , goalPorts: M.empty }

  render :: State -> HH.HTML (H.ComponentSlot Slots m Action) Action
  render state =
    HH.div
      [ HP.id "board-component"
      , HA.style $ intercalate "; "
        [ "grid-template-columns: " <> gridTemplate
        , "grid-template-rows:    " <> gridTemplate
        ]
      ] $
      (pieces <> boardPorts)
    where
      gridTemplate = "25fr repeat(" <> show n <> ", 100fr) 25fr"
      board = Z.head state.boardHistory
      n = board ^. _size

      pieces :: Array (HTML (H.ComponentSlot Slots m Action) Action)
      pieces = do
        i <- 0 .. (n-1)
        j <- 0 .. (n-1)
        pure $ renderPieceSlot i j

      renderPieceSlot :: Int -> Int -> HTML (H.ComponentSlot Slots m Action) Action
      renderPieceSlot i j = 
        HH.div
          [ attr DataAttr.location loc
          , HP.class_ (ClassName "piece")
          , HP.style $ intercalate "; "
            [ "transform: rotate("<> (show (rot * 90)) <>"deg)"
            , "grid-area: " <> show (j+2) <> " / " <> show (i+2)
            ]
          , HE.onDragEnter (LocationOnDragEnter loc)
          , HE.onDragOver (LocationOnDragOver loc)
          , HE.onDragLeave LocationOnDragLeave
          , HE.onDrop (LocationOnDrop loc)
          ]
          [ maybe emptyPieceHTML pieceHTML maybePiece loc ]
        where
          loc = location i j
          eitherPieceInfo = evalBoardM (getPieceInfo loc) board
          maybePiece = (_.piece) <$> hush eitherPieceInfo
          Rotation rot = foldMap (_.rotation) eitherPieceInfo
      
      boardPorts :: forall p i. Array (HTML p i)
      boardPorts = uncurry renderBoardPort <$>
        [ Tuple Direction.Up    (location 1 (m `div` 2 + 1))
        , Tuple Direction.Down  (location m (m `div` 2 + 1))
        , Tuple Direction.Left  (location (m `div` 2 + 1) 1)
        , Tuple Direction.Right (location (m `div` 2 + 1) m)
        ]
        where
          m = n+2
      
      renderBoardPort :: forall p i. CardinalDirection -> Location -> HTML p i
      renderBoardPort dir (Location {x, y}) = 
        HH.div
          [ HP.class_ (ClassName "board-port")
          , attr DataAttr.direction dir
          , HP.style $ intercalate "; "
            [ "grid-area: " <> show x <> " / " <> show y ]
          ]
          [ SE.svg
            [ viewBox ]
            [ SE.g 
              [ SA.transform 
                [ Rotate (toNumber (fromEnum dir + 2) * 90.0) 25.0 12.5 ]
              ] $
              A.fromFoldable (M.lookup dir state.goalPorts) <#> \port ->
                Piece.renderPort dir { connected: false, portType: matchingPort port, signal: Signal 0 }
            ]
          ]
        where
          viewBox =
            if dir `elem` [Direction.Up, Direction.Down]
              then SA.viewBox 0.0 0.0 50.0 25.0
              else SA.viewBox 12.5 (-12.5) 25.0 50.0

      pieceHTML piece location =
          HH.slot _piece location Piece.component { piece, location } PieceOutput
      
      emptyPieceHTML location = HH.text (show location)


  eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: handleAction
    , handleQuery: case _ of
        GetBoard f -> do
          board <- _board
          pure $ Just (f board)
        AddPiece loc piece -> do
          liftBoardM (addPiece loc piece) >>= traverse_ \(Tuple _ board) ->
            handleAction (UpdateBoard (AddedPiece loc (name piece)) board) 
          pure $ Nothing
        RemovePiece loc -> do
          liftBoardM (removePiece loc) >>= traverse_ \(Tuple piece board) ->
            handleAction (UpdateBoard (RemovedPiece loc (name piece)) board) 
          pure Nothing
        GetMouseOverLocation f -> do
          maybeDst <- H.gets (_.mouseOverLocation)
          pure (f <$> maybeDst)
        SetGoalPorts ports -> do
          modify_ $ _ { goalPorts = ports }
          pure Nothing
        IncrementBoardSize f -> do
          liftBoardM increaseSize >>= traverse_ \(Tuple _ board) ->
            handleAction (UpdateBoard IncrementSize board)
          pure Nothing
        DecrementBoardSize f -> do
          liftBoardM decreaseSize >>= traverse_ \(Tuple _ board) ->
            handleAction (UpdateBoard DecrementSize board)
          pure Nothing
    , initialize: Just Initialise
    , receive: \_ -> Nothing 
    }


  handleAction :: Action -> HalogenM State Action Slots Output m Unit
  handleAction = case _ of
    Initialise -> do
      emitter <- liftEffect $ globalKeyDownEventEmitter
      void $ H.subscribe (GlobalOnKeyDown <$> emitter)
    PieceOutput (Piece.Rotated loc rot) ->
      liftBoardM (rotatePieceBy loc rot) >>= traverse_ \(Tuple _ board) -> do
        handleAction $ UpdateBoard (RotatedPiece loc rot) board
    PieceOutput (Piece.Dropped src) -> do
      -- when a piece is dropped, it can be dropped over a new location or outside the game board 
      maybeDst <- H.gets (_.mouseOverLocation)
      case maybeDst of
        -- if the piece is dropped over a new location, attempt to add the piece to the board
        Just dst -> do 
          liftBoardM (removePiece src >>= addPiece dst) >>= traverse_ \(Tuple _ board) ->
            handleAction $ UpdateBoard (MovedPiece src dst) board
        -- if the piece is dropped somewhere that is not a location, remove it from the board
        Nothing -> do
          liftBoardM (removePiece src) >>= traverse_ \(Tuple piece board) ->
            handleAction $ UpdateBoard (RemovedPiece src (name piece)) board
    Undo -> do
      maybeZipper <- Z.moveLeft <$> gets (_.boardHistory)
      for_ maybeZipper \t -> do
        H.modify_ (_ { boardHistory = t })
        updateStore (BoardEvent UndoBoardEvent)
    Redo -> do
      maybeZipper <- Z.moveRight <$> gets (_.boardHistory)
      for_ maybeZipper \t -> do
        H.modify_ (_ { boardHistory = t })
        updateStore (BoardEvent UndoBoardEvent)
    UpdateBoard boardEvent board -> do
      -- append new board to board history for undo purposes 
      modify_ $ \s -> s { boardHistory = Z.append board s.boardHistory }
      -- raise as a board event so other components can be notified
      updateStore (BoardEvent boardEvent)
      -- tell puzzle component that board state has been changed
      H.raise (NewBoardState board)
      -- redraw piece ports that have been changed
      let changedLocations = fromMaybe (A.fromFoldable $ allOccupiedLocations board) (boardEventLocationsChanged boardEvent)
      for_ changedLocations \loc ->
        for_ (evalBoardM (getConnectedPorts loc) board) \relEdge ->
          H.tell _piece ?loc (\_ -> Piece.PaintConnected (relativeEdgeDirection relEdge))


    -- can these events be simplified? do we need all of them?
    LocationOnDragEnter _ dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
    LocationOnDragOver loc dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
      H.modify_ (_ { mouseOverLocation = Just loc } )
    LocationOnDrop loc dragEvent -> do
      H.modify_ (_ { mouseOverLocation = Just loc } )
      liftEffect $ preventDefault (toEvent dragEvent)
    LocationOnDragLeave _ -> do
      H.modify_ (_ { mouseOverLocation = Nothing } )
    GlobalOnKeyDown ke -> do
      when (key ke == "z" && ctrlKey ke) do
        handleAction Undo
      when (key ke == "y" && ctrlKey ke) do
        handleAction Redo

--  repaintPiece :: forall m. Monad m => Location -> HalogenM State Action Slots Output m Unit
--  repaintPiece loc = 
--    for_ (evalBoardM (getConnectedPorts loc) board) \relEdge ->
--      H.tell _piece ?loc (\_ -> Piece.PaintConnected (relativeEdgeDirection relEdge))


  liftBoardM :: forall a. BoardM a -> HalogenM State Action Slots Output m (Either BoardError (Tuple a Board))
  liftBoardM boardM = runBoardM boardM <$> _board