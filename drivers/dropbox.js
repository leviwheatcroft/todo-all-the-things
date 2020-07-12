import { Dropbox } from 'dropbox'

let tasksPatch
let tasksRemovePurged
let getOptions
let prefix
let listsEnsure

function initialise (ctx) {
  tasksPatch = ctx.tasksPatch
  tasksRemovePurged = ctx.tasksRemovePurged
  getOptions = ctx.getOptions
  prefix = ctx.prefix
  listsEnsure = ctx.listsEnsure
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
  const dbx = getClient()
  let result
  try {
    result = await dbx.filesListFolder({
      path: ''
    })
  } catch (err) {
    console.error(err)
    // const { error: raw } = err
    // const error = JSON.parse(raw)
  }
  const listIds = result.entries.map((entry) => {
    return entry.name.replace(/\.\w*?$/, '')
  })
  return listIds
}

// this structure allows multiple callers to await the same import request
const importTasksInFlight = {}
async function importTasks (listId) {
  if (importTasksInFlight[listId])
    return importTasksInFlight[listId]
  importTasksInFlight[listId] = _importTasks(listId)
    .then(() => delete importTasksInFlight[listId])
  return importTasksInFlight[listId]
}

async function _importTasks (listId) {
  const listIds = listId ? [].concat(listId) : await fetchLists()
  await Promise.all(listIds.map((listId) => {
    const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
    listsEnsure(listId)
    return retrieve(listId).then((current) => {
      tasksPatch({ ...diff(previous, current), listId })
      localStorage.setItem(prefix(`previous-${listId}`), current)
    })
  }))
}

async function retrieve (listId) {
  // debugger
  const dbx = getClient()
  let result
  try {
    result = await dbx.filesDownload({
      path: `/${listId}.txt`
    })
  } catch (err) {
    console.error(err)
    const { error: raw } = err
    const error = JSON.parse(raw)
    if (/path\/not_found/.test(error.error_summary))
      result = await create(listId)
  }
  const content = await result.fileBlob.text()
  return content
}

async function store (listId, list) {
  const {
    tasks
  } = list
  const dbx = getClient()
  const bits = Object.values(tasks)
    .filter(({ purged }) => !purged)
    // remote conflicts need to be stored otherwise they would be deleted from
    // other clients, however local conflicts should be held back.
    .filter(({ conflicted }) => !conflicted !== 'local')
    .sort((a, b) => a.lineNumber - b.lineNumber)
    .map(({ raw }) => `${raw}\n`)
  const contents = new File(bits, `${listId}.txt`)
  await dbx.filesUpload({
    contents,
    path: `/${listId}.txt`,
    mode: 'overwrite'
  })
  localStorage.setItem(prefix(`previous-${listId}`), await contents.text())
  tasksRemovePurged(listId)
}

async function create (listId) {
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

export const dropbox = {
  initialise,
  importTasks,
  store
}
