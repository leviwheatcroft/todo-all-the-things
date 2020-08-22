import { listsSelect } from './select'
import { listsAdd } from './add'
import { listsEnsureInState } from './ensureInState'
import { listsRemoveFromState } from './removeFromState'
import { listsSetDeleted } from './setDeleted'
import { listsRemoveDeleted } from './removeDeleted'

const reducers = [
  listsEnsureInState,
  listsRemoveFromState,
  listsSelect,
  listsAdd,
  listsSetDeleted,
  listsRemoveDeleted
]

export function lists (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
