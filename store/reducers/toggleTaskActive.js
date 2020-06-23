export function toggleTaskActive (action, { state, update }) {
  if (action.type !== 'toggleTaskActive')
    return

  const { payload: { task } } = action
  const { id, listId, active } = task

  const tasks = { ...state.lists[listId].tasks }

  // if activating a task, deactivate all others
  if (!task.active) {
    Object.values(tasks).forEach((t) => {
      if (!t.active)
        return
      tasks[t.id] = { ...t, active: false }
    })
  }

  tasks[id] = { ...tasks[id], active: !active }

  update(['lists', task.listId, 'tasks'], tasks)
}
