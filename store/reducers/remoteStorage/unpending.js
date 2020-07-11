export function remoteStorageUnpending (action, { update }) {
  if (action.type !== 'remoteStorageUnpending')
    return

  update(['remoteStorage', 'state'], 'connected')
}
