import { createClient } from 'webdav/web'

let tasksPatch
let tasksRemovePurged
let getOptions
let prefix
let listsEnsure
let remoteStoragePending
let remoteStorageUnpending
let setRemoteStorageTouch
let remoteStorageError

function initialise (ctx) {
  tasksPatch = ctx.tasksPatch
  tasksRemovePurged = ctx.tasksRemovePurged
  getOptions = ctx.getOptions
  prefix = ctx.prefix
  listsEnsure = ctx.listsEnsure
  remoteStoragePending = ctx.remoteStoragePending
  remoteStorageUnpending = ctx.remoteStorageUnpending
  setRemoteStorageTouch = ctx.setRemoteStorageTouch
  remoteStorageError = ctx.remoteStorageError
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

async function fetchLists () {
  const done = inFlight()
  const webdav = getClient()
  // allow error to be thrown
  const result = await webdav.getDirectoryContents('/')
  const listIds = result.map(({ baseName }) => {
    return baseName.replace(/\.\w*?$/, '')
  })
  done()
  return listIds
}

// this structure allows multiple callers to await the same import request
const importTasksInFlight = {}
async function importTasks (listId) {
  if (importTasksInFlight[listId])
    return importTasksInFlight[listId]
  const done = inFlight()
  importTasksInFlight[listId] = _importTasks(listId)
    .then(() => {
      delete importTasksInFlight[listId]
      done()
    })
  return importTasksInFlight[listId]
}

async function _importTasks (listId) {
  try {
    const listIds = listId ? [].concat(listId) : await fetchLists()
    listsEnsure(listIds)
    await Promise.all(listIds.map((listId) => {
      const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
      return retrieve(listId)
        .then((current) => {
          tasksPatch({ ...diff(previous, current), listId })
          localStorage.setItem(prefix(`previous-${listId}`), current)
        })
    }))
    setRemoteStorageTouch()
  } catch (error) {
    errorHandler(error)
  }
}

async function retrieve (listId) {
  const done = inFlight()
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
  done()
  return content
}

async function store (listId, list) {
  const done = inFlight()
  const {
    tasks
  } = list
  const webdav = getClient()
  const content = Object.values(tasks)
    .filter(({ purged }) => !purged)
    .sort((a, b) => a.lineNumber - b.lineNumber)
    .map(({ raw }) => `${raw}\n`)
    .join('')
  webdav.putFileContents(
    `/${listId}.txt`,
    content,
    { overwrite: true }
  )
  localStorage.setItem(prefix(`previous-${listId}`), content)
  tasksRemovePurged(listId)
  done()
}

async function create (listId) {
  const done = inFlight()
  const webdav = getClient()
  let result
  try {
    result = await webdav.putFileContents(
      `/${listId}.txt`,
      '',
      { overwrite: false }
    )
  } catch (error) {
    errorHandler(error)
  }
  done()
  return result
}

function getClient () {
  const { webdavUrl } = getOptions()
  return createClient(webdavUrl)
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
  importTasks,
  store,
  optionsRequired
}
