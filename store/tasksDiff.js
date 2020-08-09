export function tasksDiff (states, previous) {
  const current = states[0]
  if (!previous)
    [, previous] = states
  const { lists: currentLists } = current
  const added = []
  const updated = []
  const removed = []
  Object.values(currentLists).forEach((currentList) => {
    if (
      !previous ||
      !previous.lists[currentList.id]
    )
      return updated.push(...Object.values(currentList.tasks))

    const previousList = previous.lists[currentList.id]
    if (currentList === previousList)
      return
    Object.values(currentList.tasks).forEach((currentTask) => {
      const previousTask = previousList.tasks[currentTask.id]
      if (!previousTask)
        added.push(currentTask)
      else if (
        // TODO: why compare raw & purged here ? why not just check if the
        // object has changed ?
        currentTask.raw !== previousTask.raw ||
        currentTask.purged !== previousTask.purged
      )
        updated.push({ ...currentTask, previousTask })
    })
    Object.values(previousList.tasks).forEach((previousTask) => {
      if (!currentList.tasks[previousTask.id])
        removed.push(previousTask)
    })
  })
  return {
    added,
    updated,
    removed,
    tasks: [...added, ...updated, ...removed]
  }
}
