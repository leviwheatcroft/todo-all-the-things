export function tasksRemove (action, { state, update }) {
  if (action.type !== 'tasksRemove')
    return
  const tasks = action.payload.tasks || [action.payload.task]
  const { listId } = tasks[0]
  const listTasks = { ...state.lists[listId].tasks }
  tasks.forEach(({ raw }) => {
    const task = Object.values(listTasks).find((task) => task.raw === raw)
    if (task)
      delete listTasks[task.id]
  })
  update(['lists', listId, 'tasks'], listTasks)
}
