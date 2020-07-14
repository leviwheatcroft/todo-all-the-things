/* eslint-disable max-classes-per-file */
import {
  subscribe,
  publish
} from '../store'

const _prefix = 'tdw'

function prefix (body) {
  return `${_prefix}-${body}`
}

export function initialiseOptions () {
  subscribe(
    [
      /dialogsToggle/,
      /optionsDriverSave/,
      /filterSet/,
      /listsSelect/,
      /upgrade/
    ],
    store
  )
  subscribe(/domLoaded/, retrieveOptions)
}

export function retrieveOptions ({ loadRemoteTasks = true }) {
  const options = JSON.parse(localStorage.getItem(prefix('options')))
  if (!options)
    return
  options.filter.regExp = new RegExp(options.filter.regExp)
  // loadRemoteTasks is not used by the reducer, but remoteStorage listens
  // to this event and will not respond when loadRemoteTasks is false
  publish('optionsLoadLocalStorage', { options, loadRemoteTasks })
}

function store ({ getState }) {
  const {
    dialogs,
    sort,
    remoteStorage,
    selectedListId,
    version
  } = getState()
  let { filter } = getState()
  filter = { ...filter }
  let { regExp } = filter
  regExp = regExp.toString()
  regExp = regExp.slice(1, regExp.length - 1)
  filter.regExp = regExp
  localStorage.setItem(prefix('options'), JSON.stringify({
    dialogs,
    sort,
    remoteStorage,
    selectedListId,
    version,
    filter
  }))
}
