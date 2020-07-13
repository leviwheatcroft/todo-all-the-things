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

export class RemoteStorage {
  constructor () {
    // the order in which listeners are subscribed is the list in which they
    // will be executed
    // both this.driverSelect and this.tasksLoadRemoteStorage are handlers
    // for the 'optionsDriverSave' action.
    // because this.driverSelect is subscribed first, it will be called first
    subscribe([
      /optionsDriverSave/
    ], this.driverSelect.bind(this))
    subscribe([
      /optionsLoadLocalStorage/,
      /optionsDriverSave/,
      /requestSync/
    ], this.tasksLoadRemoteStorage.bind(this))
    subscribe([
      /^tasksCreateNew$/,
      /tasksToggleComplete/,
      /tasksEdit/,
      /tasksPurge/,
      /tasksImport/,
      /tasksConflictResolve/
    ], this.setChanged.bind(this))
    subscribe([
      /listsAdd/
    ], this.listsAdd.bind(this))

    this.driverSelect({ getState })
  }

  driverSelect ({ getState }) {
    const selected = getState().remoteStorage.driver
    this.driver = selected ? drivers[selected] : false
    if (!this.driver)
      return

    this.driver.initialise({
      tasksPatch: this.tasksPatch.bind(this),
      tasksRemovePurged: this.tasksRemovePurged.bind(this),
      getOptions: this.getOptions.bind(this),
      prefix: this.prefix.bind(this),
      listsEnsure: this.listsEnsure.bind(this),
      remoteStoragePending: this.remoteStoragePending.bind(this),
      remoteStorageUnpending: this.remoteStorageUnpending.bind(this)
    })
  }

  remoteStoragePending () {
    publish('remoteStoragePending')
  }

  remoteStorageUnpending () {
    publish('remoteStorageUnpending')
  }

  listsEnsure (listId) {
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
  tasksPatch (patch) {
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

  tasksRemovePurged (listId) {
    publish('tasksRemovePurged', { listId })
  }

  getOptions () {
    return getState().remoteStorage
  }

  prefix (key) {
    return `${_prefix}-${key}`
  }

  async setChanged ({ states, getState }) {
    if (!this.driver)
      return
    const { remoteStorage: { refreshInterval } } = getState()
    const { tasks } = tasksDiff(states)

    // TODO: remove this check
    const { listId } = tasks[0]
    if (tasks.some(({ listId: _listId }) => listId !== _listId))
      throw new Error('only one list should be updated at a time?!')

    // show spinners
    publish('tasksSetPending', { tasks })

    // pull list before sending any updates
    await this.driver.importTasks(listId)

    await this.driver.store(listId, getState().lists[listId])

    // remove spinners
    publish('tasksUnsetPending', { tasks })

    // set next refresh
    this.setReload(refreshInterval)
  }

  setReload (refreshInterval) {
    if (!refreshInterval) {
      console.error('no refreshInterval!')
      return
    }
    if (reload)
      clearTimeout(reload)
    reload = setTimeout(
      this.tasksLoadRemoteStorage.bind(this),
      refreshInterval,
      { getState }
    )
  }

  tasksLoadRemoteStorage (context) {
    const { getState } = context
    if (
      !this.driver &&
      !getState().remoteStorage.driver
    )
      return
    if (!this.driver)
      this.driverSelect(context)
    this.driver.importTasks()

    const {
      // lists,
      remoteStorage: { refreshInterval }
    } = getState()

    if (reload)
      clearTimeout(reload)
    reload = setTimeout(
      this.tasksLoadRemoteStorage.bind(this),
      refreshInterval,
      { getState }
    )
  }

  listsAdd ({ action, getState }) {
    const { lists } = getState()
    const { payload: { listId } } = action
    this.driver.store(lists[listId])
  }
}
