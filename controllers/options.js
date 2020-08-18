/* eslint-disable max-classes-per-file */
import {
  getState,
  subscribe,
  publish
} from '../store'
import {
  upgrade,
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
      /listsSelect/
    ],
    store
  )
  subscribe(/domLoaded/, retrieveOptions)
}

export function retrieveOptions ({ loadRemoteTasks = true }) {
  const dehydrated = JSON.parse(localStorage.getItem(prefix('options')))
  if (!dehydrated) {
    if (
      process.env.TATT_DRIVER === 'webdav' &&
      process.env.TATT_WEBDAV_USER &&
      process.env.TATT_WEBDAV_PASSWORD
    ) {
      publish('remoteStorageDriverSave', {
        driver: 'webdav',
        user: process.env.TATT_WEBDAV_USER,
        password: process.env.TATT_WEBDAV_PASSWORD,
        refreshInterval: 10
      })
    }
    publish('firstRun')
    return
  }
  const upgraded = upgrade(dehydrated)
  if (upgraded.version !== dehydrated.version) {
    const dehydrated = dehydrate(upgraded)
    localStorage.setItem(prefix('options'), JSON.stringify(dehydrated))
  }

  const options = hydrate(upgraded)
  // loadRemoteTasks is not used by the reducer, but remoteStorage listens
  // to this event and will not respond when loadRemoteTasks is false
  publish('optionsLoadLocalStorage', { options, loadRemoteTasks })
}

function store () {
  const hydrated = getState()
  const dehydrated = dehydrate(hydrated)
  localStorage.setItem(prefix('options'), JSON.stringify(dehydrated))
}
