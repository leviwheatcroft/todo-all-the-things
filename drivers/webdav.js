import { createClient } from 'webdav/web'

import axios from 'axios'

axios.defaults.headers.put['Content-Type'] = 'text/plain'

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

let inFlightOps = 0
function inFlight () {
  if (inFlightOps === 0)
    remoteStoragePending()
  inFlightOps += 1
  return function done () {
    inFlightOps -= 1
    if (inFlightOps === 0)
      remoteStorageUnpending()
  }
}

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
  try {
    await mergeFromRemote()
    await writeToRemote()
  } catch (error) {
    errorHandler(error)
  }
  // store touch in localStorage, so other browser tabs will update
  // TODO: should probably setRemoteStorageTouch even where an error occurs
  setRemoteStorageTouch()
}

async function mergeFromRemote () {
  const listIds = await fetchListsFromRemote()

  await Promise.all(listIds.map(async (listId) => {
    const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
    const current = await fetchListFromRemote(listId)
    console.log('diff', previous, current, listId)
    tasksPatch({ ...diff(previous, current), listId })
    localStorage.setItem(prefix(`previous-${listId}`), current)
  }))
}

async function writeToRemote () {
  console.log('glfs', getListsFromState())
  const lists = Object.values(getListsFromState())
  const webdav = getClient()
  await Promise.all(lists.map(async (list) => {
    const {
      id: listId,
      tasks
    } = list
    const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
    const current = Object.values(tasks)
      .filter(({ purged }) => !purged)
      .sort((a, b) => a.lineNumber - b.lineNumber)
      .map(({ raw }) => raw)
      .join('\n')
    console.log('wc', current, tasks)
    if (current !== previous) {
      webdav.putFileContents(
        `/${listId}.txt`,
        current,
        {
          overwrite: true,
          headers: {
            'Content-Type': 'text/plain'
          },
          onUploadProgress: (progress) => console.log('progress', progress)
        }
      )
      localStorage.setItem(prefix(`previous-${listId}`), current)
    }
    tasksRemovePurged(listId)
  }))
}

async function fetchListsFromRemote () {
  const done = inFlight()
  const webdav = getClient()
  // allow error to be thrown
  const result = await webdav.getDirectoryContents('/')
  const listIds = result.map(({ basename }) => {
    return basename.replace(/\.\w*?$/, '')
  })
  done()
  return listIds
}

async function fetchListFromRemote (listId) {
  const done = inFlight()
  const webdav = getClient()
  let content
  try {
    content = await webdav.getFileContents(
      `/${listId}.txt`,
      { format: 'text' }
    )
    console.log('fetchListFromRemote', content)
  } catch (error) {
    errorHandler(error)
    content = ''
  }
  done()
  return content
}

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

// async function store (listId, list) {
//   const done = inFlight()
//   const {
//     tasks
//   } = list
//   const webdav = getClient()
//   const content = Object.values(tasks)
//     .filter(({ purged }) => !purged)
//     .sort((a, b) => a.lineNumber - b.lineNumber)
//     .map(({ raw }) => `${raw}\n`)
//     .join('')
//   webdav.putFileContents(
//     `/${listId}.txt`,
//     content,
//     { overwrite: true }
//   )
//   localStorage.setItem(prefix(`previous-${listId}`), content)
//   tasksRemovePurged(listId)
//   done()
// }
//
// async function create (listId) {
//   const done = inFlight()
//   const webdav = getClient()
//   let result
//   try {
//     result = await webdav.putFileContents(
//       `/${listId}.txt`,
//       '',
//       { overwrite: false }
//     )
//   } catch (error) {
//     errorHandler(error)
//   }
//   done()
//   return result
// }

function getClient () {
  const { url } = getOptions()
  return createClient(url)
}

function errorHandler (error) {
  console.error('webdav error', error)
}

const optionsRequired = [
  {
    key: 'url',
    display: 'URL',
    type: 'text'
  },
  {
    key: 'user',
    display: 'User',
    type: 'text'
  },
  {
    key: 'password',
    display: 'Password',
    type: 'password'
  },
  {
    key: 'refreshInterval',
    display: 'Refresh Interval (minutes)',
    type: 'number',
    defaultValue: 10
  }
]

export const webdav = {
  initialise,
  sync,
  optionsRequired
}
