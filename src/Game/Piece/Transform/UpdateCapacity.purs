module Game.Piece.Transform.UpdateCapacity
  ( updateCapacity
  ) where

import Prelude

import Control.Alternative (guard)
import Data.Array (elem)
import Data.Maybe (Maybe(..))
import Game.Capacity (Capacity, doubleCapacity, halveCapacity)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Frame (Frame)
import Game.Frame as Frame
import Game.Piece.Catalogue.Arithmetic (mkAdder, mkMultiplier, mkSuccPiece)
import Game.Piece.Catalogue.Basic (basicPiece)
import Game.Piece.Catalogue.Comparison (mkComparisonPiece)
import Game.Piece.Catalogue.Fuse (mkFusePiece, mkSeverPiece)
import Game.Piece.Operation (PieceOperation(..))
import Game.Piece.Types (Piece(..))
import Game.Port (Port, createPort, getPortType, hasPort, portCapacity)

{-
  The piece that results from the capacity of side `dir` becoming `capacity`, or `Nothing` if the capacity shouldn't change. See `shouldRipple` for what happens next.
-}
updateCapacity :: CardinalDirection -> Capacity -> Piece -> Maybe Piece
updateCapacity dir capacity (Piece { op, ports }) = case op of
  Not -> gate
  Or -> gate
  And -> gate
  Xor -> gate

  Connection _ -> do
    guard (hasSide dir)
    pure $ Piece { op, ports: withCapacity capacity ports }

  Succ _ -> Just (mkSuccPiece capacity)
  Adder _ -> Just (mkAdder capacity)
  Multiplier -> do
    let current = portCapacity (Frame.index Direction.Left ports)
    case dir of
      Direction.Right ->
        if current == capacity
          then Just (mkMultiplier current)
          else mkMultiplier <$> halveCapacity capacity
      Direction.Down -> Nothing
      _ -> Just (mkMultiplier capacity)

  Fuse inputCapacity -> case dir of
    Direction.Left -> Nothing
    Direction.Right -> do
      inputCapacity' <- halveCapacity capacity
      guard (inputCapacity' /= inputCapacity)
      pure $ mkFusePiece { inputCapacity: inputCapacity' }
    _ -> do
      guard (capacity /= inputCapacity)
      _ <- doubleCapacity capacity
      pure $ mkFusePiece { inputCapacity: capacity }
  Sever outputCapacity -> case dir of
    Direction.Right -> Nothing
    Direction.Left -> do
      outputCapacity' <- halveCapacity capacity
      guard (outputCapacity /= outputCapacity')
      pure $ mkSeverPiece { outputCapacity: outputCapacity' }
    _ -> do
      guard (capacity /= outputCapacity)
      pure $ mkSeverPiece { outputCapacity: capacity }

  Equal -> comparison
  GreaterThan -> comparison
  LessThan -> comparison

  ShiftLeft _ -> Nothing
  ShiftRight _ -> Nothing
  TwoBitCrossOver -> Nothing
  where
    hasSide :: CardinalDirection -> Boolean
    hasSide side = hasPort (Frame.index side ports)

    gate :: Maybe Piece
    gate = do
      guard (hasSide dir)
      pure $ basicPiece { op, ports: getPortType <$> ports, capacity }

    comparison :: Maybe Piece
    comparison = do
      guard (dir `elem` [ Direction.Left, Direction.Up ])
      pure $ mkComparisonPiece { op, capacity }

-- | Set the capacity of every real port, leaving the sides with no port alone.
withCapacity :: Capacity -> Frame Port -> Frame Port
withCapacity capacity = map \port ->
  if hasPort port then createPort (getPortType port) capacity else port
