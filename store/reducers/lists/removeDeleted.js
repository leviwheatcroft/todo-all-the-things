export function listsRemoveDeleted (action, { update, getState }) {
  if (action.type !== 'listsRemoveDeleted')
    return

  const lists = Object.fromEntries(
    Object.entries(getState().lists)
      .filter(([, { deleted }]) => !deleted)
  )

  // ensure at least one list remains
  if (Object.keys(lists).length === 0)
    lists.todo = { id: 'todo', tasks: {} }

  // ensure selectedListId refers to a list that still exists
  const { selectedListId } = getState()
  if (!Object.keys(lists).includes(selectedListId))
    update(['selectedListId'], Object.keys(lists)[0])

  update(['lists'], lists)
}
