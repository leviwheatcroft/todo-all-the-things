// listsRemoveFromState is issued by remostStorage controller when a list
// is deleted in the remote
export function listsRemoveFromState (action, { update, getState }) {
  if (action.type !== 'listsRemoveFromState')
    return

  const { payload: { listIds } } = action
  const lists = { ...getState().lists }

  // delete listIds from state
  listIds.forEach((id) => delete lists[id])

  // ensure at least one list remains
  if (Object.keys(lists).length === 0)
    lists.todo = { id: 'todo', tasks: {} }

  // ensure selectedListId refers to a list that still exists
  const { selectedListId } = getState()
  if (listIds.includes(selectedListId))
    update(['selectedListId'], Object.keys(lists)[0])

  update(['lists'], lists)
}
