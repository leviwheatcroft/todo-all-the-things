export function listsRemoveFromState (action, { update, getState }) {
  if (action.type !== 'listsRemoveFromState')
    return

  const { payload: { listIds } } = action
  const lists = { ...getState().lists }
  listIds.forEach((id) => delete lists[id])
  update(['lists'], lists)
}
