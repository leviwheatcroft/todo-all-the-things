import { tasksConflictResolve } from './conflictResolve'
import { tasksCreateNew } from './createNew'
import { tasksEdit } from './edit'
import { tasksImport } from './import'
import { tasksLoadLocalStorage } from './loadLocalStorage'
import { tasksPurge } from './purge'
import { tasksRemove } from './remove'
import { tasksRemovePurged } from './removePurged'
import { tasksSetPending } from './setPending'
import { tasksToggleActive } from './toggleActive'
import { tasksToggleComplete } from './toggleComplete'
import { tasksUnsetPending } from './unsetPending'
import { tasksUpdateLineNumbers } from './updateLineNumbers'

const reducers = [
  tasksConflictResolve,
  tasksCreateNew,
  tasksEdit,
  tasksImport,
  tasksLoadLocalStorage,
  tasksPurge,
  tasksRemove,
  tasksRemovePurged,
  tasksSetPending,
  tasksToggleActive,
  tasksToggleComplete,
  tasksUnsetPending,
  tasksUpdateLineNumbers
]

export function tasks (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
