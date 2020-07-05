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

  const { payload: { listId, tasks: newTasks } } = action
  const {
    getState,
    update
  } = context

  // ensure list exists in state
  if (!getState().lists[listId])
    update(['lists', listId], { id: listId, tasks: {} })
  const tasks = { ...getState().lists[listId].tasks }
  const firstLineNumber = nextLineNumber(tasks)
  newTasks.forEach(({ raw }, idx) => {
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
    tasks[id] = task
  })
  update(['lists', listId, 'tasks'], tasks)
  update(
    ['lists', listId, 'tasks'],
    sortTasks(getState().lists[listId].tasks, getState().sort)
  )
}
