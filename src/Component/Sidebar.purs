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
import Component.Piece as Piece
import Component.Piece.Render (renderPiece)
import Control.Monad.Except (runExceptT)
import Data.Array as A
import Data.Bifunctor (bimap)
import Data.Either (Either(..), blush, hush)
import Data.Foldable (find, for_)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Traversable (for)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Class.Console (log)
import Game.Board (Board(..))
import Game.GameEvent (pieceId)
import Game.Level.Completion (CompletionStatus(..))
import Game.Level.Problem (Problem)
import Game.Location (location)
import Game.Piece (APiece(..), PieceId(..), name, pieceLookup)
import Game.Piece.Port (isInput)
import Halogen (ClassName(..), ComponentSlot, HalogenM, HalogenQ, ComponentHTML, liftAff)
import Halogen as H
import Halogen.HTML (HTML, PlainHTML, fromPlainHTML)
import Halogen.HTML as HH
import Halogen.HTML.Extras (mapActionOverHTML)
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Query.HalogenM (mapAction)
import Type.Proxy (Proxy(..))
import Web.HTML.Event.DragEvent (DragEvent, dataTransfer, toEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input = 
  { problem :: Problem
  , boardSize :: Int
  }

type State =
  { problem :: Problem
  , completionStatus :: CompletionStatus
  , boardSize :: Int
  }

data Query a
  = SetCompletionStatus CompletionStatus
  | SetBoardSize Int

data Action
  = PieceOnDrop PieceId DragEvent
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

component :: forall m. MonadAff m => H.Component Query Input Output m
component = H.mkComponent { eval , initialState , render }
  where
  initialState { problem, boardSize } =
    { problem
    , completionStatus: NotStarted
    , boardSize }

  render state = 
    HH.div 
      [ HP.id "sidebar-component" ]
      [ HH.h2_ [ HH.text state.problem.title ]
      , HH.h3_ [ HH.text state.problem.description ]
      , renderCompletionStatus -- maybe problemComplete renderError state.error
      , HH.h3_ [ HH.text "Available pieces:"]
      , HH.span [ HP.class_ (ClassName "pieces") ] $
        A.fromFoldable state.problem.pieceSet <#> renderAvailablePiece
      , HH.h3_ [ HH.text "Board size" ]
      , HH.span_
        [ HH.button [ HE.onClick (\_ -> DecrementBoardSize) ] [ HH.text "-" ]
        , HH.text (show state.boardSize)
        , HH.button [ HE.onClick (\_ -> IncrementBoardSize) ] [ HH.text "+" ]
        ]
      ]
    where

      --renderAvailablePiece :: forall p. PieceId -> HTML (ComponentSlot Slots) Action
      renderAvailablePiece pieceId =
          let input = { piece: pieceLookup pieceId, location: location 0 0, portStates: M.empty }
          in HH.div 
            [ attr DataAttr.availablePiece pieceId
            , HP.draggable true
            , HP.classes [ ClassName "available-piece" ]
            , HE.onDragEnd (PieceOnDrop pieceId)
            , HE.onClick (PieceOnClick pieceId)
            ]
            --[ HH.slot (Proxy :: Proxy "piece") pieceId Piece.component input PieceOutput
            [ mapActionOverHTML (\_ -> DoNothing) (renderPiece (Piece.defaultState (pieceLookup pieceId)))
            , HH.text (show pieceId) 
            ]

      renderCompletionStatus = case state.completionStatus of
        NotStarted ->
          HH.div_ []
        FailedRestriction restriction ->
          HH.text "failed restriction, render later"
        NotEvaluable boardError -> 
          HH.text ("not evaluable due to: " <> show boardError)
        PortMismatch mismatch ->
          HH.text "port mismatch, render later"
        ReadyForTesting ->
          HH.span_
            [ HH.text "ports are looking good: "
            , HH.button
                [ HE.onClick (\_ -> RunTestsClicked) ]
                [ HH.text "run tests"]
            ]
        FailedTestCase testCase ->
          HH.text "failed test case, render later"
        Completed ->
          HH.div_
            [ HH.text "game completed!"
            , HH.button
                [ HE.onClick (\_ -> BackToLevelSelect) ]
                [ HH.text "new level"]
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
        BackToLevelSelect -> do
          navigateTo LevelSelect
        IncrementBoardSize -> H.raise BoardSizeIncremented
        DecrementBoardSize -> H.raise BoardSizeDecremented
        RunTestsClicked -> H.raise TestsTriggered
        DoNothing -> pure unit
    , handleQuery: case _ of
        SetCompletionStatus completionStatus -> do
          H.modify_ $ _ { completionStatus = completionStatus }
          pure Nothing
        --IsProblemSolved board f -> do
        --  problemDescription <- H.gets (_.problem)
        --  isSolved <- liftAff $ runExceptT $ solvedBy problemDescription board
        --  H.modify_ (_ { error = blush isSolved })
        --  pure (f <$> blush isSolved)
        SetBoardSize boardSize -> do
          H.modify_ $ _ { boardSize = boardSize }
          pure Nothing
    , initialize: Nothing
    , receive: const Nothing -- :: input -> Maybe action
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
