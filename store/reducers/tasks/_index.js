import { tasksCreateNew } from './createNew'
import { tasksLoadLocalStorage } from './loadLocalStorage'
import { tasksToggleComplete } from './toggleComplete'
import { tasksToggleActive } from './toggleActive'
import { tasksEdit } from './edit'

const reducers = [
  tasksCreateNew,
  tasksLoadLocalStorage,
  tasksToggleComplete,
  tasksToggleActive,
  tasksEdit
]

export function tasks (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
