import {
  v4 as uuid
} from 'uuid'
import { parseTask } from '../../lib/parseTask'

export function importTasks (action, { update, publish }) {
  if (action.type !== 'importTasks')
    return

  const { payload: { lines, listId } } = action
  const tasks = Object.fromEntries(
    lines.map((raw, lineNumber) => {
      const id = uuid()
      return [
        id,
        {
          id,
          listId,
          ...parseTask(raw),
          lineNumber
        }
      ]
    })
  )

  update(['lists', listId, 'tasks'], tasks)
  publish('filterApply', { listId })
  publish('sortTasks', { listId })
}
