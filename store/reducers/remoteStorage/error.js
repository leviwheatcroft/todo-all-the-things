export function remoteStorageError (action, { update }) {
  if (action.type !== 'remoteStorageError')
    return

  update(['remoteStorage', 'state'], 'error')
}
