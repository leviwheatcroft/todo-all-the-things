import { dialogsToggle } from './toggle'

const reducers = [
  dialogsToggle
]

export function dialogs (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
