//import { boardPortElementString, diagramElement, diagramPortElementString, puzzleElement } from "../../../Guide/Elements.js";
import * as element from "../../src/Guide/Element.js";
import { driver } from "driver.js";


export const addIdPieceLesson = () => {
  const idPiece = element.avilablePiece("id-piece")()
  const location00 = element.locationAt({x: 0, y: 0})() 

  const driverObj = driver({
    popoverClass: 'driverjs-theme',
    steps: [
      { element: idPiece,
        popover:
          { description: "Click on the piece"
          , showButtons: []
          },
        onHighlighted: () => idPiece.addEventListener(
          "click",
          () => driverObj.moveNext(),
          { once: true }
        )
        
        
      },
      { element: location00,
        popover: { description: "The piece is then added to the first empty slot on the board" }
      }
    ],
  })

  driverObj.drive() 
}


export const movePieceToLeftLesson = () => {
  const driverObj = driver({
    popoverClass: 'driverjs-theme',
    steps: [
      { element: element.boardPort("left")(),
        popover: { description: "See this arrow here? It's a port that sends a signal into the board" }
      },
      { element: element.boardPort("right")(),
        popover: { description: "Here's another port, but this one sends a signal out of the board. Hmm..." }
      },
      { element: element.board(),
        popover:
        { description: "Drag this piece to the square below",
          showButtons: []
        },
        onHighlighted: () => {
          new MutationObserver((mutationList, observer) => {
            driverObj.moveNext()
            observer.disconnect()
          }).observe(element.diagramPort("left")(), { attributes: true })
        }
      },
      { element: element.diagram(),
        popover: { description: "Hey look at that! The LEFT arrow turned green!" }
      },
      { element: element.puzzle(),
        popover: 
        { description: "Alright... now we're getting somewhere. Add another piece and drag it to the RIGHT side.",
          showButtons: []
        },
        onHighlightStarted: () =>
          new MutationObserver((mutationList, observer) => {
            driverObj.moveNext()
            observer.disconnect()
          }).observe(element.diagramPort("right")(), { attributes: true })
      },
      { element: element.diagram(),
        popover: { description: "Hey look at that! The RIGHT arrow turned green! All the ports are connected to pieces!" }
      },
      { element: element.locationAt({x: 1, y: 1})(),
        popover: { description: "So now we just gotta fill in that gap..." }
      }
    ]
  })

  driverObj.drive() 
}