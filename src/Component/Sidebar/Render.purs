module Component.Sidebar.Render where

import Component.Sidebar.Types
import Prelude

import Component.DataAttribute as DA
import Component.Piece as Piece
import Component.Rendering.BoardPortDiagram (renderBoardPortDiagram)
import Component.Rendering.Piece (renderPiece)
import Component.TestRunner as TestRunner
import Data.Array as A
import Data.Array.NonEmpty.Internal (NonEmptyArray(..))
import Data.Either (Either(..))
import Data.Filterable (eitherBool)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), split)
import Data.Tuple (Tuple(..), fst, snd)
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
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Properties as HP

render :: forall m. State -> ComponentHTML Action Slots m
render state = 
  HH.div 
    [ HP.id "sidebar-component" ]
    [ renderTitle
    , renderDescription state.problem.description
    , HH.hr_
    , HH.div
      [ HP.classes [ ClassName "completion-status"]
      , DA.attr DA.completionStatus state.completionStatus
      ]
        [ renderCompletionStatus
        , renderBoardPortDiagram state.problem.goal state.boardPorts
        ]
    , renderAvailablePieces
    , HH.br_
    , renderBoardSize
    , renderUndoRedo
    , renderClear
    , renderSignalRepresentation
    , renderGiveUp
    ]
  where
    renderTitle = HH.h2_ [ HH.text state.problem.title ]

    renderDescription = HH.div_ <<< A.fromFoldable <<< map asHTML <<< reduceStrings <<< map filterPieceNames <<< L.fromFoldable <<< split (Pattern " ")
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

    renderAvailablePieces =
      HH.div_
        [ HH.span_
          [ HH.h3_ [ HH.text "Available pieces:"]
          , HH.span [ HP.class_ (ClassName "pieces") ] $
            renderAvailablePiece <$>
              A.nub (A.fromFoldable state.problem.availablePieces)
          ]
        ]

    renderAvailablePiece piece =
      HH.div 
        [ DA.attr DA.availablePiece pieceId
        , HP.draggable true
        , HP.classes [ ClassName "available-piece" ]
        , HE.onDragEnd (PieceOnDrop pieceId)
        , HE.onClick (ButtonClicked (AddPiece pieceId))
        ]
        [ mapActionOverHTML (\_ -> DoNothing) (renderPiece (Piece.initialState { piece, location: location 0 0 }))
        , HH.text (show pieceId) 
        ]
      where
        pieceId = name piece

    renderCompletionStatus = HH.div_
        case state.completionStatus of
          NotStarted -> []
          FailedRestriction restriction -> 
            [ HH.text $ "This level has a special restriction: "
            , HH.b_ [ HH.text restriction.name ]
            , HH.br_
            , HH.text restriction.description
            ]
          NotEvaluable boardError -> 
            [ HH.text ("not evaluable due to: " <> show boardError) ]
          PortMismatch mismatch ->
            [ HH.div_
              [ HH.b_ [ HH.text "Port mismatch: " ]
              , case mismatch of
                  PortExpected { direction, expected } -> HH.text $ "You need " <> describePort expected <> " in the " <> show direction <> " direction"
                  NoPortExpected { direction, received } -> HH.text $ "Remove the port in the " <> show direction <> "direction"
                  IncorrectPortType { direction, capacity, received, expected } -> HH.text $ "Port in the " <> show direction <> " direction should be an " <> show expected 
                  IncorrectCapacity { direction, portType, received, expected } -> HH.text $ "Port in the " <> show direction <> " direction should have capacity " <> show (toInt expected)
              ]
            ]
          ReadyForTesting ->
            [ HH.text "Ready for testing: "
            , HH.slot_ TestRunner.slot unit TestRunner.component { ports: state.boardPorts, base: state.base, inputs: NonEmptyArray state.problem.testCases, model: state.problem.goal }
            ]
          Completed ->
            [ HH.text "Level Complete!"
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

            --renderTestError :: FailedTestCase -> ComponentHTML Action s m
            --renderTestError { testIndex, inputs, expected, recieved } = HH.div_
            --  [ HH.b_ [ HH.text  $ "Test " <> show (testIndex+1) <> " Failed:" ]
            --  , HH.br_
            --  , HH.text "inputs: ", printPorts inputs
            --  , HH.br_
            --  , HH.text "expected: ", printPorts expected
            --  , HH.br_
            --  , HH.text "recieved: ", printReceivedOutputs
            --  ]
            --  where
            --    showTuple (Tuple dir signal) = show dir <> ": " <> printSignal state.signalRepresentation signal

            --    printPorts m = HH.text $
            --      A.intercalate ", " $ map showTuple (M.toUnfoldable m :: Array _)

            --    printReceivedOutputs = HH.span_ $
            --      A.intersperse (HH.text ", ") $ (M.toUnfoldable recieved :: Array _) <#> \tuple ->
            --        if M.lookup (fst tuple) expected == Just (snd tuple)
            --          then green (showTuple tuple)
            --          else red (showTuple tuple)

    renderBoardSize =
      HH.div_
        [ HH.h3_ [ HH.text "Board size" ]
        , HH.div
          [ HP.classes [ ClassName "buttons"] ]
          [ HH.b [ HE.onClick (ButtonClicked DecrementBoardSize) ] [ HH.text "-" ]
          , HH.text (" " <> show state.boardSize <> " ")
          , HH.b [ HE.onClick (ButtonClicked IncrementBoardSize) ] [ HH.text "+" ]
          ]
        ]
    
    renderGiveUp = 
      HH.div
        [ HE.onClick (ButtonClicked BackToLevelSelect) ]
        [ HH.h3_ [ HH.text "Resign" ]
        , HH.div_ [HH.text "Choose another level"]
        ]

    renderUndoRedo = 
      HH.div_
        [ HH.h3_
          [ HH.span [ HE.onClick (ButtonClicked Undo) ] [ HH.text "Undo" ]
          , HH.text "/"
          , HH.span [ HE.onClick (ButtonClicked Redo) ] [ HH.text "Redo" ]
          ]
        , HH.span_
          [ HH.span [ HE.onClick (ButtonClicked Undo) ] [ HH.text "Ctrl-Z" ]
          , HH.text "/"
          , HH.span [ HE.onClick (ButtonClicked Redo) ] [ HH.text "Ctrl-Y" ]
          ]
        ]
    
    renderClear = 
      HH.div
        [ HE.onClick (ButtonClicked Clear) ]
        [ HH.h3_ [ HH.text "Obliterate" ]
        , HH.div_ [HH.text "Remove all pieces"]
        ]
    
    renderSignalRepresentation =
      HH.div_
        [ HH.h3_ [ HH.text "Radix" ]
        , HH.div_ 
          [ signalRepresentationOption Binary "Binary"
          , HH.text " | "
          , signalRepresentationOption Decimal "Decimal"
          , HH.text " | "
          , signalRepresentationOption Hexadecimal "Hexidecimal"
          ]
        ]
      where
        signalRepresentationOption :: Base -> String -> ComponentHTML Action Slots m
        signalRepresentationOption base text =
          HH.span
            [ HE.onClick (ButtonClicked (Base base)) ]
            (if state.base == base
              then [ HH.b_ [ HH.text text ] ]
              else [ HH.text text ])

        
