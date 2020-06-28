import { parseTask } from '../lib/parseTask'
import { sortTasks } from '../lib/sortTasks'

export function tasksEdit (action, context) {
  if (action.type !== 'tasksEdit')
    return
  let { payload: { task } } = action
  const { id, raw, listId } = task
  const {
    getState,
    update
  } = context
  const parsed = parseTask(raw)
  const filterMatched = getState().filter.regExp.test(raw)
  task = {
    ...task,
    raw,
    filterMatched,
    ...parsed
  }
  update(['lists', listId, 'tasks', id], task)
  update(
    ['lists', listId, 'tasks'],
    sortTasks(getState().lists[listId].tasks, getState().options.sort)
  )
}
