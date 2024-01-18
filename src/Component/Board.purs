module Component.Board
  ( component
  , module Component.Board.Types
  )
  where

import Component.Board.Types
import Data.Lens
import Prelude

import Capability.Animate as Animate
import Capability.GlobalEventEmmiters (globalKeyDownEventEmitter)
import Component.DataAttribute (attr)
import Component.DataAttribute as DA
import Component.Multimeter as Multimeter
import Component.Piece as Piece
import Component.Rendering.Path (renderPathWithEvents)
import Component.Rendering.Port (portPath)
import Control.Monad.Except (ExceptT, lift)
import Control.Monad.Logger.Class (class MonadLogger, debug, info, warn)
import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.State (class MonadState, evalState, execState, get, gets, modify, modify_, put, runState, runStateT)
import Control.Monad.State.Class (modify_, gets)
import Data.Array (elem, intercalate, last, (..))
import Data.Array as A
import Data.Bifunctor (lmap)
import Data.Either (Either(..), blush, either, fromRight, hush, isRight)
import Data.Enum (fromEnum)
import Data.Foldable (fold, foldMap, for_, traverse_)
import Data.FoldableWithIndex (foldlWithIndex, foldrWithIndex, forWithIndex_, traverseWithIndex_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.HeytingAlgebra (ff, tt)
import Data.Int (toNumber)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Record (prop)
import Data.List (List(..))
import Data.List as L
import Data.List.NonEmpty as NE
import Data.List.Types (NonEmptyList)
import Data.Log.Tag (Tag(..), tag)
import Data.Map (Map, union)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Traversable (for, traverse)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..), uncurry)
import Data.Tuple.Nested (Tuple3, tuple3, tuple4, (/\))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Debug (trace)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Board (Board(..), _pieces, _size, addBoardPath, addPiece, buildEvaluableBoard, capacityRipple, decreaseSize, evalBoardM, evalWithPortInfo, getBoardPortEdge, getPieceInfo, increaseSize, pieceDropped, removePiece, rotatePieceBy, runEvaluableM, toLocalInputs)
import Game.Capacity (maxValue)
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Game.GameEvent (BoardEvent(..), GameEvent(..), GameEventStore, boardEventLocationsChanged)
import Game.Location (Location(..), location)
import Game.Port (isInput, portCapacity)
import Game.PortInfo (PortInfo)
import Game.Rotation (Rotation(..))
import Game.Signal (Signal(..))
import Halogen (AttrName(..), ClassName(..), Component, ComponentHTML, ComponentSlot, HalogenM(..), HalogenQ, Slot, mkComponent, mkEval, raise, subscribe, tell)
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Properties as HA
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Type.Proxy (Proxy(..))
import Web.DOM.Document (toEventTarget)
import Web.DOM.Element (DOMRect, fromEventTarget, getBoundingClientRect)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.Event.Event (Event, preventDefault, target)
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML.Common (ClassName(..))
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, ctrlKey, fromEvent, key)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY)
import Web.UIEvent.MouseEvent as MouseEvent

component :: forall m
  .  MonadLogger m 
  => MonadAff m
  => Component Query Input Output m
component = mkComponent { eval , initialState , render }
  where

  render :: State -> HTML (ComponentSlot Slots m Action) Action
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

      pieces :: Array (ComponentHTML Action Slots m)
      pieces = do
        i <- 0 .. (n-1)
        j <- 0 .. (n-1)
        pure $ renderPieceSlot i j

      renderPieceSlot :: Int -> Int -> ComponentHTML Action Slots m
      renderPieceSlot i j = 
        HH.div
          [ DA.attr DA.location (location i j)
          , HP.class_ (ClassName "piece")
          , HP.style $ intercalate "; "
            [ --"transform: rotate("<> (show (rot * 90)) <>"deg)"
            --, 
            gridArea (Tuple i j )
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
      boardPorts = A.fromFoldable $
        mapWithIndex renderBoardPort (evalState boardPortInfo state)

      renderBoardPort :: CardinalDirection -> PortInfo -> ComponentHTML Action Slots m
      renderBoardPort dir portInfo = 
        HH.div
          [ HP.class_ (ClassName "board-port")
          , HE.onClick (\_ -> ToggleInput dir)
          , DA.attr DA.direction dir
          , HP.style $ intercalate "; "
            [ gridArea (boardPortLocation dir) ]
          ]
          [ SE.svg
            [ viewBox ]
            [ SE.g 
              [ SA.transform [ Rotate rotation 25.0 12.5 ] ]
              [ renderPathWithEvents path (BoardPortOnMouseEnter dir) (BoardPortOnMouseLeave) ]
            ]
          ]
        where
          rotation = 90.0 * toNumber (fromEnum dir + 2)

          path = portPath (portInfo)

          boardPortLocation :: CardinalDirection -> Tuple Int Int
          boardPortLocation = case _ of
            Direction.Left    -> Tuple (-1) (n `div` 2)
            Direction.Right  -> Tuple n (n `div` 2)
            Direction.Up  -> Tuple (n `div` 2) (-1)
            Direction.Down -> Tuple (n `div` 2) n

          viewBox =
            if dir `elem` [Direction.Up, Direction.Down]
              then SA.viewBox 0.0 0.0 50.0 25.0
              else SA.viewBox 12.5 (-12.5) 25.0 50.0

      gridArea :: Tuple Int Int -> String
      gridArea (Tuple i j) = 
        "grid-area: " <> show (j+2) <> " / " <> show (i+2)

      pieceHTML piece location =
          HH.slot slot.piece location Piece.component { piece, location } PieceOutput
      
      emptyPieceHTML location = HH.text (show location)

      multimeter = HH.slot slot.multimeter unit Multimeter.component {} MultimeterOutput


  eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output m
  eval = mkEval
    { finalize: Nothing
    , handleAction
    , handleQuery
    , initialize: Just Initialise
    , receive: \_ -> Nothing 
    }

  handleQuery :: forall a. Query a -> HalogenM State Action Slots Output m (Maybe a)
  handleQuery = case _ of
    GetBoard f -> do
      Just <<< f <$> use _board
    AddPiece loc piece -> do
      liftBoardM (addPiece loc piece) >>= case _ of
        Left boardError -> do
          Animate.headShake (DA.selector DA.location loc)
        Right (Tuple _ board) -> do
        --updateStore (BoardEvent (AddedPiece loc (name piece)))
      -- raise as a board event so other components can be notified
          handleAction (SetBoard board)
      pure Nothing
    RemovePiece loc -> do
      liftBoardM (removePiece loc) >>= traverse_ \(Tuple piece board) -> do
        handleAction (SetBoard board)
        -- raise as a board event so other components can be notified
        --updateStore (BoardEvent (RemovedPiece loc (name piece)))
      pure Nothing
    GetMouseOverLocation f -> do
      maybeDst <- gets (_.isMouseOverLocation)
      pure (f <$> maybeDst)
    SetGoalPorts boardPorts -> do
      lift $ debug (tag "boardPorts" (show boardPorts)) "Set goal ports on board"
      modify_ $ _ { boardPorts = boardPorts }
      forWithIndex_ boardPorts \dir port -> do
        when (isInput port) do
          _inputs <<< at dir .= Just ff

      handleAction EvaluateBoard
      pure Nothing
    SetInputs inputs f -> do
      _inputs .= inputs
      handleAction EvaluateBoard
      Just <$> f <$> gets (_.outputs)
    IncrementBoardSize f -> do
      liftBoardM increaseSize >>= traverse_ \(Tuple _ board) -> do
        handleAction (SetBoard board)
        --updateStore (BoardEvent IncrementSize)
      pure Nothing
    DecrementBoardSize f -> do
      liftBoardM decreaseSize >>= traverse_ \(Tuple _ board) -> do
        handleAction (SetBoard board)
        --updateStore (BoardEvent DecrementSize)
      pure Nothing

handleAction :: forall m. MonadAff m => MonadLogger m 
  => Action -> HalogenM State Action Slots Output m Unit
handleAction = case _ of
  Initialise -> do
    emitter <- liftEffect $ globalKeyDownEventEmitter
    void $ subscribe (GlobalOnKeyDown <$> emitter)
    raise =<< NewBoardState <$> use _board
  PieceOutput (Piece.Rotated loc rot) ->
    liftBoardM (rotatePieceBy loc rot) >>= traverse_ \(Tuple _ board) -> do
      lift $ debug (tag "rotation" (show rot)) ("Piece rotated at " <> show loc)
      --updateStore (BoardEvent (RotatedPiece loc rot))
      handleAction (SetBoard board)
  PieceOutput (Piece.Dropped src) -> do
    lift $ debug M.empty ("Piece dropped at " <> show src)
    -- when a piece is dropped, it can be dropped over a new location or outside the game board 
    maybeDst <- gets (_.isMouseOverLocation)
    eitherPiece <- liftBoardM (pieceDropped src maybeDst)
    case eitherPiece of
      Left boardError -> do
        lift $ warn M.empty (show boardError) -- todo: what do we want to do here??
        Animate.headShake (DA.selector DA.location src)
      Right _ -> do
        board <- use _board
        handleAction (SetBoard board)


  PieceOutput (Piece.NewMultimeterFocus focus) ->
    tell slot.multimeter unit (\_ -> Multimeter.NewFocus focus)

  -- todo: fix this
  MultimeterOutput (Multimeter.SetCapacity relativeEdge capacity) -> do
    board' <- execState (capacityRipple relativeEdge capacity) <$> use _board
    handleAction (SetBoard board')

      -- update the multimeter after the port has changed
    signals <- gets (_.lastEvalWithPortInfo)
    let focus = do
          info <- M.lookup relativeEdge signals
          pure { info, relativeEdge }
      
    tell slot.multimeter unit (\_ -> Multimeter.NewFocus focus)

  Undo -> do
    maybeZipper <- Z.moveLeft <$> gets (_.boardHistory)
    for_ maybeZipper \t -> do
      modify_ (_ { boardHistory = t })
      --updateStore (BoardEvent UndoBoardEvent)
      handleAction EvaluateBoard
  Redo -> do
    maybeZipper <- Z.moveRight <$> gets (_.boardHistory)
    for_ maybeZipper \t -> do
      modify_ (_ { boardHistory = t })
      --updateStore (BoardEvent UndoBoardEvent)
      handleAction EvaluateBoard

  ToggleInput dir -> do
    _inputs <<< ix dir %= \signal -> if signal == ff then tt else ff
    handleAction EvaluateBoard
  IncrementInput dir -> do
    gets (_.boardPorts >>> M.lookup dir) >>= traverse_ \port ->
      _inputs <<< ix dir %= \signal -> if signal == maxValue (portCapacity port) then ff else signal <> one
    handleAction EvaluateBoard
  DecrementInput dir -> do
    gets (_.boardPorts >>> M.lookup dir) >>= traverse_ \port ->
      _inputs <<< ix dir %= \(Signal n) -> if n == 0 then maxValue (portCapacity port) else Signal (n-1)
    handleAction EvaluateBoard
  SetOutputs outputs -> do
    modify_ $ _ { outputs = outputs }
    gets (_.isMouseOverBoardPort) >>= traverse_ \dir ->
      tell slot.multimeter unit (\_ -> Multimeter.SetSignal (fold (M.lookup dir outputs)))

  BoardOnDragExit _ -> do
    modify_ (_ { isCreatingWire = Nothing })
    lift $ debug M.empty "Cancelled wire creation"

  LocationOnMouseDown loc me -> void $ runMaybeT do
    eventTarget <- MaybeT $ pure (target (MouseEvent.toEvent me))
    element <- MaybeT $ pure (fromEventTarget eventTarget)
    bb <- liftEffect (getBoundingClientRect element)
    let initialDirection = getDirectionClicked me bb
    modify_ (_ { isCreatingWire = Just { initialDirection, locations: [loc] } })
  LocationOnMouseOver loc _ -> do
    gets (_.isCreatingWire) >>= traverse_ \creatingWire -> do
      when (last creatingWire.locations /= Just loc) do
        _wireLocations <>= [loc]
  LocationOnMouseUp loc me -> void $ runMaybeT do
    creatingWire <- MaybeT $ gets (_.isCreatingWire)
    eventTarget <- MaybeT $ pure $ target (MouseEvent.toEvent me)
    element <- MaybeT $ pure $ fromEventTarget eventTarget
    bb <- liftEffect (getBoundingClientRect element)
    let terminalDirection = getDirectionClicked me bb

    Tuple pathAdded board <- runState (addBoardPath creatingWire.initialDirection creatingWire.locations terminalDirection) <$> use _board
    when pathAdded do
      --updateStore (BoardEvent boardEvent)
      lift $ handleAction (SetBoard board)
    modify_ $ _ { isCreatingWire = Nothing }


  SetBoard board -> do
    lift $ debug M.empty "Updating board"
    -- append new board to board history for undo purposes 
    modify_ $ \s -> s { boardHistory = Z.append board s.boardHistory }
    handleAction EvaluateBoard
    -- tell puzzle component that board state has been changed
    raise (NewBoardState board)
  EvaluateBoard -> do
    boardPorts <- gets (_.boardPorts)
    inputs <- gets (_.inputs)
    --let inputs = M.mapMaybe (\info -> if isInput info.port then Just info.signal else Nothing) goalPorts
    eitherEvaluable <- (buildEvaluableBoard boardPorts) <$> use _board

    case eitherEvaluable of      -- update pieces
      Left boardError -> 
        -- todo: what should we do when an evaluable can't be created?
        lift $ warn M.empty ("Unable to build EvaluableBoard, BoardError: " <> show boardError)
      Right evaluable -> do
        -- evaluate the evaulable
        let Tuple outputs signals = runEvaluableM evaluable (evalWithPortInfo inputs)
        lift $ debug (tag "inputs" (show inputs) `union` tag "outputs" (show outputs)) "Evaluating board"
        lift $ debug (foldrWithIndex (\relEdge info -> M.insert (show relEdge) (StringTag (show info))) M.empty signals) "Signals from board eval"

        modify_ $ _ { lastEvalWithPortInfo = signals }
        handleAction (SetOutputs outputs)

        handleAction UpdatePieceComponents

  UpdatePieceComponents -> do
    lift $ debug M.empty "Updating piece components"
    signals <- gets (_.lastEvalWithPortInfo)
    use (_board <<< _pieces) >>= traverseWithIndex_ \loc info -> do
      let portStates = toLocalInputs loc signals
      --lift $ debug (tag "port states" (show portStates)) ("update piece at :" <> show loc )
      tell slot.piece loc (\_ -> Piece.SetPortStates portStates)
      tell slot.piece loc (\_ -> Piece.SetPiece info.piece)
      tell slot.piece loc (\_ -> Piece.SetRotation info.rotation)


  -- can these events be simplified? do we need all of them?
  LocationOnDragEnter loc dragEvent -> do
    liftEffect $ preventDefault (toEvent dragEvent)
    modify_ (_ { isMouseOverLocation = Just loc } )
  LocationOnDragOver loc dragEvent -> do
    liftEffect $ preventDefault (toEvent dragEvent)
  LocationOnDrop loc dragEvent -> do
    modify_ (_ { isMouseOverLocation = Just loc } )
    liftEffect $ preventDefault (toEvent dragEvent)
  LocationOnDragLeave _ -> do
    modify_ (_ { isMouseOverLocation = Nothing } )
  GlobalOnKeyDown ke -> do
    case key ke of
      "z" -> when (ctrlKey ke) (handleAction Undo)
      "y" -> when (ctrlKey ke) (handleAction Redo)
      "e" -> gets (_.isMouseOverBoardPort) >>= traverse_ \dir ->
        handleAction (IncrementInput dir)
      "E" -> gets (_.isMouseOverBoardPort) >>= traverse_ \dir ->
        handleAction (DecrementInput dir)
      _ -> pure unit
  
  BoardPortOnMouseEnter dir -> do
    modify_ (_ { isMouseOverBoardPort = Just dir })
    relativeEdge <- evalState (getBoardPortEdge dir) <$> use _board
    signals <- gets (_.lastEvalWithPortInfo)
    let focus = { info: _, relativeEdge } <$> M.lookup relativeEdge signals
    tell slot.multimeter unit (\_ -> Multimeter.NewFocus focus)
  BoardPortOnMouseLeave -> do
    modify_ (_ { isMouseOverBoardPort = Nothing })
    tell slot.multimeter unit (\_ -> Multimeter.NewFocus Nothing)
  --DoNothing -> pure unit

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