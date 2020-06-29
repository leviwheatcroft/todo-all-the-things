export function tasksRemovePurged (action, { getState, update }) {
  if (action.type !== 'tasksRemovePurged')
    return
  const { payload: { listId } } = action
  const tasks = Object.fromEntries(
    Object.values(getState().lists[listId].tasks)
      .filter(({ purged }) => !purged)
      .map((task) => [task.id, task])
  )
  update(['lists', listId, 'tasks'], tasks)
}
