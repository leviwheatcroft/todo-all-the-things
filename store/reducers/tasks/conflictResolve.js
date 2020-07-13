export function tasksConflictResolve (action, { updateTask }) {
  if (action.type !== 'tasksConflictResolve')
    return

  const { resolution, conflictedLocals, conflictedRemotes } = action.payload

  if (resolution === 'keepLocals')
    conflictedRemotes.forEach((t) => updateTask(t, { purged: true }))
  if (resolution === 'keepRemotes')
    conflictedLocals.forEach((t) => updateTask(t, { purged: true }))
}
