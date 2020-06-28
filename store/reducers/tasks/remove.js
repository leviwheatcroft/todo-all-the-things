export function tasksRemove (action, { getState, update }) {
  if (action.type !== 'tasksRemove')
    return
  const tasks = action.payload.tasks || [action.payload.task]
  const { listId } = tasks[0]
  const listTasks = { ...getState().lists[listId].tasks }
  tasks.forEach(({ raw }) => {
    const task = Object.values(listTasks).find((task) => task.raw === raw)
    if (task)
      delete listTasks[task.id]
  })
  update(['lists', listId, 'tasks'], listTasks)
}
