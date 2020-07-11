export function remoteStoragePending (action, { update }) {
  if (action.type !== 'remoteStoragePending')
    return

  update(['remoteStorage', 'state'], 'pending')
}
