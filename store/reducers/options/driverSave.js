export function optionsDriverSave (action, context) {
  if (action.type !== 'optionsDriverSave')
    return

  const { payload: { driver, refreshInterval, accessToken } } = action
  const { update } = context
  const state = driver === 'none' ? 'noDriver' : 'connected'
  update(['remoteStorage'], {
    driver,
    state,
    refreshInterval,
    accessToken
  })
}
