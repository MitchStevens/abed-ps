module Guide.Predicates where

import Prelude

pieceAt :: Location -> PieceId -> Effect Boolean

anyPieceAt :: Location -> Effect Boolean

rotationAt :: Location -> PieceId -> Effect Boolean

completionStatusEquals :: String -> Effect Boolean