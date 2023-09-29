module Component.Board where

import Data.Lens
import Prelude

import Component.Piece as Piece
import Data.Array (intercalate, (..))
import Data.Either (Either(..), blush, either, fromRight)
import Data.Foldable (for_)
import Data.Lens.At (at)
import Data.Lens.Index (ix)
import Data.Lens.Record (prop)
import Data.List (List)
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Monoid (power)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (Board(..), BoardError, PieceInfo, _pieces, _size, addPiece, getPieceInfo, removePiece, rotatePieceBy, standardBoard)
import Game.Location (Location(..), Rotation(..), location, rotation)
import Game.Piece (APiece(..))
import Halogen (ClassName(..), HalogenM(..), HalogenQ)
import Halogen as H
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Web.Event.Event (preventDefault)
import Web.HTML.Common (ClassName(..))
import Web.HTML.Event.DataTransfer as DataTransfer
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent, code, ctrlKey)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = { board :: Maybe Board }

type State = 
  { board :: Board, previousBoards :: List Board, mouseOverLocation :: Maybe Location }

data Query a
  = GetBoard (Board -> a)
  | AddPiece Location APiece (BoardError -> a)
  | RemovePiece Location (BoardError -> a)
  | GetMouseOverLocation (Location -> a)

data Action
  = PieceOutput Piece.Output
  | SetBoard Board
  | OnKeyDown KeyboardEvent
  | Undo
  | LocationOnDragEnter Location DragEvent
  | LocationOnDragOver Location DragEvent
  | LocationOnDragLeave DragEvent
  | LocationOnDrop Location DragEvent

data Output
  = NewBoardState Board

type Slots = ( piece :: H.Slot Piece.Query Piece.Output Location )

_piece = Proxy :: Proxy "piece"

component :: forall m. MonadEffect m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState { board } = { board: fromMaybe standardBoard board, previousBoards: L.Nil , mouseOverLocation: Nothing }

  render :: State -> HH.HTML (H.ComponentSlot Slots m Action) Action
  render state =
    HH.div
      [ HP.id "board-component"
      , HP.style $ intercalate ";" 
        [ "grid-template-columns: " <> (power "1fr " n)
        , "grid-template-rows: " <> (power "1fr " n)
        ]
      , HE.onKeyDown OnKeyDown
      --, HE.onDragExit BoardOnDragLeave
      ]
      -- todo: this is repellant
      do
        j <- 0 .. (n - 1)
        i <- 0 .. (n - 1)
        let loc = location i j
        let eitherPieceInfo = getPieceInfo state.board loc
        let Rotation rot = either (\_ -> rotation 0) (_.rotation) eitherPieceInfo
        pure $ HH.div
          [ HP.class_ (ClassName "piece")
          , HP.style ("transform: rotate("<> (show (rot * 90)) <>"deg)") 
          , HE.onDragEnter (LocationOnDragEnter loc)
          , HE.onDragOver (LocationOnDragOver loc)
          , HE.onDragLeave LocationOnDragLeave
          , HE.onDrop (LocationOnDrop loc)
          ]
          (either (\_ -> [ emptyPieceHTML loc ]) ((_.piece) >>> pieceHTML loc >>> pure) eitherPieceInfo)
    where
      n = state.board ^. _size

      pieceHTML :: Location -> APiece -> HH.HTML (H.ComponentSlot Slots m Action) Action
      pieceHTML location piece =
          HH.slot _piece location Piece.component { piece, location } PieceOutput
      
      emptyPieceHTML :: Location -> HH.HTML (H.ComponentSlot Slots m Action) Action
      emptyPieceHTML loc = HH.text (show loc)


  eval :: HalogenQ Query Action Input ~> HalogenM State Action Slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: handleAction
    , handleQuery: case _ of
        GetBoard f -> do
          board <- H.gets (_.board)
          pure $ Just (f board)
        AddPiece loc piece f -> do
          board <- H.gets (_.board)
          let eitherBoard = addPiece loc piece board
          for_ eitherBoard (\b -> handleAction (SetBoard b))
          pure $ f <$> blush eitherBoard
        RemovePiece loc f -> do
          board <- H.gets (_.board)
          let eitherBoard = removePiece loc board
          for_ eitherBoard (\b -> handleAction (SetBoard b))
          pure $ f <$> blush eitherBoard
        GetMouseOverLocation f -> do
          maybeLoc <- H.gets (_.mouseOverLocation)
          pure $ f <$> maybeLoc
    , initialize: Nothing
    , receive: const Nothing
    }

  handleAction :: Action -> HalogenM State Action Slots Output m Unit
  handleAction = case _ of
    PieceOutput (Piece.Rotated loc rot) -> 
      prop (Proxy :: Proxy "board") <<< _pieces <<< ix loc <<< prop (Proxy :: Proxy "rotation") <>= rot
    PieceOutput (Piece.Dropped initialLocation) -> do
      log "BOARD: received drop"
      board <- H.gets (_.board)
      maybeDestination <- H.gets (_.mouseOverLocation)

      -- remove  piece
      -- if dst location is set, move to locatin else  not, do nothing
      -- setBoard either way
      let remove = removePiece initialLocation board
      let move dst = getPieceInfo board initialLocation >>= (\p ->
        remove >>= addPiece dst p.piece >>= rotatePieceBy dst p.rotation)

      let board' = maybe remove move maybeDestination
      log $ "BOARD: loction " <> show maybeDestination
      log $ "BOARD: board " <> show board'
      for_ board' \b -> do 
        log "BOARD: setting new board"
        handleAction (SetBoard b)
    
    SetBoard board -> do
    --todo: cance this action if  oldboard == new board (requires board has Eq instance )
      log "set ne board"
      H.modify_ (\s -> s { board = board, previousBoards = L.Cons board s.previousBoards })
      H.raise (NewBoardState board)
    Undo -> do
      previousBoards <- L.uncons <$> H.gets (_.previousBoards)
      for_ previousBoards \{ head, tail } ->
        H.modify_ (\s -> s { board = head, previousBoards = tail })
    OnKeyDown e ->
      if code e == "90" && ctrlKey e
        then log "undo"
        else pure unit 

    LocationOnDragEnter loc dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
      log "dragenter"
      --H.modify_ (_ { mouseOverLocation = Just loc } )
    LocationOnDragOver loc dragEvent -> do
      liftEffect $ preventDefault (toEvent dragEvent)
      H.modify_ (_ { mouseOverLocation = Just loc } )
      --liftEffect $ preventDefault (toEvent dragEvent)
    LocationOnDrop loc dragEvent -> do
      log "on drop"
      H.modify_ (_ { mouseOverLocation = Just loc } )
      liftEffect $ preventDefault (toEvent dragEvent)
    LocationOnDragLeave _ -> do
      log "drag leave"
      H.modify_ (_ { mouseOverLocation = Nothing } )

