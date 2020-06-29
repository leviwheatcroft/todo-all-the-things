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
    subscribe(this.setChanged.bind(this))
    this.driver = dropbox
    this.driver.initialise({
      tasksAdd: this.tasksAdd.bind(this),
      tasksRemove: this.tasksRemove.bind(this),
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

  getOptions () {
    return states[0].options
  }

  prefix (key) {
    return `${_prefix}-${key}`
  }

  async setChanged ({ action, state }) {
    if (
      action.type === 'tasksLoadLocalStorage' ||
      action.type === 'tasksSetPending' ||
      action.type === 'tasksUnsetPending' ||
      action.type === 'tasksCreateNew.fromRemote' ||
      action.type === 'domLoaded'
    )
      return

    const tasks = tasksDiff(states)
    publish('tasksSetPending', { tasks })
    let listIds = tasks
      .map(({ listId }) => listId)
    listIds = listIds.filter((id, idx) => listIds.indexOf(id) === idx)
    // console.log('Remote Storage will store:', listIds)
    listIds.forEach((listId) => {
      this.driver.store(state.lists[listId])
        .then(() => {
          publish('tasksUnsetPending', { tasks: state.lists[listId].tasks })
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
