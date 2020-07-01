export function optionsDriverSave (action, context) {
  if (action.type !== 'optionsDriverSave')
    return

  const { payload: { driver, refreshInterval, accessToken } } = action
  const { update } = context
  update(['remoteStorage'], {
    driver,
    refreshInterval,
    accessToken
  })
}
