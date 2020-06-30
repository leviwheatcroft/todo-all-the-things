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
      /filterSet/
    ],
    store.bind(this)
  )
  subscribe(/domLoaded/, retrieve.bind(this))
}

function retrieve () {
  const options = JSON.parse(localStorage.getItem(prefix('options')))
  if (!options)
    return
  publish('optionsLoadLocalStorage', { options })
}

function store ({ getState }) {
  const {
    dialogs,
    sort,
    remoteStorage,
    filter
  } = getState()
  localStorage.setItem(prefix('options'), JSON.stringify({
    dialogs,
    sort,
    remoteStorage,
    filter
  }))
}
