/* eslint-disable comma-dangle */
export const actionTypes = [
  'domLoaded',
  // issued by index.js on load
  // listener: localStorage controller - needs to load tasks from local storage

  'tasksLoadLocalStorage',
  // issued by LocalStorage

  'tasksCreateNew',
  // issued by TaskNew component

  'tasksToggleActive',
  // issued by TaskInactive component
  // issued by TaskActive component

  'tasksToggleComplete',
  // issued by TaskInactive component

  'tasksEdit',
  // issued by TaskActive component

  'filterSet',
  // issued by Filter component

  'dialogsToggle',
  // issued by NavBar component
  // issued by Tools component
  // issued by ToolsImport component

  'tasksPurge',
  // sets completed tasks { purged: true }
  // issued by Tools component

  'tasksRemove',
  // removes task which matches 'raw' value
  // used when a task has been removed from the remote
  // issued by RemoteStorage controller
]
