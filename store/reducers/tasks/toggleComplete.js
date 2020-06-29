import { sortTasks } from '../lib/sortTasks'

export function tasksToggleComplete (action, context) {
  if (action.type !== 'tasksToggleComplete')
    return
  if (process.env.NODE_ENV !== 'production')
    checkPayloadShape(action.payload)

  const { getState, update } = context
  let { payload: { task } } = action
  const { listId } = task
  task = { ...task }
  task.complete = !task.complete
  if (task.complete)
    task.raw = ` x ${task.raw}`
  else
    task.raw = task.raw.replace(/^\s?x\s/i, '')
  const tasks = { ...getState().lists[listId].tasks, [task.id]: task }
  update(['lists', listId, 'tasks'], sortTasks(tasks, getState().options.sort))
}

function checkPayloadShape (payload) {
  /* eslint-disable no-console */
  console.assert(
    Object.getPrototypeOf(payload.task) === Object.prototype,
    'payload.task must be plain Object', payload.task
  )
  /* eslint-enable */
}
