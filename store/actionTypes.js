/* eslint-disable comma-dangle */
export const actionTypes = [
  'domLoaded',
  // issued by index.js on load
  // listener: localStorage controller - needs to load tasks from local storage
  'tasksUpsert',
  // issued by LocalStorage on domLoaded
  //
  'filterApply',
  // issued by tasksUpsert reducer
  // issued by filterSet reducer
  'toggleComplete',
  // issued by TaskInactive component
  'sortTasks',
  // issued by toggleComplete reducer
  // issued by tasksUpsert reducer
]
