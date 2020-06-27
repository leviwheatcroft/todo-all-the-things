import { wrap } from '../../lib/dotProp'
import { tasks } from './tasks'

// import { tasksUpsert } from './tasksUpsert'
import { tasksRemove } from './tasksRemove'
// import { toggleComplete } from './toggleComplete'
import { toggleDialog } from './toggleDialog'
// import { toggleTaskActive } from './toggleTaskActive'
// import { updateTask } from './updateTask'
import { filterApply } from './filterApply'
import { filterSet } from './filterSet'
import { sortTasks } from './sortTasks'
import { purgeTasks } from './purgeTasks'

const reducers = [
  tasks,

  // tasksUpsert,
  tasksRemove,
  // toggleComplete,
  toggleDialog,
  // toggleTaskActive,
  // updateTask,
  filterApply,
  filterSet,
  sortTasks,
  purgeTasks
]

export function reduce (_state, action, publish) {
  const result = reducers.reduce((state, reducer) => {
    const wrapped = wrap(state)
    const context = {
      state,
      wrapped,
      update: wrapped.set,
      publish
    }
    reducer(action, context)
    return wrapped.result
  }, _state)
  return result
}
