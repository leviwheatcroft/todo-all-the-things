export function listsSetDeleted (action, { update }) {
  if (action.type !== 'listsSetDeleted')
    return

  const { payload: { listId } } = action
  update(['lists', listId, 'deleted'], true)
}
