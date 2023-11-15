module Component.Sidebar where
{-
  responsible for:
  - description of level
  - confirming that piece fits the port spec
  - starting single tests
  - running randomised tests 
  - exiting level
-}

import Prelude

import Capability.Navigate (Route(..), navigateTo)
import Component.DataAttribute (attr)
import Component.DataAttribute as DataAttr
import Control.Monad.Except (runExceptT)
import Data.Array as A
import Data.Either (Either, blush, hush)
import Data.Foldable (find, for_)
import Data.Maybe (Maybe(..), maybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (Board(..))
import Game.Piece (APiece(..), PieceId(..), name)
import Game.Piece.Port (isInput)
import Game.ProblemDescription (PieceSpecMismatch(..), ProblemDescription, solvedBy)
import Halogen (ClassName(..), HalogenM, HalogenQ, liftAff)
import Halogen as H
import Halogen.HTML (HTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = 
  { problem :: ProblemDescription
  , boardSize :: Int
  }

type State =
  { problem :: ProblemDescription
  , error :: Maybe PieceSpecMismatch
  , boardSize :: Int
  }

data Query a
  = IsProblemSolved Board (PieceSpecMismatch -> a)
  | SetBoardSize Int

data Action
  = PieceOnDrop PieceId DragEvent
  | PieceOnClick PieceId MouseEvent
  | BackToLevelSelect MouseEvent
  | IncrementBoardSize
  | DecrementBoardSize

data Output
  = PieceDropped PieceId
  | PieceAdded PieceId
  | BoardSizeIncremented
  | BoardSizeDecremented

component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState { problem, boardSize }= { problem, error: Nothing, boardSize }

  render state = 
    HH.div 
      [ HP.class_ (ClassName "sidebar-component")
      ]
      [ HH.h2_ [ HH.text state.problem.title ]
      , HH.h3_ [ HH.text state.problem.description ]
      , maybe problemComplete renderError state.error
      , HH.h3_ [ HH.text "Available pieces:"]
      , HH.div [ HP.class_ (ClassName "pieces") ] $
        A.fromFoldable state.problem.pieceSet <#> renderAvailablePiece
      , HH.h3_ [ HH.text "Board size" ]
      , HH.span_
        [ HH.button [ HE.onClick (\_ -> DecrementBoardSize) ] [ HH.text "-" ]
        , HH.text (show state.boardSize)
        , HH.button [ HE.onClick (\_ -> IncrementBoardSize) ] [ HH.text "+" ]
        ]
      ]

  renderAvailablePiece :: forall p. PieceId -> HTML p Action
  renderAvailablePiece pieceId =
    HH.div 
      [ attr DataAttr.availablePiece pieceId
      , HP.draggable true
      , HP.classes [ ClassName "available-piece" ]
      , HE.onDragEnd (PieceOnDrop pieceId)
      , HE.onClick (PieceOnClick pieceId)
      ]
      [HH.text (show pieceId)]

  problemComplete = HH.span_
    [ HH.text "problem complete"
    , HH.button
        [ HE.onClick BackToLevelSelect ]
        [ HH.text "solve another"]
    ]
  

  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: case _ of
        PieceOnDrop piece _ -> do
          log "piece dropped!"
          H.raise (PieceDropped piece)
        PieceOnClick piece _ ->
          H.raise (PieceAdded piece)
        BackToLevelSelect _ -> do
          navigateTo PuzzleSelect
        IncrementBoardSize -> H.raise BoardSizeIncremented
        DecrementBoardSize -> H.raise BoardSizeDecremented
    , handleQuery: case _ of
        IsProblemSolved board f -> do
          problemDescription <- H.gets (_.problem)
          isSolved <- liftAff $ runExceptT $ solvedBy problemDescription board
          H.modify_ (_ { error = blush isSolved })
          pure (f <$> blush isSolved)
        SetBoardSize boardSize -> do
          H.modify_ $ _ { boardSize = boardSize }
          pure Nothing
    , initialize: Nothing
    , receive: const Nothing -- :: input -> Maybe action
    }

renderError :: forall r i. PieceSpecMismatch -> HTML r i
renderError err = HH.div_ $ case err of
  DifferentPortConfiguration r ->
    case r.received, r.expected of
      Just received, Nothing -> [ HH.text "Remove the ", renderPort received, HH.text " in the ", renderDirection r.dir, HH.text " direction."]
      Nothing, Just expected -> [ HH.text "You need an ", renderPort expected, HH.text " in the ", renderDirection r.dir, HH.text " direction"]
      _,  _ -> [ HH.text "ERROR" ]
  DifferentPort r ->
    [ HH.text "You need an ", renderPort r.expected, HH.text " in the ", renderDirection r.dir, HH.text " direction."]
  FailedTestCase r ->
    [ HH.text "For the inputs ", renderSignals r.inputs, HH.text " your solution should output ", renderSignals r.expected, HH.text ", not ", renderSignals r.received , HH.text "." ]
  FailedRestriction r ->
    [ HH.text ("Failed predicate " <> r.name <> " with description " <> r.description) ]
  where
    renderPort port = HH.span [ HP.class_ (ClassName "port")]
      [ HH.text (if isInput port then "Input" else "Output") ]

    renderDirection dir = HH.span [ HP.class_ (ClassName "direction")]
      [ HH.text (show dir) ]

    renderSignals signals = HH.text (show signals)