export function toggleComplete (action, { state, publish, update }) {
  if (action.type !== 'toggleComplete')
    return

  let { payload: { task } } = action
  task = { ...task }
  task.complete = !task.complete
  const re = /^\s?x\s/i
  if (task.complete)
    task.raw = ` x ${task.raw}`
  else
    task.raw = task.raw.replace(re, '')
  update(['lists', task.listId, 'tasks', task.id], task)
  if (state.options.sort.completedLast)
    publish('sortTasks')
}
