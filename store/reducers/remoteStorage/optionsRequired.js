export function remoteStorageOptionsRequired (action, { update }) {
  if (action.type !== 'remoteStorageOptionsRequired')
    return

  const { optionsRequired } = action.payload

  update(['remoteStorage', 'optionsRequired'], optionsRequired)
}
