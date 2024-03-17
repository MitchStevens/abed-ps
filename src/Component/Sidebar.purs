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
import Component.DataAttribute as DA
import Component.DataAttribute as DataAttr
import Component.Piece as Piece
import Component.Rendering.BoardPortDiagram (renderBoardPortDiagram)
import Component.Rendering.Piece (renderPiece)
import Control.Monad.Except (runExceptT)
import Control.Monad.State.Class (gets, modify_, put)
import Data.Array (intersperse)
import Data.Array as A
import Data.Bifunctor (bimap)
import Data.Either (Either(..), blush, hush)
import Data.Filterable (eitherBool)
import Data.Foldable (find, for_, intercalate)
import Data.LimitQueue (LimitQueue)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.String (Pattern(..), split)
import Data.Traversable (for)
import Data.Tuple (Tuple(..), fst, snd)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Capacity (toInt)
import Game.Direction (CardinalDirection)
import Game.Level.Completion (CompletionStatus(..), FailedTestCase, PortMismatch(..))
import Game.Level.Problem (Problem)
import Game.Location (location)
import Game.Message (green, red)
import Game.Piece (PieceId(..), name, pieceVault)
import Game.Port (Port(..))
import Game.Port as Port
import Halogen (ClassName(..), Component, ComponentHTML, ComponentSlot, HalogenM, HalogenQ, liftAff, mkComponent, mkEval, raise)
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Properties as HP
import Halogen.Query.HalogenM (mapAction)
import Type.Proxy (Proxy(..))
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = 
  { problem :: Problem
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  , boardPorts :: Map CardinalDirection Port
  }

type State =
  { problem :: Problem
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  , boardPorts :: Map CardinalDirection Port
  }

data Query a

data Action
  = Initialise Input
  | PieceOnDrop PieceId DragEvent
  | PieceOnClick PieceId MouseEvent
  | BackToLevelSelect
  | IncrementBoardSize
  | DecrementBoardSize
  | RunTestsClicked
  {-
    the sidebar creates little icons using the same piece rendering as pieces. the type of HTML used in piece rendering is:
      `ComponentHTML Piece.Action s m`
    
    When the sidebar renders the little icons, it requires HTML of type
      `ComponentHTML Sidebar.Action s m`
    
    We use the function `mapActionOverHTML :: (a -> a') -> ComponentHTML a s m -> ComponentHTML a' s m` to convert between the two HTML types, but this requires a mapping between between piece actions and sidebar actions. The simplest such function is:
      (\_ -> DoNothing) :: Piece.Action -> Sidebar.Action)
  -}
  | DoNothing

data Output
  = PieceDropped PieceId
  | PieceAdded PieceId
  | BoardSizeIncremented
  | BoardSizeDecremented
  | TestsTriggered

component :: forall m. MonadAff m => Component Query Input Output m
component = mkComponent { eval , initialState , render }
  where
  initialState { problem, boardSize, completionStatus, boardPorts } =
    { problem , completionStatus , boardSize, boardPorts  }

  render :: forall s. State -> ComponentHTML Action s m
  render state = 
    HH.div 
      [ HP.id "sidebar-component" ]
      [ HH.h2_ [ HH.text state.problem.title ]
      , HH.div_
        [ renderDescription state.problem.description ]
      , HH.hr_
      , HH.div
        [ HP.classes [ ClassName "completion-status"]
        , DA.attr DA.completionStatus state.completionStatus
        ]
          [ renderCompletionStatus
          , renderBoardPortDiagram state.problem.goal state.boardPorts
          ]
      , HH.h3_ [ HH.text "Available pieces:"]
      , HH.span [ HP.class_ (ClassName "available-pieces") ] $
          renderAvailablePiece <$>
            A.nub state.problem.availablePieces
      , HH.br_
      , renderBoardSize
      , renderGiveUp
      ]
    where



      --renderAvailablePiece :: forall p. PieceId -> HTML (ComponentSlot Slots) Action
      renderAvailablePiece piece =
          let input = { piece, location: location 0 0, portStates: M.empty }
              pieceId = name piece
          in HH.div 
            [ attr DataAttr.availablePiece (name piece)
            , HP.draggable true
            , HP.classes [ ClassName "available-piece" ]
            , HE.onDragEnd (PieceOnDrop pieceId)
            , HE.onClick (PieceOnClick pieceId)
            ]
            [ mapActionOverHTML (\_ -> DoNothing) (renderPiece (Piece.initialState { piece, location: location 0 0 }))
            , HH.text (show pieceId) 
            ]

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
                [ HH.b_ [ HH.text "Port mismatch:" ]
                , case mismatch of
                    PortExpected { direction, expected } -> HH.text $ "You need " <> describePort expected <> " in the " <> show direction <> " direction"
                    NoPortExpected { direction, received } -> HH.text $ "Remove the port in the " <> show direction <> "direction"
                    IncorrectPortType { direction, capacity, received, expected } -> HH.text $ "Port in the " <> show direction <> " direction should be an " <> show expected 
                    IncorrectCapacity { direction, portType, received, expected } -> HH.text $ "Port in the " <> show direction <> " direction should have capacity " <> show (toInt expected)
                ]
              ]
            ReadyForTesting ->
              [ HH.text "Ready for testing: "
              , HH.button
                  [ HP.class_ (ClassName "ready-for-testing")
                  , HE.onClick (\_ -> RunTestsClicked) ]
                  [ HH.text "Run Tests"]
              ]
            RunningTest { testIndex, numTests } ->
              [ HH.b_ [ HH.text "Running tests" ]
              , HH.br_
              , HH.text $ "Running "<> show (testIndex+1) <>"/"<> show numTests
              ]
            FailedTestCase failedTestCase ->
              [ renderTestError failedTestCase ]
            Completed ->
              [ HH.text "Level Complete!"
              , HH.button
                  [ HP.class_ (ClassName "run-tests-again")
                  , HE.onClick (\_ -> RunTestsClicked) ]
                  [ HH.text "Run Tests again"]
              , HH.button
                  [ HP.class_ (ClassName "back-to-level-select")
                  , HE.onClick (\_ -> BackToLevelSelect) ]
                  [ HH.text "Back to Level Select "]
              ]
            where
              describePort :: Port -> String
              describePort (Port {portType, capacity}) =
                "an " <> if portType == Port.Input then "input" else "output" <> " of capacity " <> show (toInt capacity)


              renderTestSuccess :: Int -> Int -> PlainHTML
              renderTestSuccess i n = HH.span_ [ green (show i <> "/" <> show n), HH.text " Sucessful" ]

              renderTestError :: FailedTestCase -> ComponentHTML Action s m
              renderTestError { testIndex, inputs, expected, recieved } = HH.div_
                [ HH.b_ [ HH.text  $ "Test " <> show (testIndex+1) <> " Failed:" ]
                , HH.br_
                , HH.text "inputs: ", printPorts inputs
                , HH.br_
                , HH.text "expected: ", printPorts expected
                , HH.br_
                , HH.text "recieved: ", printReceivedOutputs
                ]
                where
                  showTuple (Tuple dir signal) = show dir <> ": " <> show signal

                  printPorts m = HH.text $
                    intercalate ", " $ map showTuple (M.toUnfoldable m :: Array _)

                  printReceivedOutputs = HH.span_ $
                    intersperse (HH.text ", ") $ (M.toUnfoldable recieved :: Array _) <#> \tuple ->
                      if M.lookup (fst tuple) expected == Just (snd tuple)
                        then green (showTuple tuple)
                        else red (showTuple tuple)


      renderBoardSize =
        HH.div
          [ HP.classes [ ClassName "board-size" ]]
          [ HH.b_ [ HH.text "Board size" ]
          , HH.div
            [ HP.classes [ ClassName "buttons"] ]
            [ HH.button [ HE.onClick (\_ -> DecrementBoardSize) ] [ HH.text "-" ]
            , HH.text (" " <> show state.boardSize <> " ")
            , HH.button [ HE.onClick (\_ -> IncrementBoardSize) ] [ HH.text "+" ]
            ]
          ]
      
      renderGiveUp = 
        HH.div
          [ HP.classes [ClassName "give-up"] ]
          [ HH.b_ [ HH.text "I give up" ]
          , HH.button [ HE.onClick (\_ -> BackToLevelSelect) ] [HH.text "Choose another level"]
          ]

  eval :: forall slots. HalogenQ Query Action Input ~> HalogenM State Action slots Output m
  eval = mkEval
    { finalize: Nothing
    , handleAction: case _ of
        Initialise input -> put (initialState input)
        PieceOnDrop piece _ -> do
          raise (PieceDropped piece)
        PieceOnClick piece _ ->
          raise (PieceAdded piece)
        BackToLevelSelect -> do
          navigateTo LevelSelect
        IncrementBoardSize -> raise BoardSizeIncremented
        DecrementBoardSize -> raise BoardSizeDecremented
        RunTestsClicked -> raise TestsTriggered
        DoNothing -> pure unit
    , handleQuery: \_ -> pure Nothing
    , initialize: Nothing
    , receive: Just <<< Initialise -- :: input -> Maybe action
    }

--renderError :: PieceSpecMismatch -> PlainHTML
--renderError err = HH.div_ $ 
--    case r.received, r.expected of
--      Just received, Nothing -> [ HH.text "Remove the ", renderPort received, HH.text " in the ", renderDirection r.dir, HH.text " direction."]
--      Nothing, Just expected -> [ HH.text "You need an ", renderPort expected, HH.text " in the ", renderDirection r.dir, HH.text " direction"]
--      _,  _ -> [ HH.text "ERROR" ]
--  DifferentPort r ->
--    [ HH.text "You need an ", renderPort r.expected, HH.text " in the ", renderDirection r.dir, HH.text " direction."]
--  FailedRestriction r ->
--    [ HH.text ("Failed predicate " <> r.name <> " with description " <> r.description) ]
--  where
--    renderPort port = HH.span [ HP.class_ (ClassName "port")]
--      [ HH.text (if isInput port then "Input" else "Output") ]
--
--    renderDirection dir = HH.span [ HP.class_ (ClassName "direction")]
--      [ HH.text (show dir) ]

-- adds markup
renderDescription :: forall p i. String -> HTML p i
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

    asHTML :: Either String String -> HTML p i
    asHTML (Left pieceName) = HH.span [ HP.class_ (ClassName "piece-name") ] [ HH.text pieceName ]
    asHTML (Right text) = HH.text text

