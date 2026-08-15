module Component.Sidebar.Render where

import Component.Sidebar.Types
import Prelude

import Component (toCssSelectorString)
import Component.CardStack as CardStack
import Component.DataAttribute as DA
import Component.Feedback as Feedback
import Component.Piece.Render (renderPiece)
import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Component.Sidebar.Segment (segment, segmentWithTitle)
import Data.Array as A
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.Either (Either(..))
import Data.Filterable (eitherBool)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
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
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Properties as HP

render :: forall m. MonadAff m => State -> ComponentHTML Action Slots m
render state = 
  HH.div 
    [ HP.id "sidebar-component" ]
    [ renderLevelInfo
    , renderCardStack
    , renderSidebarControls
    , renderFeedback
    ]
  where

    renderLevelInfo = HH.div [ HP.class_ (ClassName "level-info")]
      [ HH.h1 [ HP.class_ (ClassName "title") ]  [ HH.text state.problem.title ]
      , maybe (HH.text "") (\subtitle -> HH.h3 [ HP.class_ (ClassName "subtitle") ] [ HH.text subtitle ]) state.problem.subtitle
      , HH.span [ HP.class_ (ClassName "description")] [ markupDescription state.problem.description ]
      ]

    renderCardStack = HH.div
      [ HP.class_ ( ClassName "card-stack") ]
      [ HH.slot CardStack.slot unit CardStack.component unit CardStackAction ]

    -- Render-less (see Component.Feedback) -- mounted purely so its eval
    -- loop runs and it can push cards into CardStack via Sidebar.
    renderFeedback = HH.slot Feedback.slot unit Feedback.component feedbackInput FeedbackAction
      where
        feedbackInput =
          { completionStatus: state.completionStatus
          , base: state.base
          , goal: state.problem.goal
          , testInputs: NonEmptyArray state.problem.testCases
          }

    -- Everything below the card stack, pinned to the bottom of the sidebar
    -- (see `#sidebar-component .sidebar-controls`'s `margin-top: auto`) so
    -- the card stack -- the only source of textual feedback -- gets the
    -- space in between.
    renderSidebarControls = HH.div
      [ HP.class_ ( ClassName "sidebar-controls") ]
      [ renderRunDemonstration
      , H.slot BoardSizeSlider.slot unit BoardSizeSlider.component { boardSize: state.boardSize } BoardSizeSliderAction
      , renderUndoRedo
      , renderClear
      --, renderSignalRepresentation
      , renderGiveUp
      ]

    --renderBoardSize =
    --  HH.div
    --    [ HP.class_ (ClassName "board-size") ]
    --    [ HH.h3_ [ HH.text ("Board size: " <> show state.boardSize) ]
    --    , HH.input
    --      [ HP.type_ HP.InputRange
    --      , HP.list "values"
    --      , HP.min 3.0
    --      , HP.max 9.0
    --      , HP.step (HP.Step 2.0)
    --      , HP.value (show state.boardSize)
    --      , HE.onInput (InputFieldChanged (SetBoardSize Nothing))
    --      ]
    --    , HH.datalist
    --      [ HP.id "values" ]
    --      [ HH.option [ HP.value "3" ] []
    --      , HH.option [ HP.value "5" ] []
    --      , HH.option [ HP.value "7" ] []
    --      , HH.option [ HP.value "9" ] []
    --      ]
    --    ]

    renderRunDemonstration = segment (ClassName "demonstrate") title html
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
            (if state.base == base
              then [ HH.b_ [ HH.text text ] ]
              else [ HH.text text ])

-- markup the description so piece-names look fancy
markupDescription :: forall p i. String -> HTML p i
markupDescription = HH.span_ <<< A.fromFoldable <<< map asHTML <<< reduceStrings <<< map filterPieceNames <<< L.fromFoldable <<< split (Pattern " ")
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