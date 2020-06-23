export function toggleDialog (action, { state, update }) {
  if (action.type !== 'toggleDialog')
    return

  let show
  if (!action.payload)
    show = false
  else if (state.dialogs.show === action.payload.dialog)
    show = false
  else
    show = action.payload.dialog

  update(['dialogs', 'show'], show)
}
