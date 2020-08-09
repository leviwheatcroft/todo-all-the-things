export function listsAdd (action, { update }) {
  if (action.type !== 'listsAdd')
    return

  const { payload: { listId } } = action
  const list = {
    id: listId,
    tasks: {}
  }
  update(['lists', listId], list)
  update(['selectedListId'], listId)
}
