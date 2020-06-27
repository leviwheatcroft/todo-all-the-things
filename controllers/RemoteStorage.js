import {
  publish,
  subscribe,
  states,
  tasksDiff
} from '../store'
import { dropbox } from '../drivers'
import { LocalStorage } from './LocalStorage'

const _prefix = 'tdw'

export class RemoteStorage {
  constructor () {
    subscribe(/localStorageLoaded/, this.importTasks.bind(this))
    subscribe(/tasksUpsert/, this.tasksUpsert.bind(this))
    this.driver = dropbox
    this.driver.initialise({
      tasksAdd: this.tasksAdd.bind(this),
      tasksRemove: this.tasksRemove.bind(this),
      getOptions: this.getOptions.bind(this),
      prefix: this.prefix.bind(this)
    })
  }

  tasksAdd (tasks) {
    publish('tasksAdd', { tasks })
  }

  tasksRemove (tasks) {
    publish('tasksRemove', { tasks })
  }

  getOptions () {
    return states[0].options
  }

  prefix (key) {
    return `${_prefix}-${key}`
  }

  tasksUpsert ({ action: { origin }, state }) {
    if (
      origin === this ||
      origin instanceof LocalStorage
    )
      return
    const tasks = tasksDiff(states)
    let listIds = tasks
      .map(({ listId }) => listId)
    listIds = listIds.filter((id, idx) => listIds.indexOf(id) === idx)
    // console.log('Remote Storage will store:', listIds)
    listIds.forEach((listId) => {
      let upsert
      upsert = [
        ...tasks
          .filter((task) => task.listId === listId)
          .map((task) => ({ ...task, pendingRemote: true }))
      ]
      publish('tasksUpsert', this, { tasks: upsert })
      this.driver.store(state.lists[listId])
        .then(() => {
          upsert = upsert.map((task) => ({ ...task, pendingRemote: false }))
          publish('tasksUpsert', this, { tasks: upsert })
        })
    })
  }

  importTasks ({ action, state }) {
    let listIds
    if (action.type === 'localStorageLoaded')
      listIds = Object.keys(state.lists)
    listIds.forEach((listId) => {
      try {
        this.driver.importTasks(listId)
      } catch (err) {
        console.error(err)
      }
    })
  }
}
