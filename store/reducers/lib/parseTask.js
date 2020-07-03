/* eslint-disable no-cond-assign, prefer-destructuring */
export function parseTask (raw) {
  const parsed = raw
  const task = { raw, parsed }
  complete(task)
  createdDate(task)
  completedDate(task)
  priority(task)
  project(task)
  context(task)
  url(task)
  values(task)
  detail(task)
  description(task)
  return task
}

function complete (task) {
  const re = /^ ?x /i
  task.complete = re.test(task.raw)
  task.parsed = task.parsed.replace(re, '').trimStart()
}

function priority (task) {
  const re = /\(([a-z])\) /ig
  const result = re.exec(task.raw)
  task.priority = false
  if (result)
    task.priority = result[1].toUpperCase()
  task.parsed = task.parsed.replace(re, '').trimStart()
}

function createdDate (task) {
  const re = /^\d{4}-\d{2}-\d{2}/
  const result = re.exec(task.parsed)
  if (!result)
    return
  task.createdDate = result[0]
  task.parsed = task.parsed.replace(re, '').trimStart()
}

function completedDate (task) {
  const re = /^\d{4}-\d{2}-\d{2}/
  const result = re.exec(task.parsed)
  if (!result)
    return
  task.completedDate = result[0]
  task.parsed = task.parsed.replace(re, '').trimStart()
}

function project (task) {
  const re = /\+([\w-]*)( |$)/g
  task.projects = []
  let result
  while ((result = re.exec(task.raw)) !== null)
    task.projects.push(result[1])

  task.parsed = task.parsed.replace(re, '')
}

function context (task) {
  const re = /@([\w-]*)( |$)/g
  task.contexts = []
  let result
  while ((result = re.exec(task.raw)) !== null)
    task.contexts.push(result[1])

  task.parsed = task.parsed.replace(re, '')
}

function url (task) {
  const re = /https?:\/\/(?:www\.)?([^/]*)[^\s]*/g
  task.urls = {}
  let result
  while ((result = re.exec(task.raw)) !== null)
    task.urls[result[1]] = result[0]
  task.parsed = task.parsed.replace(re, '')
}

function values (task) {
  const re = /([^ :]+):([^ :]+)( |$)/g
  task.values = {}
  let result
  while ((result = re.exec(task.parsed)) !== null)
    task.values[result[1]] = result[2]
  task.parsed = task.parsed.replace(re, '')
}

function detail (task) {
  const re = /\s-\s(.*)/
  const result = re.exec(task.parsed)
  console.log(result)
  task.detail = result ? result[1] : false
  task.parsed = task.parsed.replace(re, '')
}

function description (task) {
  task.description = task.parsed
  delete task.parsed
}
