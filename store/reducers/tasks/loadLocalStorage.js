import { parseTask } from '../lib/parseTask'
import { sortTasks } from '../lib/sortTasks'

export function tasksLoadLocalStorage (action, context) {
  if (action.type !== 'tasksLoadLocalStorage')
    return
  const { payload: { tasks } } = action
  const {
    update,
    getState
  } = context
  const { lists } = getState()
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
    if (lists[listId])
      lists[listId] = { ...lists[listId] }
    else
      lists[listId] = { id: listId, tasks: {} }
    lists[listId].tasks[id] = task
  })
  Object.entries(lists).forEach(([id, list]) => {
    lists[id].tasks = sortTasks(list.tasks, getState().sort)
  })
  update(['lists'], lists)
}
