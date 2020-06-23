export function filterSet (action, { update, publish }) {
  if (action.type !== 'filterSet')
    return
  const {
    payload: {
      filter = {}
    }
  } = action
  const { text = '' } = filter
  let { regExp } = filter
  if (!regExp && text === '')
    regExp = /.*/
  else if (!regExp)
    regExp = new RegExp(text.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'), 'i')

  update(['filter'], { text, regExp })
  publish('filterApply')
}
