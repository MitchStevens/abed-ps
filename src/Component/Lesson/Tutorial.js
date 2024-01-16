import { driver } from "driver.js";

export const addPieceLesson = () => {
    const idPiece = document.querySelector("div[data-avilable-piece='id-piece']")
    const pieceLocation = document.querySelector("div[data-location='(0,1)']")

    const driver = driver({
        steps:
            [ { element: idPiece, popover: { title: "Mouse down on the piece" }}
            , { element: pieceLocation, popover: { title: "Drag the piece to the board" }}
            ]
    })

    idPiece.addEventListener("mousedown", () => driver.moveNext(), { once: true})
    pieceLocation.addEventListener("onDrop", () => driver.moveNext(), { once: true})

    return driver.drive() 
}
