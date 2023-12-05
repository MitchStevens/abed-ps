module Component.Board where

import Data.Lens
import Prelude

import Capability.GlobalEventEmmiters (globalKeyDownEventEmitter)
import Component.DataAttribute (attr)
import Component.DataAttribute as DataAttr
import Component.MultimeterComponent as MultiMeter
import Component.MultimeterComponent as Multimeter
import Component.Piece as Piece
import Component.Piece.Render (renderPort)
import Control.Monad.Except (ExceptT, lift)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.State (class MonadState, evalState, execState, get, gets, modify, modify_, put, runState, runStateT)
import Data.Array (elem, intercalate, last, (..))
import Data.Array as A
import Data.Bifunctor (lmap)
import Data.Either (Either(..), blush, either, fromRight, hush, isRight)
import Data.Enum (fromEnum)
import Data.Foldable (foldMap, for_, traverse_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Int (toNumber)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
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
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Board (Board(..), RelativeEdge, _pieces, _size, standardBoard, toLocalInputs)
import Game.Board.EvaluableBoard (EvaluableBoard(..), buildEvaluableBoard, evalWithPortInfo, injectInputs, toEvaluableBoard)
import Game.Board.Operation (BoardError, BoardM, addPiece, applyBoardEvent, decreaseSize, evalBoardM, getPieceInfo, increaseSize, movePiece, removePiece, rotatePieceBy, runBoardM)
import Game.Board.Path (boardPath)
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.GameEvent (BoardEvent(..), GameEvent(..), GameEventStore, boardEventLocationsChanged)
import Game.Location (Location(..), location)
import Game.Piece (APiece(..), PieceId(..), Port, getPort, getPorts, isInput, isOutput, matchingPort, name)
import Game.Rotation (Rotation(..))
import Game.Signal (Signal(..))
import Halogen (AttrName(..), ClassName(..), Component, HalogenM(..), HalogenQ, Slot, ComponentHTML)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (mapActionOverHTML)
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
  , goalPorts :: Map CardinalDirection PortInfo
  , lastEvalWithPortInfo :: Map RelativeEdge PortInfo
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
  | MultimeterOutput MultiMeter.Output
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
  | DoNothing

data Output
  = NewBoardState Board

type Slots =
  ( piece :: Slot Piece.Query Piece.Output Location
  , multimeter :: Slot Multimeter.Query Multimeter.Output Unit
  )

_piece = Proxy :: Proxy "piece"
_multimeter = Proxy :: Proxy "multimeter"

_board :: Lens' State Board
_board = prop (Proxy :: Proxy "boardHistory") <<< Z._head

_wireLocations :: Traversal' State (Array Location)
_wireLocations = prop (Proxy :: Proxy "isCreatingWire") <<< _Just <<< prop (Proxy :: Proxy "locations")

_goalPorts = prop (Proxy :: Proxy "goalPorts")

--component :: forall m. MonadEffect m => GlobalKeyDown m => H.Component Query Input Output m
component :: forall m. MonadStore GameEvent GameEventStore m => MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState :: Input -> State
  initialState maybeBoard =
    let board = fromMaybe standardBoard maybeBoard
    in
      { boardHistory: Z.singleton board
      , mouseOverLocation: Nothing
      , goalPorts: M.empty
      , lastEvalWithPortInfo: M.empty
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
      (pieces <> boardPorts <> [multimeter])
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
      
      --boardPorts :: forall p. Array (HTML p Action)
      boardPorts = do
        Tuple dir portInfo <- M.toUnfoldable state.goalPorts
        pure $ renderBoardPort dir portInfo
      
      renderBoardPort :: forall s m. CardinalDirection -> PortInfo -> ComponentHTML Action s m
      renderBoardPort dir portInfo = 
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
              ]
              [ mapActionOverHTML (\_ -> DoNothing) (renderPort dir (portInfo { port = matchingPort portInfo.port} )) ]
            ]
          ]
        where
          m = n+2
          Tuple x y = case dir of
            Direction.Up    -> Tuple 1 (m `div` 2 + 1)
            Direction.Down  -> Tuple m (m `div` 2 + 1)
            Direction.Left  -> Tuple (m `div` 2 + 1) 1
            Direction.Right -> Tuple (m `div` 2 + 1) m

          viewBox =
            if dir `elem` [Direction.Up, Direction.Down]
              then SA.viewBox 0.0 0.0 50.0 25.0
              else SA.viewBox 12.5 (-12.5) 25.0 50.0

      pieceHTML piece location =
          let portStates = toLocalInputs location state.lastEvalWithPortInfo
          in HH.slot _piece location Piece.component { piece, location, portStates } PieceOutput
      
      emptyPieceHTML location = HH.text (show location)

      multimeter = HH.slot _multimeter unit Multimeter.component {} MultimeterOutput


  eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: handleAction
    , handleQuery: case _ of
        GetBoard f -> do
          board <- use _board
          pure $ Just (f board)
        AddPiece loc piece -> do
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
        SetInputs signals f -> do
          for_ (M.toUnfoldable signals :: Array _) \(Tuple dir signal) ->
            _goalPorts <<< ix dir <<< prop (Proxy :: Proxy "signal") .= signal
          _ <- evaluateBoard
          outputs <- M.mapMaybe (\info -> if not (isInput info.port) then Just info.signal else Nothing) <$> gets (_.goalPorts)          
          pure <<< Just $ f outputs
        SetGoalPorts goalPorts -> do
          for_ (M.toUnfoldable goalPorts :: Array _) \(Tuple dir port) ->
            _goalPorts <<< at dir .= Just { port, signal: Signal 0, connected: false}
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

      H.raise =<< NewBoardState <$> use _board
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
    PieceOutput (Piece.NewMultimeterFocus focus) ->
      H.tell _multimeter unit (\_ -> Multimeter.NewFocus focus)

    MultimeterOutput (Multimeter.SetCapacity relativeEdge capacity) -> do
      log ("set capacity: " <> show capacity)
      pure unit

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
      _goalPorts <<< ix dir <<< prop (Proxy :: Proxy "signal") %= not
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
      gets (_.isCreatingWire) >>= traverse_ \creatingWire -> do
        when (last creatingWire.locations /= Just loc) do
          log "modifying state of board"
          _wireLocations <>= [loc]
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
                let boardEvent = Multiple boardEvents
                liftBoardM (applyBoardEvent boardEvent) >>= traverse_ \(Tuple _ board) -> do
                  updateStore (BoardEvent boardEvent)
                  updateBoard board

                H.modify_ $ \s -> s { isCreatingWire = Nothing }
              Nothing -> do
                log "no board events!!"

    -- can these events be simplified? do we need all of them?
    LocationOnDragEnter loc dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
      H.modify_ (_ { mouseOverLocation = Just loc } )
    LocationOnDragOver loc dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
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
      --when (key ke == "s") do
      --  H.modify_ (\s -> s { displayMultimeter = not s.displayMultimeter } )
    DoNothing -> pure unit

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

-- if there is a new board, we always want to evaluate it and send the changes to the piece components
updateBoard :: forall m. Board -> HalogenM State Action Slots Output m Unit
updateBoard board = do
  -- append new board to board history for undo purposes 
  modify_ $ \s -> s { boardHistory = Z.append board s.boardHistory }
  pieces <- use (_board <<< _pieces)
  evaluateBoard

  -- tell puzzle component that board state has been changed
  H.raise (NewBoardState board)

evaluateBoard :: forall m. HalogenM State Action Slots Output m Unit
evaluateBoard = do
  goalPorts <- use _goalPorts
  let inputs = M.mapMaybe (\info -> if isInput info.port then Just info.signal else Nothing) goalPorts
  eitherEvaluable <- evalBoardM (buildEvaluableBoard (Just $ (_.port) <$> goalPorts)) <$> use _board
  for_ eitherEvaluable \evaluable ->  do
    let Tuple output signals = runState (evalWithPortInfo evaluable inputs) M.empty
    let updateGoalInfo dir info = 
          if isOutput info.port
            then info { signal = fromMaybe (Signal 0) (M.lookup dir output) }
            else info

    H.modify_ $ \s -> s
      { lastEvalWithPortInfo = signals
      , goalPorts = mapWithIndex updateGoalInfo s.goalPorts
      }

    use (_board <<< _pieces <<< to M.keys) >>= traverse_ \loc -> do
      let portStates = toLocalInputs loc signals
      H.tell _piece loc (\_ -> Piece.SetPortStates portStates)





liftBoardM :: forall m a. BoardM a -> HalogenM State Action Slots Output m (Either BoardError (Tuple a Board))
liftBoardM boardM = runBoardM boardM <$> use _board