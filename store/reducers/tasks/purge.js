export function tasksPurge (action, { getState, update }) {
  if (action.type !== 'tasksPurge')
    return

  Object.values(getState().lists).forEach(({ id: listId, tasks }) => {
    tasks = Object.fromEntries(
      Object.values(tasks)
        .map((task) => {
          if (task.complete)
            task = { ...task, purged: true }
          return [task.id, task]
        })
    )
    update(['lists', listId, 'tasks'], tasks)
  })
}
