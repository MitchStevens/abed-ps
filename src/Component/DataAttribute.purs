module Component.DataAttribute where

import Prelude

import Capability.Progress (LevelProgress)
import Capability.Progress as LevelProgress
import Data.Array as A
import Data.Either (hush)
import Data.Int (fromString)
import Data.Int as Int
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Newtype (class Newtype, unwrap, wrap)
import Data.String (Pattern(..), split, stripPrefix, stripSuffix, toLower)
import Data.String.CodeUnits (fromCharArray)
import Data.UInt (UInt, fromInt)
import Effect (Effect)
import Game.Capacity (Capacity(..))
import Game.Direction (CardinalDirection)
import Game.Direction as Direction
import Game.Level.Completion (CompletionStatus(..), PortMismatch(..))
import Game.Location (Location(..))
import Game.Location as Location
import Game.Piece (Piece(..), PieceId(..), pieceLookup)
import Game.Port (Port(..), PortType, createPort)
import Game.Port as Port
import Game.Rotation (Rotation(..))
import Game.Signal (Signal(..))
import Halogen.HTML (AttrName(..), IProp)
import Halogen.HTML as HP
import Parsing (Parser, fail, runParser)
import Parsing.Combinators (choice, try)
import Parsing.Combinators.Array (many1)
import Parsing.String (char, rest, string)
import Parsing.String.Basic (digit)
import Web.DOM.Element (Element, getAttribute)
import Web.DOM.ParentNode (QuerySelector(..))
import Web.HTML.Common (AttrName(..))

type DataAttribute a =
  { attrName :: AttrName
  , attrPrint :: a -> String
  , attrParse :: Parser String a
  }

dataAttribute :: forall a. AttrName -> (a -> String) -> (Parser String a) -> DataAttribute a
dataAttribute = { attrName: _, attrPrint: _, attrParse: _ }

wrapAttribute :: forall t a. Newtype t a => AttrName -> DataAttribute a -> DataAttribute t
wrapAttribute attrName da =
  { attrName
  , attrPrint: unwrap >>> da.attrPrint
  , attrParse: map wrap da.attrParse
  }

selector :: forall a. DataAttribute a -> a -> QuerySelector
selector da a = QuerySelector ("["<> attr <>"='" <> da.attrPrint a <> "']")
  where AttrName attr = da.attrName

selectAll :: forall a. DataAttribute a -> QuerySelector
selectAll da = QuerySelector ("[" <> attr <> "]")
  where AttrName attr = da.attrName

attr :: forall a p i. DataAttribute a -> a -> IProp p i
attr da a = HP.attr da.attrName (da.attrPrint a)

getAttr :: forall a. DataAttribute a -> Element -> Effect (Maybe a)
getAttr da element = do 
  let AttrName attr = da.attrName
  maybeAttrStr <- getAttribute attr element
  pure $ maybeAttrStr >>= (\s -> hush (runParser s da.attrParse))

hasAttr :: forall a. DataAttribute a -> Element -> Effect Boolean
hasAttr da element = isJust <$> getAttr da element

print :: forall a. DataAttribute a -> a -> String
print da a = da.attrPrint a


-- DATA ATTRIBUTES
int :: DataAttribute Int
int = dataAttribute (AttrName "int") show attrParse
  where
    attrParse = do
      digitStr <- fromCharArray <<< A.fromFoldable <$> many1 digit
      maybe (fail digitStr) pure (Int.fromString digitStr)

uint :: DataAttribute UInt
uint = dataAttribute (AttrName "uint") show (map fromInt int.attrParse)

boolean :: DataAttribute Boolean
boolean = dataAttribute (AttrName "boolean") attrPrint attrParse
  where
    attrPrint = if _ then "true" else "false"
    attrParse = choice
      [ string "true"  $> true
      , string "false" $> false
      ]

pieceId :: DataAttribute PieceId
pieceId = dataAttribute (AttrName  "data-piece-id") unwrap (wrap <$> rest)

location :: DataAttribute Location
location = dataAttribute (AttrName "data-location") attrPrint attrParse
  where
    attrPrint (Location {x, y}) = "("<> show x <> ","<> show y <>")"
    attrParse = do
      x <- char '(' *> int.attrParse <* char ','
      y <- int.attrParse <* char ')'
      pure (Location.location x y)


availablePiece :: DataAttribute PieceId
availablePiece = dataAttribute (AttrName "data-available-piece") unwrap (PieceId <$> rest)

chatUsername :: DataAttribute String
chatUsername = dataAttribute (AttrName "data-username") identity rest

progress :: DataAttribute LevelProgress
progress = dataAttribute (AttrName "data-puzzle-progress") attrPrint attrParse
  where
    attrPrint = case _ of
      LevelProgress.Completed -> "completed"
      LevelProgress.Incomplete -> "incomplete"

    attrParse = choice
      [ string "completed" $> LevelProgress.Completed 
      , string "incomplete" $> LevelProgress.Incomplete
      ]

direction :: DataAttribute CardinalDirection
direction = dataAttribute (AttrName "data-direction") (show >>> toLower) attrParse
  where
    attrParse = choice
      [ string "up"    $> Direction.Up
      , string "right" $> Direction.Right
      , string "down"  $> Direction.Down
      , string "left"  $> Direction.Left
      ]

rotation :: DataAttribute Rotation
rotation = wrapAttribute (AttrName "data-rotation") int

isConnected :: DataAttribute Boolean
isConnected = boolean { attrName = AttrName "data-is-connected" } 

--signal :: DataAttribute Signal
--signal = dataAttribute (AttrName "data-signal") () (map mkSignal uint.attrParse)

isDragging :: DataAttribute Boolean
isDragging = boolean { attrName = AttrName "data-is-dragging" } 

completionStatus :: DataAttribute CompletionStatus
completionStatus = dataAttribute (AttrName "data-completion-status") attrPrint attrParse
  where
    attrPrint = case _ of
      NotStarted -> "not-started"
      PortMismatch _ -> "port-mismatch"
      FailedRestriction _ -> "failed-restriction"
      NotEvaluable _ -> "not-evaluable"
      ReadyForTesting -> "ready-for-testing"
      --RunningTestCase _ -> "running-test"
      --TestCaseOutcome _ -> "testCaseOutcome"
      Completed -> "completed"
    attrParse = fail "no parser for completion status!"

portType :: DataAttribute PortType
portType = dataAttribute (AttrName "data-port-type") attrPrint attrParse
  where
    attrPrint = case _ of
      Port.Input -> "input"
      Port.Output -> "output"
    attrParse = choice
      [ string "input"  $> Port.Input
      , string "output" $> Port.Output
      ]

capacity :: DataAttribute Capacity
capacity = dataAttribute (AttrName "data-capacity") attrPrint attrParse
  where
    attrPrint = case _ of
      OneBit -> "1"
      TwoBit -> "2"
      FourBit -> "4"
      EightBit -> "8"
    attrParse = choice
      [ char '1' $> OneBit
      , char '2' $> TwoBit
      , char '4' $> FourBit
      , char '8' $> EightBit
      ]

port :: DataAttribute Port
port = dataAttribute (AttrName "data-port") attrPrint attrParse
  where
    attrPrint (Port p) = portType.attrPrint p.portType <> "-" <> capacity.attrPrint p.capacity
    attrParse = do
      portType' <- portType.attrParse <* char '-'
      capacity' <- capacity.attrParse
      pure (createPort portType' capacity')


-- very complex, take care when modifying!
portMismatch :: DataAttribute PortMismatch
portMismatch = dataAttribute (AttrName "data-port-mismatch") attrPrint attrParse
  where
    attrPrint = case _  of
      PortExpected r -> A.intercalate "-"
        [ port.attrPrint r.expected
        , "port-expected-at"
        , direction.attrPrint r.direction
        ]
      NoPortExpected r -> A.intercalate "-"
        [ "no"
        , port.attrPrint r.received
        , "port-expected-at"
        , direction.attrPrint r.direction
        ]
      IncorrectPortType r -> A.intercalate "-"
        [ "expected"
        , port.attrPrint (createPort r.expected r.capacity)
        , "at"
        , direction.attrPrint r.direction
        , "but-port-type-was"
        , portType.attrPrint r.received
        ]
      IncorrectCapacity r -> A.intercalate "-"
        [ "expected"
        , port.attrPrint (createPort r.portType r.expected)
        , "at"
        , direction.attrPrint r.direction
        , "but-capacity-was"
        , capacity.attrPrint r.received ]
    attrParse = choice $ map try
      [ do
          expected <- port.attrParse
          _ <- string "-port-expected-at-"
          direction <- direction.attrParse
          pure (PortExpected { direction, expected })
      , do
          _ <- string "no-"
          received <- port.attrParse
          _ <- string "-port-expected-at-"
          direction <- direction.attrParse
          pure (NoPortExpected { received, direction })
      , do
          _ <- string "expected-"
          Port p <- port.attrParse
          _ <- string "-at-"
          direction <- direction.attrParse
          _ <- string "-but-port-type-was-"
          received <- portType.attrParse
          pure (IncorrectPortType {direction, capacity: p.capacity, received, expected: p.portType} )
      , do
          _ <- string "expected-"
          Port p <- port.attrParse
          _ <- string "-at-"
          direction <- direction.attrParse
          _ <- string "-but-capacity-was-"
          received <- capacity.attrParse
          pure (IncorrectCapacity {direction, portType: p.portType, received, expected: p.capacity} )
      ]


--no-PORT-port-expected-at-DIR