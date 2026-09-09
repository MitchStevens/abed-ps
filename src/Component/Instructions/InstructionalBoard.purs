module Component.Instructions.InstructionalBoard where

import Prelude

import AppM (AppM)
import Component.Board as Board
import Component.Selector as Selector
import Data.Array as A
import Data.Foldable (any, for_, traverse_)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set as S
import Data.Tuple (Tuple(..), fst)
import Game.Board (Board(..), firstEmptyLocation, standardBoard)
import Game.Direction (allDirections)
import Game.Location (Location, followDirection)
import Game.Piece (Piece, PieceId, getPorts, isWirePiece, pieceLookup)
import Halogen (ClassName(..), Component, ComponentHTML, HalogenM, Slot)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))

-- | A predicate over the board -- `check newBoard oldBoard` -- so an
-- | objective can key off either the current shape or how it just changed.
-- | Once `check` returns true it's marked complete and stays that way (see
-- | `checkObjective`), even if a later board no longer satisfies it.
type Objective =
  { title :: String
  , check :: Board -> Board -> Boolean
  }

type ObjectiveState =
  { title :: String
  , check :: Board -> Board -> Boolean
  , complete :: Boolean
  }

-- | `availablePieces` is optional in spirit: an empty array hides the
-- | palette entirely (see `render`'s `availablePiecesSection`) rather than
-- | showing an empty "Available pieces" list.
type Input =
  { availablePieces :: Array PieceId
  , objectives :: Array Objective
  }

type State =
  { board :: Board
  , availablePieces :: Array PieceId
  , objectives :: Array ObjectiveState
  }

data Action
  = BoardOutput Board.Output
  | SelectorOutput Selector.Output
  | ResetClicked

data Query a

type Output = Void

type Slots =
  ( board :: Slot Board.Query Board.Output Unit
  , selector :: Slot Selector.Query Selector.Output Unit
  )

slot = Proxy :: Proxy "instructionalBoard"

initialState :: Input -> State
initialState { availablePieces, objectives } =
  { board: standardBoard
  , availablePieces
  , objectives: map (\o -> { title: o.title, check: o.check, complete: false }) objectives
  }

component :: Component Query Input Output AppM
component = H.mkComponent { eval, initialState, render }
  where
  eval = H.mkEval H.defaultEval { handleAction = handleAction }

  handleAction :: Action -> HalogenM State Action Slots Output AppM Unit
  handleAction = case _ of
    -- Re-fetch rather than trust an output's own payload: AddPiece only
    -- raises BoardEvent (not NewBoardState), and Clear raises nothing at
    -- all, so reacting to "some Board output happened" and asking the
    -- board directly is the one path that works for every mutation.
    BoardOutput _ ->
      H.request Board.slot unit Board.GetBoard >>= traverse_ \newBoard -> do
        oldBoard <- H.gets _.board
        H.modify_ \s -> s
          { board = newBoard
          , objectives = map (checkObjective newBoard oldBoard) s.objectives
          }

    SelectorOutput output -> case output of
      Selector.AddPiece pieceId ->
        H.request Board.slot unit Board.GetBoard >>= traverse_ \board ->
          for_ (firstEmptyLocation board) \loc ->
            H.request Board.slot unit (Board.AddPiece loc (pieceLookup pieceId))
      Selector.PieceDropped pieceId -> do
        maybeLocation <- H.request Board.slot unit Board.GetMouseOverLocation
        for_ maybeLocation \loc ->
          H.request Board.slot unit (Board.AddPiece loc (pieceLookup pieceId))
      Selector.DoNothing -> pure unit

    -- Board's own Clear query doesn't raise an output, so update our board
    -- snapshot by hand instead of waiting for a BoardOutput that never
    -- comes.
    ResetClicked -> do
      H.tell Board.slot unit Board.Clear
      H.modify_ \s -> s
        { board = standardBoard
        , objectives = map (_ { complete = false }) s.objectives
        }

  checkObjective :: Board -> Board -> ObjectiveState -> ObjectiveState
  checkObjective newBoard oldBoard objective
    | objective.complete = objective
    | objective.check newBoard oldBoard = objective { complete = true }
    | otherwise = objective

  render :: State -> ComponentHTML Action Slots AppM
  render state =
    HH.div
      [ HP.class_ (ClassName "instructional-board") ]
      [ HH.div
          [ HP.class_ (ClassName "instructional-board-main") ]
          ( [ HH.slot Board.slot unit Board.component { board: standardBoard } BoardOutput ]
              <> availablePiecesSection
          )
      , HH.div
          [ HP.class_ (ClassName "instructional-board-objectives") ]
          ( [ HH.p [ HP.class_ (ClassName "objectives-label") ] [ HH.text "Objectives" ] ]
              <> map renderObjective state.objectives
          )
      , HH.button
          [ HP.class_ (ClassName "reset-board-button")
          , HE.onClick (\_ -> ResetClicked)
          ]
          [ HH.text "Reset board" ]
      ]
    where
    availablePiecesSection
      | A.null state.availablePieces = []
      | otherwise =
          [ HH.p [ HP.class_ (ClassName "available-pieces-label") ] [ HH.text "Available pieces" ]
          , HH.slot Selector.slot unit Selector.component
              { availablePieces: S.fromFoldable (map pieceLookup state.availablePieces) }
              SelectorOutput
          ]

    renderObjective :: ObjectiveState -> ComponentHTML Action Slots AppM
    renderObjective objective =
      HH.label
        [ HP.classes ([ ClassName "objective" ] <> if objective.complete then [ ClassName "objective-complete" ] else []) ]
        [ HH.input
            [ HP.type_ HP.InputCheckbox
            , HP.class_ (ClassName "objective-checkbox")
            , HP.checked objective.complete
            , HP.disabled true
            ]
        , HH.span [ HP.class_ (ClassName "objective-title") ] [ HH.text objective.title ]
        ]

-- Objective predicates ----------------------------------------------------

wirePieceLocations :: Board -> Array (Tuple Location Piece)
wirePieceLocations (Board { pieces }) =
  A.mapMaybe asWireLocation (M.toUnfoldable pieces)
  where
  asWireLocation (Tuple loc info)
    | isWirePiece info.piece = Just (Tuple loc info.piece)
    | otherwise = Nothing

madeAWire :: Objective
madeAWire =
  { title: "Create a wire"
  , check: \new _ -> not (A.null (wirePieceLocations new))
  }

-- | Two wire cells sitting next to each other -- dragging across adjacent
-- | tiles (see the Wires instructions above) always connects them, so
-- | adjacency here is the same thing as "one continuous wire" in practice.
madeADoubleLengthWire :: Objective
madeADoubleLengthWire =
  { title: "Create a double-length wire"
  , check: \new _ ->
      let locs = map fst (wirePieceLocations new)
      in any (\l1 -> any (\l2 -> l1 /= l2 && isAdjacent l1 l2) locs) locs
  }
  where
  isAdjacent l1 l2 = A.elem l2 (map (followDirection l1) allDirections)

-- | A plain wire has exactly one input and one output (2 ports total);
-- | once something's dropped against its unused side it grows another
-- | output, so 3+ ports means it's carrying its signal two ways at once.
forkedAWire :: Objective
forkedAWire =
  { title: "Fork an input from another wire"
  , check: \new _ -> any (\(Tuple _ piece) -> M.size (getPorts piece) >= 3) (wirePieceLocations new)
  }
