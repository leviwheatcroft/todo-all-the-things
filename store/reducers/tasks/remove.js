export function tasksRemove (action, { getState, update }) {
  if (action.type !== 'tasksRemove')
    return

  // TODO: get rid of this check
  if (
    action.payload.tasks ||
    action.payload.task
  )
    throw new Error('tasksRemove called with deprecated API')

  const { raws, listId } = action.payload
  const tasks = { ...getState().lists[listId].tasks }
  raws.forEach((raw) => {
    const task = Object.values(tasks).find(({ raw: _raw }) => raw === _raw)
    if (task)
      delete tasks[task.id]
  })
  update(['lists', listId, 'tasks'], tasks)
}
