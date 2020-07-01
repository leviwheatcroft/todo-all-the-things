import { optionsLoadLocalStorage } from './loadLocalStorage'
import { optionsDriverSave } from './driverSave'

const reducers = [
  optionsLoadLocalStorage,
  optionsDriverSave
]

export function options (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
