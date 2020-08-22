import {
  publish,
  // subscribe,
  getState,
  tasksDiff,
  states
} from '../../store'

export { prefix } from '../../lib/prefix'

export function listsEnsureInState (listId) {
  publish('listsEnsureInState', { listId })
}

export function listsRemoveDeleted () {
  publish('listsRemoveDeleted')
}

export function getListsFromState () {
  return Object.values(getState().lists)
}

export function getOptions () {
  return getState().remoteStorage.options
}

export function remoteStorageError (error, errorDetail) {
  publish('remoteStorageError', { error, errorDetail })
}

export function remoteStoragePending () {
  publish('remoteStoragePending')
}

export function remoteStorageUnpending () {
  publish('remoteStorageUnpending')
}

export function setRemoteStorageTouch () {
  publish('remoteStorageTouch', { time: (new Date()).toISOString() })
}

/**
 * tasksPatch - update local tasks by raw comparison
 *
 * this is the best time to detect a conflict, because the raw value of the
 * task to remove won't exist in the current state.
 *
 * during this operation, you reliably detect all the different tasks and
 * versions of those tasks in order to thoroughly identify the conflict.
 */
export function tasksPatch (patch) {
  const {
    added,
    removed,
    // updated, // won't be provided by dropbox
    listId
  } = patch

  publish('listsEnsureInState', { listId })

  // add new remote tasks - this is always done even if theres a conflict
  if (added)
    publish('tasksCreateNew.fromRemote', { raws: added, listId })

  if (!removed)
    return

  // find conflicts
  // https://github.com/leviwheatcroft/todo-all-the-things/wiki/periodic-sync-strategy
  const tasks = Object.values(getState().lists[listId].tasks)
  const conflictedLocals = removed
    .filter((removedRaw) => {
      return !tasks.find(({ raw }) => raw === removedRaw)
    })
    .map((removedRaw) => {
      let localPrev
      states.some((state) => {
        const tasks = Object.values(state.lists[listId].tasks)
        localPrev = tasks.find(({ raw }) => raw === removedRaw)
        return localPrev
      })
      if (!localPrev)
        throw new Error('unable to determine localPrev')

      const localCurrent = getState().lists[listId].tasks[localPrev.id]
      if (!localCurrent)
        throw new Error('unable to determine localNext')
      return localCurrent
    })

  if (conflictedLocals.length) {
    const { added: conflictedRemotes } = tasksDiff(getState(), getState(1))
    publish('tasksConflict', { conflictedLocals, conflictedRemotes })
  }

  // remove tasks removed remotely - won't remove conflicted
  publish('tasksRemove', { raws: removed, listId })
}

export function listsRemoveFromState (listIds) {
  const origin = 'controllerRemoteStorage'
  publish('listsRemoveFromState', { listIds, origin })
}

export function tasksRemovePurged () {
  publish('tasksRemovePurged')
}
