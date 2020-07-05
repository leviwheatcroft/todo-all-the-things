import { Dropbox } from 'dropbox'

let tasksAdd
let tasksRemove
let tasksRemovePurged
let getOptions
let prefix

function initialise (ctx) {
  tasksAdd = ctx.tasksAdd
  tasksRemove = ctx.tasksRemove
  tasksRemovePurged = ctx.tasksRemovePurged
  getOptions = ctx.getOptions
  prefix = ctx.prefix
}

function diff (previous, current, listId) {
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
      return added.push({ raw, listId })
    delete previous[idx] // unchanged
  })
  const removed = previous
    .filter((i) => i)
    .map((raw) => { return { raw, listId } })
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

async function importTasks (listId) {
  const listIds = listId ? [listId] : await fetchLists()
  listIds.forEach((listId) => {
    const previous = localStorage.getItem(prefix(`previous-${listId}`)) || ''
    retrieve(listId).then((current) => {
      const { added, removed } = diff(previous, current, listId)
      if (added)
        tasksAdd(added, listId)
      if (removed)
        tasksRemove(removed, listId)
      localStorage.setItem(prefix(`previous-${listId}`), current)
    })
  })
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

async function store (list) {
  const {
    id: listId,
    tasks
  } = list
  const dbx = getClient()
  const bits = Object.values(tasks)
    .filter(({ purged }) => !purged)
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
