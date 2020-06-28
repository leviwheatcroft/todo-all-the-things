export function filterSet (action, { getState, update }) {
  if (action.type !== 'filterSet')
    return
  const {
    payload: {
      filter = {}
    }
  } = action
  const { text = '' } = filter
  let { regExp } = filter
  if (!regExp && text === '')
    regExp = /.*/
  else if (!regExp)
    regExp = new RegExp(text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'i')

  update(['filter'], { text, regExp })

  Object.values(getState().lists).forEach((list) => {
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
