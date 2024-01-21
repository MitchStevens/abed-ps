import { boardElement, sidebarElement } from "./Elements"

export const boardIsEmpty = () => 
  boardElement.querySelector(".piece-component") == null

export const pieceAt = x => y => () => 
  boardElement.querySelector("div[data-location='("+ x + "," + y + ")']")

export const completionStatus = () =>
  sidebarElement.