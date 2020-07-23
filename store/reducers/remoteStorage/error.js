export function remoteStorageError (action, { update }) {
  if (action.type !== 'remoteStorageError')
    return

  const { error } = action.payload

  update(['remoteStorage', 'error'], error)
  update(['remoteStorage', 'state'], 'error')
}
