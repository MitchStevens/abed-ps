{-
  EVALUABLE BOARD

  A `Board` represents operations on the board in the game: adding pieces, rotating pieces, etc. However this representation is not good for evaluation. To evaluate a board, it is first transformed into an `EvaluableBoard`, which *can* be evaluated and has a `Piece` instance.

  An `EvaluatableBoard` also generates information about the states of ports which is used in rendering. Generating extra information has an overhead cost, for the evaluation of board that don't need to provide internal port information, use `CompiledBoard` for better performance.
-}

module Game.Board.Evaluable
  ( module Game.Board.Evaluable.Types
  , module Game.Board.Evaluable.Evaluate
  )
  where

import Game.Board.Evaluable.Types
import Game.Board.Evaluable.Evaluate

{-
evalAt :: forall m. MonadReader EvaluableBoard m 
  => MonadState (Map RelativeEdge Signal) m
  => Location -> Piece -> m Unit


{-
  Once the `EvaluableBoard` is build from a `Board`, we do the following to evaluate it:
    1. Inject the inputs into the psuedo inputs
    2. `eval` each location in the list `evalOrder`
    3. Extract the outputs from the psuedo outputs

-}
evalWithPortInfo :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m 
  => Map CardinalDirection Signal -> m (Map CardinalDirection Signal)
evalWithPortInfo inputs = do
  evalOrder <- asks (unwrap >>> (_.evalOrder))
  injectInputs inputs
  traverse_ evalWithPortInfoAt evalOrder
  extractOutputs

injectInputs :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => Map CardinalDirection Signal -> m Unit
injectInputs inputs = do
  psuedoPieceLocations <- asks (unwrap >>> (_.psuedoPieceLocations))
  forWithIndex_ psuedoPieceLocations \dir loc -> do
    for_ (M.lookup dir inputs) \signal -> do
      setOuterPort dir signal

{-
  -- if the edge is set already, return the input edge signal
  -- if the adjacent edge has a signal, copy the signal from the output to the input, return the signal
  -- else, return signal 0
-}
getInputOnEdge :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => InputEdge -> Capacity -> m Signal
getInputOnEdge inputEdge capacity = do
  connections <- asks (unwrap >>> (_.connections))
  case (M.lookup inputEdge connections) of
    Just outputEdge -> do
      maybeSignal <- use (at (coerce outputEdge)) >>= traverse \{ port, connected, signal} -> do
        --let signal = getClampedSignal info
        at (coerce inputEdge)  .= Just { connected: true, signal, port: inputPort  capacity }
        at (coerce outputEdge) .= Just { connected: true, signal, port: outputPort capacity }
        pure signal
      pure $ fromMaybe zero maybeSignal
    Nothing -> do
      signal <- maybe zero (_.signal) <$> use (at (coerce inputEdge))
      at (coerce inputEdge) .= Just { connected: false, signal: signal, port: inputPort capacity }
      pure signal

evalWithPortInfoAt :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => Location -> m Unit
evalWithPortInfoAt loc = do
  pieces <- asks (unwrap >>> (_.pieces))
  for_ (M.lookup loc pieces) \(Piece p) -> do
    let inputPorts = M.filter isInput p.ports

    inputs <- M.fromFoldable <$>
      forWithIndex inputPorts \dir port ->
        Tuple dir <$> getInputOnEdge (inputEdge loc dir) (portCapacity port)
        
    unless (isPseudoPiece (Piece p)) do
      let outputs = p.eval inputs
      let outputPorts = M.filter isOutput p.ports
      forWithIndex_ outputPorts \dir port -> do
        --let signal = foldMap (ca (portCapacity port)) (M.lookup dir outputs)
        let signal = fold (M.lookup dir outputs)
        at (relative loc dir) .= Just { connected: false, signal, port }

extractOutputs :: forall m. MonadReader EvaluableBoard m => MonadState (Map RelativeEdge PortInfo) m
  => m (Map CardinalDirection Signal)
extractOutputs = M.catMaybes <$> do
    outputPorts <- M.filter isOutput <$> getPorts
    forWithIndex outputPorts \dir port -> do
      getOuterPort dir

--extractOuterPortInfo :: forall m. MonadState (Map RelativeEdge PortInfo) m
--  => EvaluableBoard -> m (Map CardinalDirection PortInfo)
--extractOuterPortInfo (EvaluableBoard evaluable) = 
--  forWithIndex (evaluable.portLocations) \dir relEdge -> do
--    maybePortInfo <- use (at relEdge)
--    pure $ fromMaybe defaultPortInfo maybePortInfo
--  where
--    defaultPortInfo =
--      { connected: false
--      , port: outputPort EightBit
--      , signal: Signal 0
--      }

getPortInfo :: forall m. MonadReader EvaluableBoard m 
  => m (Map RelativeEdge { port :: Port, connected :: Boolean})
getPortInfo = do
  EvaluableBoard e <- ask
  let portInfo = execWriter do
        forWithIndex_ e.pieces \loc piece ->
          for_ allDirections \dir ->
            for_ (Piece.getPort piece dir) \port ->
              tell (M.singleton (relative loc dir) { port: First (Just port), connected: Disj false })
        forWithIndex_ e.connections \(InputEdge inputEdge) (OutputEdge outputEdge) -> do
          tell (M.singleton inputEdge  { port: First Nothing, connected: Disj true})
          tell (M.singleton outputEdge { port: First Nothing, connected: Disj true})

  pure $ M.mapMaybe (\{ port, connected } -> { port: _, connected: coerce connected} <$> coerce port) portInfo

getPorts :: forall m. MonadReader EvaluableBoard m => m (Map CardinalDirection Port)
getPorts = do
  pieces <- asks (unwrap >>> _.pieces)
  psuedoPieceLocations <- asks (unwrap >>> _.psuedoPieceLocations)
  
  pure $ M.mapMaybe (\loc -> map matchingPort $ M.lookup loc pieces >>= (\(Piece p) -> M.lookup Direction.Right p.ports)) psuedoPieceLocations

getPort :: forall m. MonadReader EvaluableBoard m => CardinalDirection ->  m (Maybe Port)
getPort dir = do
  pieces <- asks (unwrap >>> _.pieces)
  psuedoPieceLocations <- asks (unwrap >>> _.psuedoPieceLocations)
  pure $
    M.lookup dir psuedoPieceLocations
      >>= \loc -> M.lookup loc pieces
      >>= \(Piece p) -> M.lookup Direction.Right p.ports
      <#> matchingPort
    

toLocalInputs :: forall a. Location -> Map RelativeEdge a -> Map CardinalDirection a
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey edgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: forall a. Location -> Map CardinalDirection a -> Map RelativeEdge a
toGlobalInputs loc = unsafeMapKey (relative loc)
