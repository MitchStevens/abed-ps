-- | The grid a board is laid out on, shared by the interactive board
-- | (`Component.Board.Render`) and the drawn-only one (`Component.BoardView`).
-- |
-- | A board is always laid out on a grid big enough for the largest board,
-- | `maxBoardSize` tracks of slots with a `25fr` port track either side; the
-- | tracks a smaller board doesn't use are `0fr`, so a resize can animate.
module Component.Board.Layout
  ( boardPortSvg
  , emptySideSvg
  , focusPortSvg
  , gridLayoutStyle
  , gridTemplateStyle
  , pieceGridLayout
  , portGridLayout
  , wormholeEndSvg
  , wormholeThreadPath
  )
  where

import Prelude

import Component.Sidebar.BoardSizeSlider as BoardSizeSlider
import Data.Array (elem, replicate)
import Data.Array as A
import Data.Foldable (foldMap, intercalate)
import Data.Int (toNumber)
import Data.Maybe (fromMaybe)
import Data.Number (sqrt)
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection, clockwiseRotation)
import Game.Direction as Direction
import Game.PortInfo (PortInfo)
import Game.Rotation (toDegrees)
import Halogen.HTML (AttrName(..), ClassName(..), HTML)
import Halogen.HTML as HH
import Halogen.Svg.Attributes (Color(..), Transform(..))
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE
import Render.Colours as Colours
import Render.Port (portPath)
import Render.Segment (renderPathWithFill)

-- | Where the slot at `(i, j)` of a board of `size` sits on the grid.
pieceGridLayout :: Int -> Tuple Int Int -> Tuple Int Int
pieceGridLayout size (Tuple i j) = Tuple (center + i) (center + j)
  where center = (BoardSizeSlider.maxBoardSize + 2) `div` 2 - size `div` 2 + 1

-- | Where the board's port on `dir` sits on the grid.
portGridLayout :: CardinalDirection -> Tuple Int Int
portGridLayout = case _ of
  Direction.Left  -> Tuple 1 (m `div` 2 + 1)
  Direction.Right -> Tuple m (m `div` 2 + 1)
  Direction.Up    -> Tuple (m `div` 2 + 1) 1
  Direction.Down  -> Tuple (m `div` 2 + 1) m
  where m = BoardSizeSlider.maxBoardSize + 2

gridTemplateStyle :: Int -> String
gridTemplateStyle size = intercalate "; "
  [ "grid-template-columns: " <> template
  , "grid-template-rows:    " <> template
  ]
  where
    template = intercalate " " [ "25fr", invisibleCells, visibleCells, invisibleCells, "25fr" ]
    visibleCells = intercalate " " (replicate size "100fr")
    invisibleCells = intercalate " " (replicate ((BoardSizeSlider.maxBoardSize - size) `div` 2) "0fr")

gridLayoutStyle :: Tuple Int Int -> String
gridLayoutStyle (Tuple i j) = intercalate ";"
  [ "grid-column: " <> show i
  , "grid-row: "    <> show j
  ]

-- | The board's port on `dir`, drawn to sit in its port track.
boardPortSvg :: forall w i. CardinalDirection -> PortInfo -> HTML w i
boardPortSvg dir portInfo = sideSvg dir 50.0 [ portGlyph portInfo ]

-- | `boardPortSvg`, on the board being edited: with room around it for the
-- | ring that marks a side a wormhole drag can be dropped on.
focusPortSvg :: forall w i. CardinalDirection -> PortInfo -> HTML w i
focusPortSvg dir portInfo = sideSvg dir focusWidth [ targetRing, portGlyph portInfo ]

-- | A side with no port, which a wormhole could use: a dotted outline of the
-- | hole one would make.
emptySideSvg :: forall w i. CardinalDirection -> HTML w i
emptySideSvg dir =
  sideSvg dir focusWidth
    [ targetRing
    , SE.ellipse [ SA.class_ (ClassName "empty-oval"), SA.cx 25.0, SA.cy 12.5, SA.rx 23.0, SA.ry 8.5 ]
    ]

-- | One end of a wormhole: a hole in the margin, with the port's arrow over
-- | it once the piece on that edge offers the port the end needs. The mouth
-- | is an output, so its arrow points away from the board, into the hole; the
-- | tail's comes out of the hole and points into the board. Both are filled
-- | with their own signal, so the tail shows the mouth's from a tick ago.
wormholeEndSvg :: forall w i. CardinalDirection -> { mouth :: Boolean, portInfo :: PortInfo, ready :: Boolean } -> HTML w i
wormholeEndSvg dir { mouth, portInfo, ready } =
  sideSvg dir focusWidth
    [ targetRing
    , SE.g [ SA.class_ (ClassName "wormhole-glyph") ] $
        [ SE.ellipse [ SA.class_ (ClassName "hole-rim"), SA.cx 25.0, SA.cy 11.0, SA.rx 33.0, SA.ry 10.5 ]
        , SE.ellipse [ SA.class_ (ClassName "hole-depth"), SA.cx 25.0, SA.cy 12.4, SA.rx 22.0, SA.ry 6.4 ]
        , SE.ellipse [ SA.class_ (ClassName "hole-floor"), SA.cx 25.0, SA.cy 13.4, SA.rx 11.0, SA.ry 3.0 ]
        ] <> (if ready then [ arrow ] else [])
    ]
  where
    arrow = SE.polygon
      [ SA.points (if mouth then mouthArrow else tailArrow)
      , SA.fill (if portInfo.signal /= zero then Colours.portOn else Colours.portOff)
      , SA.stroke (Named "black")
      , SA.strokeWidth 1.0
      , HH.attr (AttrName "stroke-linejoin") "round"
      ]
    mouthArrow = [ t 10.0 25.0, t 10.0 15.0, t 3.0 15.0, t 25.0 4.0, t 47.0 15.0, t 40.0 15.0, t 40.0 25.0 ]
    tailArrow = [ t 40.0 4.0, t 40.0 14.0, t 47.0 14.0, t 25.0 25.0, t 3.0 14.0, t 10.0 14.0, t 10.0 4.0 ]
    t = Tuple

-- | Ports on the board being edited are drawn this wide (out of a slot's 100),
-- | for the target ring and the wormhole's hole to fit around them.
focusWidth :: Number
focusWidth = 70.0

-- | Hidden unless the side is a wormhole drag's source or a place to drop it
-- | (see `less/board-component.less`).
targetRing :: forall w i. HTML w i
targetRing = SE.ellipse [ SA.class_ (ClassName "target-ring"), SA.cx 25.0, SA.cy 12.0, SA.rx 33.5, SA.ry 11.5 ]

portGlyph :: forall w i. PortInfo -> HTML w i
portGlyph portInfo = renderPathWithFill fill (portPath portInfo)
  where fill = if portInfo.signal /= zero then Colours.portOn else Named "none"

-- | Something drawn in the port track on `dir`, `width` wide. It's drawn for
-- | the top side, in a 50 by 25 box whose bottom edge is the board's (centred
-- | in `width`), then turned to face `dir`. The port track is 25 deep and a
-- | slot 100 across, so `width` is also a percentage of the track's length.
sideSvg :: forall w i. CardinalDirection -> Number -> Array (HTML w i) -> HTML w i
sideSvg dir width content =
  SE.svg
    ( [ viewBox ] <> (if vertical then [] else [ HH.attr (AttrName "style") ("width: " <> show width <> "%") ]) )
    [ SE.g [ SA.transform [ Rotate rot 25.0 12.5 ] ] content ]
  where
    rot = toDegrees (clockwiseRotation Direction.Up dir)
    vertical = dir `elem` [ Direction.Left, Direction.Right ]
    margin = (width - 50.0) / 2.0

    viewBox =
      if vertical
        then SA.viewBox 12.5 (-12.5 - margin) 25.0 width
        else SA.viewBox (-margin) 0.0 width 25.0

-- | The path a wormhole's signal takes from `mouth` to `tail`, round the
-- | middle of the port tracks of a board of `size`, in the grid's own units
-- | (see `gridTemplateStyle`): the short way round, or clockwise between
-- | opposite sides.
wormholeThreadPath :: Int -> CardinalDirection -> CardinalDirection -> String
wormholeThreadPath size mouth tail =
  "M" <> pt (middle mouth) <> foldMap corner (A.range 1 (A.length points - 2)) <> " L" <> pt (middle tail)
  where
    w = 100.0 * toNumber size + 50.0
    o = 12.5
    e = w - o
    c = w / 2.0

    middle = case _ of
      Direction.Up -> Tuple c o
      Direction.Right -> Tuple e c
      Direction.Down -> Tuple c e
      Direction.Left -> Tuple o c

    -- the corner just clockwise of each side
    cornerAfter = case _ of
      Direction.Up -> Tuple e o
      Direction.Right -> Tuple e e
      Direction.Down -> Tuple o e
      Direction.Left -> Tuple o o

    clockwise = [ Direction.Up, Direction.Right, Direction.Down, Direction.Left ]
    position d = fromMaybe 0 (A.elemIndex d clockwise)
    steps = (position tail - position mouth + 4) `mod` 4
    corners
      | steps == 3 = [ cornerAfter tail ]
      | otherwise = A.mapMaybe (\k -> cornerAfter <$> A.index clockwise ((position mouth + k) `mod` 4)) (A.range 0 (steps - 1))
    points = [ middle mouth ] <> corners <> [ middle tail ]

    -- each corner rounded off with a quadratic curve
    corner k = fromMaybe "" do
      Tuple ax ay <- A.index points (k - 1)
      Tuple px py <- A.index points k
      Tuple bx by <- A.index points (k + 1)
      let
        r = 20.0
        la = len (px - ax) (py - ay)
        lb = len (bx - px) (by - py)
        p1 = Tuple (px - (px - ax) / la * r) (py - (py - ay) / la * r)
        p2 = Tuple (px + (bx - px) / lb * r) (py + (by - py) / lb * r)
      pure (" L" <> pt p1 <> " Q" <> pt (Tuple px py) <> " " <> pt p2)

    len dx dy = sqrt (dx * dx + dy * dy)
    pt (Tuple x y) = show x <> "," <> show y
