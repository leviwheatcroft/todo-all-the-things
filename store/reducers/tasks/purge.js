export function tasksPurge (action, { getState, update }) {
  if (action.type !== 'tasksPurge')
    return

  const {
    selectedListId,
    lists
  } = getState()

  const tasks = Object.fromEntries(
    Object.values(lists[selectedListId].tasks)
      .map((task) => {
        if (task.complete)
          task = { ...task, purged: true }
        return [task.id, task]
      })
  )
  update(['lists', selectedListId, 'tasks'], tasks)
}
