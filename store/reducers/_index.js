import { wrap } from './lib/dotProp'
import { tasks } from './tasks'
import { dialogs } from './dialogs'
import { options } from './options'
import { lists } from './lists'
import { remoteStorage } from './remoteStorage'
<<<<<<< HEAD
import { upgrade } from './upgrade'
=======
// import { upgrade } from './upgrade'
>>>>>>> sync

import { filterSet } from './filterSet'

const reducers = [
  tasks,
  dialogs,
  options,
  lists,
  remoteStorage,
<<<<<<< HEAD
  upgrade,
=======
  // upgrade,
>>>>>>> sync

  filterSet
]

export function reduce (_state, action, publish) {
  const result = reducers.reduce((state, reducer) => {
    const wrapped = wrap(state)
    function updateTask (task, update) {
      wrapped.set(
        ['lists', task.listId, 'tasks', task.id],
        { ...task, ...update }
      )
    }
    const context = {
      getState: wrapped.get,
      wrapped,
      update: wrapped.set,
      updateTask,
      publish
    }
    reducer(action, context)
    return wrapped.result
  }, _state)
  return result
}
