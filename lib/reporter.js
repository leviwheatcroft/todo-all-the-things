/* eslint-disable no-console */

export const logHistory = []

function append (type, meta) {
  meta = [].concat(meta)
  const line = typeof meta[0] === 'string' ? meta.shift() : '<data>'
  logHistory.push({ line, type, meta })
  logHistory.splice(100)
}

logHistory.toString = function toString () {
  return logHistory.reduce((lines, { line, type }, idx) => {
    const count = idx.toString().padStart(3)
    return lines.concat(`${count}: [${type.padEnd(10)}] ${line}\n`)
  }, '')
}

// don't do this... recursion!!
// logHistory.toJSON = function toJSON () {
//   return JSON.stringify(logHistory)
// }

export function assert (test, ...meta) {
  if (!test)
    append('assertion', meta)
  console.assert(test, ...meta)
}

export function group (groupName) {
  append('group', `## ${groupName} >>>`)
  console.group(groupName)
}

export function groupCollapsed (groupName) {
  append('group', `## ${groupName} >>>`)
  console.groupCollapsed(groupName)
}

export function groupEnd (groupName) {
  append('groupEnd', `## <<< ${groupName}`)
  console.groupEnd(groupName)
}

const logLevels = ['debug', 'info', 'log', 'warn', 'error']
const logLevelFns = Object.fromEntries(logLevels.map((logLevel) => {
  return [
    logLevel,
    (...meta) => {
      append(logLevel, meta)
      console[logLevel](...meta)
    }
  ]
}))

export default {
  logHistory,
  group,
  groupCollapsed,
  groupEnd,
  assert,
  ...logLevelFns
}
