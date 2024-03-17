export const delayUntilClicked_ = (element) => (onError, onSuccess) => {
  const onClick = (event) => { onSuccess() }
  const options = { once: true }
  element.addEventListener( "click", onClick, options )

  return function (cancelError, onCancelerError, onCancelerSuccess) {
    element.removeEventListener("click", onClick, options )
    onCancelerSuccess()
  };
}