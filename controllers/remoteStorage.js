import {
  publish,
  subscribe,
  getState,
  tasksDiff,
  states
} from '../store'
import drivers from '../drivers'

const _prefix = 'tdw'

let reload
let driver

export function initialiseRemoteStorage () {
  // the order in which listeners are subscribed is the list in which they
  // will be executed
  // both this.driverSelect and this.tasksLoadRemoteStorage are handlers
  // for the 'optionsDriverSave' action.
  // because this.driverSelect is subscribed first, it will be called first
  subscribe([
    /optionsDriverSave/
  ], driverSelect)
  subscribe([
    /optionsLoadLocalStorage/,
    /optionsDriverSave/,
    /requestSync/
  ], tasksLoadRemoteStorage)
  subscribe([
    /^tasksCreateNew$/,
    /tasksToggleComplete/,
    /tasksEdit/,
    /tasksPurge/,
    /tasksImport/,
    /tasksConflictResolve/
  ], setChanged)
  subscribe([
    /listsAdd/
  ], listsAdd)

  driverSelect({ getState })
}

function driverSelect ({ getState }) {
  const selected = getState().remoteStorage.driver
  driver = selected ? drivers[selected] : false
  if (!driver)
    return

  driver.initialise({
    tasksPatch,
    tasksRemovePurged,
    getOptions,
    prefix,
    listsEnsure,
    remoteStoragePending,
    remoteStorageUnpending,
    setRemoteStorageTouch
  })
}

function setRemoteStorageTouch () {
  publish('remoteStorageTouch', (new Date()).toISOString())
}

function remoteStoragePending () {
  publish('remoteStoragePending')
}

function remoteStorageUnpending () {
  publish('remoteStorageUnpending')
}

function listsEnsure (listId) {
  publish('listsEnsure', { listId })
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
function tasksPatch (patch) {
  const {
    added,
    removed,
    // updated, // won't be provided by dropbox
    listId
  } = patch

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
    const { added: conflictedRemotes } = tasksDiff(states)
    publish('tasksConflict', { conflictedLocals, conflictedRemotes })
  }

  // remove tasks removed remotely - won't remove conflicted
  publish('tasksRemove', { raws: removed, listId })
}

function tasksRemovePurged (listId) {
  publish('tasksRemovePurged', { listId })
}

function getOptions () {
  return getState().remoteStorage
}

function prefix (key) {
  return `${_prefix}-${key}`
}

async function setChanged ({ states, getState }) {
  if (!driver)
    return
  const { tasks } = tasksDiff(states)
  if (!tasks.length)
    return

  // TODO: remove this check
  const { listId } = tasks[0]
  if (tasks.some(({ listId: _listId }) => listId !== _listId))
    throw new Error('only one list should be updated at a time?!')

  // show spinners
  publish('tasksSetPending', { tasks })

  // pull list before sending any updates
  await driver.importTasks(listId)

  await driver.store(listId, getState().lists[listId])

  // remove spinners
  publish('tasksUnsetPending', { tasks })

  // set next refresh
  setRemoteStorageReload()
}

export function setRemoteStorageReload (offset = 0) {
  const { remoteStorage: { refreshInterval } } = getState()
  if (!refreshInterval) {
    console.error('no refreshInterval!')
    return
  }
  if (reload)
    clearTimeout(reload)
  reload = setTimeout(
    tasksLoadRemoteStorage,
    refreshInterval + offset,
    { getState }
  )
}

function tasksLoadRemoteStorage (context) {
  const { action, getState } = context
  if (
    action.type === 'optionsLoadLocalStorage' &&
    !action.payload.loadRemoteTasks
  )
    return
  if (
    !driver &&
    !getState().remoteStorage.driver
  )
    return
  if (!driver)
    driverSelect(context)
  driver.importTasks()

  setRemoteStorageReload()
}

function listsAdd ({ action, getState }) {
  const { lists } = getState()
  const { payload: { listId } } = action
  driver.store(lists[listId])
}
