<<<<<<< HEAD
import { boardElement, sidebarElement } from "./Elements"

export const boardIsEmpty = () => 
  boardElement.querySelector(".piece-component") == null

export const pieceAt = x => y => () => 
  boardElement.querySelector("div[data-location='("+ x + "," + y + ")']")

export const completionStatus = () =>
  sidebarElement.
=======
export const boardIsEmpty = () => true

export const atLocation = x => y => () => "idPiece"
>>>>>>> 4a656599f9da3b18eb00bd2e49b8d44da47fe42d
