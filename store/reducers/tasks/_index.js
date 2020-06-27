import { tasksCreateNew } from './createNew'
import { tasksLoadLocalStorage } from './loadLocalStorage'

const reducers = [
  tasksCreateNew,
  tasksLoadLocalStorage
]

export function tasks (action, context) {
  const { state, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, state)
  return result
}
