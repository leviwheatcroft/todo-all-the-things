/**
 * driver complex operations
 *
 * ## lists deleted locally
 * - set list[listId].deleted in state
 * - driver: mergeFromRemote as normal
 * - driver: writeToRemote must remove deleted lists
 * - driver: call listsRemoveDeleted
 *
 * ## lists deleted remotely
 * - driver: mergeFromRemote detects deleted list
 * - driver: call listsRemoveFromState
 */

import { createClient } from 'webdav/web'

let getListsFromState
let getOptions
let prefix
let remoteStorageError
let remoteStoragePending
let remoteStorageUnpending
let setRemoteStorageTouch
let tasksPatch
let tasksRemovePurged
let listsRemoveFromState
let listsRemoveDeleted

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
  listsRemoveFromState = ctx.listsRemoveFromState
  listsRemoveDeleted = ctx.listsRemoveDeleted
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
  remoteStoragePending()
  try {
    await mergeFromRemote()
    await writeToRemote()
  } catch (error) {
    errorHandler(error)
  }
  // store touch in localStorage, so other browser tabs will update
  setRemoteStorageTouch()
  remoteStorageUnpending()
}

async function mergeFromRemote () {
  const remoteListIds = await fetchListsFromRemote()

  await Promise.all(remoteListIds.map(async (listId) => {
    const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
    const current = await fetchListFromRemote(listId)
    tasksPatch({ ...diff(previous, current), listId })
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

async function writeToRemote () {
  const lists = Object.values(getListsFromState())
  const webdav = getClient()
  await Promise.all(lists.map(async (list) => {
    const {
      id: listId,
      deleted,
      tasks
    } = list
    if (deleted) {
      await webdav.deleteFile(`/${listId}.txt`)
      localStorage.removeItem(prefix(`previous-${listId}`))
      return
    }
    const previous = localStorage.getItem(prefix(`previous-${listId}`))
    const current = Object.values(tasks)
      .filter(({ purged }) => !purged)
      .sort((a, b) => a.lineNumber - b.lineNumber)
      .map(({ raw }) => raw)
      .join('\n')
    if (current !== previous) {
      await webdav.putFileContents(
        `/${listId}.txt`,
        current,
        {
          overwrite: true
        }
      )
      localStorage.setItem(prefix(`previous-${listId}`), current)
    }
  }))
  tasksRemovePurged()
  listsRemoveDeleted()
}

async function fetchListsFromRemote () {
  const webdav = getClient()
  // allow error to be thrown
  const result = await webdav.getDirectoryContents('/')
  const listIds = result.map(({ basename }) => {
    return basename.replace(/\.\w*?$/, '')
  })
  return listIds
}

async function fetchListFromRemote (listId) {
  const webdav = getClient()
  let content
  try {
    content = await webdav.getFileContents(
      `/${listId}.txt`,
      { format: 'text' }
    )
  } catch (error) {
    errorHandler(error)
    content = ''
  }
  return content
}

function getClient () {
  const { url, user, password } = getOptions()
  return createClient(url, {
    username: user || undefined,
    password: password || undefined
  })
}

function errorHandler (error) {
  Object.entries(error).forEach(([key, value]) => {
    console.error('error:', key, value)
  })
  if (
    error.isAxiosError &&
    !error.response &&
    error.message === 'Network Error'
  ) {
    // this is what a CORS failure will look like.
    // our webDAV lib wants to issue a PROPFIND request, which will list
    // directory contents. Browser will first issue an OPTIONS request, to
    // check CORS headers will permit the PROPFIND request. If the headers
    remoteStorageError(
      error.message ? `${error.message} (CORS Error?)` : 'CORS Error',
      `
      This error is vague, but is commonly caused when a server does not
      support CORS requests.
      `
    )

    return
  }
  if (!error.response) {
    remoteStorageError(
      'Unknown Error'
    )
    return
  }
  if (error.response.status === 403) {
    remoteStorageError(
      '403: Forbidden',
      `
      The server you've tried to connect to will not provide access to that
      directory.
      `
    )
    return
  }
  if (error.response.status === 401) {
    remoteStorageError(
      '401: Unauthorized',
      `
      The server you've tried to connect to says that your user / password
      does not have proper authorization to access that directory.
      `
    )
    return
  }
  if (error.response) {
    remoteStorageError(
      `${error.response.status} ${error.response.statusText}`,
      `
      This error was reported by the WebDAV server, and is most likely a server
      or configuration issue.
      `
    )
    // eslint-disable-next-line no-useless-return
    return
  }
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
