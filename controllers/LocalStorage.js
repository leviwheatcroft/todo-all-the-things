/* eslint-disable max-classes-per-file */
import { subscribe, publish, states } from '../store'

const _prefix = 'tdw'

function prefix (body) {
  return `${_prefix}-${body}`
}

export class LocalStorage {
  constructor () {
    subscribe(/.*/, this.setTasks.bind(this))
    subscribe(/domLoaded/, this.domLoaded.bind(this))
  }

  domLoaded () {
    publish({
      type: 'loadTasks',
      payload: {
        tasks: this.getAll()
      }
    })
  }

  setTasks () {
    if (!states[1])
      return
    const listIds = Object.keys(states[0].lists).filter((k) => {
      return (
        states[1].lists[k] &&
        states[0].lists[k].tasks !== states[1].lists[k].tasks
      )
    })
    if (!listIds.length)
      return
    listIds.forEach((listId) => {
      const currentTasks = states[0].lists[listId].tasks
      const previousTasks = states[1].lists[listId].tasks

      // remove deleted tasks
      Object.keys(previousTasks)
        .forEach((taskId) => {
          if (currentTasks[taskId])
            return
          localStorage.removeItem(prefix(taskId))
        })

      // update changed tasks
      Object.keys(currentTasks)
        .forEach((taskId) => {
          if (currentTasks[taskId] === previousTasks[taskId])
            return
          const task = currentTasks[taskId]
          const storedTask = {
            id: task.id,
            listId: task.listId,
            raw: task.raw,
            lineNumber: task.lineNumber
          }
          localStorage.setItem(
            prefix(task.id),
            JSON.stringify(storedTask)
          )
        })
    })
  }

  getAll () {
    const re = new RegExp(_prefix)
    let idx = 0
    let key
    const tasks = []
    // eslint-disable-next-line no-cond-assign
    while ((key = localStorage.key(idx)) !== null) {
      if (re.test(key))
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
