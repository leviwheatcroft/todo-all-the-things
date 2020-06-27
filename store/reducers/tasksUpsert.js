import {
  v4 as uuid
} from 'uuid'
import { parseTask } from '../../lib/parseTask'

export function tasksUpsert (action, { state, update, publish }) {
  if (action.type !== 'tasksUpsert')
    return
  let { payload: { tasks } } = action
  if (!tasks)
    throw new RangeError('tasksAdd requires payload.tasks')
  tasks = [].concat(tasks)
  tasks.forEach((task) => {
    let {
      id,
      lineNumber
    } = task
    const {
      listId,
      raw
    } = task
    id = id || uuid()
    lineNumber = lineNumber || nextLineNumber(state.lists[listId].tasks)
    task = {
      ...task,
      id,
      lineNumber,
      listId,
      ...parseTask(raw)
    }
    // console.log('will update', ['lists', listId, 'tasks', id], task)
    update(['lists', listId, 'tasks', id], task)
  })
  publish('filterApply')
  publish('sortTasks')
}

function nextLineNumber (tasks) {
  return Object.values(tasks)
    .reduce((lineNumber, task) => {
      return Math.max(lineNumber, task.lineNumber + 1)
    }, 0)
}
