module Component.Board where

import Data.Lens
import Prelude

import Capability.GlobalKeyDown (class GlobalKeyDown, getKeyDownEmitter)
import Component.DataAttribute (attr)
import Component.DataAttribute as DataAttr
import Component.Piece (portIconSrc)
import Component.Piece as Piece
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.State (class MonadState, gets, modify, modify_)
import Data.Array (intercalate, (..))
import Data.Either (Either(..), blush, either, fromRight, hush)
import Data.Foldable (foldMap, for_, traverse_)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Traversable (for, traverse)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Board (Board(..), BoardError, BoardM, PieceInfo, _pieces, _size, addPiece, evalBoardM, execBoardM, getPiece, getPieceInfo, removePiece, rotatePieceBy, standardBoard)
import Game.Board.BoardDelta (BoardDelta(..), invertBoardDelta, runDelta)
import Game.Board.BoardDeltaStore (BoardDeltaStore)
import Game.Board.BoardDeltaStore as BoardDeltaStore
import Game.Location (CardinalDirection, Location(..), Rotation(..), allDirections, location, oppositeDirection, rotation)
import Game.Location as Direction
import Game.Piece (APiece(..), PieceId(..), getPort, matchingPort, name)
import Halogen (AttrName(..), ClassName(..), Component, HalogenM(..), HalogenQ, Slot)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Web.DOM.Document (toEventTarget)
import Web.Event.Event (Event, preventDefault)
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML.Common (ClassName(..))
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, ctrlKey, fromEvent, key)

type Input = Maybe Board

type State = 
  { currentBoard :: Board
  , boardDeltas :: BoardDeltaStore
  , mouseOverLocation :: Maybe Location
  }

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location PieceId (BoardError -> a)
  | RemovePiece Location (BoardError -> a)
  | GetMouseOverLocation (Location -> a)

data Action
  = Initialise
  | PieceOutput Piece.Output
  | RevertBoard
  | RunDelta BoardDelta
  | GlobalOnKeyDown KeyboardEvent
  | LocationOnDragEnter Location DragEvent
  | LocationOnDragOver Location DragEvent
  | LocationOnDragLeave DragEvent
  | LocationOnDrop Location DragEvent


data Output
  = NewBoardState BoardDeltaStore Board

type Slots = ( piece :: Slot Piece.Query Piece.Output Location )

_piece = Proxy :: Proxy "piece"

_board = H.gets (_.currentBoard)

component :: forall m. MonadEffect m => GlobalKeyDown m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where

  initialState board =
    { currentBoard: fromMaybe standardBoard board
    , boardDeltas: BoardDeltaStore.empty
    , mouseOverLocation: Nothing }

  render :: State -> HH.HTML (H.ComponentSlot Slots m Action) Action
  render state =
    HH.div
      [ HP.id "board-component" ] $
      [ pieces ]
    where
      board = state.currentBoard
      n = board ^. _size

      --renderBoard =
      --  HH.div
      --    [ HP.id "pieces"
      --    , HP.style $
      --        let margin = "13fr" -- update this in css also!
      --            gridTemplate = margin <> " repeat(" <> show n <> ", 100fr) " <> margin
      --        in intercalate "; " 
      --          [ "grid-template-columns: " <> gridTemplate 
      --          , "grid-template-rows: " <> gridTemplate
      --          ]
      --    , HP.tabIndex (-1)
      --    ]
      --    []
      
      pieces :: HTML (H.ComponentSlot Slots m Action) Action
      pieces = HH.table_ do
        j <- (-1) .. n
        pure $ HH.tr_ do
          i <- (-1) .. n
          pure $ HH.td_ $
            if between 0 (n-1) i && between 0 (n-1) j
              then [ renderPieceSlot i j ]
              else [ maybe (HH.div_ []) renderBoardPort (asDirection i j) ]


      renderPieceSlot :: Int -> Int -> HTML (H.ComponentSlot Slots m Action) Action
      renderPieceSlot i j = 
        HH.div
          [ attr DataAttr.location loc
          , HP.class_ (ClassName "piece")
          , HP.style $ intercalate "; "
            [ "transform: rotate("<> (show (rot * 90)) <>"deg)"
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
      
      asDirection :: Int -> Int -> Maybe CardinalDirection
      asDirection i j =
        if      i == -1 && j == h 
          then Just Direction.Left
        else if i == h  && j == -1
          then Just Direction.Up
        else if i == n  && j == h 
          then Just Direction.Right
        else if i == h  && j == n 
          then Just Direction.Down
        else Nothing
        where h = n `div` 2

      renderBoardPort :: CardinalDirection -> HTML (H.ComponentSlot Slots m Action) Action
      renderBoardPort dir =
        HH.div
          [ HP.class_ (ClassName "fake-piece")
          ]
          [ HH.div
            [ HP.classes [ ClassName "board-port", ClassName (show dir)]
            , HP.draggable false
            ]
            [ HH.img
              [ HP.src (portIconSrc (matchingPort <$> getPort board dir))
              , HP.classes [ ClassName "port-icon"]
              , HP.draggable false
              ]
            ]
          ]

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
        AddPiece loc pieceId f -> do
          eitherBoard <- handleDelta (AddedPiece loc pieceId)
          pure $ f <$> blush eitherBoard
        RemovePiece loc f -> do
          board <- _board
          eitherPiece <- halogenEvalBoardM (getPiece loc)
          eitherBoard <- join <$> for eitherPiece \piece ->
            handleDelta (RemovedPiece loc (name piece))
          pure $ f <$> blush eitherBoard
        GetMouseOverLocation f -> do
          maybeLoc <- H.gets (_.mouseOverLocation)
          pure $ f <$> maybeLoc
    , initialize: Just Initialise
    , receive: \_ -> Nothing 
    }

  handleAction :: Action -> HalogenM State Action Slots Output m Unit
  handleAction = case _ of
    Initialise -> do
      emitter <- getKeyDownEmitter
      void $ H.subscribe (GlobalOnKeyDown <$> emitter)
    PieceOutput (Piece.Rotated loc rot) -> void $
      handleDelta (RotatedPiece loc rot)
    PieceOutput (Piece.Dropped src) -> do
      halogenEvalBoardM (getPiece src) >>= traverse_ \piece -> do
        maybeDst <- H.gets (_.mouseOverLocation)
        let delta = maybe (RemovedPiece src (name piece)) (MovedPiece src) maybeDst
        handleDelta delta
    RevertBoard -> do
      maybeUncons <- gets ((_.boardDeltas) >>> BoardDeltaStore.uncons)
      for_ maybeUncons $ \{ head, tail } -> do
        H.modify_ (_ { boardDeltas = tail })
        handleDelta (invertBoardDelta head)
    RunDelta delta -> do
      void $ handleDelta delta
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
        handleAction RevertBoard

  handleDelta :: BoardDelta -> HalogenM State Action Slots Output m (Either BoardError Board)
  handleDelta delta = do
    board <- _board
    let eitherBoard = flip execBoardM board (runDelta delta) 
    for_ eitherBoard $ \newBoard -> do
      s <- modify $ \s -> s
        { currentBoard = newBoard
        , boardDeltas = BoardDeltaStore.cons delta s.boardDeltas
        }
      log "NEW DELTA STORE"
      log (show s)
      H.raise (NewBoardState s.boardDeltas newBoard)
    pure eitherBoard

  halogenEvalBoardM :: forall a. BoardM a -> HalogenM State Action Slots Output m (Either BoardError a)
  halogenEvalBoardM boardM = do
    flip evalBoardM <$> _board <*> pure boardM
