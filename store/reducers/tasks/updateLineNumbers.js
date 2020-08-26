export function tasksUpdateLineNumbers (action, context) {
  if (action.type !== 'tasksUpdateLineNumbers')
    return

  const { update, getState } = context
  const { payload: { lines, listId } } = action

  const tasks = Object.values(getState().lists[listId].tasks)
    .sort((a, b) => a.lineNumber - b.lineNumber)

  tasks.forEach((task) => {
    // marking lines[idx] as undefined avoids issues with duplicate tasks
    if (lines[task.lineNumber - 1] === task.raw) {
      lines[task.lineNumber - 1] = undefined
      return
    }

    const idx = lines.indexOf(task.raw)

    let lineNumber
    if (idx >= 0) {
      // incorrect lineNumber
      lineNumber = idx + 1
      lines[idx] = undefined
    } else {
      // new task
      lineNumber = lines.push(undefined) - 1
    }

    update(['lists', listId, 'tasks', task.id, 'lineNumber'], lineNumber)
  })
}
