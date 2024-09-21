module Component.Board
  ( component
  , module Component.Board.Types
  )
  where

import Component.Board.Types
import Data.Lens
import Prelude

import AppM (AppM)
import Capability.Animate as Animate
import Capability.GlobalEventEmmiters (globalKeyDownEventEmitter)
import Component.Board.Render (render)
import Component.DataAttribute (attr)
import Component.DataAttribute as DA
import Component.Multimeter as Multimeter
import Component.Piece as Piece
import Component.Rendering.Path (renderPathWithEvents)
import Component.Rendering.Port (portPath)
import Control.Monad.Except (ExceptT, lift, throwError)
import Control.Monad.Logger.Class (class MonadLogger, debug, info, warn)
import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.State (class MonadState, evalState, execState, get, gets, modify, modify_, put, runState, runStateT)
import Control.Monad.State.Class (modify_, gets)
import Data.Array (elem, intercalate, last, (..))
import Data.Array as A
import Data.Bifunctor (lmap)
import Data.Either (Either(..), blush, either, fromRight, hush, isLeft, isRight)
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
import Game.Board (Board(..), BoardError, BoardM, _pieces, _size, addPath, addPiece, buildEvaluableBoard, capacityRipple, decreaseSize, evalBoardM, evalWithPortInfo, execBoardM, getBoardPortEdge, getPieceInfo, increaseSize, pieceDropped, removePiece, rotatePieceBy, runBoardM, runEvaluableM, toLocalInputs)
import Game.Capacity (maxValue)
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Game.GameEvent (BoardEvent(..))
import Game.Location (Location(..), location)
import Game.Port (isInput, portCapacity)
import Game.PortInfo (PortInfo)
import Game.Rotation (Rotation(..))
import Game.Signal (Signal(..))
import GlobalState (GlobalState, newBoardEvent)
import Halogen (AttrName(..), ClassName(..), Component, ComponentHTML, ComponentSlot, HalogenM(..), HalogenQ, Slot, mkComponent, mkEval, raise, subscribe, tell)
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
import Web.DOM.ParentNode (QuerySelector(..))
import Web.Event.Event (Event, preventDefault, target)
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML.Common (ClassName(..))
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, ctrlKey, fromEvent, key)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY)
import Web.UIEvent.MouseEvent as MouseEvent

component :: Component Query Input Output AppM
component = mkComponent { eval , initialState , render }
  where

  eval :: forall a. HalogenQ Query Action Input a -> HalogenM State Action Slots Output AppM a
  eval = mkEval
    { finalize: Nothing
    , handleAction
    , handleQuery
    , initialize: Just Initialise
    , receive: \_ -> Nothing 
    }
    where
      handleQuery :: forall a. Query a -> HalogenM State Action Slots Output AppM (Maybe a)
      handleQuery = case _ of
        GetBoard f -> do
          Just <<< f <$> use _board

        AddPiece loc piece f -> do
          result <- liftBoardM (addPiece loc piece)
          case result of
            Left boardError -> 
              Animate.headShake (DA.selector DA.location loc)
            Right _ ->
              H.raise (BoardEvent (AddPieceEvent loc piece))
          pure (Just (f result))

        AddPath initial locations terminal f -> do
          result <- liftBoardM (addPath initial locations terminal)
          when (isRight result) do
            H.raise (BoardEvent (AddPathEvent initial locations terminal))
          pure (Just (f result))

        RemovePiece loc f -> do
          result <- liftBoardM (removePiece loc)
          for_ result \info ->
            H.raise (BoardEvent (RemovePieceEvent loc info))
          pure (Just (f result))

        GetMouseOverLocation f -> do
          maybeDst <- gets (_.isMouseOverLocation)
          pure (f <$> maybeDst)

        SetGoalPorts boardPorts next -> do
          lift $ debug (tag "boardPorts" (show boardPorts)) "Set goal ports on board"

          modify_ $ _ { boardPorts = boardPorts }
          forWithIndex_ boardPorts \dir port -> do
            when (isInput port) do
              _inputs <<< at dir .= Just ff
          handleAction EvaluateBoard

          pure (Just next)

        SetInputs inputs f -> do
          _inputs .= inputs
          handleAction EvaluateBoard
          Just <$> f <$> gets (_.outputs)

        IncrementBoardSize next -> do
          result <- liftBoardM increaseSize
          pure (Just next)

        DecrementBoardSize f -> do
          result <- liftBoardM decreaseSize 
          pure (Just (f result))

        Undo next -> do
          maybeZipper <- Z.moveLeft <$> gets (_.boardHistory)
          for_ maybeZipper \t -> do
            modify_ (_ { boardHistory = t })
            handleAction EvaluateBoard
          pure (Just next)

        Redo next -> do
          maybeZipper <- Z.moveRight <$> gets (_.boardHistory)
          for_ maybeZipper \t -> do
            modify_ (_ { boardHistory = t })
            handleAction EvaluateBoard
          pure (Just next)
        
        Clear next -> do
          _ <- liftBoardM do
            pieces <- use _pieces
            forWithIndex_ pieces \loc _ ->
              removePiece loc
          pure (Just next)


      --handleAction :: Action -> HalogenM State Action Slots Output _ Unit
      handleAction = case _ of
        Initialise -> do
          emitter <- liftEffect $ globalKeyDownEventEmitter
          void $ subscribe (GlobalOnKeyDown <$> emitter)
          raise =<< NewBoardState <$> use _board

        PieceOutput (Piece.Rotated loc rot) -> do
          void $ liftBoardM (rotatePieceBy loc rot)

        PieceOutput (Piece.Dropped src) -> do
          lift $ debug M.empty ("Piece dropped at " <> show src)
          -- when a piece is dropped, it can be dropped over a new location or outside the game board 
          maybeDst <- gets (_.isMouseOverLocation)

          result <- liftBoardM (pieceDropped src maybeDst)
          when (isLeft result) do
              lift $ warn M.empty (show result)
              Animate.headShake (DA.selector DA.location src)


        -- set values of the  
        PieceOutput (Piece.NewMultimeterFocus focus) ->
          tell slot.multimeter unit (\_ -> Multimeter.NewFocus focus)

        -- todo: fix this
        MultimeterOutput (Multimeter.SetCapacity relativeEdge capacity) -> do
          void $ liftBoardM (capacityRipple relativeEdge capacity)
          -- update the multimeter after the port has changed
          signals <- gets (_.lastEvalWithPortInfo)
          let focus = do
                info <- M.lookup relativeEdge signals
                pure { info, relativeEdge }
            
          tell slot.multimeter unit (\_ -> Multimeter.NewFocus focus)

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
          { initialDirection: initial, locations } <- MaybeT $ gets (_.isCreatingWire)
          eventTarget <- MaybeT $ pure $ target (MouseEvent.toEvent me)
          element <- MaybeT $ pure $ fromEventTarget eventTarget
          bb <- liftEffect (getBoundingClientRect element)
          let terminal = getDirectionClicked me bb

          lift $ handleQuery (AddPath initial locations terminal (\_ -> unit))

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

        GlobalOnKeyDown ke -> 
          case key ke of
            "z" -> when (ctrlKey ke) do
              void $ handleQuery (Undo unit)
            "y" -> when (ctrlKey ke) do
              void $ handleQuery (Redo unit)
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

        {-
          Lift a `BoardM` operation in the `HalogenM` Monad for this component.
        -}
      liftBoardM :: forall a. BoardM a -> HalogenM State Action Slots Output AppM (Either BoardError a)
      liftBoardM boardM =  do
        board <- use _board
        case runBoardM boardM board of
          Left boardError ->
            pure (throwError boardError)
          Right (Tuple a board') -> do
            handleAction (SetBoard board')
            pure (Right a)

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
 