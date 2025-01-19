module Component.Sidebar.Render where

import Component.Sidebar.Types
import Prelude

import Component (toCssSelectorString)
import Component.DataAttribute as DA
import Component.Piece as Piece
import Component.Rendering.BoardPortDiagram (renderBoardPortDiagram)
import Component.Rendering.Piece (renderPiece)
import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Component.Sidebar.Segment (segment, segmentWithTitle)
import Component.TestRunner as TestRunner
import Data.Array as A
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.Either (Either(..))
import Data.Filterable (eitherBool)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), isJust)
import Data.String (Pattern(..), split)
import Data.Tuple (Tuple(..), fst, snd)
import Effect.Aff.Class (class MonadAff)
import Game.Capacity (toInt)
import Game.Level.Completion (CompletionStatus(..), PortMismatch(..))
import Game.Location (location)
import Game.Message (green, red)
import Game.Piece (PieceId(..), name, pieceVault)
import Game.Port (Port(..))
import Game.Port as Port
import Game.Signal (Base(..), SignalRepresentation(..), printSignal)
import Halogen (ClassName(..), ComponentHTML)
import Halogen.HTML (HTML)
import Halogen.HTML as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

render :: forall m. MonadAff m => State -> ComponentHTML Action Slots m
render state = 
  HH.div 
    [ HP.id "sidebar-component" ]
    [ HH.div_ 
      [ renderTitle
      , renderSubtitle
      , renderDescription state.level.description
      ]
    , renderCompletionStatus
    , renderRunDemonstration
    , if state.level.options.enableBoardSizeChange
        then H.slot BoardSizeSlider.slot unit BoardSizeSlider.component { boardSize: state.boardSize } BoardSizeSliderAction
        else HH.text ""
    , renderUndoRedo
    , renderClear
    , renderSignalRepresentation
    , renderGiveUp
    ]
  where
    renderTitle = HH.h1 [ HP.class_ (ClassName "title") ]  [ HH.text state.level.title ]

    renderSubtitle = case state.level.subtitle of
      Just subtitle ->
        HH.h3
          [ HP.class_ (ClassName "subtitle") ]
          [ HH.text subtitle ]
      Nothing -> HH.text ""


    renderDescription = HH.span [ HP.class_ (ClassName "description") ] <<< A.fromFoldable <<< map asHTML <<< reduceStrings <<< map filterPieceNames <<< L.fromFoldable <<< split (Pattern " ")
      where
        filterPieceNames :: String -> Either String String 
        filterPieceNames = eitherBool \s -> not (M.member (PieceId s) pieceVault)

        reduceStrings :: List (Either String String) -> List (Either String String)
        reduceStrings (Right s1 : Right s2 : sn) = reduceStrings (Right (s1 <> " " <> s2) : sn)
        reduceStrings (Left p   : Right s2 : sn) = Left p : reduceStrings (Right (" " <> s2) : sn)
        reduceStrings (Right s1 : Left p   : sn) = Right (s1 <> " ") : Left p : reduceStrings sn
        reduceStrings (s : sn) = s : reduceStrings sn
        reduceStrings Nil = Nil

        asHTML :: forall p i. Either String String -> HTML p i
        asHTML (Left pieceName) = HH.span [ HP.class_ (ClassName "piece-name") ] [ HH.text pieceName ]
        asHTML (Right text) = HH.text text

    renderCompletionStatus = HH.div
      [ HP.class_ ( ClassName "completion-status" ) ] $
        case state.completionStatus of
          NotStarted -> []
          FailedValidation { description, locations } -> 
            [ HH.h2_ [ HH.text "Restriction!" ]
            , HH.h3_ [ HH.text description ]
            ]
          NotEvaluable boardError -> 
            [ HH.h2_ [ HH.text "Not Evaluable!" ]
            , HH.text ("not evaluable due to: " <> show boardError) ]
          PortMismatch mismatch ->
            [ HH.h2_ [ HH.text "Port mismatch" ]
            , case mismatch of
                PortExpected { direction, expected } -> HH.text $ "You need " <> describePort expected <> " in the " <> show direction <> " direction"
                NoPortExpected { direction, received } -> HH.text $ "Remove the port in the " <> show direction <> "direction"
                IncorrectPortType { direction, capacity, received, expected } -> HH.text $ "Port in the " <> show direction <> " direction should be an " <> show expected 
                IncorrectCapacity { direction, portType, received, expected } -> HH.text $ "Port in the " <> show direction <> " direction should have capacity " <> show (toInt expected)
            ]
          ReadyForTesting ->
            [ HH.h2_ [ HH.text "Testing" ]
            , HH.slot TestRunner.slot unit TestRunner.component { base: state.level.options.base, inputs: NonEmptyArray state.level.testCases, model: state.level.goal } TestRunnerAction
            ]
          Completed ->
            [ HH.h2_ [ HH.text "Level Complete!" ]
            , HH.slot TestRunner.slot unit TestRunner.component { base: state.level.options.base, inputs: NonEmptyArray state.level.testCases, model: state.level.goal } TestRunnerAction
            , HH.button
                [ HP.class_ (ClassName "run-tests-again")
                , HE.onClick (ButtonClicked RunTests) ]
                [ HH.text "Run Tests again"]
            , HH.button
                [ HP.class_ (ClassName "back-to-level-select")
                , HE.onClick (ButtonClicked BackToLevelSelect) ]
                [ HH.text "Back to Level Select "]
            ]
          where
            describePort :: Port -> String
            describePort (Port {portType, capacity}) =
              "an " <> if portType == Port.Input then "input" else "output" <> " of capacity " <> show (toInt capacity)

            renderTestSuccess :: forall p i. Int -> Int -> HTML p i
            renderTestSuccess i n = HH.span_ [ green (show i <> "/" <> show n), HH.text " Sucessful" ]

    renderRunDemonstration = 
      if isJust state.level.demonstration 
        then segment (ClassName "demonstrate") title html
        else HH.text ""
      where
        title = 
          HH.span
            [ HE.onClick (ButtonClicked RunDemonstration) ]
            [ HH.text "Demonstrate" ]
        html = 
          HH.span
            [ HE.onClick (ButtonClicked RunDemonstration) ]
            [ HH.text "Provide guidance" ]

    renderGiveUp = segment (ClassName "give-up") title html
      where
        title = 
          HH.span
            [ HE.onClick (ButtonClicked BackToLevelSelect) ]
            [ HH.text "Resign" ]
        html = 
          HH.span
            [ HE.onClick (ButtonClicked BackToLevelSelect) ]
            [ HH.text "Choose another level" ]

    renderUndoRedo = segment (ClassName "undo-redo") title html
      where
        title =
          HH.span_
            [ HH.span [ HE.onClick (ButtonClicked Undo) ] [ HH.text "Undo" ]
            , HH.text "/"
            , HH.span [ HE.onClick (ButtonClicked Redo) ] [ HH.text "Redo" ]
            ]
        html = 
          HH.span_
            [ HH.span [ HE.onClick (ButtonClicked Undo) ] [ HH.text "Ctrl-Z" ]
            , HH.text "/"
            , HH.span [ HE.onClick (ButtonClicked Redo) ] [ HH.text "Ctrl-Y" ]
            ]
    
    renderClear = segment (ClassName "clear-all") title html
      where
        title =
          HH.span
            [ HE.onClick (ButtonClicked Clear) ]
            [ HH.text "Obliterate" ]
        html =
          HH.span
            [ HE.onClick (ButtonClicked Clear) ]
            [ HH.text "Remove all pieces"]
    
    renderSignalRepresentation =
      segmentWithTitle "Radix" $
        HH.div_ 
          [ signalRepresentationOption Binary "Binary"
          , HH.text " | "
          , signalRepresentationOption Decimal "Decimal"
          , HH.text " | "
          , signalRepresentationOption Hexadecimal "Hexidecimal"
          ]
      where
        signalRepresentationOption :: Base -> String -> ComponentHTML Action Slots m
        signalRepresentationOption base text =
          HH.span
            [ HE.onClick (ButtonClicked (Base base)) ]
            (if state.level.options.base == base
              then [ HH.b_ [ HH.text text ] ]
              else [ HH.text text ])


