export function remoteStorageTouch (action, { update }) {
  if (action.type !== 'remoteStorageTouch')
    return

  const { time } = action.payload

  update(['remoteStorage', 'lastTouch'], time)
}
