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

  // this only happens once, there won't be anything in state
  // so just create a new lists structure

  const lists = Object.fromEntries(
    tasks
      .map(({ listId }) => listId)
      .filter((listId, idx, listIds) => listIds.indexOf(listId) === idx)
      .map((listId) => [listId, { id: listId, tasks: {} }])
  )

  const filter = getState().filter.regExp
  tasks.forEach((task) => {
    lists[task.listId].tasks[task.id] = {
      ...task,
      filterMatched: filter.test(task.raw),
      ...parseTask(task.raw)
    }
  })

  const { sort } = getState()
  Object.values(lists).forEach((list) => {
    list.tasks = sortTasks(list.tasks, sort)
  })

  update(['lists'], lists)
}
