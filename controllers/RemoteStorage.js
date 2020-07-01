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
    // the ordre in which listeners are subscribed is the list in which they
    // will be executed, so here the new driver will be selected & initialised
    // before this.tasksLoadRemoteStorage is called
    subscribe(/optionsDriverSave/, this.driverSelect.bind(this))
    subscribe([
      /tasksLoadLocalStorage/,
      /optionsDriverSave/
    ], this.tasksLoadRemoteStorage.bind(this))
    subscribe([
      /^tasksCreateNew$/,
      /tasksToggleComplete/,
      /tasksEdit/,
      /tasksPurge/,
      /tasksImport/
    ], this.setChanged.bind(this))

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
      prefix: this.prefix.bind(this)
    })
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
    if (reload)
      clearTimeout(reload)
    reload = setTimeout(
      this.tasksLoadRemoteStorage.bind(this),
      refreshInterval,
      { getState }
    )
  }

  tasksLoadRemoteStorage ({ getState }) {
    if (!this.driver)
      return
    const {
      lists,
      remoteStorage: { refreshInterval }
    } = getState()

    Object.keys(lists).forEach((listId) => {
      try {
        this.driver.importTasks(listId)
      } catch (err) {
        console.error(err)
      }
    })
    if (reload)
      clearTimeout(reload)
    reload = setTimeout(
      this.tasksLoadRemoteStorage.bind(this),
      refreshInterval,
      { getState }
    )
  }
}
