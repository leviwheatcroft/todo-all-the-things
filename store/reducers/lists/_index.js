import { listsSelect } from './select'
import { listsAdd } from './add'
import { listsEnsure } from './ensure'

const reducers = [
  listsSelect,
  listsAdd,
  listsEnsure
]

export function lists (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
