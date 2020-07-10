import { tasksCreateNew } from './createNew'
import { tasksLoadLocalStorage } from './loadLocalStorage'
import { tasksToggleComplete } from './toggleComplete'
import { tasksToggleActive } from './toggleActive'
import { tasksEdit } from './edit'
import { tasksPurge } from './purge'
import { tasksRemove } from './remove'
import { tasksRemovePurged } from './removePurged'
import { tasksImport } from './import'
import { tasksSetPending } from './setPending'
import { tasksUnsetPending } from './unsetPending'
import { tasksConflict } from './conflict'

const reducers = [
  tasksCreateNew,
  tasksLoadLocalStorage,
  tasksToggleComplete,
  tasksToggleActive,
  tasksEdit,
  tasksPurge,
  tasksRemove,
  tasksRemovePurged,
  tasksImport,
  tasksSetPending,
  tasksUnsetPending,
  tasksConflict
]

export function tasks (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
