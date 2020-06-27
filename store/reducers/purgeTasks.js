export function purgeTasks (action, { state, update }) {
  if (action.type !== 'purgeTasks')
    return

  Object.values(state.lists).forEach(({ id: listId, tasks }) => {
    tasks = Object.fromEntries(
      Object.values(tasks)
        .map((task) => {
          if (task.completed)
            task = { ...task, purged: true }
          return [task.id, task]
        })
    )
    update(['lists', listId, 'tasks'], tasks)
  })
}
