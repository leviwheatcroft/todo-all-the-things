import { parseTask } from '../lib/parseTask'

export function tasksConflict (action, context) {
  if (action.type !== 'tasksConflict')
    return

  const {
    payload: {
      conflictedLocals,
      conflictedRemotes
    }
  } = action

  const {
    update
  } = context

  function updateTask (task) {
    update(['lists', task.listId, 'tasks', task.id], task)
  }

  // for the local task, include a tag in the raw task, then parseTask
  // will set conflicted: 'local'
  conflictedLocals.forEach((local) => {
    updateTask({
      ...local,
      ...parseTask(`${local.raw} !conflicted-local`)
    })
  })
  // for the remote task, you can't include a tag in the raw task, because
  // it would be synced back to the remote, and show up in other clients as
  // conflicted even though it wouldn't be conflicted in those clients.
  // so, we just set the conflict in the local state
  conflictedRemotes.forEach((remote) => {
    updateTask({
      ...remote,
      conflicted: 'remote'
    })
  })
}
