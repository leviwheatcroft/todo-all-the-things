import { parseTask } from '../lib/parseTask'

export function tasksConflict (action, context) {
  if (action.type !== 'tasksConflict')
    return

  const {
    payload: {
      local,
      localOriginal,
      remote
    }
  } = action
  console.log(action.payload)
  const {
    update
  } = context

  function updateTask (task) {
    update(['lists', task.listId, 'tasks', task.id], task)
  }

  const conflicted = {
    local: local.id,
    localOriginal: localOriginal.id,
    remote: remote.id
  }

  updateTask({
    ...local,
    ...parseTask(`${local.raw} !conflicted-local`),
    conflicted: { ...conflicted, type: 'local' }
  })
  updateTask({
    ...localOriginal,
    ...parseTask(`${localOriginal.raw} !conflicted-local-original`),
    conflicted: { ...conflicted, type: 'localOriginal' }
  })
  updateTask({
    ...remote,
    ...parseTask(`${remote.raw} !conflicted-remote`),
    conflicted: { ...conflicted, type: 'remote' }
  })
}
