export function remoteStorageUnpending (action, { update, getState }) {
  if (action.type !== 'remoteStorageUnpending')
    return

  if (getState().remoteStorage.state === 'error')
    return

  update(['remoteStorage', 'state'], 'connected')
}
