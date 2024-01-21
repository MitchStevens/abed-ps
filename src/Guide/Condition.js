import { boardElement, sidebarElement } from "./Elements"

export const boardIsEmpty = () => 
  boardElement.querySelector(".piece-component") == null

export const locationAt = x => y => () => 
  boardElement.querySelector("div[data-location='("+ x + "," + y + ")']")

export const pieceAt = x => y => () => 
  locationAt(x)(y)().querySelector(".piece-component")

export const completionStatus = () => null