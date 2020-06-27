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
    state,
    update
  } = context
  const id = uuid()
  const lineNumber = nextLineNumber(state.lists[listId].tasks)
  const parsed = parseTask(raw)
  const filterMatched = state.filter.regExp.test(raw)
  const task = {
    id,
    raw,
    lineNumber,
    filterMatched,
    ...parsed
  }
  update(['lists', listId, 'tasks', id], task)
  update(
    ['lists', listId, 'tasks'],
    sortTasks(state.lists[listId].tasks, state.options.sort)
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
