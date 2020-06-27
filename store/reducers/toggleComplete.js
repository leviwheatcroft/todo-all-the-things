export function toggleComplete (action, { publish }) {
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
  publish('tasksUpsert', false, { tasks: [task] })
}
