import { parseTask } from '../lib/parseTask'

export function tasksConflict (action, context) {
  if (action.type !== 'tasksConflict')
    return

  const {
    payload: {
      localUpdated,
      remoteAdded
    }
  } = action

  const {
    update
  } = context

  function updateTask (task) {
    update(['lists', task.listId, 'tasks', task.id], task)
  }

  const conflicted = {
    localUpdatedId: localUpdated.id,
    remoteAddedId: remoteAdded.id
  }

  updateTask({
    ...localUpdated,
    ...parseTask(`${localUpdated.raw} !conflicted-local`),
    conflicted: { ...conflicted, type: 'localUpdated' }
  })
  updateTask({
    ...remoteAdded,
    ...parseTask(`${remoteAdded.raw} !conflicted-remote`),
    conflicted: { ...conflicted, type: 'remoteAdded' }
  })
}
