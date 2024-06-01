module Game.Board.Types where

import Prelude

import Control.Alternative (guard, (<|>))
import Control.Monad.Except (ExceptT, runExceptT)
import Control.Monad.State (StateT, evalState, runStateT)
import Data.Array ((..))
import Data.Array as A
import Data.Either (Either)
import Data.Foldable (any, foldMap, intercalate, maximumBy, surround)
import Data.Function (on)
import Data.Group (ginverse)
import Data.Identity (Identity)
import Data.Lens (Lens', to, view, (^.))
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.List (List(..), (:))
import Data.List as L
import Data.Map (Map)
import Data.Map as M
import Data.Map.Unsafe (unsafeMapKey)
import Data.Maybe (Maybe(..), maybe)
import Data.Monoid (power)
import Data.Newtype (class Newtype, unwrap)
import Data.Set (Set)
import Data.Set as S
import Data.String as String
import Data.Tuple (Tuple(..), fst, snd)
import Data.Unfoldable (replicate)
import Game.Board.PieceInfo (PieceInfo)
import Game.Board.RelativeEdge (RelativeEdge, AbsoluteEdge, relative, relativeEdgeDirection, absolute)
import Game.Piece.Capacity (Capacity, toInt)
import Game.Piece.Direction (CardinalDirection, oppositeDirection, rotateDirection)
import Game.Piece.Direction as Direction
import Game.Edge (Edge(..))
import Game.Location (Location(..), location, taxicabDistance)
import Game.Piece (Piece(..), getPort)
import Game.Piece.Port (Port(..), isInput, portCapacity)
import Game.Piece.Rotation (Rotation(..))
import Partial.Unsafe (unsafeCrashWith)
import Type.Proxy (Proxy(..))

newtype Board = Board
  { size :: Int
  , pieces :: Map Location PieceInfo
  }

derive instance Newtype Board _
derive instance Eq Board
instance Show Board where
  show = printBoard

data BoardError
  = LocationOccupied Location
  | LocationNotOccupied Location
  | InvalidLocation Location
  | InvalidBoardInitialisation Int
  | BadBoardSize Int
  | Cyclic
derive instance Eq BoardError

instance Show BoardError where
  show = case _ of
    LocationOccupied loc -> "Location Occupied: " <> show loc
    LocationNotOccupied loc ->  "Location Not Occupied: " <> show loc
    InvalidLocation loc -> "Location " <> show loc <> " is outside range of the board"
    InvalidBoardInitialisation n -> "Invalid Board Initialisation: " <> show n <> " is not a valid board size"
    BadBoardSize n -> "Boards of size " <>  show n <>" are not valid"
    Cyclic -> "ABED does not admit cyclic boards"

_size :: Lens' Board Int
_size = _Newtype <<< prop (Proxy :: _ "size")

_pieces :: Lens' Board (Map Location PieceInfo)
_pieces = _Newtype <<< prop (Proxy :: _ "pieces")

standardBoard :: Board
standardBoard = Board { size: 3, pieces: M.empty }

toLocalInputs :: forall a. Location -> Map RelativeEdge a -> Map CardinalDirection a
toLocalInputs loc = M.submap (Just (relative loc Direction.Up)) (Just (relative loc Direction.Left)) >>> unsafeMapKey relativeEdgeDirection

-- this creates a valid map because d1 >= d2 => reledge loc d1 >= relEdge loc d2
toGlobalInputs :: forall a. Location -> Map CardinalDirection a -> Map RelativeEdge a
toGlobalInputs loc = unsafeMapKey (relative loc)

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
printBoard (Board b) = case L.unsnoc (interleave colEdges rows) of
  Just { init, last } -> foldMap (_ <> "\n") init <> last
  Nothing -> unsafeCrashWith "this should never happen"

  where
    rows = L.range 0 (b.size - 1) <#> \x -> printRow x
    colEdges = L.range 0 b.size <#> \y -> 
      surround "+" $ (L.range 0 (b.size - 1)) <#> \x -> printColEdge x y

    printPiece :: Map CardinalDirection Port -> Rotation -> Location -> List String
    printPiece ports rot loc = L.fromFoldable
      [ "   " <> port Direction.Up <> "   "
      , port Direction.Left <> " " <> center <> " " <> port Direction.Right
      , "   " <> port Direction.Down <> "   "
      ]
      where
        port :: CardinalDirection -> String
        port dir = 
          let dir' = rotateDirection dir (ginverse rot)
          in maybe " " (printPort dir) (M.lookup dir' ports)
        
        center = case (_.piece) <$> M.lookup loc b.pieces of
          Just (Piece p) -> String.take 3 (show p.name)
          Nothing -> printLocation loc
    
    printRow :: Int -> String
    printRow y = intercalate "\n" $ L.foldr (L.zipWith append) (replicate 3 "")  $ interleave edges pieces
      where
        pieces =
          L.range 0 (b.size - 1) <#> \x -> 
            let loc = location x y
            in case M.lookup loc b.pieces of
              Just { piece: Piece p, rotation } -> printPiece p.ports rotation loc
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
    printRowEdge x y = case rowCapacity of
      Just c -> "╹" : show (toInt c) : "╻" : Nil
      Nothing -> replicate 3 "┃"
      
      where
        rowCapacity = case leftPortCapacity, rightPortCapacity of
          Just c1, Just c2 -> if c1 == c2 then Just c1 else Nothing
          _, _ -> leftPortCapacity <|> rightPortCapacity
    
        leftPortCapacity = getPortCapacity (absolute (location x y) Direction.Left)
        rightPortCapacity = getPortCapacity (absolute (location (x-1) y) Direction.Right)

    printColEdge :: Int -> Int -> String
    printColEdge x y = case colCapacity of
      Just c -> "━━ " <> show (toInt c) <> " ━━"
      Nothing ->  "━━━━━━━"

      where
        colCapacity = case upperPortCapacity, lowerPortCapacity of
          Just c1, Just c2 -> if c1 == c2 then Just c1 else Nothing
          _, _ -> upperPortCapacity <|> lowerPortCapacity
    
        upperPortCapacity = getPortCapacity (absolute (location x y) Direction.Up)
        lowerPortCapacity = getPortCapacity (absolute (location x (y-1)) Direction.Down)

    getPortCapacity :: AbsoluteEdge -> Maybe Capacity
    getPortCapacity (Edge {loc, dir}) = do
      { piece, rotation } <- M.lookup loc b.pieces
      port <- getPort piece (rotateDirection dir (ginverse rotation))
      Just (portCapacity port)

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

