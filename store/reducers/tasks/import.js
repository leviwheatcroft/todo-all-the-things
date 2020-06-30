import {
  v4 as uuid
} from 'uuid'
import { parseTask } from '../lib/parseTask'
import { nextLineNumber } from '../lib/nextLineNumber'
import { sortTasks } from '../lib/sortTasks'

export function tasksImport (action, context) {
  if (action.type !== 'tasksImport')
    return

  const { getState, update } = context
  const { payload: { fileContent, listId } } = action
  const firstLineNumber = nextLineNumber(getState().lists[listId].tasks)

  const tasks = { ...getState().lists[listId].tasks }
  fileContent
    .replace(/\r\n?/g, '\n') // easier to convert all line endings before splitting
    .split(/\n/)
    .filter((raw) => raw) // remove empty lines
    .map((raw, idx) => {
      const id = uuid()
      const parsed = parseTask(raw)
      const lineNumber = firstLineNumber + idx
      const filterMatched = getState().filter.regExp.test(raw)
      return {
        id,
        raw,
        listId,
        lineNumber,
        filterMatched,
        ...parsed
      }
    })
    .forEach((task) => { tasks[task.id] = task })

  update(['lists', listId, 'tasks'], sortTasks(tasks, getState().sort))
}
