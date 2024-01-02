module Component.Rendering.Wire where

import Prelude

import Component.DataAttribute as DA
import Component.Piece.Types (Action)
import Component.Piece.Types as Piece
import Component.Rendering.Gradient (createPortGradient)
import Component.Rendering.Path (Path, SimplifiedF(..), SimplifiedPathCommand, renderPathWithEvents, rotateBy, rotateByAround, toPathCommand)
import Component.Rendering.Port (stubPath, arrowHeadPath)
import Data.Array as A
import Data.Foldable (any)
import Data.FoldableWithIndex (anyWithIndex)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Tuple (Tuple(..))
import Game.Board.PortInfo (PortInfo)
import Game.Direction (CardinalDirection, clockwiseRotation)
import Game.Direction as Direction
import Game.Piece (portType)
import Game.Piece as Port
import Game.Rotation (Rotation(..))
import Halogen (ComponentHTML)
import Halogen.HTML as HH
import Halogen.Svg.Attributes (PathCommand)

renderWire :: forall s m. Map CardinalDirection PortInfo -> ComponentHTML Action s m
renderWire portStates = fromMaybe (HH.div_ [ HH.text "couldn't render wire"]) $ do
   path <- wirePiecePath portStates
   pure $ renderPathWithEvents path (Piece.PortOnMouseEnter Direction.Left) Piece.PortOnMouseLeave

wirePiecePath :: Map CardinalDirection PortInfo -> Maybe Path
wirePiecePath portStates = do
  { head, tail } <- A.uncons dirs
  let betweenPorts = A.zipWith createPathBetweenPorts dirs (tail <> [head])
  let path = map toPathCommand $ join $ combineArrays ports betweenPorts
  info <- M.lookup Direction.Left portStates
  let gradient = createPortGradient info
  let attrs =  DA.attr DA.connected info.connected
  
  pure { path, gradient, attrs }
  --pure { path, gradient, attrs }

  where
    dirs = A.fromFoldable (M.keys portStates)
    ports = createPathForPort <$> dirs

    center = Tuple 50.0 50.0

    init = M (Tuple 35.0 25.0)

    isInputDirection :: CardinalDirection -> Boolean
    isInputDirection dir = anyWithIndex (\d info -> (dir == d) && portType info.port == Port.Input) portStates

    createPathForPort :: CardinalDirection -> Array SimplifiedPathCommand
    createPathForPort dir =
      if isInputDirection dir
        then map (rotateByAround rot center) $ [init] <> stubPath
        else map (rotateByAround rot center) $ [init] <> if isConnected then stubPath else arrowHeadPath
      where
        rot = clockwiseRotation Direction.Up dir
        isConnected = any (_.connected) (M.lookup dir portStates)

    createPathBetweenPorts :: CardinalDirection -> CardinalDirection -> Array SimplifiedPathCommand
    createPathBetweenPorts from to = pure <<< rotateBy rot $ case clockwiseRotation from to of
      Rotation 0 -> L (Tuple (-30.0) 0.0)
      Rotation 1 -> L (Tuple 10.0 10.0)
      Rotation 2 -> L (Tuple 0.0 50.0)
      Rotation _ -> L (Tuple (-40.0) 40.0)
      --Rotation 0 -> L (Tuple 30.0 25.0)
      --Rotation 1 -> Q (Tuple 65.0 35.0) (Tuple 75.0 35.0)
      --Rotation 2 -> L (Tuple 65.0 75.0)
      --Rotation _ -> Q (Tuple 65.0 65.0) (Tuple 25.0 65.0)
      where rot = clockwiseRotation Direction.Up from

    combineArrays :: forall a. Array a -> Array a -> Array a
    combineArrays as bs = case A.uncons as, A.uncons bs of
      _, Nothing -> as
      Nothing, _ -> bs
      Just a, Just b -> [a.head, b.head] <> combineArrays a.tail b.tail