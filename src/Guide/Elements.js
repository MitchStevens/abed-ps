export const puzzleElement  = () => document.querySelector("#puzzle-component")
export const boardElement   = () => document.querySelector("#board-component")
export const sidebarElement = () => document.querySelector("#sidebar-component")

export const completionStatus = () => sidebarElement().querySelector("div.completion-status")

export const boardPortLeft = () => boardElement().querySelector(".board-port[data-direction='left']")
export const boardPortRight = () => boardElement().querySelector(".board-port[data-direction='right']")

export const diagram = () => 
  sidebarElement().querySelector(".board-port-diagram")
export const diagramPortLeft = () =>
  diagram().querySelector("g[data-direction='left']")
export const diagramPortRight = () =>
  diagram().querySelector("g[data-direction='right']")

export const locationAt = loc => () => {
  console.log("div[data-location='("+ loc.x + "," + loc.y + ")']")
  return boardElement().querySelector("div[data-location='("+ loc.x + "," + loc.y + ")']")
}

export const pieceAt = loc => () =>
  location(loc)()?.querySelector(".piece-component")?.dataset.pieceId

export const rotationAt = loc => () =>
  location(loc)()?.querySelector(".piece-component")?.dataset.rotation

export const availablePiece = pieceId => () => {
  return sidebarElement().querySelector("div[data-available-piece='" + pieceId + "']")
}