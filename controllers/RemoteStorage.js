import {
  publish,
  subscribe,
  getState,
  tasksDiff
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
      /optionsDriverSave/
    ], this.tasksLoadRemoteStorage.bind(this))
    subscribe([
      /^tasksCreateNew$/,
      /tasksToggleComplete/,
      /tasksEdit/,
      /tasksPurge/,
      /tasksImport/
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
      tasksAdd: this.tasksAdd.bind(this),
      tasksRemove: this.tasksRemove.bind(this),
      tasksRemovePurged: this.tasksRemovePurged.bind(this),
      getOptions: this.getOptions.bind(this),
      prefix: this.prefix.bind(this),
      listsEnsure: this.listsEnsure.bind(this)
    })
  }

  listsEnsure (listId) {
    publish('listsEnsure', { listId })
  }

  tasksAdd (tasks, listId) {
    publish('tasksCreateNew.fromRemote', { tasks, listId })
  }

  tasksRemove (tasks, listId) {
    publish('tasksRemove', { tasks, listId })
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
    const diff = tasksDiff(states)
    const { added, removed, tasks } = diff
    let { updated: updatedLocals } = diff

    const { listId } = tasks[0]
    if (tasks.some(({ listId: _listId }) => listId !== _listId))
      throw new Error('only one list should be updated at a time?!')

    // show spinners
    publish('tasksSetPending', { tasks })

    // pull list before sending any updates
    await this.driver.importTasks(listId)

    // check for conflicts
    const { updated: updatedRemotes } = tasksDiff(states)
    updatedLocals.forEach((updatedLocalTask, idx) => {
      const { previousTask } = updatedLocalTask
      const remoteMatch = updatedRemotes.find(({ raw }) => {
        return raw === previousTask.raw
      })
      if (remoteMatch)
        return // ok - no conflict

      // remove conflicted tasks from the set to be posted
      delete updatedLocals[idx]
      // kill spinner
      publish('tasksUnsetPending', { tasks: [updatedLocalTask] })

      // identify remote
      // identifying the remote in this way will not work if the remote list
      // was purged, or line numbers were changed by a manual edit or
      // something

      console.log('updatedRemotes', updatedRemotes)
      console.log('updatedLocalTask', updatedLocalTask)
      const remote = updatedRemotes.find(({ lineNumber }) => {
        return lineNumber === updatedLocalTask.lineNumber
      })
      // set the conflict flags
      publish('tasksConflict', {
        local: updatedLocalTask,
        localOriginal: updatedLocalTask.previousTask,
        remote
      })
    })
    updatedLocals = updatedLocals.filter((i) => i)

    if (
      !added.length &&
      !removed.length &&
      !updatedLocals.length
    )
      return

    // store updates (won't store conflicted)
    await this.driver.store(listId, getState().lists[listId])

    // remove spinners
    publish(
      'tasksUnsetPending',
      { tasks: [...added, ...removed, ...updatedLocals] }
    )

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
    console.log('tasksLoadRemoteStorage')
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
