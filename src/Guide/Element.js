export const puzzle = () => document.querySelector("#puzzle-component")
export const board   = () => document.querySelector("#board-component")
export const sidebar = () => document.querySelector("#sidebar-component")


export const boardPort = direction => () => 
  board().querySelector(".board-port[data-direction='"+ direction +"']")

export const diagram = () => 
  sidebar().querySelector(".board-port-diagram")

export const diagramPort = direction => () =>
  diagram().querySelector("g[data-direction='"+ direction +"']")

export const completionStatus = () =>
  sidebar().querySelector("div.completion-status")

export const locationAt = loc => () =>
  board().querySelector("div[data-location='("+ loc.x + "," + loc.y + ")']")

export const avilablePiece = pieceId => () =>
  sidebar().querySelector("div[data-available-piece='" + pieceId + "']")


export const pieceAt = loc => () =>
  locationAt(loc)()?.querySelector(".piece-component")?.dataset.pieceId

export const rotationAt = loc => () => {
  const rot = locationAt(loc)()?.querySelector(".piece-component")?.dataset.rotation
  return rot ? parseInt(rot) : null
}