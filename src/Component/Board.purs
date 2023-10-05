module Component.Board where

import Data.Lens
import Prelude

import Capability.GlobalKeyDown (class GlobalKeyDown, getKeyDownEmitter)
import Component.Piece (portIconSrc)
import Component.Piece as Piece
import Control.Alternative (guard)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.State (class MonadState)
import Data.Array (intercalate, (..))
import Data.Either (Either(..), blush, either, fromRight, hush)
import Data.Foldable (foldMap, for_, traverse_)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Record (prop)
import Data.List.NonEmpty as L
import Data.List.Types (NonEmptyList)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Monoid (power)
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log, logShow)
import Game.Board (Board(..), BoardError, PieceInfo, _pieces, _size, addPiece, getPieceInfo, removePiece, rotatePieceBy, standardBoard)
import Game.Location (CardinalDirection, Location(..), Rotation(..), allDirections, location, oppositeDirection, rotation)
import Game.Location as Direction
import Game.Piece (APiece(..), getPort, matchingPort)
import Halogen (ClassName(..), HalogenM(..), HalogenQ)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Subscription (Emitter)
import Halogen.Subscription as HS
import Type.Proxy (Proxy(..))
import Web.DOM.Document (toEventTarget)
import Web.Event.Event (Event, preventDefault)
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML (window)
import Web.HTML.Common (ClassName(..))
import Web.HTML.Event.DataTransfer as DataTransfer
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.HTML.HTMLDocument (toDocument)
import Web.HTML.Window (document)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, ctrlKey, fromEvent, key)
import Web.UIEvent.KeyboardEvent.EventTypes (keydown)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = Maybe Board

type State = 
  { boardHistory :: NonEmptyList Board
  , mouseOverLocation :: Maybe Location
  }

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location APiece (BoardError -> a)
  | RemovePiece Location (BoardError -> a)
  | GetMouseOverLocation (Location -> a)

data Action
  = Initialise
  | PieceOutput Piece.Output
  | RevertBoard
  | SetBoard Board
  | GlobalOnKeyDown KeyboardEvent
  | LocationOnDragEnter Location DragEvent
  | LocationOnDragOver Location DragEvent
  | LocationOnDragLeave DragEvent
  | LocationOnDrop Location DragEvent

data Output
  = NewBoardState Board

type Slots = ( piece :: H.Slot Piece.Query Piece.Output Location )

_piece = Proxy :: Proxy "piece"

component :: forall m. MonadEffect m => GlobalKeyDown m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where

  _board :: forall m. MonadState State m => m Board
  _board = H.gets ((_.boardHistory) >>> L.head)

  initialState board =
    { boardHistory: L.singleton $ fromMaybe standardBoard board
    , mouseOverLocation: Nothing }

  render :: State -> HH.HTML (H.ComponentSlot Slots m Action) Action
  render state =
    HH.div
      [ HP.id "board-component" ] $
      [ renderBoard ]
    where
      n = L.head (state.boardHistory) ^. _size

      renderBoard =
        HH.div
          [ HP.id "pieces"
          , HP.style $
              let margin = "13fr" -- update this in css also!
                  gridTemplate = margin <> " repeat(" <> show n <> ", 100fr) " <> margin
              in intercalate "; " 
                [ "grid-template-columns: " <> gridTemplate 
                , "grid-template-rows: " <> gridTemplate
                ]
          , HP.tabIndex (-1)
          ]
          (pieceSlots <> boardPorts)
      
      pieceSlots = do
        j <- 0 .. (n - 1)
        i <- 0 .. (n - 1)
        pure $ renderPieceSlot i j
      
      renderPieceSlot :: Int -> Int -> HTML (H.ComponentSlot Slots m Action) Action
      renderPieceSlot i j = 
        HH.div
          [ HP.class_ (ClassName "piece")
          , HP.style $ intercalate "; "
            [ "transform: rotate("<> (show (rot * 90)) <>"deg)"
            , "grid-area: " <> gridArea
            ]
          , HE.onDragEnter (LocationOnDragEnter loc)
          , HE.onDragOver (LocationOnDragOver loc)
          , HE.onDragLeave LocationOnDragLeave
          , HE.onDrop (LocationOnDrop loc)
          ]
          [ maybe emptyPieceHTML pieceHTML maybePiece loc ]
        where
          loc = location i j
          eitherPieceInfo = getPieceInfo (L.head state.boardHistory) loc
          maybePiece = (_.piece) <$> hush eitherPieceInfo
          Rotation rot = foldMap (_.rotation) eitherPieceInfo
          gridArea = show (j+2) <> " / " <> show (i+2) <> " / auto / auto" 
      
      boardPorts = renderBoardPort <$> allDirections

      renderBoardPort :: CardinalDirection -> HTML (H.ComponentSlot Slots m Action) Action
      renderBoardPort dir =
        HH.div
          [ HP.class_ (ClassName "fake-piece")
          , HP.style $ intercalate "; "
                [ "grid-area: " <> gridArea ]
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
        where
          Location { x, y } = case dir of
            Direction.Left  -> location 1             (n`div`2 + 2)
            Direction.Up -> location (n`div`2 + 2) 1
            Direction.Right -> location (n+2)             (n`div`2 + 2)
            Direction.Down  -> location (n`div`2 + 2)     (n+2)    
          --gridArea = let p = [ y , x ] in intercalate " / " (map show (p <> p))
          gridArea = show y <> " / " <> show x <> " / auto / auto" 
          board = L.head state.boardHistory

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
        AddPiece loc piece f -> do
          eitherBoard <- addPiece loc piece <$> _board
          for_ eitherBoard (\b -> handleAction (SetBoard b))
          pure $ f <$> blush eitherBoard
        RemovePiece loc f -> do
          eitherBoard <- removePiece loc <$> _board
          for_ eitherBoard (\b -> handleAction (SetBoard b))
          pure $ f <$> blush eitherBoard
        GetMouseOverLocation f -> do
          maybeLoc <- H.gets (_.mouseOverLocation)
          pure $ f <$> maybeLoc
    , initialize: Just Initialise
    , receive: map SetBoard
    }

  handleAction :: Action -> HalogenM State Action Slots Output m Unit
  handleAction = case _ of
    Initialise -> do
      emitter <- getKeyDownEmitter
      void $ H.subscribe (GlobalOnKeyDown <$> emitter)
    PieceOutput (Piece.Rotated loc rot) -> do
      rotatePieceBy loc rot <$> _board >>= traverse_ \board' ->
        handleAction (SetBoard board')
    PieceOutput (Piece.Dropped initialLocation) -> do
      board <- _board
      maybeDestination <- H.gets (_.mouseOverLocation)

      -- remove  piece
      -- if dst location is set, move to locatin else  not, do nothing
      -- setBoard either way
      let remove = removePiece initialLocation board
      let move dst = getPieceInfo board initialLocation >>= (\p ->
        remove >>= addPiece dst p.piece >>= rotatePieceBy dst p.rotation)

      for_ (maybe remove move maybeDestination) \board' ->
        handleAction (SetBoard board')
    RevertBoard -> do
      tail <- H.gets (_.boardHistory >>> L.tail)
      for_ (L.fromList tail) \neList -> do
        H.modify_ (\s -> s { boardHistory = neList })
        H.raise (NewBoardState (L.head neList))
    SetBoard board -> do
    --todo: cance this action if  oldboard == new board (requires board has Eq instance )
      H.modify_ (\s -> s { boardHistory = L.cons board s.boardHistory })
      H.raise (NewBoardState board)
      log "show board"
    LocationOnDragEnter loc dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
    LocationOnDragOver loc dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
      H.modify_ (_ { mouseOverLocation = Just loc } )
    LocationOnDrop loc dragEvent -> do
      H.modify_ (_ { mouseOverLocation = Just loc } )
      liftEffect $ preventDefault (toEvent dragEvent)
    LocationOnDragLeave _ -> do
      log "drag leave"
      H.modify_ (_ { mouseOverLocation = Nothing } )
    GlobalOnKeyDown ke -> do
      when (key ke == "z" && ctrlKey ke) do
        handleAction RevertBoard

