export function tasksUnsetPending (action, context) {
  if (action.type !== 'tasksUnsetPending')
    return

  const { update } = context
  let {
    payload: { tasks }
  } = action
  if (!Array.isArray(tasks))
    tasks = Object.values(tasks)
  tasks.forEach((task) => {
    update(['lists', task.listId, 'tasks', task.id, 'pending'], false)
  })
}
