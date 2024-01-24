export const pieceAt = loc => () =>
  location(loc)()?.querySelector(".piece-component")?.dataset.pieceId

export const rotationAt = loc => () =>
  location(loc)()?.querySelector(".piece-component")?.dataset.rotation

export const availablePiece = pieceId => () =>
  sidebarElement().querySelector("div[data-available-piece='" + pieceId + "']")