import { sortTasks } from '../lib/sortTasks'

export function tasksToggleActive (action, { state, update }) {
  if (action.type !== 'tasksToggleActive')
    return
  if (process.env.NODE_ENV !== 'production')
    checkPayloadShape(action.payload)

  const { payload: { task } } = action
  const { id, listId, active } = task

  const tasks = { ...state.lists[listId].tasks }

  // if activating a task, deactivate all others
  if (!task.active) {
    Object.values(tasks).forEach((t) => {
      if (!t.active)
        return
      tasks[t.id] = { ...t, active: false }
    })
  }

  tasks[id] = { ...tasks[id], active: !active }

  update(['lists', listId, 'tasks'], sortTasks(tasks, state.options.sort))
}

function checkPayloadShape (payload) {
  /* eslint-disable no-console */
  console.assert(
    Object.getPrototypeOf(payload.task) === Object.prototype,
    'payload.task must be plain Object', payload.task
  )
  /* eslint-enable */
}
