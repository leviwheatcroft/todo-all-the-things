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
      /listsSelect/,
      /listsRemoveFromState/,
      /listsRemoveDeleted/
    ],
    store
  )
  subscribe(/domLoaded/, retrieveOptions)
}

export function retrieveOptions ({ loadRemoteTasks = true }) {
  const dehydrated = JSON.parse(localStorage.getItem(prefix('options')))
  if (!dehydrated) {
    if (
      // TODO: this won't work. code runs in the browser silly.
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

  // localStorage controller populates state.lists by reading tasks
  // from localStorage. it will not create state.lists[listId] where
  // a list contains no tasks.
  // therefore it's possible for selectedListId to refer to a list
  // which does not exist in state.
  publish('listsEnsureInState', { listId: options.selectedListId })

  // loadRemoteTasks is not used by the reducer, but remoteStorage listens
  // to this event and will not respond when loadRemoteTasks is false
  // TODO: is this still necessary ? seems kludgy
  publish('optionsLoadLocalStorage', { options, loadRemoteTasks })
}

function store () {
  const hydrated = getState()
  const dehydrated = dehydrate(hydrated)
  localStorage.setItem(prefix('options'), JSON.stringify(dehydrated))
}
