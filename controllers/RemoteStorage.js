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
    const {
      lists,
      remoteStorage: { refreshInterval }
    } = getState()
    const { tasks } = tasksDiff(states)
    publish('tasksSetPending', { tasks })
    let listIds = tasks
      .map(({ listId }) => listId)
    listIds = listIds.filter((id, idx) => listIds.indexOf(id) === idx)
    listIds.forEach((listId) => {
      this.driver.store(lists[listId])
        .then(() => {
          publish('tasksUnsetPending', { tasks })
        })
    })
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
