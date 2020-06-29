/* eslint-disable max-classes-per-file */
import {
  subscribe,
  publish,
  states,
  tasksDiff
} from '../store'

const _prefix = 'tdw'

function prefix (body) {
  return `${_prefix}-${body}`
}

export class LocalStorage {
  constructor () {
    subscribe(
      [
        /^tasksCreateNew$/,
        /^tasksCreateNew\.fromRemote$/,
        /tasksToggleComplete/,
        /tasksEdit/,
        /tasksPurge/,
        /tasksRemove/,
        /tasksRemovePurged/,
        /tasksImport/
      ],
      this.setChanged.bind(this)
    )
    subscribe(/domLoaded/, this.domLoaded.bind(this))
  }

  domLoaded () {
    const tasks = this.getAll()
    publish('tasksLoadLocalStorage', { tasks })
  }

  setChanged ({ action: { type } }) {
    if (type === 'tasksLoadLocalStorage')
      return
    const { added, updated, removed } = tasksDiff(states)
    const tasks = [...added, ...updated]
    tasks.forEach((task) => {
      const storedTask = {
        id: task.id,
        listId: task.listId,
        raw: task.raw,
        purged: task.purged,
        lineNumber: task.lineNumber
      }
      localStorage.setItem(
        prefix(task.id),
        JSON.stringify(storedTask)
      )
    })
    removed.forEach((task) => {
      localStorage.removeItem(prefix(task.id))
    })
  }

  getAll () {
    const rePrefix = new RegExp(_prefix)
    const reUuid = /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    let idx = 0
    let key
    const tasks = []
    // eslint-disable-next-line no-cond-assign
    while ((key = localStorage.key(idx)) !== null) {
      if (rePrefix.test(key) && reUuid.test(key))
        tasks.push(JSON.parse(localStorage.getItem(key)))
      idx += 1
    }
    return tasks
  }
}

// const storage = require('../lib/storage')
// const {
//   StateObserver
// } = require('../lib/StateObserver')

// class Storage extends StateObserver {
// constructor () {
//   super()
//   this.registry = []
//   const registry = localStorage.getItem('tdt-registry')
//   if (registry)
//     this.registry = JSON.parse(registry)
//   this.initializeStateObserver()
//   this.subscribe('domLoaded', this.domLoaded.bind(this))
//   this.subscribe('updateExistingTask', this.setTask.bind(this))
//   this.subscribe('saveNewTask', this.setTask.bind(this))
//   this.subscribe('importTasks', this.importTasks.bind(this))
//   this.subscribe('purgeCompleted', this.purgeCompleted.bind(this))
//   this.subscribe('taskToggleComplete', this.setTask.bind(this))
// }
//
//   domLoaded () {
//     const state = {
//       contexts: [],
//       projects: [],
//       lists: { todo: { id: 'todo' } },
//       tasks: {},
//       tasksMeta: {}
//     }
//     storage.getAll().forEach((t) => {
//       state.contexts.push(...t.contexts || [])
//       state.projects.push(...t.projects || [])
//       state.lists[t.list] = state.lists[t.list] || { id: t.list }
//       state.tasks[t.id] = t
//       state.tasksMeta[t.id] = { id: t.id }
//     })
//     Object.entries(state).forEach(([key, array]) => {
//       if (!Array.isArray(array))
//         return
//       state[key] = array.filter((i, idx) => array.indexOf(i) === idx)
//     })
//     this.publish({
//       type: 'storageLoaded',
//       modifier (s) {
//         Object.assign(s, state)
//         return s
//       }
//     })
//   }
//
//   importTasks () {
//     Object.entries(this.states[0].tasks).filter(([id]) => {
//       if (this.states[0].tasksMeta[id].newTask)
//         return false
//       return !this.registry.includes(id)
//     })
//       .forEach(([id, task]) => {
//         localStorage.setItem(id, JSON.stringify(task))
//         this.registry.push(id)
//       })
//     localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
//   }
//
//   purgeCompleted () {
//     const removed = this.registry.filter((id) => !this.states[0].tasks[id])
//     removed.forEach((id) => {
//       localStorage.removeItem(id)
//     })
//     this.registry = this.registry.filter((id) => !removed.includes(id))
//     localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
//   }
//
//   setTask (advent) {
//     const { data: { id } } = advent
//     const task = this.states[0].tasks[id]
//     if (!this.registry.includes(id)) {
//       this.registry.push(id)
//       localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
//     }
//     localStorage.setItem(task.id, JSON.stringify(task))
//   }
//
//   getTask (id) {
//     return JSON.parse(localStorage.getItem(id))
//   }
//
//   getAllTasks () {
//     const tasks = []
//     this.registry.forEach((i) => tasks.push(this.get(i)))
//     return tasks
//   }
//
//   removeTask (id) {
//     localStorage.removeItem(id)
//     this.registry = this.registry.filter((val) => val !== id)
//     localStorage.setItem('tdt-registry', JSON.stringify(this.registry))
//   }
// }
//
// Storage.prototype.controllerName = 'Storage'
//
// module.exports = Storage
