export function optionsLoadLocalStorage (action, context) {
  if (action.type !== 'optionsLoadLocalStorage')
    return

  const { payload: { options } } = action
  const { update } = context
  const {
    dialogs,
    sort,
    driver,
    filter
  } = options
  update(['dialogs'], dialogs)
  update(['sort'], sort)
  update(['driver'], driver)
  update(['filter'], filter)
}
