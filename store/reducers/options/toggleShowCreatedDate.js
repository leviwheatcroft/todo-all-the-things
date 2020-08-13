export function optionsToggleShowCreatedDate (action, context) {
  if (action.type !== 'optionsToggleShowCreatedDate')
    return

  const { update, getState } = context
  const { showCreatedDate } = getState().settings
  update(['settings', 'showCreatedDate'], !showCreatedDate)
}
