import { Dropbox } from 'dropbox'
import { diff } from './lib/diff'

let getListsFromState
let getOptions
let listsRemoveDeleted
let listsRemoveFromState
let prefix
let remoteStorageError
let remoteStoragePending
let remoteStorageUnpending
let setRemoteStorageTouch
let tasksPatch
let tasksRemovePurged
let updateLineNumbers

function initialise (ctx) {
  getListsFromState = ctx.getListsFromState
  getOptions = ctx.getOptions
  listsRemoveDeleted = ctx.listsRemoveDeleted
  listsRemoveFromState = ctx.listsRemoveFromState
  prefix = ctx.prefix
  remoteStorageError = ctx.remoteStorageError
  remoteStoragePending = ctx.remoteStoragePending
  remoteStorageUnpending = ctx.remoteStorageUnpending
  setRemoteStorageTouch = ctx.setRemoteStorageTouch
  tasksPatch = ctx.tasksPatch
  tasksRemovePurged = ctx.tasksRemovePurged
  updateLineNumbers = ctx.updateLineNumbers
}

async function sync () {
  remoteStoragePending()
  try {
    await mergeListsFromRemote()
    await uploadListsToRemote()
  } catch (error) {
    errorHandler(error)
  }
  // store touch in localStorage, so other browser tabs will update
  setRemoteStorageTouch()
  remoteStorageUnpending()
}

async function mergeListsFromRemote () {
  const remoteListIds = await fetchListIdsFromRemote()

  await Promise.all(remoteListIds.map(async (listId) => {
    const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
    const current = await fetchListFromRemote(listId)
    if (current === previous)
      return
    tasksPatch({ ...diff(previous, current), listId })
    updateLineNumbers(current, listId)
    localStorage.setItem(prefix(`previous-${listId}`), current)
  }))

  // this handles lists deleted remotely. when a list is deleted locally
  // deletedListIds.length will be 0
  const deletedListIds = getListsFromState()
    .map(({ id }) => id)
    .filter((id) => localStorage.getItem(prefix(`previous-${id}`)))
    .filter((id) => !remoteListIds.includes(id))
  if (deletedListIds.length)
    listsRemoveFromState(deletedListIds)
}

async function uploadListsToRemote () {
  const dbx = getClient()
  const lists = Object.values(getListsFromState())
  await Promise.all(lists.map(async (list) => {
    const {
      id: listId,
      deleted,
      tasks
    } = list
    if (deleted) {
      await dbx.filesDelete({ path: `/${listId}.txt` })
      localStorage.removeItem(prefix(`previous-${listId}`))
      return
    }
    const bits = Object.values(tasks)
      .filter(({ purged }) => !purged)
      .sort((a, b) => a.lineNumber - b.lineNumber)
      .map(({ raw }) => `${raw}\n`)
    const contentsAsFile = new File(bits, `${listId}.txt`)
    const contentsAsString = bits.join('')
    const prefixed = prefix(`previous-${listId}`)
    const previous = localStorage.getItem(prefixed) || false
    // TODO: does this ever happen? lineNumbers ?
    if (previous === contentsAsString)
      return
    await dbx.filesUpload({
      contents: contentsAsFile,
      path: `/${listId}.txt`,
      mode: 'overwrite'
    })
    localStorage.setItem(prefixed, contentsAsString)
  }))
  tasksRemovePurged()
  listsRemoveDeleted()
}

async function fetchListIdsFromRemote () {
  const dbx = getClient()
  // allow error to be thrown
  const result = await dbx.filesListFolder({
    path: ''
  })
  const listIds = result.entries.map((entry) => {
    return entry.name.replace(/\.\w*?$/, '')
  })
  return listIds
}

async function fetchListFromRemote (listId) {
  const dbx = getClient()
  let result
  let content
  try {
    result = await dbx.filesDownload({
      path: `/${listId}.txt`
    })
    content = await result.fileBlob.text()
  } catch (error) {
    // if (
    //   error.status === 409 &&
    //   /path\/not_found/.test(error)
    // )
    //   result = await createListOnRemote(listId)
    // else
    //   throw error
    errorHandler(error)
    content = ''
  }
  return content
}

// async function createListOnRemote (listId) {
//   const dbx = getClient()
//   let result
//   try {
//     result = await dbx.filesUpload({
//       contents: '',
//       path: `/${listId}.txt`,
//       mode: 'add',
//       autorename: true
//     })
//   } catch ({ error: raw }) {
//     const error = JSON.parse(raw)
//     console.error('err', error)
//   }
//   return result
// }

function getClient () {
  const { accessToken } = getOptions()
  return new Dropbox({ accessToken, fetch })
}

function errorHandler (error) {
  Object.entries(error).forEach(([key, value]) => {
    console.error('error:', key, value)
  })
  // bad auth code
  if (
    error.status === 400 &&
    /Invalid authorization value in HTTP header/.test(error.error)
  ) {
    remoteStorageError(
      '400:Bad Access Token',
      `
      There's an issue with your API Access Token.
      `
    )
    return
  }
  remoteStorageError(
    'Unknown Error',
    `
    See Console for more details.
    `
  )
  console.error('error details', error)
}

const optionsRequired = [
  {
    key: 'accessToken',
    display: 'Access Token',
    type: 'password'
  },
  {
    key: 'refreshInterval',
    display: 'Refresh Interval (minutes)',
    type: 'number',
    defaultValue: 10
  }
]

export const dropbox = {
  initialise,
  sync,
  optionsRequired
}
