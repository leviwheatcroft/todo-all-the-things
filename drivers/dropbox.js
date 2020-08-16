import { Dropbox } from 'dropbox'

let listsEnsureInState
let getListsFromState
let getOptions
let prefix
let remoteStorageError
let remoteStoragePending
let remoteStorageUnpending
let setRemoteStorageTouch
let tasksPatch
let tasksRemovePurged

function initialise (ctx) {
  listsEnsureInState = ctx.listsEnsureInState
  getListsFromState = ctx.getListsFromState
  getOptions = ctx.getOptions
  prefix = ctx.prefix
  remoteStorageError = ctx.remoteStorageError
  remoteStoragePending = ctx.remoteStoragePending
  remoteStorageUnpending = ctx.remoteStorageUnpending
  setRemoteStorageTouch = ctx.setRemoteStorageTouch
  tasksPatch = ctx.tasksPatch
  tasksRemovePurged = ctx.tasksRemovePurged
}

// let inFlightOps = 0
// function inFlight () {
//   if (inFlightOps === 0)
//     remoteStoragePending()
//   inFlightOps += 1
//   return function done () {
//     inFlightOps -= 1
//     if (inFlightOps === 0)
//       remoteStorageUnpending()
//   }
// }

/**
 * diff - compares previous and current text files
 *
 * because textfiles are being compared, it's only possible to reliably
 * determine additions and removals, not updates. If you rely on line numbers
 * you could detect updates, however lineNumbers will change when completed
 * tasks are purged.
 *
 * by contrast tasksDiff, which diffs state, can detect which tasks have been
 * added, removed, or updated. However, after a dropbox import, tasksDiff
 * will report an updated task as an addition & removal, because the remote
 * storage  driver creates a new task and removes the old task rather than
 * updating a task in place.
 */
function diff (previous, current) {
  const newLine = /\r?\n/
  previous = previous.split(newLine)
  current = current.split(newLine)
  // console.log(current, previous)
  const added = []
  current.forEach((raw) => {
    if (raw.length === 0)
      return
    const idx = previous.indexOf(raw)
    if (idx === -1)
      return added.push(raw)
    delete previous[idx] // unchanged
  })
  const removed = previous
    .filter((i) => i)

  return {
    added: added.length ? added : undefined,
    removed: removed.length ? removed : undefined
  }
}

async function sync () {
  remoteStoragePending()
  try {
    await mergeListsFromRemote()
    await uploadListsToRemote()
    setRemoteStorageTouch()
  } catch (error) {
    errorHandler(error)
  }
  remoteStorageUnpending()
}

async function mergeListsFromRemote () {
  const listIds = await fetchListIdsFromRemote()
  await Promise.all(listIds.map(async (listId) => {
    listsEnsureInState(listId)
    const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
    const current = await fetchListFromRemote(listId)
    tasksPatch({ ...diff(previous, current), listId })
    localStorage.setItem(prefix(`previous-${listId}`), current)
  }))
}

async function uploadListsToRemote () {
  const dbx = getClient()
  const lists = getListsFromState()
  await Promise.all(lists.map(async ({ id: listId, tasks }) => {
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
    tasksRemovePurged(listId)
  }))
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
  try {
    result = await dbx.filesDownload({
      path: `/${listId}.txt`
    })
  } catch (error) {
    if (
      error.status === 409 &&
      /path\/not_found/.test(error)
    )
      result = await createListOnRemote(listId)
    else
      throw error
  }
  const content = await result.fileBlob.text()
  return content
}

// // this structure allows multiple callers to await the same import request
// const importTasksInFlight = {}
// async function importTasks (listId) {
//   if (importTasksInFlight[listId])
//     return importTasksInFlight[listId]
//   const done = inFlight()
//   importTasksInFlight[listId] = _importTasks(listId)
//     .then(() => {
//       delete importTasksInFlight[listId]
//       done()
//     })
//   return importTasksInFlight[listId]
// }
//
// async function _importTasks (listId) {
//   try {
//     const listIds = listId ? [].concat(listId) : await fetchLists()
//     listsEnsure(listIds)
//     await Promise.all(listIds.map((listId) => {
//       const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
//       return retrieve(listId)
//         .then((current) => {
//           tasksPatch({ ...diff(previous, current), listId })
//           localStorage.setItem(prefix(`previous-${listId}`), current)
//         })
//     }))
//     setRemoteStorageTouch()
//   } catch (error) {
//     errorHandler(error)
//   }
// }
//
// async function retrieve (listId) {
//   const done = inFlight()
//   const dbx = getClient()
//   let result
//   try {
//     result = await dbx.filesDownload({
//       path: `/${listId}.txt`
//     })
//   } catch (error) {
//     if (
//       error.status === 409 &&
//       /path\/not_found/.test(error)
//     ) {
//       result = await create(listId)
//     } else {
//       done()
//       throw error
//     }
//   }
//   const content = await result.fileBlob.text()
//   done()
//   return content
// }
//
// async function store (listId, list) {
//   const done = inFlight()
//   const {
//     tasks
//   } = list
//   const dbx = getClient()
//   const bits = Object.values(tasks)
//     .filter(({ purged }) => !purged)
//     .sort((a, b) => a.lineNumber - b.lineNumber)
//     .map(({ raw }) => `${raw}\n`)
//   const contents = new File(bits, `${listId}.txt`)
//   await dbx.filesUpload({
//     contents,
//     path: `/${listId}.txt`,
//     mode: 'overwrite'
//   })
//   localStorage.setItem(prefix(`previous-${listId}`), await contents.text())
//   tasksRemovePurged(listId)
//   done()
// }

async function createListOnRemote (listId) {
  const dbx = getClient()
  let result
  try {
    result = await dbx.filesUpload({
      contents: '',
      path: `/${listId}.txt`,
      mode: 'add',
      autorename: true
    })
  } catch ({ error: raw }) {
    const error = JSON.parse(raw)
    console.error('err', error)
  }
  return result
}

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
    'Unknown Error'
  )
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
