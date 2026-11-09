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
import Capability.GlobalEventEmmiters (globalKeyDownEventEmitter, globalMouseUpEventEmitter)
import Component.Board.Render (render)
import Component.DataAttribute (attr)
import Component.DataAttribute as DA
import Component.Piece.Movement as Piece
import Component.Board.ViewModel (PortSource, leafInputs, liveSource, maxDepth, staticSource, viewBoard)
import Render.Port (portPath)
import Control.Monad.Except (ExceptT, lift, throwError)
import Control.Monad.Logger.Class (class MonadLogger, debug, info, warn)
import Control.Monad.Maybe.Trans (MaybeT(..), runMaybeT)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.Rec.Class (forever)
import Control.Monad.State (class MonadState, execState, get, gets, modify, modify_, put, runState, runStateT)
import Control.Monad.State.Class (modify_, gets)
import Data.Array (elem, intercalate, last, (..))
import Data.Array as A
import Data.Bifunctor (lmap)
import Data.Either (Either(..), blush, either, fromRight, hush, isLeft)
import Data.Enum (fromEnum)
import Data.Foldable (for_, traverse_)
import Data.FoldableWithIndex (foldlWithIndex, forWithIndex_, traverseWithIndex_)
import Data.FunctorWithIndex (mapWithIndex)
import Data.HeytingAlgebra (ff, tt)
import Data.Int (toNumber)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Record (prop)
import Data.Lens.Zoom (zoom)
import Data.List (List(..))
import Data.List as L
import Data.List.NonEmpty as NE
import Data.List.Types (NonEmptyList)
import Data.Log.Tag (Tag(..), tag)
import Data.Map (Map, union)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Control.Alternative (guard)
import Game.Board.Zoom (ZoomedBoard)
import Data.Traversable (for, traverse)
import Data.TraversableWithIndex (forWithIndex)
import Data.Tuple (Tuple(..), uncurry)
import Data.Tuple.Nested (Tuple3, tuple3, tuple4, (/\))
import Data.Zipper (Zipper)
import Data.Zipper as Z
import Debug (trace)
import Effect (Effect)
import Effect.Aff (Milliseconds(..), delay)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Eval (boundaryPortInfo, compile, portInfo, restoreState, saveState, step)
import Game.Board (Board(..), BoardError, BoardM, Cell(..), _focus, _pieces, _ports, _rootPorts, _size, addCell, addPath, addWormhole, focusIndex, isZoomed, pieceDropped, rebuild, removePiece, removeWormhole, rotatePieceBy, runAtFocus, setBoardSize, standardBoard, zoomIn, zoomOut)
import Game.Direction (CardinalDirection, allDirections)
import Game.Direction as Direction
import Game.Location (Location(..), location)
import Game.Port (hasPort, isInput, portCapacity)
import Game.Rotation (Rotation(..))
import Game.Frame as Frame
import Game.Signal (Signal(..), maxValue)
import Game.TestCase (testCaseOutcome)
import Halogen (AttrName(..), ClassName(..), Component, ComponentHTML, ComponentSlot, HalogenM(..), HalogenQ, Slot, mkComponent, mkEval, raise, subscribe)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Properties as HA
import Halogen.HTML.Properties as HP
import Halogen.Subscription as HS
import Halogen.Svg.Attributes (Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))
import Web.DOM.Document (toEventTarget)
import Web.DOM.Element (DOMRect, fromEventTarget, getBoundingClientRect, setAttribute)
import Web.DOM.NonElementParentNode (getElementById)
import Web.DOM.ParentNode (QuerySelector(..), querySelector)
import Web.Event.Event (Event, preventDefault, target)
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML (window)
import Web.HTML.Common (ClassName(..))
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.HTML.HTMLDocument as HTMLDocument
import Web.HTML.Window (document)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, ctrlKey, fromEvent, key)
import Web.UIEvent.MouseEvent (MouseEvent, clientX, clientY)
import Web.UIEvent.MouseEvent as MouseEvent
import Web.UIEvent.MouseEvent.Extras (MouseButton(..), button)
import Web.UIEvent.WheelEvent (WheelEvent, deltaY)
import Web.UIEvent.WheelEvent as WheelEvent

component :: Component Query Input Output AppM
component = mkComponent { eval , initialState , render }
  where

  eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output AppM
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
          Just <<< f <<< rebuild <$> use _zoomed

        GetFocus f -> do
          Just <<< f <$> use _board
        
        AddPiece loc piece f -> do
          result <- liftBoardM (addCell loc piece)
          case result of
            Left _ -> Animate.headShake (DA.selector DA.location loc)
            Right _ -> pure unit
          pure (Just (f result))

        AddPath initial locations terminal f -> do
          result <- liftBoardM (addPath initial locations terminal)
          pure (Just (f result))

        RemovePiece loc f -> do
          result <- liftBoardM (removePiece loc)
          pure (Just (f result))
        
        RotatePieceBy loc rot f -> do
          result <- liftBoardM (rotatePieceBy loc rot)
          pure (Just (f result))


        GetMouseOverLocation f -> do
          maybeDst <- gets (_.isMouseOverLocation)
          pure (f <$> maybeDst)

        SetGoalPorts boardPorts next -> do
          lift $ debug (tag "boardPorts" (show boardPorts)) "Set goal ports on board"
          modify_ $ _ { boardPorts = boardPorts }
          -- `compile` reads a board's own boundary straight off `BoardF.ports`
          -- (see `Game.Eval.Flatten`), so the goal's ports have
          -- to land there too, not just in `State.boardPorts`.
          _zoomed <<< _rootPorts .= boardPorts
          forWithIndex_ boardPorts \dir port -> do
            when (isInput port) do
              _inputs <<< Frame._side dir .= ff
          handleAction EvaluateBoard 
          pure (Just next)

        SetInputs inputs f -> do
          _inputs .= inputs
          handleAction EvaluateBoard
          Just <$> f <$> gets (_.outputs)


        SetBoardSize n f -> do
          result <- liftBoardM (setBoardSize n)
          pure (Just (f result))

        Undo next -> do
          maybeZipper <- Z.moveLeft <$> gets (_.boardHistory)
          for_ maybeZipper \t -> do
            modify_ (_ { boardHistory = t, zoomAnimation = Nothing, fadeInGrid = false })
            handleAction EvaluateBoard
          pure (Just next)

        Redo next -> do
          maybeZipper <- Z.moveRight <$> gets (_.boardHistory)
          for_ maybeZipper \t -> do
            modify_ (_ { boardHistory = t, zoomAnimation = Nothing, fadeInGrid = false })
            handleAction EvaluateBoard
          pure (Just next)
        
        Clear next -> do
          _ <- liftBoardM do
            pieces <- use _pieces
            forWithIndex_ pieces \loc _ ->
              removePiece loc
          pure (Just next)
        
        RunTestCase { inputs, expected } f -> do
          handleQuery $ SetInputs inputs \received -> do
            f (testCaseOutcome { inputs, expected } received)


      handleAction :: Action -> HalogenM State Action Slots Output AppM Unit
      handleAction = case _ of
        Initialise -> do
          emitter <- liftEffect $ globalKeyDownEventEmitter
          void $ subscribe (GlobalOnKeyDown <$> emitter)
          -- a wormhole drag can end anywhere, on the board or off it
          mouseUpEmitter <- liftEffect $ globalMouseUpEventEmitter
          void $ subscribe (GlobalOnMouseUp <$> mouseUpEmitter)

          -- fires `Tick` every 500ms for as long as this component lives
          -- (Halogen kills forked fibers on teardown, so no `finalize`
          -- handler is needed) -- same `HS.create` + forked loop + `notify`
          -- shape as `Component.Piece.Outline.after`/`Component.Level.delay`,
          -- just repeating via `forever` instead of firing once.
          { emitter: tickEmitter, listener: tickListener } <- liftEffect HS.create
          void $ subscribe (Tick <$ tickEmitter)
          void $ H.fork $ forever do
            liftAff (delay (Milliseconds 500.0))
            liftEffect (HS.notify tickListener unit)

          raise =<< NewBoardState <$> use _zoomed

          -- add attribute oncontextmenu="return false;" to board-component in order to disable right click context menu over the board (we are using right click to remove pieces)
          liftEffect do
            parentNode <- window >>= document <#> HTMLDocument.toNonElementParentNode
            getElementById "board-component" parentNode >>= traverse_ \element ->
              setAttribute "oncontextmenu" "return false;" element

        PieceOutput (Piece.Rotated loc rot) -> do
          void $ liftBoardM (rotatePieceBy loc rot)

        PieceOutput (Piece.Dropped src) -> do
          lift $ debug M.empty ("Piece dropped at " <> show src)
          -- when a piece is dropped, it can be dropped over a new location or outside the game board 
          maybeDst <- gets (_.isMouseOverLocation)

          result <- liftBoardM (pieceDropped src maybeDst)
          when (isLeft result) do
              lift $ warn M.empty (either show (const "") result)
              Animate.headShake (DA.selector DA.location src)

        PieceOutput (Piece.RemoveThis loc) -> do
          _ <- liftBoardM (removePiece loc)
          pure unit

        -- the board's ports are only the level's inputs when zoomed out --
        -- `Render` doesn't offer these while zoomed in
        ToggleInput dir -> do
          _inputs <<< Frame._side dir %= \signal -> if signal == ff then tt else ff
          handleAction EvaluateBoard

        IncrementInput dir -> do
          gets (_.boardPorts >>> Frame.lookupWhere hasPort dir) >>= traverse_ \port ->
            _inputs <<< Frame._side dir %= \signal -> if signal == maxValue (portCapacity port) then ff else signal <> one
          handleAction EvaluateBoard

        DecrementInput dir -> do
          gets (_.boardPorts >>> Frame.lookupWhere hasPort dir) >>= traverse_ \port ->
            _inputs <<< Frame._side dir %= \n -> if n == zero then maxValue (portCapacity port) else n - one
          handleAction EvaluateBoard

        SetOutputs outputs -> do
          modify_ $ _ { outputs = outputs }

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

        -- todo: used to use MaybeT here, refactor?
        LocationOnMouseUp loc me ->
          when (button me == Primary) do 
            gets (_.isCreatingWire) >>= traverse_ \{ initialDirection: initial, locations} -> do
              (liftEffect $ boundingBoxFromMouseEvent me) >>= traverse_ \bb -> do
                let terminal = getDirectionClicked me bb
                handleQuery (AddPath initial locations terminal (\_ -> unit))

        SetBoard zoomed -> do
          lift $ debug M.empty "Updating board"
          -- append new board to board history for undo purposes, in the same
          -- update as dropping any zoom animation, so a finished zoom in
          -- swaps straight from the scaled-up slot to the board inside it
          modify_ $ \s -> s { boardHistory = Z.pushFocus zoomed s.boardHistory, zoomAnimation = Nothing, fadeInGrid = false }
          handleAction EvaluateBoard
          -- tell puzzle component that board state has been changed
          raise (NewBoardState zoomed)

        -- ticking and input-driven evaluation are the same operation now --
        -- both just re-run `step` with the persisted tick state -- so a
        -- wormhole piece's state keeps advancing every 500ms even with no
        -- input change (see `Initialise`).
        Tick -> handleAction EvaluateBoard

        -- only the real board can be evaluated, so this rebuilds it from the
        -- zoom, then reads the focus's signals from where it sits in it
        EvaluateBoard -> do
          inputs <- gets (_.inputs)
          zoomed <- use _zoomed
          let board = rebuild zoomed
              focus = view _focus zoomed
              index = focusIndex zoomed

          let
            -- the focus and the board around it as they're drawn, their
            -- ports read from `src`
            setViews :: PortSource -> HalogenM State Action Slots Output AppM Unit
            setViews src = do
              let focusView = viewBoard src maxDepth index focus
              modify_ _
                { focusView = focusView
                , pieceInputs = leafInputs focusView
                , contextView = do
                    parent <- zoomOut zoomed
                    hole <- L.last index
                    pure { parent: viewBoard src maxDepth (focusIndex parent) (view _focus parent), hole }
                }

          case compile board of
            Left boardError -> do
              -- a cyclic wiring (two outputs facing each other, say) is an
              -- easy, ordinary thing for a player to do mid-edit -- leave
              -- the signals as they last were rather than crashing, but
              -- still show the edit.
              lift $ warn M.empty ("Unable to compile board, BoardError: " <> show boardError)
              setViews staticSource
            Right netlist -> do
              saved <- gets (_.registerState)
              let
                Tuple outputs signals = step netlist inputs (restoreState netlist saved)
              lift $ debug (tag "inputs" (show inputs) `union` tag "outputs" (show outputs)) "Evaluating board"

              setViews (liveSource netlist signals)
              modify_ $ _
                { registerState = saveState netlist signals
                -- every side the focus declares, its wormhole's included: at
                -- the root that's the harness's sides (`boundaryPortInfo`)
                -- and the wormhole's, which the harness never sees
                , boardPortInfoMap =
                    mapWithIndex (\side port -> portInfo netlist signals (Tuple index side) port) (view _ports focus)
                }
              handleAction (SetOutputs outputs)

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

        -- the wheel only claims the event (stopping the page scrolling) when
        -- it actually zooms, so scrolling over a board still scrolls the page.
        -- A slot with no piece shown is either empty or holds a nested board,
        -- and both can be zoomed into.
        --
        -- Zooming in scales the slot up to fill the board first (all but the
        -- margin the board inside it will show its neighbours in), and only
        -- then moves into it (`FinishZoomIn`).
        LocationOnWheel loc we -> do
          state <- get
          when (deltaY we < 0.0 && isNothing state.zoomAnimation && isNothing (pieceInput state loc)) do
            liftEffect $ preventDefault (WheelEvent.toEvent we)
            let innerSize = case _.piece <$> M.lookup loc (view (_board <<< _pieces) state) of
                  Just (Nested inner) -> view _size inner
                  _ -> view _size standardBoard
            modify_ (_ { zoomAnimation = Just { location: loc, animate: true, inset: zoomInset innerSize } })
            void $ H.fork do
              liftAff (delay zoomDuration)
              handleAction (FinishZoomIn loc)

        -- Zooming out moves out first, shows the parent with the slot still
        -- filling the board, then scales it back down (`FinishZoomOut`).
        BoardOnWheel we -> do
          zoomed <- use _zoomed
          animating <- gets (isJust <<< _.zoomAnimation)
          for_ (guard (deltaY we > 0.0 && not animating) *> zoomOutWithLocation zoomed) \(Tuple loc parent) -> do
            liftEffect $ preventDefault (WheelEvent.toEvent we)
            -- starts from just how the zoomed-in board was showing its parent
            let inset = zoomInset (view (_focus <<< _size) zoomed)
            handleAction (SetBoard parent)
            modify_ (_ { zoomAnimation = Just { location: loc, animate: false, inset } })
            -- long enough for the browser to draw the scaled-up frame, so the
            -- transition has somewhere to start from
            void $ H.fork do
              liftAff (delay (Milliseconds 30.0))
              handleAction (FinishZoomOut loc)

        FinishZoomIn loc -> do
          -- the board can have changed under the animation (undo, a resize),
          -- so the slot might not be there to zoom into any more
          animation <- gets (_.zoomAnimation)
          when (isAnimating loc true animation) do
            zoomIn loc <$> use _zoomed >>= case _ of
              Right zoomed -> do
                handleAction (SetBoard zoomed)
                modify_ (_ { fadeInGrid = true })
              Left err -> do
                lift $ warn M.empty ("Couldn't zoom in: " <> show err)
                modify_ (_ { zoomAnimation = Nothing })

        FinishZoomOut loc -> do
          animation <- gets (_.zoomAnimation)
          when (isAnimating loc false animation) do
            modify_ (_ { zoomAnimation = Nothing })

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
        BoardPortOnMouseLeave -> do
          modify_ (_ { isMouseOverBoardPort = Nothing })

        -- Dragging from a side: from one end of the wormhole, to drop it off
        -- the board; from any other side a wormhole could use, to drop it on
        -- another and join the two. The drop is `GlobalOnMouseUp`.
        BoardPortOnMouseDown dir me -> when (button me == Primary) do
          state <- get
          let existing = isJust (wormholeEnd state dir)
          when (existing || canHoldWormhole state dir) do
            -- or the drag selects text
            liftEffect $ preventDefault (MouseEvent.toEvent me)
            modify_ (_ { wormholeDrag = Just { from: dir, existing, outside: false } })

        BoardOnMouseEnter -> do
          modify_ \s -> s { wormholeDrag = s.wormholeDrag <#> _ { outside = false } }
        BoardOnMouseLeave -> do
          modify_ \s -> s { wormholeDrag = s.wormholeDrag <#> _ { outside = true } }

        GlobalOnMouseUp _ -> do
          state <- get
          for_ state.wormholeDrag \drag -> do
            modify_ (_ { wormholeDrag = Nothing })
            if drag.existing
              then when drag.outside do
                void $ liftBoardM removeWormhole
              else for_ (state.isMouseOverBoardPort >>= wormholeCandidate state drag.from) \wormhole ->
                void $ liftBoardM (addWormhole wormhole)

        {-
          Lift a `BoardM` operation in the `HalogenM` Monad for this component.
        -}
      liftBoardM :: forall a. BoardM a -> HalogenM State Action Slots Output AppM (Either BoardError a)
      liftBoardM boardM =  do
        zoomed <- use _zoomed
        case runAtFocus boardM zoomed of
          Left boardError ->
            pure (Left boardError)
          Right (Tuple a zoomed') -> do
            handleAction (SetBoard zoomed')
            pure (Right a)
      

-- | How long a zoom in scales up for before moving into the slot -- the
-- | same as `.board-grid`'s transition in `less/board-component.less`.
zoomDuration :: Milliseconds
zoomDuration = Milliseconds 200.0

-- | Whether a zoom animation is still the one that was started at `loc`.
isAnimating :: forall r. Location -> Boolean -> Maybe { location :: Location, animate :: Boolean | r } -> Boolean
isAnimating loc animate = maybe false \a -> a.location == loc && a.animate == animate

-- | `zoomOut`, along with the slot it zoomed out of.
zoomOutWithLocation :: ZoomedBoard -> Maybe (Tuple Location ZoomedBoard)
zoomOutWithLocation zoomed = Tuple <$> L.last (focusIndex zoomed) <*> zoomOut zoomed

boundingBoxFromMouseEvent :: MouseEvent -> Effect (Maybe DOMRect)
boundingBoxFromMouseEvent me =
  for (target (MouseEvent.toEvent me) >>= fromEventTarget) getBoundingClientRect

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
 