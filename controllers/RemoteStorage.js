import {
  publish,
  subscribe,
  states,
  tasksDiff
} from '../store'
import { dropbox } from '../drivers'

const _prefix = 'tdw'

export class RemoteStorage {
  constructor () {
    subscribe(/tasksLoadLocalStorage/, this.tasksLoadRemoteStorage.bind(this))
    subscribe(
      [
        /^tasksCreateNew$/,
        /tasksToggleComplete/,
        /tasksEdit/,
        /tasksPurge/,
        /tasksImport/
      ],
      this.setChanged.bind(this)
    )
    this.driver = dropbox
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
    return states[0].driver
  }

  prefix (key) {
    return `${_prefix}-${key}`
  }

  async setChanged ({ getState }) {
    const { tasks } = tasksDiff(states)
    publish('tasksSetPending', { tasks })
    let listIds = tasks
      .map(({ listId }) => listId)
    listIds = listIds.filter((id, idx) => listIds.indexOf(id) === idx)
    // console.log('Remote Storage will store:', listIds)
    listIds.forEach((listId) => {
      this.driver.store(getState().lists[listId])
        .then(() => {
          // const { lists: { [listId]: { tasks } } } = getState()
          publish('tasksUnsetPending', { tasks })
        })
    })
  }

  tasksLoadRemoteStorage ({ state }) {
    // let listIds
    // if (action.type === 'localStorageLoaded')
    //   listIds = Object.keys(state.lists)
    Object.keys(state.lists).forEach((listId) => {
      try {
        this.driver.importTasks(listId)
      } catch (err) {
        console.error(err)
      }
    })
  }
}
