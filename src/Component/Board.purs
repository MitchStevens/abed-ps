module Component.Board where

import Data.Lens
import Prelude

import Capability.GlobalKeyDown (globalKeyDownEventEmitter)
import Component.DataAttribute (attr)
import Component.DataAttribute as DataAttr
import Component.Piece as Piece
import Control.Monad.Except (ExceptT, lift)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.State (class MonadState, evalState, get, gets, modify, modify_, put, runState, runStateT)
import Data.Array (elem, intercalate, (..))
import Data.Array as A
import Data.Bifunctor (lmap)
import Data.Either (Either(..), blush, either, fromRight, hush, isRight)
import Data.Enum (fromEnum)
import Data.Foldable (foldMap, for_, traverse_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Int (toNumber)
import Data.Lens.Record (prop)
import Data.List (List(..))
import Data.List as L
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
import Debug (trace)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Board (Board(..), RelativeEdge(..), _pieces, _size, evalBoardWithPortInfo, extractOutputs, standardBoard)
import Game.Board.Operation (BoardError, BoardM, addPiece, applyBoardEvent, decreaseSize, evalBoardM, getPieceInfo, increaseSize, movePiece, removePiece, rotatePieceBy, runBoardM)
import Game.Board.Path (boardPath)
import Game.Board.Query (directPredecessors)
import Game.Expression (Signal(..))
import Game.GameEvent (BoardEvent(..), GameEvent(..), GameEventStore, boardEventLocationsChanged)
import Game.Location (CardinalDirection, Edge(..), Location(..), Rotation(..), allDirections, location, oppositeDirection, rotateDirection, rotation)
import Game.Location as Direction
import Game.Piece (APiece(..), PieceId(..), getPort, name)
import Game.Piece.Port (Port, isInput, matchingPort)
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
import Web.DOM.Element (DOMRect, fromEventTarget, getBoundingClientRect)
import Web.Event.Event (Event, preventDefault, target)
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML.Common (ClassName(..))
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, ctrlKey, fromEvent, key)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY)
import Web.UIEvent.MouseEvent as MouseEvent

type Input = Maybe Board

type State = 
  { boardHistory :: Zipper Board
  , mouseOverLocation :: Maybe Location
  , ports :: Map CardinalDirection (Tuple Port Signal)
  , isCreatingWire :: Maybe
    { initialDirection :: CardinalDirection
    , locations :: Array Location
    }
  }

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location APiece
  | RemovePiece Location
  | GetMouseOverLocation (Location -> a)
  | SetGoalPorts (Map CardinalDirection Port)
  | SetInputs (Map CardinalDirection Signal) (Map CardinalDirection Signal -> a)
  | IncrementBoardSize (Board -> a)
  | DecrementBoardSize (Board -> a)

data Action
  = Initialise
  | PieceOutput Piece.Output
  | Undo
  | Redo
  | ToggleInput CardinalDirection
  | GlobalOnKeyDown KeyboardEvent
  | BoardOnDragExit DragEvent
  | LocationOnMouseDown Location MouseEvent
  | LocationOnMouseOver Location MouseEvent
  | LocationOnMouseUp Location MouseEvent
  | LocationOnDragEnter Location DragEvent
  | LocationOnDragOver Location DragEvent
  | LocationOnDragLeave DragEvent
  | LocationOnDrop Location DragEvent


data Output
  = NewBoardState Board

type Slots = ( piece :: Slot Piece.Query Piece.Output Location )

_piece = Proxy :: Proxy "piece"

_board :: Lens' State Board
_board = prop (Proxy :: Proxy "boardHistory") <<< Z._head

_wireLocations :: Traversal' State (Array Location)
_wireLocations = prop (Proxy :: Proxy "isCreatingWire") <<< _Just <<< prop (Proxy :: Proxy "locations")

--component :: forall m. MonadEffect m => GlobalKeyDown m => H.Component Query Input Output m
component :: forall m. MonadStore GameEvent GameEventStore m => MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState board =
    { boardHistory: Z.singleton $ fromMaybe standardBoard board
    , mouseOverLocation: Nothing
    , ports: M.empty 
    , isCreatingWire: Nothing
    }


  render :: State -> HH.HTML (H.ComponentSlot Slots m Action) Action
  render state =
    HH.div
      [ HP.id "board-component"
      , HE.onDragExit (BoardOnDragExit)
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
          , HE.onMouseDown (LocationOnMouseDown loc)
          , HE.onMouseOver (LocationOnMouseOver loc)
          , HE.onMouseUp (LocationOnMouseUp loc)
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
      
      boardPorts :: forall p. Array (HTML p Action)
      boardPorts = portLocations <#> \(Tuple dir loc) -> 
        renderBoardPort dir loc
        where
          m = n+2
          portLocations =
            [ Tuple Direction.Up    (location 1 (m `div` 2 + 1))
            , Tuple Direction.Down  (location m (m `div` 2 + 1))
            , Tuple Direction.Left  (location (m `div` 2 + 1) 1)
            , Tuple Direction.Right (location (m `div` 2 + 1) m)
            ]
      
      renderBoardPort :: forall p. CardinalDirection -> Location -> HTML p Action
      renderBoardPort dir (Location {x, y}) = 
        HH.div
          [ HP.class_ (ClassName "board-port")
          , HE.onClick (\_ -> ToggleInput dir)
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
              A.fromFoldable (M.lookup dir state.ports) <#> \(Tuple port signal) ->
                Piece.renderPort dir { connected: false, port: matchingPort port, signal }
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
          board <- use _board
          pure $ Just (f board)
        AddPiece loc piece -> do
          log "board: add piece"
          liftBoardM (addPiece loc piece) >>= traverse_ \(Tuple _ board) -> do
            _ <- updateBoard board 
            updateStore (BoardEvent (AddedPiece loc (name piece)))
          -- raise as a board event so other components can be notified
          pure $ Nothing
        RemovePiece loc -> do
          liftBoardM (removePiece loc) >>= traverse_ \(Tuple piece board) -> do
            _ <- updateBoard board 
            -- raise as a board event so other components can be notified
            updateStore (BoardEvent (RemovedPiece loc (name piece)))
          pure Nothing
        GetMouseOverLocation f -> do
          maybeDst <- H.gets (_.mouseOverLocation)
          pure (f <$> maybeDst)
        SetInputs inputs f -> do
          let setInput dir (Tuple port signal) = Tuple port (if isInput port then fromMaybe signal (M.lookup dir inputs) else signal)
          modify_ $ \s -> s { ports = mapWithIndex setInput s.ports }
          _ <- evaluateBoard
          pure Nothing
        SetGoalPorts ports -> do
          modify_ $ _ { ports = map (\p -> Tuple p (Signal 0)) ports }
          _ <- evaluateBoard
          pure Nothing
        IncrementBoardSize f -> do
          liftBoardM increaseSize >>= traverse_ \(Tuple _ board) -> do
            _ <- updateBoard board 
            updateStore (BoardEvent IncrementSize)
          pure Nothing
        DecrementBoardSize f -> do
          liftBoardM decreaseSize >>= traverse_ \(Tuple _ board) -> do
            _ <- updateBoard board
            updateStore (BoardEvent DecrementSize)
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
        updateStore (BoardEvent (RotatedPiece loc rot))
        updateBoard board
    PieceOutput (Piece.Dropped src) -> do
      -- when a piece is dropped, it can be dropped over a new location or outside the game board 
      maybeDst <- H.gets (_.mouseOverLocation)
      case maybeDst of
        -- if the piece is dropped over a new location, attempt to add the piece to the board
        Just dst -> do 
          liftBoardM (movePiece src dst) >>= traverse_ \(Tuple _ board) -> do
            updateStore (BoardEvent (MovedPiece src dst))
            updateBoard board
        -- if the piece is dropped somewhere that is not a location, remove it from the board
        Nothing -> do
          liftBoardM (removePiece src) >>= traverse_ \(Tuple piece board) -> do
            updateStore (BoardEvent (RemovedPiece src (name piece)))
            updateBoard board
    Undo -> do
      maybeZipper <- Z.moveLeft <$> gets (_.boardHistory)
      for_ maybeZipper \t -> do
        H.modify_ (_ { boardHistory = t })
        updateStore (BoardEvent UndoBoardEvent)
        evaluateBoard
    Redo -> do
      maybeZipper <- Z.moveRight <$> gets (_.boardHistory)
      for_ maybeZipper \t -> do
        H.modify_ (_ { boardHistory = t })
        updateStore (BoardEvent UndoBoardEvent)
        evaluateBoard
    ToggleInput dir -> do
      modify_ $ \s -> s { ports = M.alter (map (\(Tuple port signal) -> Tuple port (if isInput port then not signal else signal))) dir s.ports }
      _ <- evaluateBoard
      pure unit

    BoardOnDragExit _ -> do
      H.modify_ (_ { isCreatingWire = Nothing })
      log "cancel wire creation"

    LocationOnMouseDown loc me -> do
      for_ (target (MouseEvent.toEvent me)) \eventTarget ->
        for_ (fromEventTarget eventTarget) \element -> do
          bb <- liftEffect (getBoundingClientRect element)
          let initialDirection = getDirectionClicked me bb
          log (show initialDirection)

          H.modify_ (_ { isCreatingWire = Just { initialDirection, locations: [loc] } })
    LocationOnMouseOver loc _ -> do
      _wireLocations <>= [loc]
      pure unit
    LocationOnMouseUp loc me -> do
      isCreatingWire <- gets (_.isCreatingWire)
      for_ isCreatingWire \creatingWire -> do
        for_ (target (MouseEvent.toEvent me)) \eventTarget ->
          for_ (fromEventTarget eventTarget) \element -> do
            bb <- liftEffect (getBoundingClientRect element)
            let terminalDirection = getDirectionClicked me bb
            maybeBoardEvents <- evalState (boardPath creatingWire.initialDirection creatingWire.locations terminalDirection) <$> use _board
            case maybeBoardEvents of
              Just boardEvents -> do
                log ("boardevents: " <> show boardEvents)
                let boardEvent = Multiple boardEvents
                liftBoardM (applyBoardEvent boardEvent) >>= logShow
                liftBoardM (applyBoardEvent boardEvent) >>= traverse_ \(Tuple _ board) -> do
                  log "added boardEvents"
                  updateStore (BoardEvent boardEvent)
                  updateBoard board

                H.modify_ $ \s -> s { isCreatingWire = Nothing }
              Nothing -> do
                log "no board events!!"




    -- can these events be simplified? do we need all of them?
    LocationOnDragEnter _ dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
    LocationOnDragOver loc dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
      H.modify_ (_ { mouseOverLocation = Just loc } )
    LocationOnDrop loc dragEvent -> do
      log "location on drop"
      H.modify_ (_ { mouseOverLocation = Just loc } )
      liftEffect $ preventDefault (toEvent dragEvent)
    LocationOnDragLeave _ -> do
      H.modify_ (_ { mouseOverLocation = Nothing } )
    GlobalOnKeyDown ke -> do
      when (key ke == "z" && ctrlKey ke) do
        handleAction Undo
      when (key ke == "y" && ctrlKey ke) do
        handleAction Redo

-- assumes that DOMRect is squareish
getDirectionClicked :: MouseEvent -> DOMRect -> CardinalDirection
getDirectionClicked me bb = case isTopOrRight, isTopOrLeft of
  false, false -> Direction.Down
  false, true  -> Direction.Left
  true,  false -> Direction.Right
  true,  true  -> Direction.Up
  where
    Tuple x y = Tuple (toNumber (clientX me) - bb.left) (toNumber (clientY me) - bb.top)
    isTopOrRight = x > y
    isTopOrLeft = x + y < bb.width

getInputs :: forall m. MonadState State m => m (Map CardinalDirection Signal)
getInputs = M.mapMaybe getInputSignal <$> gets (_.ports)
  where getInputSignal (Tuple port signal) = if isInput port then Just signal else Nothing

setOutputs :: forall m. MonadState State m => Map CardinalDirection Signal -> m Unit
setOutputs outputs = modify_ $ \s -> s { ports = mapWithIndex setOutput s.ports }
  where setOutput dir (Tuple port signal) = if not (isInput port) then Tuple port (fromMaybe signal (M.lookup dir outputs)) else Tuple port signal

-- if there is a new board, we always want to evaluate it and send the changes to the piece components
updateBoard :: forall m. Board -> HalogenM State Action Slots Output m (Map CardinalDirection Signal)
updateBoard board = do
    -- append new board to board history for undo purposes 
    modify_ $ \s -> s { boardHistory = Z.append board s.boardHistory }
    pieces <- use (_board <<< _pieces)
    outputs <- evaluateBoard

    -- tell puzzle component that board state has been changed
    H.raise (NewBoardState board)
    pure outputs

evaluateBoard :: forall m. HalogenM State Action Slots Output m (Map CardinalDirection Signal)
evaluateBoard = do
    inputs  <- getInputs
    signals <- evalState (evalBoardWithPortInfo inputs) <$> use _board
    outputs <- map (_.signal) <$> evalState (extractOutputs signals) <$> use _board
    setOutputs outputs

    for_ (M.toUnfoldable $ signals :: Array _) \(Tuple (Relative (Edge {dir, loc})) portInfo) -> do
      trace (show loc <> "\t" <> show dir <> "\t" <> show portInfo) \_ ->
        H.tell _piece loc (\_ -> Piece.PaintPort dir portInfo)

    pure outputs


liftBoardM :: forall m a. BoardM a -> HalogenM State Action Slots Output m (Either BoardError (Tuple a Board))
liftBoardM boardM = runBoardM boardM <$> use _board