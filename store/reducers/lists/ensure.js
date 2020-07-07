export function listsEnsure (action, { getState, update }) {
  if (action.type !== 'listsEnsure')
    return

  const { payload: { listId } } = action

  const list = getState().lists[listId]
  if (list)
    return
  update(['lists', listId], { id: listId, tasks: {} })
}
