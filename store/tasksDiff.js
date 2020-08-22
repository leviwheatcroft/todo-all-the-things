export function tasksDiff (currentState, previousState) {
  const current = Object.assign(
    {},
    ...Object.values(currentState.lists).map(({ tasks }) => tasks)
  )
  const previous = Object.assign(
    {},
    ...Object.values(previousState.lists).map(({ tasks }) => tasks)
  )
  const added = [...Object.values(current).filter(({ id }) => {
    // exists in current, but not in previous
    return !previous[id]
  })]
  const removed = [...Object.values(previous).filter(({ id }) => {
    // exists in previous, but not in current
    return !current[id]
  })]
  const updated = [...Object.values(current).filter(({ id }) => {
    return (
      // exists in both current and previous
      current[id] &&
      previous[id] &&
      // is not the same in each
      current[id] !== previous[id]
    )
  })]
  return {
    added,
    updated,
    removed,
    tasks: [...added, ...updated, ...removed]
  }
}

// export function tasksDiff (states, previous) {
//   const current = states[0]
//   if (!previous)
//     [, previous] = states
//   const { lists: currentLists } = current
//   const added = []
//   const updated = []
//   const removed = []
//   Object.values(currentLists).forEach((currentList) => {
//     if (
//       !previous ||
//       !previous.lists[currentList.id]
//     )
//       return updated.push(...Object.values(currentList.tasks))
//
//     const previousList = previous.lists[currentList.id]
//     if (currentList === previousList)
//       return
//     Object.values(currentList.tasks).forEach((currentTask) => {
//       const previousTask = previousList.tasks[currentTask.id]
//       if (!previousTask)
//         added.push(currentTask)
//       else if (
//         // TODO: why compare raw & purged here ? why not just check if the
//         // object has changed ?
//         currentTask.raw !== previousTask.raw ||
//         currentTask.purged !== previousTask.purged
//       )
//         updated.push({ ...currentTask, previousTask })
//     })
//     Object.values(previousList.tasks).forEach((previousTask) => {
//       if (!currentList.tasks[previousTask.id])
//         removed.push(previousTask)
//     })
//   })
//   return {
//     added,
//     updated,
//     removed,
//     tasks: [...added, ...updated, ...removed]
//   }
// }
