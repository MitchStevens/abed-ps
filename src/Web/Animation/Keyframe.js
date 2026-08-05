export const emptyKeyframe = () => ({})

export const combineKeyframes = (a, b) => ({ ...a, ...b })

export const singletonKeyframe = (property, value) => ({ [property]: value })

export const singletonKeyframeNumber = (property) => (value) => ({ [property]: value })