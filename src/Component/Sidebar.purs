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

import Capability.Navigate (class Navigate, Route(..), navigateTo)
import Control.Monad.Except (runExceptT)
import Data.Array as A
import Data.Either (Either, blush, hush)
import Data.Foldable (find, for_)
import Data.Maybe (Maybe(..), maybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (Board(..))
import Game.Piece (APiece(..), isInput, name)
import Game.ProblemDescription (PieceSpecMismatch(..), ProblemDescription, solvedBy)
import Halogen (ClassName(..), HalogenM, HalogenQ, liftAff)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import IO.Progress (savePuzzleProgress)
import Web.Event.Event (preventDefault)
import Web.HTML (Location)
import Web.HTML.Event.DataTransfer as DataTransfer
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = ProblemDescription

type State =
  { problem :: ProblemDescription
  , error :: Maybe PieceSpecMismatch
  }

data Query a
  = IsProblemSolved Board (PieceSpecMismatch -> a)
--  | GetSelectedPiece (APiece -> a)

data Action
  = PieceOnDrop APiece DragEvent
  | PieceOnClick APiece MouseEvent
  | BackToLevelSelect MouseEvent

data Output
  = PieceDropped APiece
  | PieceAdded APiece
  -- | ProblemSolved

component :: forall m. MonadAff m => Navigate m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState problem = { problem, error: Nothing }

  render { problem, error } = 
    HH.div 
      [ HP.class_ (ClassName "sidebar-component")
      ]
      [ HH.h2_ [ HH.text problem.title ]
      , HH.h3_ [ HH.text problem.description ]
      , maybe problemComplete renderError error
      , HH.h3_ [ HH.text "Available pieces:"]
      , HH.div [ HP.class_ (ClassName "pieces") ] $
        A.fromFoldable problem.pieceSet <#> \piece ->
          HH.div 
            [ HP.draggable true
            , HE.onDragEnd (PieceOnDrop piece)
            , HE.onDoubleClick (PieceOnClick piece)
            ]
            [HH.text (name piece)]
      , HH.h3_ [ HH.text "Board size" ]
      , HH.span_
        [ HH.button_ [ HH.text "-" ]
        , HH.text "3"
        , HH.button_ [ HH.text "+" ]
        ]
      ]
  

  problemComplete = HH.span_
    [ HH.text "problem complete"
    , HH.button
        [ HE.onClick BackToLevelSelect ]
        [ HH.text "solve another"]
    ]
  

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
  
  renderPort port = HH.span [ HP.class_ (ClassName "port")]
    [ HH.text (if isInput port then "Input" else "Output") ]

  renderDirection dir = HH.span [ HP.class_ (ClassName "direction")]
    [ HH.text (show dir) ]
  
  renderSignals signals = HH.text (show signals)



  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: case _ of
        PieceOnDrop piece _ -> do
          H.raise (PieceDropped piece)
        PieceOnClick piece _ ->
          H.raise (PieceAdded piece)
        BackToLevelSelect _ -> do
          navigateTo PuzzleSelect
    , handleQuery: case _ of
        IsProblemSolved board f -> do
          problemDescription <- H.gets (_.problem)
          isSolved <- liftAff $ runExceptT $ solvedBy problemDescription board
          H.modify_ (_ { error = blush isSolved })
          pure (f <$> blush isSolved)
        --GetSelectedPiece f -> do
        --  maybePiece <- H.gets (_.selectedPiece)
        --  pure $ f <$> maybePiece
    , initialize: Nothing
    , receive: const Nothing -- :: input -> Maybe action
    }
