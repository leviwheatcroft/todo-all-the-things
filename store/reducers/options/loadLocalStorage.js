export function optionsLoadLocalStorage (action, context) {
  if (action.type !== 'optionsLoadLocalStorage')
    return

  const { payload: { options } } = action
  const { update } = context
  const {
    dialogs,
    sort,
    remoteStorage,
    filter
  } = options
  update(['dialogs'], dialogs)
  update(['sort'], sort)
  update(['remoteStorage'], remoteStorage)
  update(['filter'], filter)
}
