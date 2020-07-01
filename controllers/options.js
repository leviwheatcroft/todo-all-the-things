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
  options.filter.regExp = new RegExp(options.filter.regExp)
  publish('optionsLoadLocalStorage', { options })
}

function store ({ getState }) {
  const {
    dialogs,
    sort,
    remoteStorage
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
    filter
  }))
}
