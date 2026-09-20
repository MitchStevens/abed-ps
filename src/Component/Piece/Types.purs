module Component.Piece.Types
  ( Action(..)
  , Input
  , Output(..)
  , Query(..)
  , State
  , _portStates
  , boardInputs
  , initialState
  , slot
  )
  where

import Prelude

import Component.Piece.Outline as Outline
import Data.FunctorWithIndex (mapWithIndex)
import Data.Lens (Lens', view)
import Data.Lens.Record (prop)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Tuple (Tuple(..))
import Game.Frame (Frame)
import Game.Board (Board, RelativeEdge, _pieces)
import Game.Board.Compiled (CompiledBoard(..), PieceIndex, PortIndex, portInfoAt)
import Game.Direction (CardinalDirection)
import Game.Location (Location(..), location)
import Game.Frame as Frame
import Game.Piece (Piece(..), getPorts)
import Game.Port (hasPort)
import Game.PortInfo (PortInfo)
import Game.Rotation (Rotation(..), rotation)
import Game.Signal (Signal)
import Halogen as H
import Type.Proxy (Proxy(..))
import Web.HTML.Event.DragEvent (DragEvent)
import Web.UIEvent.KeyboardEvent (KeyboardEvent)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input =
  { piece :: Piece
  , location :: Location
  , rotation :: Rotation
  , portStates :: Frame PortInfo
  }

type State =
  { piece :: Piece
  , location :: Location
  , rotation  :: Rotation
  , portStates :: Frame PortInfo
  , isRotating :: Maybe
    { initialClickPosition :: Tuple Number Number
    , currentRotation :: Number
    }
  , isDragging :: Boolean
  }

data Query a
  -- = SetPortStates (Frame PortInfo) a
  -- | SetPiece Piece a 
  -- | SetRotation Rotation a

data Action
  = Initialise
  | Finalise
  | Receive Input
  | OnDrop Location DragEvent
  | OnDrag DragEvent
  | OnMouseDown MouseEvent
  | OnMouseMove MouseEvent
  | OnMouseUp MouseEvent
  | OnAuxClick MouseEvent
  | PortOnMouseEnter CardinalDirection
  | PortOnMouseLeave
  | OnKeyDown KeyboardEvent

data Output
  = Rotated Location Rotation
  | Dropped Location
  | RemoveThis Location
  | NewMultimeterFocus (Maybe {info :: PortInfo, relativeEdge :: RelativeEdge })

type ChildSlots = ( outline :: H.Slot Outline.Query Void Unit )

-- the subset of state used for rendering (for memoization)
type RenderState =
  { piece :: Piece
  , location :: Location
  , rotation  :: Rotation
  , portStates :: Frame PortInfo
  , isRotating :: Maybe
    { initialClickPosition :: Tuple Number Number
    , currentRotation :: Number
    }
  }

slot = Proxy :: Proxy "piece"

initialState :: Input -> State
initialState { piece, rotation, location, portStates } =
  { piece
  , location
  , rotation
  , portStates
  , isRotating: Nothing
  , isDragging: false
  }

_portStates :: Lens' State (Frame PortInfo)
_portStates = prop (Proxy :: _ "portStates")

--type State =
--  { piece :: Piece
--  , location :: Location
--  , rotation  :: Rotation
--  , portStates :: Frame PortInfo
--  , isRotating :: Maybe
--    { initialClickPosition :: Tuple Number Number
--    , currentRotation :: Number
--    }
--  , isDragging :: Boolean
--
--  }

{-
  Every root-level piece's `Input`, ready to hand to `Component.Piece`. Takes
  an already-`compile`d `CompiledBoard` (the caller needs one anyway, to
  `evaluate` and produce `state`) rather than compiling `board` again here.
  `board` is still needed on its own: it carries each piece's `Rotation` in
  its own `_pieces` map, which `compile` discards since evaluation itself is
  rotation-blind -- so there's no need for `CompiledBoard` to carry rotation
  data of its own.

  A nested board can't be shown as a piece in this UI yet -- same
  limitation as `Component.Board.Types.pieceInput` -- so only depth-1
  `PieceIndex`es (a bare `Location`) are included.
-}
boardInputs :: CompiledBoard -> Board -> Map PortIndex Signal -> Map Location Input
boardInputs compiled@(CompiledBoard c) board state = mapWithIndex toInput rootPieces
  where
  rootPieces :: Map Location Piece
  rootPieces = M.fromFoldable $ L.mapMaybe asRoot $ M.toUnfoldable c.pieces
    where
    asRoot :: Tuple PieceIndex Piece -> Maybe (Tuple Location Piece)
    asRoot (Tuple (Cons loc Nil) piece) = Just (Tuple loc piece)
    asRoot _ = Nothing

  boardRotations :: Map Location Rotation
  boardRotations = map _.rotation (view _pieces board)

  toInput :: Location -> Piece -> Input
  toInput loc piece =
    { piece
    , location: loc
    , rotation: fromMaybe (rotation 0) (M.lookup loc boardRotations)
    , portStates: mapWithIndex (\dir port -> portInfoAt compiled state (Tuple (L.singleton loc) dir) port) (getPorts piece)
    }