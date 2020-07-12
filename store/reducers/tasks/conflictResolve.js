import { parseTask } from '../lib/parseTask'

export function tasksConflictResolve (action, { getState, update }) {
  if (action.type !== 'tasksConflictResolve')
    return

  const { resolution } = action.payload
  const { selectedListId } = getState()

  Object.values(getState().lists[selectedListId].tasks)
    .filter((task) => task.conflicted)
    .forEach((_task) => {
      let task = { ..._task }

      switch (resolution) {
        case 'keepLocals':
          if (task.conflicted === 'remote') {
            task.purged = true
          } else if (task.conflicted === 'local') {
            task = {
              ...task,
              ...parseTask(task.raw.replace(/!conflicted-local/, ''))
            }
          }
          break
        case 'keepRemotes':
          if (task.conflicted === 'local')
            task.purged = true
          break
        default:
          throw new Error('no resolution?!')
      }

      delete task.conflicted
      update(['lists', task.listId, 'tasks', task.id], task)
    })
}
