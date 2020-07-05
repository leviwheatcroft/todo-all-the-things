import { listsSelect } from './select'

const reducers = [
  listsSelect
]

export function lists (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
