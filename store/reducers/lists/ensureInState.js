export function listsEnsureInState (action, { update, getState }) {
  if (action.type !== 'listsEnsureInState')
    return

  const { payload: { listId } } = action
  if (getState().lists[listId])
    return
  const list = {
    id: listId,
    tasks: {}
  }
  update(['lists', listId], list)
}
