export function tasksSetPending (action, context) {
  if (action.type !== 'tasksSetPending')
    return

  const { update } = context
  let {
    payload: { tasks }
  } = action
  if (!Array.isArray(tasks))
    tasks = Object.values(tasks)
  tasks.forEach((task) => {
    update(['lists', task.listId, 'tasks', task.id, 'pending'], true)
  })
}
