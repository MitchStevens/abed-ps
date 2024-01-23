module Component.DataAttribute where

import Prelude

import Capability.Progress (LevelProgress)
import Capability.Progress as LevelProgress
import Data.Int (fromString)
import Data.Int as Int
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap, wrap)
import Data.String (Pattern(..), split, stripPrefix, stripSuffix, toLower)
import Effect (Effect)
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Level.Completion (CompletionStatus(..), PortMismatch(..))
import Game.Location (Location(..))
import Game.Location as Location
import Game.Piece (Piece(..), PieceId(..), pieceLookup)
import Game.Port (PortType)
import Game.Port as Port
import Game.Rotation (Rotation(..))
import Game.Signal (Signal(..))
import Halogen.HTML (AttrName(..), IProp)
import Halogen.HTML as HP
import Web.DOM.Element (Element, getAttribute)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

type DataAttributeBase r a =
  { attrName :: AttrName
  , attrPrint :: a -> String
  | r }

type DataAttribute a = DataAttributeBase () a

type DataAttributeParser a = DataAttributeBase ( attrParse :: String -> Maybe a ) a

dataAttribute :: forall a. AttrName -> (a -> String) -> DataAttribute a
dataAttribute = { attrName: _, attrPrint: _ }

dataAttributeParser :: forall a. AttrName -> (a -> String) -> (String -> Maybe a) -> DataAttributeParser a
dataAttributeParser = { attrName: _, attrPrint: _, attrParse: _ }


selector :: forall r a. DataAttributeBase r a -> a -> QuerySelector
selector da a = QuerySelector ("["<> attr <>"='" <> da.attrPrint a <> "']")
  where AttrName attr = da.attrName

attr :: forall r a p i. DataAttributeBase r a -> a -> IProp p i
attr da a = HP.attr da.attrName (da.attrPrint a)

getAttr :: forall a. DataAttributeParser a -> Element -> Effect (Maybe a)
getAttr da element = do 
  let AttrName attr = da.attrName
  maybeAttrStr <- getAttribute attr element
  pure $ maybeAttrStr >>= da.attrParse

print :: forall r a. DataAttributeBase r a -> a -> String
print da a = da.attrPrint a


-- DATA ATTRIBUTES
pieceId :: DataAttributeParser PieceId
pieceId = dataAttributeParser (AttrName  "data-piece-id") unwrap (Just <<< wrap)

location :: DataAttributeParser Location
location = dataAttributeParser (AttrName "data-location") attrPrint attrParse
  where
    attrPrint (Location {x, y}) = "("<> show x <> ","<> show y <>")"
    
    attrParse str = do
      numbers <- pure str
        >>= stripPrefix (Pattern "(") 
        >>= stripSuffix (Pattern ")") 
        <#> split (Pattern ",")
      case numbers of
        [x, y] -> Location.location <$> fromString x <*> fromString y
        _ -> Nothing


availablePiece :: DataAttributeParser Piece
availablePiece = dataAttributeParser (AttrName "data-available-piece") (\(Piece p) -> unwrap p.name) (Just <<< pieceLookup <<< PieceId)

chatUsername :: DataAttribute String
chatUsername = dataAttribute (AttrName "data-username") identity

progress :: DataAttributeParser LevelProgress
progress = dataAttributeParser (AttrName "data-puzzle-progress") attrPrint attrParse
  where
    attrPrint = case _ of
      LevelProgress.Completed -> "completed"
      LevelProgress.Incomplete -> "incomplete"
    attrParse = case _ of
      "completed"  -> Just LevelProgress.Completed 
      "incomplete" -> Just LevelProgress.Incomplete
      _ -> Nothing

direction :: DataAttributeParser CardinalDirection
direction = dataAttributeParser (AttrName "data-direction") (show >>> toLower) attrParse
  where
    attrParse = case _ of
      "up" -> Just Direction.Up
      "right" -> Just Direction.Right
      "down" -> Just Direction.Down
      "left" -> Just Direction.Left
      _ -> Nothing 

rotation :: DataAttributeParser Rotation
rotation = dataAttributeParser (AttrName "data-rotation") attrPrint attrParse
  where
    attrPrint (Rotation r) = show r
    attrParse = map Rotation <<< Int.fromString

connected :: DataAttributeParser Boolean
connected = dataAttributeParser (AttrName "data-connected") attrPrint attrParse
  where
    attrPrint = if _ then "connected" else "not-connected"
    attrParse = case _ of
      "connected" -> Just true
      "not-connected" -> Just false
      _ -> Nothing

signal :: DataAttributeParser Signal
signal = dataAttributeParser (AttrName "data-signal") attrPrint attrParse
  where
    attrPrint (Signal s) = show s
    attrParse = map Signal <<< Int.fromString


portType :: DataAttributeParser PortType
portType = dataAttributeParser (AttrName "data-port-type") attrPrint attrParse
  where
    attrPrint = case _ of
      Port.Input -> "input"
      Port.Output -> "output"
    attrParse = case _ of
      "input" -> Just Port.Input
      "output" -> Just Port.Output
      _ -> Nothing
    

isDragging :: DataAttributeParser Boolean
isDragging = dataAttributeParser (AttrName "data-is-dragging") attrPrint attrParse
  where
    attrPrint = if _ then "true" else "false"
    attrParse = case _ of
      "true" -> Just true
      "false" -> Just false
      _ -> Nothing

completionStatus :: DataAttribute CompletionStatus
completionStatus = dataAttribute (AttrName "data-completion-status") $ case _ of
  NotStarted -> "not-started"
  FailedRestriction _ -> "failed-restriction"
  NotEvaluable _ -> "not-evaluable"
  PortMismatch _ -> "port-mismatch"
  ReadyForTesting -> "ready-for-testing"
  RunningTest _ -> "running-test"
  FailedTestCase _ -> "failed-test-case"
  Completed -> "completed"

portMismatch :: DataAttribute (Maybe PortMismatch)
portMismatch = dataAttribute (AttrName "data-port-mismatch") $ case _ of
  Just (PortExpected _)      -> "port-expected"
  Just (NoPortExpected _)    -> "no-port-expected"
  Just (IncorrectPortType _) -> "incorrect-port-type"
  Just (IncorrectCapacity _) -> "incorrect-capacity"
  Nothing                    -> "no-mismatch"