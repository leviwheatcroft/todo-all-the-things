export function purgeTasks (action, { state, update }) {
  if (action.type !== 'purgeTasks')
    return

  Object.values(state.lists).forEach(({ id: listId, tasks }) => {
    tasks = Object.fromEntries(
      Object.values(tasks)
        .filter((task) => !task.complete)
        .map((task) => [task.id, task])
    )
    update(['lists', listId, 'tasks'], tasks)
  })
}
