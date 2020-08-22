export function tasksRemovePurged (action, { getState, update }) {
  if (action.type !== 'tasksRemovePurged')
    return

  Object.keys(getState().lists).forEach((listId) => {
    const { tasks } = getState().lists[listId]
    const purgedIds = Object.values(tasks)
      .filter(({ purged }) => purged)
      .map(({ id }) => id)
    if (!purgedIds.length)
      return
    const filteredTasks = Object.fromEntries(
      ...Object.entries(tasks)
        .filter(([id]) => !purgedIds.includes(id))
    )

    update(['lists', listId, 'tasks'], filteredTasks)
  })
}
