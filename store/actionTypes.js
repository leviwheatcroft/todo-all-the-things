/* eslint-disable comma-dangle */
export const actionTypes = [
  'domLoaded',
  // issued by index.js on load
  // listener: localStorage controller - needs to load tasks from local storage

  'tasksLoadLocalStorage',
  // issued by LocalStorage

  'tasksCreateNew',
  // issued by TaskNew component

  'tasksCreateNew.fromRemote',
  // this is processed by the tasksCreateNew reducer
  // a different action.type is required so that RemoteStorage can listen to
  // tasksCreateNew, while ignoring tasksCreateNew.fromRemote
  // issued by RemoteStorage

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
  // removes task which matches 'raw' value from payload
  // used when a task has been removed from the remote
  // issued by RemoteStorage controller

  'tasksRemovePurged',
  // removes tasks with task.purged set
  // the flow for purging completed tasks is:
  // set task.purged
  // RemoteStorage reacts to changed tasks, invokes driver.store
  // driver.store saves list without purged tasks
  // driver.store invokes tasksRemovePurged to delete tasks from state
  // localStorage reacts to changed tasks, deletes tasks from localStorage

  'tasksImport',
  // imports tasks from txt file, stores in state
  // issued by Import component

  'tasksSetPending',
  'tasksUnsetPending',
  // set pending: true | false
  // issued by RemoteStorage controller
]
