export const animate = (element, keyframes, duration) => {
    return element.animate(keyframes, { duration: duration })
}
export const cancel = (animation) => {
    return animation.cancel()
}
export const finish = (animation) => {
    return animation.finish()
}
export const play = (animation) => {
    return animation.play()
}
export const pause = (animation) => {
    return animation.pause()
}
export const updatePlaybackRate = (animation, playbackRate) => {
    return animation.updatePlaybackRate(playbackRate)
}
export const reverse = (animation) => {
    return animation.reverse()
}
export const persist = (animation) => {
    return animation.persist()
}

