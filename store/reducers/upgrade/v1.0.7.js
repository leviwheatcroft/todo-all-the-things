/* eslint-disable camelcase */
export function v1_0_7 (ctx) {
  const { update, getState } = ctx

  const state = getState()
  if (state.remoteStorage.driver === 'dropbox')
    update(['remoteStorage', 'state'], 'connected')
  else
    update(['remoteStorage', 'state'], 'noDriver')
  update(['version'], 'v1.0.7')
}
