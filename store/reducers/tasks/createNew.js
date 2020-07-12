import {
  v4 as uuid
} from 'uuid'
import { parseTask } from '../lib/parseTask'
import { nextLineNumber } from '../lib/nextLineNumber'
import { sortTasks } from '../lib/sortTasks'

export function tasksCreateNew (action, context) {
  if (
    action.type !== 'tasksCreateNew' &&
    action.type !== 'tasksCreateNew.fromRemote'
  )
    return

  const { payload: { listId, raws } } = action
  const {
    getState,
    update
  } = context

  // ensure list exists in state
  if (!getState().lists[listId])
    update(['lists', listId], { id: listId, tasks: {} })

  const firstLineNumber = nextLineNumber(getState().lists[listId].tasks)

  raws.forEach((raw, idx) => {
    const id = uuid()
    const lineNumber = firstLineNumber + idx
    const parsed = parseTask(raw)
    const filterMatched = getState().filter.regExp.test(raw)
    const task = {
      id,
      raw,
      listId,
      lineNumber,
      filterMatched,
      ...parsed
    }
    update(['lists', listId, 'tasks', id], task)
  })

  // re-sort
  update(
    ['lists', listId, 'tasks'],
    sortTasks(getState().lists[listId].tasks, getState().sort)
  )
}
