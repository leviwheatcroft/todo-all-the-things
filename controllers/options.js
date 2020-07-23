/* eslint-disable max-classes-per-file */
import {
  subscribe,
  publish
} from '../store'
import {
  hydrate,
  dehydrate
} from '../store/state'

const _prefix = 'tdw'

function prefix (body) {
  return `${_prefix}-${body}`
}

export function initialiseOptions () {
  subscribe(
    [
      /dialogsToggle/,
      /optionsDriverSave/,
      /optionsToggle/,
      /filterSet/,
      /listsSelect/,
      /upgrade/
    ],
    store
  )
  subscribe(/domLoaded/, retrieveOptions)
}

export function retrieveOptions ({ loadRemoteTasks = true }) {
  const dehydrated = JSON.parse(localStorage.getItem(prefix('options')))
  if (!dehydrated) {
    publish('firstRun')
    return
  }
  const options = hydrate(dehydrated)
  // loadRemoteTasks is not used by the reducer, but remoteStorage listens
  // to this event and will not respond when loadRemoteTasks is false
  publish('optionsLoadLocalStorage', { options, loadRemoteTasks })
}

function store ({ getState }) {
  const hydrated = getState()
  const dehydrated = dehydrate(hydrated)
  localStorage.setItem(prefix('options'), JSON.stringify(dehydrated))
}
