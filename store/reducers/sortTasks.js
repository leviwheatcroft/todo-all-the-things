export function sortTasks (action, { state, update }) {
  if (action.type !== 'sortTasks')
    return

  const { payload: { listId } } = action

  const {
    options: {
      sort: {
        by,
        order,
        priorityAlways,
        completedLast
      }
    },
    lists
  } = state
  const orderMod = order === 'ascending' ? 1 : -1
  const listIds = listId ? [listId] : Object.keys(lists)
  listIds.forEach((listId) => {
    const list = state.lists[listId]
    const tasks = Object.fromEntries(
      Object.values(list.tasks)
        .sort((a, b) => {
          if (completedLast) {
            // true & false evalate to 1 & 0, but undefined is NaN
            const completed = (a.complete || false) - (b.complete || false)
            if (completed)
              return completed * orderMod
          }
          if (priorityAlways) {
            // 'z' is code 122, '{' is code 123
            let priorityA = a.priority || '{'
            priorityA = priorityA.toLowerCase().charCodeAt(0)
            let priorityB = b.priority || '{'
            priorityB = priorityB.toLowerCase().charCodeAt(0)
            const priority = priorityA - priorityB
            if (priority)
              return priority * orderMod
          }
          if (by === 'file')
            return (a.lineNumber - b.lineNumber) * orderMod
          return 1
        })
        .map((task) => [task.id, task])
    )
    update(['lists', listId, 'tasks'], tasks)
  })
}
