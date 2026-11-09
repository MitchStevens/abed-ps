module Component.Board.Render
  ( render
  )
  where

import Prelude

import AppM (AppM)
import Component.Board.Layout (emptySideSvg, focusPortSvg, gridLayoutStyle, gridTemplateStyle, pieceGridLayout, portGridLayout, wormholeEndSvg, wormholeThreadPath)
import Component.Board.Types (Action(..), BoardViewKey(..), Slots, State, WormholeRole(..), _board, _zoomed, boardPortInfo, canHoldWormhole, pieceInput, wormholeCandidate, wormholeEnd, zoomInset, zoomTransform)
import Component.Board.ViewModel (CellView(..))
import Component.BoardView as BoardView
import Component.DataAttribute as DA
import Component.Piece.Movement as Piece
import Data.Array (range)
import Data.Array as A
import Data.Foldable (intercalate)
import Data.FunctorWithIndex (mapWithIndex)
import Control.Alternative (guard)
import Data.Int (toNumber)
import Data.Lens ((^.))
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isJust, maybe)
import Data.Tuple (Tuple(..))
import Game.Board (_size, _wormhole, focusIndex, isZoomed)
import Game.Direction (CardinalDirection, allDirections)
import Game.Frame as Frame
import Game.Location (Location(..), location)
import Game.Port (isInput, isOutput)
import Game.PortInfo (hasPortInfo)
import Halogen.HTML (AttrName(..), ClassName(..), ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Elements.Keyed as HK
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Type.Proxy (Proxy(..))

-- | Inside the board's frame, one element (`board-zoom`) is the camera: a zoom
-- | animates its transform, carrying everything inside it along. Inside that
-- | is the grid being looked at and, when zoomed in, the board around it
-- | (`renderContext`), placed so its neighbours show in the grid's margins.
-- |
-- | The camera is keyed by where it's looking, so each level of zoom gets a
-- | new one. That's what lets a zoom in end by jumping straight to the board
-- | inside rather than transitioning back from scaled up, and what plays the
-- | grid's fade in.
-- |
-- | Only the grid's own leaf pieces are interactive; everything else (nested
-- | boards, the context) is a `Component.BoardView`.
render :: State -> ComponentHTML Action Slots AppM
render state =
  HK.div
    [ HP.classes ([ ClassName "board-component" ] <> (if isJust state.wormholeDrag then [ ClassName "dragging-wormhole" ] else []))
    , HE.onDragExit (BoardOnDragExit)
    , HE.onWheel BoardOnWheel
    , HE.onMouseEnter (\_ -> BoardOnMouseEnter)
    , HE.onMouseLeave (\_ -> BoardOnMouseLeave)
    ]
    [ Tuple ("zoom " <> show (focusIndex zoomedBoard)) $ HH.div
      [ HP.class_ (ClassName "board-zoom")
      , HP.style $ intercalate "; "
        [ "transform: " <> maybe "none" (\a -> zoomTransform n a.inset a.location) state.zoomAnimation
        -- see `State.zoomAnimation`
        , if (_.animate <$> state.zoomAnimation) == Just false then "transition: none" else ""
        ]
      ]
      -- the context comes after the grid so anything looking pieces up by
      -- `data-location` finds the grid's first
      ([ grid ] <> A.fromFoldable (renderContext <$> state.contextView))
    ]
  where
    grid =
      HH.div
        [ HP.classes ([ ClassName "board-grid" ] <> (if state.fadeInGrid then [ ClassName "fade-in" ] else []))
        , HP.style (gridTemplateStyle n)
        ] (pieces <> boardSides <> wormholeThread)

    zoomedBoard = state ^. _zoomed
    zoomed = isZoomed zoomedBoard
    n = state ^. _board <<< _size

    -- Drawn behind the grid, transformed so the hole lines up exactly with
    -- the grid's slots, which leaves its neighbours showing in the grid's
    -- port margins. Just after zooming in, the focus's preview stays in the
    -- hole under the grid, fading out as the grid fades in, so the two
    -- crossfade.
    renderContext { parent, hole } =
      HH.div
        [ HP.class_ (ClassName "board-context")
        , HP.style ("transform: " <> zoomTransform parent.size (zoomInset n) hole)
        ]
        [ HH.slot_ (Proxy :: _ "boardView") ContextKey BoardView.component
            { view: parent
            , layout: BoardView.Framed
            , classes: []
            , hole: Just
                { location: hole
                , preview: if state.fadeInGrid then Just state.focusView else Nothing
                }
            }
        ]

    pieces :: Array (ComponentHTML Action Slots AppM)
    pieces =
      renderPieceSlot <$> range 0 (n-1) <*> range 0 (n-1)

    -- the slot being zoomed into or out of right now, whose preview is
    -- shown at full strength while it fills the board
    zoomingInto = _.location <$> state.zoomAnimation

    renderPieceSlot :: Int -> Int -> ComponentHTML Action Slots AppM
    renderPieceSlot i j =
      HH.div
        [ DA.attr DA.location (location i j)
        , HP.class_ (ClassName "piece")
        , HP.style (gridLayoutStyle (pieceGridLayout n (Tuple i j)))
        , HE.onMouseDown (LocationOnMouseDown loc)
        , HE.onMouseOver (LocationOnMouseOver loc)
        , HE.onMouseUp (LocationOnMouseUp loc)
        , HE.onDragEnter (LocationOnDragEnter loc)
        , HE.onDragOver (LocationOnDragOver loc)
        , HE.onDragLeave LocationOnDragLeave
        , HE.onDrop (LocationOnDrop loc)
        , HE.onWheel (LocationOnWheel loc)
        ]
        [ fromMaybe (emptyPieceHTML loc) do
            input <- pieceInput state loc
            pure $ HH.slot Piece.slot loc Piece.component input PieceOutput
        ]
      where
        loc = location i j

    -- Every side gets something to drag a wormhole from or to: its port, an
    -- end of the wormhole, or, if it could hold one, a dotted outline of the
    -- hole it would make. The root's goal ports are the level's inputs and
    -- outputs, so they're clicked to toggle instead.
    boardSides = renderSide <$> allDirections

    renderSide :: CardinalDirection -> ComponentHTML Action Slots AppM
    renderSide dir =
      HH.div
        ( [ HP.classes (ClassName <$> [ "board-port" ] <> sideClasses)
          , DA.attr DA.direction dir
          , HP.style (gridLayoutStyle (portGridLayout dir))
          , HE.onMouseEnter (\_ -> BoardPortOnMouseEnter dir)
          , HE.onMouseLeave (\_ -> BoardPortOnMouseLeave)
          , HE.onMouseDown (BoardPortOnMouseDown dir)
          ]
          -- the board's ports are only the level's inputs at the root
          <> (if zoomed || isJust end || not (hasPortInfo info) then [] else [ HE.onClick (\_ -> ToggleInput dir) ])
        )
        content
      where
        info = Frame.index dir (boardPortInfo state)
        end = wormholeEnd state dir
        canHold = canHoldWormhole state dir
        drag = state.wormholeDrag

        content = case end of
          Just { role } ->
            let mouth = role == Mouth
            in [ wormholeEndSvg dir { mouth, portInfo: info, ready: if mouth then isOutput info.port else isInput info.port } ]
          Nothing
            | hasPortInfo info -> [ focusPortSvg dir info ]
            | canHold -> [ emptySideSvg dir ]
            | otherwise -> []

        sideClasses = A.catMaybes
          [ if isJust end then Just "wormhole-end" else Nothing
          , if isJust end || canHold then Just "draggable" else Nothing
          , if (_.from <$> drag) == Just dir then Just "wormhole-source" else Nothing
          , case drag of
              Just d | not d.existing, isJust (wormholeCandidate state d.from dir) -> Just "wormhole-target"
              _ -> Nothing
          , case drag of
              Just d | d.existing && d.outside && isJust end -> Just "removing"
              _ -> Nothing
          ]

    -- The way a wormhole's signal goes, round the port tracks from mouth to
    -- tail: while one is being dragged to a side, and while the mouse is over
    -- either end of the board's own.
    wormholeThread :: Array (ComponentHTML Action Slots AppM)
    wormholeThread = A.fromFoldable do
      { mouth, tail, valid } <- threadEnds
      let w = 100.0 * toNumber n + 50.0
      pure $ SE.svg
        [ SA.class_ (ClassName "wormhole-thread"), SA.viewBox 0.0 0.0 w w ]
        [ SE.path
            [ SA.class_ (ClassName (if valid then "thread" else "thread invalid"))
            , HH.attr (AttrName "d") (wormholeThreadPath n mouth tail)
            ]
        ]

    threadEnds = case state.wormholeDrag of
      Just d | not d.existing -> do
        over <- state.isMouseOverBoardPort
        guard (over /= d.from)
        pure case wormholeCandidate state d.from over of
          Just w -> { mouth: w.wormholeIn, tail: w.wormholeOut, valid: true }
          Nothing -> { mouth: d.from, tail: over, valid: false }
      _ -> do
        w <- state ^. _board <<< _wormhole
        let hovered = maybe false (\o -> o == w.wormholeIn || o == w.wormholeOut) state.isMouseOverBoardPort
        guard (isJust state.wormholeDrag || hovered)
        pure { mouth: w.wormholeIn, tail: w.wormholeOut, valid: true }

    -- no leaf piece to show: either nothing's there, or a nested board is
    emptyPieceHTML loc@(Location { x, y }) = case M.lookup loc state.focusView.cells of
      Just (NestedView inner) ->
        HH.slot_ (Proxy :: _ "boardView") (NestedKey loc) BoardView.component
          { view: inner
          , layout: BoardView.Bare
          , classes: [ ClassName "nested" ] <> (if zoomingInto == Just loc then [ ClassName "zooming" ] else [])
          , hole: Nothing
          }
      Just TooDeep -> HH.div [ HP.classes [ ClassName "board-view", ClassName "too-deep" ] ] []
      Just (LeafView _) -> HH.div_ []
      Nothing ->
        HH.div
          [ HP.class_ (ClassName "location-text") ]
          [ HH.text (show (x+1) <> "," <> show (y+1)) ]
