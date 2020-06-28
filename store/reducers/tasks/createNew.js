import {
  v4 as uuid
} from 'uuid'
import { parseTask } from '../lib/parseTask'
import { nextLineNumber } from '../lib/nextLineNumber'
import { sortTasks } from '../lib/sortTasks'

export function tasksCreateNew (action, context) {
  if (action.type !== 'tasksCreateNew')
    return
  if (process.env.NODE_ENV !== 'production')
    checkPayloadShape(action.payload)
  const {
    payload: {
      task: { raw, listId }
    }
  } = action
  const {
    getState,
    update
  } = context
  const id = uuid()
  const lineNumber = nextLineNumber(getState().lists[listId].tasks)
  const parsed = parseTask(raw)
  const filterMatched = getState().filter.regExp.test(raw)
  const task = {
    id,
    raw,
    listId,
    lineNumber,
    filterMatched,
    ...parsed
  }
  update(['lists', listId, 'tasks', id], task)
  update(
    ['lists', listId, 'tasks'],
    sortTasks(getState().lists[listId].tasks, getState().options.sort)
  )
}

function checkPayloadShape (payload) {
  /* eslint-disable no-console */
  console.assert(
    Object.getPrototypeOf(payload.task) === Object.prototype,
    'payload.task must be plain object'
  )
  console.assert(
    typeof payload.task.raw === 'string' &&
    payload.task.raw !== '',
    'payload.task.raw must be non-empty string'
  )
  console.assert(
    typeof payload.task.listId === 'string' &&
    payload.task.listId !== '',
    'payload.task.listId must be non-empty string'
  )
  /* eslint-enable */
}
