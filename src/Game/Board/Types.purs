module Game.Board.Types where

import Prelude

import Control.Monad.Except (ExceptT(..), runExceptT)
import Control.Monad.Free (Free, resume, wrap)
import Control.Monad.State (StateT(..), runStateT)
import Data.Array ((..))
import Data.Array as A
import Data.Either (Either(..))
import Data.Eq (class Eq1)
import Data.Foldable (foldMap, intercalate, maximumBy, surround)
import Data.Function (on)
import Data.Group (ginverse)
import Data.Identity (Identity)
import Data.Lens (Lens', lens, to, view, (^.))
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.List (List(..))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Monoid (power)
import Data.Newtype (class Newtype, unwrap)
import Data.Set (Set)
import Data.Set as S
import Data.String as String
import Data.Tuple (Tuple(..), fst, snd)
import Data.Unfoldable (replicate)
import Game.Direction (CardinalDirection, oppositeDirection, rotateDirection)
import Game.Direction as Direction
import Game.Frame (Frame, PortIndex)
import Game.Frame as Frame
import Game.Location (Location(..), location, taxicabDistance)
import Game.Piece (Piece(..))
import Game.Port (Port, hasPort, isInput, noPort)
import Game.Rotation (Rotation)
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))

-- | `wormholeIn` is always the mouth (the side that consumes a signal and
-- | buffers it) and `wormholeOut` is always the tail (the side that emits
-- | the buffered signal one tick later, so its value depends on whatever
-- | `wormholeIn` last consumed). Same convention as the `WormholeIn`/
-- | `WormholeOut` port types and `Game.Piece.Types.getWormhole`.
-- |
-- | Parameterized so `Game.Board.Compiled` can reuse this same named shape
-- | once each side is resolved from a bare `CardinalDirection` down to a
-- | concrete `RelativeEdge` -- named fields, not a positional `Tuple`, so the
-- | mouth/tail roles can never be swapped by argument order.
type WormholeF a = { wormholeIn :: a, wormholeOut :: a }
type Wormhole = WormholeF CardinalDirection

newtype BoardF a = BoardF
  { size :: Int
  , ports :: Frame Port
  , pieces :: Map Location { rotation :: Rotation, piece :: a }
  , wormhole :: Maybe Wormhole
  }

derive instance Functor BoardF
derive instance Newtype (BoardF a) _

instance Eq1 BoardF where
  eq1 (BoardF b1) (BoardF b2) =
    b1.size == b2.size && b1.ports == b2.ports && b1.pieces == b2.pieces && b1.wormhole == b2.wormhole

-- `Board` is a newtype (rather than a bare `type Board = Free BoardF Piece`
-- alias) so instances like `Eq`/`Show` can be attached to it: `Free`'s own
-- head type constructor lives in another module, so an instance on the bare
-- alias would be an orphan.
newtype Board = Board (Free BoardF Piece)

derive instance Newtype Board _
derive instance Eq Board

instance Show Board where
  show board = case resumeBoard board of
    Right p -> "(Pure " <> show p <> ")"
    Left (BoardF b) -> "(BoardF " <> show b <> ")"

-- like `Control.Monad.Free.resume`, but unwraps/rewraps the `Board` newtype
-- at each nested piece slot so callers keep working with `Board` throughout,
-- rather than the raw `Free BoardF Piece` representation underneath.
resumeBoard :: Board -> Either (BoardF Board) Piece
resumeBoard (Board free) = case resume free of
  Right p -> Right p
  Left boardF -> Left (map Board boardF)

mkBoard :: BoardF Board -> Board
mkBoard boardF = Board (wrap (map (\(Board free) -> free) boardF))

-- a leaf piece, lifted into `Board` -- `Board` is a concrete type now (not
-- `Free BoardF Piece` itself), so `pure` from `Free`'s `Applicative` isn't
-- directly available on it.
pureBoard :: Piece -> Board
pureBoard = Board <<< pure

data BoardError
  = LocationOccupied Location
  | LocationNotOccupied Location
  | InvalidLocation Location
  | InvalidBoardInitialisation Int
  | BadBoardSize Int
  | Cyclic
  | WormholeInvalid Wormhole
  -- more than one thing drives the same net -- see `Game.Eval.Nets`
  | MultipleWriters (Array PortIndex)
  | Other String
derive instance Eq BoardError

instance Show BoardError where
  show = case _ of
    LocationOccupied loc -> "Location Occupied: " <> show loc
    LocationNotOccupied loc ->  "Location Not Occupied: " <> show loc
    InvalidLocation loc -> "Location " <> show loc <> " is outside range of the board"
    InvalidBoardInitialisation n -> "Invalid Board Initialisation: " <> show n <> " is not a valid board size"
    BadBoardSize n -> "Boards of size " <>  show n <>" are not valid"
    Cyclic -> "ABED does not admit cyclic boards"
    WormholeInvalid { wormholeIn, wormholeOut } -> "Invalid wormhole: mouth " <> show wormholeIn <> " and tail " <> show wormholeOut <> " must be on different board sides"
    MultipleWriters ports -> "Ports " <> show ports <> " all drive the same signal"
    Other other -> "Other error: " <>  other

-- a `Board`'s root is always a `BoardF`, never a bare `Piece` -- same
-- invariant `Evaluable`/`Cell` enforce in `Game.Board.Compiled`, just not
-- pushed into the type itself here, so this crashes on the impossible case.
_boardF :: Lens' Board (BoardF Board)
_boardF = lens getter setter
  where
  getter board = case resumeBoard board of
    Left boardF -> boardF
    Right _ -> unsafeCrashWith "Board: expected a BoardF at the root, found a bare Piece"
  setter _ boardF = mkBoard boardF

_size :: Lens' Board Int
_size = _boardF <<< _Newtype <<< prop (Proxy :: _ "size")

_ports :: Lens' Board (Frame Port)
_ports = _boardF <<< _Newtype <<< prop (Proxy :: _ "ports")

_pieces :: Lens' Board (Map Location { rotation :: Rotation, piece :: Board })
_pieces = _boardF <<< _Newtype <<< prop (Proxy :: _ "pieces")

standardBoard :: Board
standardBoard = mkBoard $ BoardF { size: 3, ports: pure noPort, pieces: M.empty, wormhole: Nothing }

allOccupiedLocations :: Board -> Set Location
allOccupiedLocations = view $ _pieces <<< to M.keys


-- todo: ensure that this short circuits when the empty loction is found
firstEmptyLocation :: Board -> Maybe Location
firstEmptyLocation board = do
  let n = view _size board
  let allLocations = do
        j <- 0 .. (n - 1)
        i <- 0 .. (n - 1)
        pure $ location i j
  let occupied = allOccupiedLocations board
  A.find (\loc -> not (S.member loc occupied)) allLocations

closestEmptyLocation :: Board -> Location -> Maybe Location
closestEmptyLocation board loc = maximumBy (compare `on` (taxicabDistance loc)) emptyLocations
  where
    occupied = allOccupiedLocations board
    n = board ^. _size
    emptyLocations = do
      j <- 0 .. (n - 1)
      i <- 0 .. (n - 1)
      if not (S.member (location i j) occupied) then [] else [ location  i j ]

printBoard :: Board -> String
printBoard board = "SHOW BOARD\n" <> (foldMap (_ <> "\n") $ interleave colEdges rows )
  where
    BoardF b = view _boardF board

    -- a leaf piece's own ports; a nested board has none to show here yet.
    portsOf :: Board -> Frame Port
    portsOf cell = case resumeBoard cell of
      Right (Piece p) -> p.ports
      Left _ -> pure noPort

    rows = L.range 0 (b.size - 1) <#> \x -> printRow x
    colEdges = L.range 0 b.size <#> \y ->
      surround "+" $ (L.range 0 (b.size - 1)) <#> \x -> printColEdge x y

    printPiece :: Frame Port -> Rotation -> Location -> List String
    printPiece ports rot loc = L.fromFoldable
      [ "   " <> port Direction.Up <> "   "
      , port Direction.Left <> " " <> center <> " " <> port Direction.Right
      , "   " <> port Direction.Down <> "   "
      ]
      where
        port :: CardinalDirection -> String
        port dir =
          let dir' = rotateDirection dir (ginverse rot)
          in maybe " " (printPort dir) (Frame.lookupWhere hasPort dir' ports)

        center = case (_.piece) <$> M.lookup loc b.pieces of
          Just cell -> case resumeBoard cell of
            Right (Piece p) -> String.take 3 (show p.name)
            Left _ -> "brd"
          Nothing -> printLocation loc

    printRow :: Int -> String
    printRow y = intercalate "\n" $ L.foldr (L.zipWith append) (replicate 3 "")  $ interleave edges pieces
      where
        pieces =
          L.range 0 (b.size - 1) <#> \x ->
            let loc = location x y
            in case M.lookup loc b.pieces of
              Just { piece, rotation } -> printPiece (portsOf piece) rotation loc
              Nothing -> L.fromFoldable ["       ", "  " <> printLocation loc <> "  ", "       " ]

        edges = L.range 0 b.size <#> \x -> printRowEdge x y

    printLocation (Location {x, y}) = show x <> "," <> show y

    printPort :: CardinalDirection -> Port -> String
    printPort dir port = case if isInput port then oppositeDirection dir else dir of
      Direction.Up -> "∧"
      Direction.Right -> ">"
      Direction.Down -> "∨"
      Direction.Left -> "<"

    printRowEdge :: Int -> Int -> List String
    printRowEdge 0 _ = replicate 3 "┃"
    printRowEdge x y = replicate 3 "┃" -- todo:

    printColEdge :: Int -> Int -> String
    printColEdge _ 0 = power "━" 7
    printColEdge x y = power "━" 7 --todo:

    interleave :: forall a. List a -> List a -> List a
    interleave (Cons x xs) (Cons y ys) = Cons x $ Cons y (interleave xs ys)
    interleave Nil ys = ys
    interleave xs Nil = xs



type BoardT m a = StateT Board (ExceptT BoardError m) a
type BoardM a = BoardT Identity a

runBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError (Tuple a Board))
runBoardT boardM b = runExceptT $ runStateT boardM b

evalBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError a)
evalBoardT boardM b = map fst <$> runBoardT boardM b

execBoardT :: forall m a. Monad m => BoardT m a -> Board -> m (Either BoardError Board)
execBoardT boardM b = map snd <$> runBoardT boardM b

runBoardM :: forall a. BoardM a -> Board -> Either BoardError (Tuple a Board)
runBoardM boardM b = unwrap $ runBoardT boardM b

evalBoardM :: forall a. BoardM a -> Board -> Either BoardError a
evalBoardM boardM b = unwrap $ evalBoardT boardM b

execBoardM :: forall a. BoardM a -> Board -> Either BoardError Board
execBoardM boardM b = unwrap $ execBoardT boardM b

 --don't modify state if error occurs
transaction :: forall m a. Monad m => BoardT m a -> BoardT m (Either BoardError a)
transaction ma = StateT \board -> ExceptT do
  runBoardT ma board <#> case _ of
    Left boardError -> pure (Tuple (Left boardError) board)
    Right (Tuple a board') -> pure (Tuple (Right a) board')

{-
  s -> m (a, s)
  s -> m (Either BoardError a)

  s -> ExceptT BoardError n (Either BoardError a, s)
-}
