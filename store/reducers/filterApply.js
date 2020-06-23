export function filterApply (action, { state, update }) {
  if (action.type !== 'filterApply')
    return
  const {
    payload: {
      listId
    }
  } = action

  const { regExp } = state.filter
  const lists = listId ? [state.lists[listId]] : Object.values(state.lists)

  lists.forEach((list) => {
    let { tasks } = list
    Object.values(tasks).forEach((task) => {
      const filterMatched = regExp.test(task.raw)
      if (filterMatched !== task.filterMatched)
        tasks = { ...tasks, [task.id]: { ...task, filterMatched } }
    })
    if (tasks !== list.tasks)
      update(['lists', list.id, 'tasks'], tasks)
  })
}
