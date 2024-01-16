module Game.Board.Types where

import Prelude

import Control.Monad.Except (ExceptT, runExceptT)
import Control.Monad.State (StateT, runStateT)
import Data.Array ((..))
import Data.Array as A
import Data.Either (Either)
import Data.Foldable (foldMap, intercalate, maximumBy, surround)
import Data.Function (on)
import Data.Group (ginverse)
import Data.Identity (Identity)
import Data.Lens (Lens', to, view, (^.))
import Data.Lens.Iso.Newtype (_Newtype)
import Data.Lens.Record (prop)
import Data.List (List(..))
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
import Game.Board.RelativeEdge (RelativeEdge, relative, relativeEdgeDirection)
import Game.Direction (CardinalDirection, oppositeDirection, rotateDirection)
import Game.Direction as Direction
import Game.Location (Location(..), location, taxicabDistance)
import Game.Piece (Piece(..))
import Game.Port (Port(..), isInput)
import Game.Rotation (Rotation(..))
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
  A.find (\loc -> S.member loc occupied) allLocations

closestEmptyLocation :: Board -> Location -> Maybe Location
closestEmptyLocation board loc = maximumBy (compare `on` (taxicabDistance loc)) emptyLocations
  where
    occupied = allOccupiedLocations board
    n = board ^. _size
    emptyLocations = do
      j <- 0 .. (n - 1)
      i <- 0 .. (n - 1)
      if S.member (location i j) occupied then [] else [ location  i j ]

printBoard :: Board -> String
printBoard (Board b) = "SHOW BOARD\n" <> (foldMap (_ <> "\n") $ interleave colEdges rows )
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

