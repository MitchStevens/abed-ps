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
import Web.Event.Event (preventDefault)
import Web.HTML (Location)
import Web.HTML.Event.DataTransfer as DataTransfer
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = ProblemDescription

type State =
  { problem :: ProblemDescription
  , error :: Maybe PieceSpecMismatch
  , selectedPiece :: Maybe APiece
  }

data Query a
  = IsProblemSolved Board (Either PieceSpecMismatch Boolean -> a)
  | GetSelectedPiece (APiece -> a)

data Action
  = PieceOnDrop APiece DragEvent
  | PieceOnDragLeave DragEvent

data Output = PieceDropped APiece

component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState problem = { problem, error: Nothing, selectedPiece: Nothing }

  render { problem, error, selectedPiece } = 
    HH.div 
      [ HP.class_ (ClassName "sidebar-component")
      ]
      [ HH.h2_ [ HH.text problem.title ]
      , HH.h3_ [ HH.text problem.description ]
      , maybe (HH.text "problem complete") renderError error
      , HH.h3_ [ HH.text "Available pieces:"]
      , HH.div [ HP.class_ (ClassName "pieces") ] $
        A.fromFoldable problem.pieceSet <#> \piece ->
          HH.div 
            [ HP.draggable true
            , HE.onDragEnd (PieceOnDrop piece)
            , HE.onDragLeave PieceOnDragLeave
            ]
            [HH.text (name piece)]
      ]
  
  renderError = HH.div_ <<< case _ of
    DifferentPortConfiguration r ->
      case r.received, r.expected of
        Just received, Nothing -> [ HH.text "Remove the ", renderPort received, HH.text " in the ", renderDirection r.dir, HH.text " direction."]
        Nothing, Just expected -> [ HH.text "You need an ", renderPort expected, HH.text " in the ", renderDirection r.dir, HH.text " direction"]
        _,  _ -> [ HH.text "ERROR" ]
    DifferentPort r ->
      [ HH.text "You need an ", renderPort r.expected, HH.text " in the ", renderDirection r.dir, HH.text " direction."]
    FailedTestCase r ->
      [ HH.text "For the inputs ", renderSignals r.inputs, HH.text " your solution should output ", renderSignals r.expected, HH.text ", not ", renderSignals r.received , HH.text "." ]
    FailedRestriction str -> [ HH.text ("Failed predicate " <> str) ]
  
  renderPort port = HH.span [ HP.class_ (ClassName "port")]
    [ HH.text (if isInput port then "Input" else "Output") ]

  renderDirection dir = HH.span [ HP.class_ (ClassName "direction")]
    [ HH.text (show dir) ]
  
  renderSignals signals = HH.text (show signals)



  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = H.mkEval
    { finalize: Nothing
    , handleAction: case _ of
        PieceOnDrop piece dragEvent -> do
          H.raise (PieceDropped piece)
        PieceOnDragLeave dragEvent -> do
          log "LEFT TARGT!"
    , handleQuery: case _ of
        IsProblemSolved board f -> do
          problemDescription <- H.gets (_.problem)
          isSolved <- liftAff $ runExceptT $ solvedBy problemDescription board
          H.modify_ (_ { error = blush isSolved })
          pure (Just (f isSolved))
        GetSelectedPiece f -> do
          maybePiece <- H.gets (_.selectedPiece)
          pure $ f <$> maybePiece
    , initialize: Nothing
    , receive: const Nothing -- :: input -> Maybe action
    }
