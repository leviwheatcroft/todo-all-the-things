export function remoteStorageDriverSave (action, { update }) {
  if (action.type !== 'remoteStorageDriverSave')
    return

  const { payload: { options } } = action
  const state = options.driver === 'none' ? 'noDriver' : 'connected'
  update(['remoteStorage', 'state'], state)
  update(['remoteStorage', 'options'], options)
}
