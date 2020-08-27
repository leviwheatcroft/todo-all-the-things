export function optionsLoadLocalStorage (action, context) {
  if (action.type !== 'optionsLoadLocalStorage')
    return

  const { payload: { options } } = action
  const { update } = context
  const {
    sort,
    remoteStorage,
    filter,
    selectedListId,
    version,
    settings
  } = options
  update(['sort'], sort)
  update(['remoteStorage', 'options'], remoteStorage.options)
  update(['filter'], filter)
  update(['selectedListId'], selectedListId)
  update(['version'], version)
  update(['settings'], settings)

  if (remoteStorage.options.driver !== 'none')
    update(['remoteStorage', 'state'], 'connected')
}
