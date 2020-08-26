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
      Object.values(tasks)
        // exclude purged
        .filter(({ id }) => !purgedIds.includes(id))
        // reassign line numbers
        .sort((a, b) => a.lineNumber - b.lineNumber)
        .map((task, idx) => ({ ...task, lineNumber: idx + 1 }))
        // as entries
        .map((task) => [task.id, task])
    )

    update(['lists', listId, 'tasks'], filteredTasks)
  })
}
