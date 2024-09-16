//
//export const removePieceLessonUnsafe = loc => () => {
//  location = locationAt(loc)()
//
//  const driverObj = driver({
//    popoverClass: 'driverjs-theme',
//    steps: [{
//        element: location,
//        popover: {
//          description: "Pieces can be removed by dragging them outside the board"
//        }
//      }, { 
//        element: boardElement(),
//        popover: {
//          description: "Drag the piece outside the board",
//          showButtons: []
//        },
//        onHighlightStarted: () => {
//          new MutationObserver((mutationList, observer) => {
//            mutationList.forEach(record => {
//              record.removedNodes.forEach((node) => {
//                driverObj.moveNext()
//                observer.disconnect()
//              })
//            })
//          }).observe(completionStatus, { childList: true})
//        }
//
//        
//      }
//
//    ]
//  })
//
//
//  driverObj.drive()
//}
//
//export const rotatePieceLesson = loc => () => {
//  const driverObj = abedDriver({
//    popoverClass: 'driverjs-theme',
//    steps: [
//      { element: completionStatus,
//        popover: {
//          description: "Press 'Run Tests' to see if the level is solved",
//          showButtons: []
//        },
//        onHighlightStarted: () => {
//          new MutationObserver((mutationList, observer) => {
//            mutationList.forEach(record => {
//              switch (completionStatus.dataset.completionStatus) {
//                case "failed-test-case":
//                  observer.disconnect()
//                  driverObj.moveNext() 
//                  break;
//                case "completed":
//                  observer.disconnect()
//                  driverObj.destroy()
//                  break;
//                default: break;
//              }
//            })
//          }).observe(completionStatus, { attributes: true})
//        }
//      }
//    ]
//  })
//
//  driverObj.drive() 
//}
//
//export const runTestsLesson = () => {
//
//  const driverObj = abedDriver({
//    popoverClass: 'driverjs-theme',
//    steps: [
//      { element: completionStatus,
//        popover: {
//          description: "Press 'Run Tests' to see if the level is solved",
//          showButtons: []
//        },
//        onHighlightStarted: () => {
//          new MutationObserver((mutationList, observer) => {
//            mutationList.forEach(record => {
//              switch (completionStatus.dataset.completionStatus) {
//                case "failed-test-case":
//                  observer.disconnect()
//                  driverObj.moveNext() 
//                  break;
//                case "completed":
//                  observer.disconnect()
//                  driverObj.destroy()
//                  break;
//                default: break;
//              }
//            })
//          }).observe(completionStatus, { attributes: true})
//        }
//      },
//      { element: puzzle,
//        popover: {
//          description: "Your tests have failed! Add a piece to the center of the board to connect the LEFT port to the RIGHT port",
//          showButtons: []
//        },
//        onHighlightStarted: () => {
//          new MutationObserver((mutationList, observer) => {
//            mutationList.forEach(record => {
//              record.addedNodes.forEach(element => {
//                if (element.classList.contains("piece-component")) {
//                  driverObj.movePrevious()
//                  observer.disconnect()
//                }
//              })
//            })
//          }).observe(location11, { childList: true})
//        }
//      }
//    ]
//  })
//
//  driverObj.drive() 
//}