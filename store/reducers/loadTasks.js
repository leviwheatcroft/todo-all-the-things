import { parseTask } from '../../lib/parseTask'

export function loadTasks (action, { update, publish }) {
  if (action.type !== 'loadTasks')
    return
  const { payload: { tasks } } = action
  const state = {
    contexts: [],
    projects: [],
    lists: { todo: { id: 'todo', tasks: {} } }
  }
  tasks.forEach((t) => {
    const task = {
      ...t,
      ...parseTask(t.raw)
    }
    state.contexts.push(...task.contexts || [])
    state.projects.push(...task.projects || [])
    if (!state.lists[task.listId])
      state.lists[task.listId] = { id: task.listId, tasks: {} }
    state.lists[task.listId].tasks[task.id] = task
  })
  state.contexts = state.contexts.filter((i, idx) => {
    return state.contexts.indexOf(i) === idx
  })
  state.projects = state.projects.filter((i, idx) => {
    return state.projects.indexOf(i) === idx
  })
  update(['contexts'], state.contexts)
  update(['projects'], state.projects)
  update(['lists'], state.lists)
  publish('filterApply')
  publish('sortTasks')
  publish('localStorageLoaded')
}
