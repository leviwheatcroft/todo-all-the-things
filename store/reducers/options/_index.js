import { optionsLoadLocalStorage } from './loadLocalStorage'

const reducers = [
  optionsLoadLocalStorage
]

export function options (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
