module Component.Piece.Render where

import Prelude

import Component.DataAttribute as DataAttr
import Component.Piece.Types (Action(..), State)
import Data.Array (elem, foldMap, intercalate)
import Data.Array as A
import Data.Enum (fromEnum)
import Data.Foldable (any)
import Data.FoldableWithIndex (anyWithIndex)
import Data.HeytingAlgebra (ff)
import Data.Int (toNumber)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Number (pi)
import Data.Set (Set)
import Data.Set as S
import Data.Tuple (Tuple(..), uncurry)
import Data.Tuple.LinearAlgebra (Point)
import Debug (trace)
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection, allDirections, clockwiseRotation, rotateDirection)
import Game.Direction as Direction
import Game.Piece (Capacity(..), PieceId(..), Port(..), PortType, allWirePieces, crossPiece, getOutputDirs, inputPort, isInput, name, outputPort, portCapacity, portType, toInt)
import Game.Piece as Port
import Game.Rotation (Rotation(..), rotation)
import Game.Signal (Signal(..))
import Halogen.HTML (ClassName(..), HTML, PlainHTML, ComponentHTML)
import Halogen.HTML as HH
import Halogen.HTML.Events as HP
import Halogen.Svg.Attributes (Color(..), CommandPositionReference(..), PathCommand, Transform(..), l, m, q)
import Halogen.Svg.Attributes as SA
import Halogen.Svg.Elements as SE

--renderWirePath :: forall s m. CardinalDirection -> Map CardinalDirection PortInfo -> ComponentHTML Action s m
--renderWirePath inputDirection portInfo =
--  SE.path
--    [ SA.d path
--    , SA.classes [ ClassName "port" ]
--    , DataAttr.attr DataAttr.connected info.connected
--    , SA.fill (setAlpha 0.5 (portColor info.port info.signal))
--    , HP.onMouseEnter (\_ -> PortOnMouseEnter inputDirection)
--    , HP.onMouseLeave (\_ -> PortOnMouseLeave)
--    ]
--  where
--    defaultPortInfo = { port: inputPort OneBit, signal: Signal 0, connected: false }
--    info = fromMaybe defaultPortInfo $ M.lookup inputDirection portInfo
--    path = wirePiecePath (M.filterKeys (_ `elem` [Direction.Left, Direction.Right]) portInfo)
--
--
--renderCrossOver :: forall s m. State -> ComponentHTML Action s m
--renderCrossOver state = 
--  SE.g 
--    [ SA.transform [ Rotate (toNumber r * 90.0) 50.0 50.0 ] ] 
--    [ renderWirePath Direction.Left (M.filterKeys (_ `elem` [Direction.Left, Direction.Right]) state.portStates)
--    , renderWirePath Direction.Up (M.filterKeys (_ `elem` [Direction.Up, Direction.Down]) state.portStates)
--    ]
--  where Rotation r = state.rotation
--
--renderWire :: forall s m. State -> ComponentHTML Action s m
--renderWire state = 
--  SE.g 
--    [ SA.transform [ Rotate (toNumber r * 90.0) 50.0 50.0 ] ] 
--    [ renderWirePath Direction.Left state.portStates ]
--  where Rotation r = state.rotation