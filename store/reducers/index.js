import { wrap } from '../../lib/dotProp'
import { loadTasks } from './loadTasks'
import { newTask } from './newTask'
import { toggleComplete } from './toggleComplete'
import { toggleDialog } from './toggleDialog'
import { importTasks } from './importTasks'
import { toggleTaskActive } from './toggleTaskActive'
import { updateTask } from './updateTask'
import { filterApply } from './filterApply'
import { filterSet } from './filterSet'
import { sortTasks } from './sortTasks'
import { purgeTasks } from './purgeTasks'

const reducers = [
  loadTasks,
  newTask,
  toggleComplete,
  toggleDialog,
  importTasks,
  toggleTaskActive,
  updateTask,
  filterApply,
  filterSet,
  sortTasks,
  purgeTasks
]

export function reduce (currentState, action, publish) {
  return reducers.reduce((state, reducer) => {
    const wrapped = wrap(state)
    reducer(action, { state, update: wrapped.set, publish })
    return wrapped.result
  }, currentState)
}
