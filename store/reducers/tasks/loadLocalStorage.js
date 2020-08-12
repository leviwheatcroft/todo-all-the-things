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

  const lists = { ...getState().lists }
  tasks
    .map(({ listId }) => listId)
    .filter((listId, idx, listIds) => listIds.indexOf(listId) === idx)
    .forEach((listId) => {
      if (lists[listId])
        return
      lists[listId] = { id: listId, tasks: [] }
    })

  const filter = getState().filter.regExp
  tasks.forEach((task) => {
    lists[task.listId].tasks[task.id] = {
      ...task,
      filterMatched: filter.test(task.raw),
      ...parseTask(task.raw)
    }
  })

  Object.entries(lists).forEach(([id, list]) => {
    update(['lists', id, 'tasks'], sortTasks(list.tasks, getState().sort))
  })
}
