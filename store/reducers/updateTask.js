import { parseTask } from '../../lib/parseTask'

export function updateTask (action, { publish, update }) {
  if (action.type !== 'updateTask')
    return

  const task = { ...action.payload.task }
  const { listId } = task

  update(['lists', listId, 'tasks', task.id], {
    ...task,
    ...parseTask(task.raw)
  })

  publish('filterApply', { listId })
  publish('sortTasks', { listId })
}
