import { wrap } from './lib/dotProp'
import { tasks } from './tasks'
import { dialogs } from './dialogs'

import { filterSet } from './filterSet'

const reducers = [
  tasks,
  dialogs,

  filterSet
]

export function reduce (_state, action, publish) {
  const result = reducers.reduce((state, reducer) => {
    const wrapped = wrap(state)
    const context = {
      getState: wrapped.get,
      wrapped,
      update: wrapped.set,
      publish
    }
    reducer(action, context)
    return wrapped.result
  }, _state)
  return result
}
