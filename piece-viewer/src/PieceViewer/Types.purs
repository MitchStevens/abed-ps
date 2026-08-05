module PieceViewer.Types
  ( Animation(..)
  , State
  , clearAnimation
  , currentPiece
  , defaultPiece
  , initialState
  , portStatesForPiece
  ) where

import Prelude

import Data.Array as A
import Data.Foldable (foldl)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Game.Direction (CardinalDirection(..))
import Game.Piece (Piece, allPieces, defaultPortInfo, eval, name, superPiece, truncateInputs)
import Game.Port (PortType(..), isInput, isOutput)
import Game.PortInfo (PortInfo, clampPortInfo)
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
  , inputValues :: Map CardinalDirection Int
  , animation :: Maybe Animation
  }

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
  , inputValues: Map.empty
  , animation: Nothing
  }

portStatesForPiece :: Piece -> Map CardinalDirection Int -> Map CardinalDirection PortInfo
portStatesForPiece piece inputValues =
  let
    defaults = defaultPortInfo piece
    withInputs =
      foldl
        (\acc (Tuple dir value) ->
          case Map.lookup dir acc of
            Just info | isInput info.port ->
              Map.insert dir (clampPortInfo (info { signal = mkSignal value })) acc
            _ -> acc)
        defaults
        (Map.toUnfoldable inputValues :: Array (Tuple CardinalDirection Int))
    signalInputs = truncateInputs piece (mkSignal <$> inputValues)
    outputs = eval piece signalInputs
  in
    foldl
      (\acc (Tuple dir signal) ->
        case Map.lookup dir acc of
          Just info | isOutput info.port ->
            Map.insert dir (clampPortInfo (info { signal = signal })) acc
          _ -> acc)
      withInputs
      (Map.toUnfoldable outputs :: Array (Tuple CardinalDirection Signal))

currentPiece :: State -> Piece
currentPiece s = s.piece

--case allPieces A.!! s.pieceIx of
--  Just p -> p
--  Nothing -> unsafeCrashWith "piece-viewer: piece index out of range"

clearAnimation :: State -> State
clearAnimation st = st { animation = Nothing }
