export function tasksDiff (states) {
  const [current, previous] = states
  const { lists: currentLists } = current
  const updatedTasks = []
  Object.values(currentLists).forEach((currentList) => {
    if (
      !previous ||
      !previous.lists[currentList.id]
    )
      return updatedTasks.push(...Object.values(currentList.tasks))

    const previousList = previous.lists[currentList.id]
    if (currentList === previousList)
      return
    Object.values(currentList.tasks).forEach((currentTask) => {
      const previousTask = previousList.tasks[currentTask.id]
      if (
        !previousTask ||
        currentTask.raw !== previousTask.raw
      )
        updatedTasks.push(currentTask)
    })
  })
  return updatedTasks
}
