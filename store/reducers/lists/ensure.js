export function listsEnsure (action, { getState, update }) {
  if (action.type !== 'listsEnsure')
    return

  let { payload: { listIds } } = action
  listIds = [].concat(listIds)

  listIds.forEach((listId) => {
    const list = getState().lists[listId]
    if (list)
      return
    update(['lists', listId], { id: listId, tasks: {} })
  })
}
