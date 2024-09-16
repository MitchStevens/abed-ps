export const addOnClickEventListenerUnsafe = id => value => (onError, onSuccess) => {
    button = document.getElementById(id)

    if (button == null) {
        onError("can't find element with id " + id)
    } else {
        button.addEventListener("click", () => {
            onSuccess(value) 
        })
    }

    return function (cancelError, onCancelerError, onCancelerSuccess) {
        cancel();
        onCancelerSuccess();
    };
}
