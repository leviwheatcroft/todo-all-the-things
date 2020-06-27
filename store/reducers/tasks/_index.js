import { tasksCreateNew } from './createNew'
import { tasksLoadLocalStorage } from './loadLocalStorage'
import { tasksToggleComplete } from './toggleComplete'
import { tasksToggleActive } from './toggleActive'

const reducers = [
  tasksCreateNew,
  tasksLoadLocalStorage,
  tasksToggleComplete,
  tasksToggleActive
]

export function tasks (action, context) {
  const { state, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, state)
  return result
}
