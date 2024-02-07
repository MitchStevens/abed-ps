import { annotate, annotationGroup } from 'rough-notation';
import * as element from '../../src/Guide/Element.js';

const clickHereConfig = { type: "box", color: "blue"}
const lookHereConfig = { type: "circle", color: "red", padding: 15 }


export const addPiece = (onError, onSuccess) => {
  const idPiece = element.avilablePiece("id-piece")()
  const location00 = element.locationAt({ x: 0, y: 0 })()

  const idPieceAnnotation = annotate(
      idPiece,
      clickHereConfig
  )
  const location00Annotation = annotate(
    location00, 
    lookHereConfig
  )
  
  try {
    idPieceAnnotation.show()

    idPiece.addEventListener(
      "click",
      () => {
        idPieceAnnotation.remove()
        location00Annotation.show()
        setTimeout(
          () => {
            location00Annotation.remove()
            onSuccess()
          },
          3500
        )
      },
      { once: true }
    )
  } catch(error) {
    onError(error)
  }

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    idPieceAnnotation.remove()
    location00Annotation.remove()
    onCancelerSuccess()
  };
}

export const movePieceFromTo = src => dst => (onError, onSuccess) => {
  const srcElement = element.locationAt(src)()
  const srcPiece = srcElement.querySelector(".piece-component")
  const dstElement = element.locationAt(dst)()

  const srcAnnotation = annotate(srcElement, clickHereConfig)
  const dstAnnotation = annotate(dstElement, lookHereConfig)

  srcAnnotation.show()
  srcPiece.addEventListener(
    "mousedown",
    () => {
      srcAnnotation.remove()
      dstAnnotation.show()
      dstElement.addEventListener(
        "mouseenter",
        () => {
          dstAnnotation.remove()
          onSuccess()
        },
        { once: true }
      )
    },
    { once: true }
  )

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    srcAnnotation.remove()
    dstAnnotation.remove()
    onCancelerSuccess()
  };
}

export const runTests = (onError, onSuccess) => {
  const runTestsButton = document.querySelector("div.completion-status[data-completion-status='ready-for-testing'] button")

  const runTestsAnnotation = annotate(runTestsButton, clickHereConfig)
  runTestsAnnotation.show()
  runTestsButton.addEventListener(
    "click",
    () => {
      runTestsAnnotation.remove()
      onSuccess()
    },
    { once: true }
  )

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    srcAnnotation.remove()
    dstAnnotation.remove()
    onCancelerSuccess()
  };
}

export const backToLevelSelect = () => {
  const backToLevelSelectButton = document.querySelector("div.completion-status[data-completion-status='completed'] .back-to-level-select")

  const backToLevelSelectAnnotation = annotate(backToLevelSelectButton, clickHereConfig)
  backToLevelSelectAnnotation.show()

  backToLevelSelectButton.addEventListener(
    "click",
    () => backToLevelSelectAnnotation.remove,
    { once: true}
  )
}