export function dialogsToggle (action, { getState, update }) {
  if (action.type !== 'dialogsToggle')
    return

  let show
  if (
    !action.payload ||
    !action.payload.dialog
  )
    show = false
  else if (getState().dialogs.show === action.payload.dialog)
    show = false
  else
    show = action.payload.dialog

  update(['dialogs', 'show'], show)
}
