import { parseTask } from '../lib/parseTask'
import { sortTasks } from '../lib/sortTasks'
import { assertShape } from '../lib/assertTypes'

export function tasksLoadLocalStorage (action, context) {
  if (action.type !== 'tasksLoadLocalStorage')
    return
  if (process.env.NODE_ENV !== 'production')
    checkPayloadShape(action.payload)
  const { payload: { tasks } } = action
  const {
    update,
    getState
  } = context
  const lists = {}
  tasks.forEach((task) => {
    const parsed = parseTask(task.raw)
    const filterMatched = getState().filter.regExp.test(task.raw)
    task = {
      ...task,
      filterMatched,
      ...parsed
    }
    const {
      id,
      listId
    } = task
    lists[listId] = lists[listId] || { id: listId, tasks: {} }
    lists[listId].tasks[id] = task
  })
  Object.entries(lists).forEach(([id, list]) => {
    lists[id].tasks = sortTasks(list.tasks, getState().options.sort)
  })
  update(['lists'], lists)
}

function checkPayloadShape (payload) {
  /* eslint-disable no-console */
  console.assert(
    Object.getPrototypeOf(payload.tasks) === Array.prototype,
    'payload.tasks must be Array', payload.tasks
  )
  const uuidRe = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  payload.tasks.forEach((task) => {
    assertShape(task, {
      id: [String, (v) => uuidRe.test(v)],
      listId: String,
      raw: String,
      lineNumber: [Number, (v) => v !== 0]
    })
  })
  /* eslint-enable */
}
