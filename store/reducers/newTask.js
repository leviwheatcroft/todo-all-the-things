import {
  v4 as uuid
} from 'uuid'
import { parseTask } from '../../lib/parseTask'

export function newTask (action, { state, update, publish }) {
  if (action.type !== 'newTask')
    return

  const { payload: { task: { raw, listId } } } = action
  const id = uuid()
  const lineNumber = Object.values(state.lists[listId].tasks)
    .reduce((lineNumber, task) => {
      return Math.max(lineNumber, task.lineNumber + 1)
    }, 0)
  const task = {
    id,
    lineNumber,
    listId,
    ...parseTask(raw)
  }
  update(['lists', listId, 'tasks', id], task)
  publish('filterApply', { listId })
  publish('sortTasks', { listId })
}
