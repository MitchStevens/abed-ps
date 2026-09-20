module PieceViewer.Types
  ( Animation(..)
  , State
  , clearAnimation
  , currentPiece
  , defaultPiece
  , adaptPort
  , initialState
  , portStatesForPiece
  ) where

import Prelude

import Data.Array as A
import Data.Foldable (foldl)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Tuple (Tuple(..))
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection(..))
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Piece (Piece, allPieces, defaultPortInfo, eval, name, superPiece, truncateInputs)
import Game.Port (Port, PortType(..), createPort, isInput, isOutput, noPort)
import Game.PortInfo (PortInfo, clampPortInfo, hasPortInfo)
import Game.Rotation (Rotation, rotation)
import Game.Signal (Signal, mkSignal)
import Partial.Unsafe (unsafeCrashWith)

data Animation
  = HeadShake
  | Spin
  | PieceAdded
  | PieceRemoved

type State =
  { piece :: Piece
  , scale :: Number
  , rotation :: Rotation
  , tiled :: Boolean
  , adaptDirection :: CardinalDirection
  , adaptPortType :: Maybe PortType
  , inputValues :: Frame Int
  , animation :: Maybe Animation
  }

-- | The neighbouring port the "Adapt" controls stand in for: the chosen type
-- | on a one-bit port, or no port at all.
adaptPort :: Maybe PortType -> Port
adaptPort = maybe noPort (\portType -> createPort portType OneBit)

defaultPiece :: Piece
defaultPiece = superPiece

initialState :: State
initialState =
  { piece: defaultPiece
  , scale: 1.0
  , rotation: rotation 0
  , tiled: false
  , adaptDirection: Up
  , adaptPortType: Just Input
  , inputValues: pure 0
  , animation: Nothing
  }

portStatesForPiece :: Piece -> Frame Int -> Frame PortInfo
portStatesForPiece piece inputValues =
  let
    defaults = defaultPortInfo piece
    withInputs =
      foldl
        (\acc (Tuple dir value) ->
          case Frame.lookupWhere hasPortInfo dir acc of
            Just info | isInput info.port ->
              Frame.set dir (clampPortInfo (info { signal = mkSignal value })) acc
            _ -> acc)
        defaults
        (Frame.toListWithIndex inputValues)
    signalInputs = truncateInputs piece (mkSignal <$> inputValues)
    outputs = eval piece signalInputs
  in
    foldl
      (\acc (Tuple dir signal) ->
        case Frame.lookupWhere hasPortInfo dir acc of
          Just info | isOutput info.port ->
            Frame.set dir (clampPortInfo (info { signal = signal })) acc
          _ -> acc)
      withInputs
      (Frame.toListWithIndex outputs)

currentPiece :: State -> Piece
currentPiece s = s.piece

--case allPieces A.!! s.pieceIx of
--  Just p -> p
--  Nothing -> unsafeCrashWith "piece-viewer: piece index out of range"

clearAnimation :: State -> State
clearAnimation st = st { animation = Nothing }
