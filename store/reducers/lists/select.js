export function listsSelect (action, { update }) {
  if (action.type !== 'listsSelect')
    return

  const { payload: { listId } } = action
  update(['selectedListId'], listId)
}
