/* eslint-disable max-classes-per-file */
import {
  subscribe,
  publish,
  // states,
  getState,
  hasChanged,
  tasksDiff
} from '../store'
import {
  retrieveOptions
} from './options'
import {
  setNextSync
} from './remoteStorage'

const _prefix = 'tdw'

function prefix (body) {
  return `${_prefix}-${body}`
}

export function initialiseLocalStorage () {
  subscribe(
    [
      /listsRemoveDeleted/,
      /^tasksCreateNew$/,
      /^tasksCreateNew\.fromRemote$/,
      /^listsRemoveFromState$/,
      /tasksToggleComplete/,
      /tasksEdit/,
      /tasksPurge/,
      /^tasksRemove$/,
      /^tasksRemovePurged$/,
      /tasksImport/,
      /tasksConflict/,
      /^tasksUpdateLineNumbers$/
    ],
    setChanged
  )
  subscribe(/domLoaded/, loadTasks)
  subscribe(/destroyLocalStorage/, destroyLocalStorage)
  subscribe(/remoteStorageTouch/, remoteStorageTouch)

  // note that this only listens to storage events called from other tabs,
  // not the local tab
  window.addEventListener('storage', storageEvent)
}

// presently, this value is not required from localStorage for any reason,
// however every remoteStorageTouch must write something to localStorage
// even if there are no task updates, to notify other tabs that a reload has
// occurred via the storage event.
function remoteStorageTouch ({ getState }) {
  const { lastTouch } = getState().remoteStorage
  localStorage.setItem(prefix('remoteStorageLastTouch'), lastTouch)
}

let debouncedStorageEvent
function storageEvent () {
  if (debouncedStorageEvent)
    clearTimeout(debouncedStorageEvent)
  debouncedStorageEvent = setTimeout(() => {
    loadTasks()
    retrieveOptions({ loadRemoteTasks: false })
    setNextSync(1 * 60 * 1000)
    debouncedStorageEvent = false
  }, 1000)
}

function loadTasks () {
  const tasks = getAll()
  publish('tasksLoadLocalStorage', { tasks })
}

function destroyLocalStorage () {
  localStorage.clear()
  window.location.reload(false)
}

function setChanged () {
  if (!hasChanged('lists'))
    return
  const { added, updated, removed } = tasksDiff(getState(), getState(1))
  const tasks = [...added, ...updated]
  tasks.forEach((task) => {
    const storedTask = {
      id: task.id,
      listId: task.listId,
      raw: task.raw,
      purged: task.purged,
      lineNumber: task.lineNumber
    }
    localStorage.setItem(
      prefix(task.id),
      JSON.stringify(storedTask)
    )
  })
  removed.forEach((task) => {
    localStorage.removeItem(prefix(task.id))
  })
}

function getAll () {
  const rePrefix = new RegExp(_prefix)
  const reUuid = /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
  let idx = 0
  let key
  const tasks = []
  // eslint-disable-next-line no-cond-assign
  while ((key = localStorage.key(idx)) !== null) {
    if (rePrefix.test(key) && reUuid.test(key))
      tasks.push(JSON.parse(localStorage.getItem(key)))
    idx += 1
  }
  return tasks
}
