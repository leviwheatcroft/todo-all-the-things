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
  // issued by LightBox component
  //  - Tools
  //  - ToolsImport
  //  - Help

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

  'tasksConflict',
  // sets conflicted object on all tasks involved in a conflict
  // called by RemoteStorage controller

  'tasksConflictResolve',
  // resolves conflict
  // called by DialigConflict

  'optionsLoadLocalStorage',
  // loads options to state from local storage
  // issued by options controller

  'optionsToggleShowCreatedDate',
  // toggles showCreatedDate
  // called from options dialog

  'listsAdd',
  // adds new list to store
  // published by DialogLists

  'listsSelect',
  // sets selectedList in the store
  // published by DialogLists

  'listsEnsureInState',
  // ensures list exists in store
  // lists from remote storage with no tasks still need to be created in store
  // published by driver via RemoteStorage

  'remoteStoragePending',
  'remoteStorageUnpending',
  // sets remoteStorage.state as 'pending' or 'connected'
  // called by RemoteStorage controller

  'requestSync',
  // no effect on state
  // issued by RemoteStorageState NavBar Button
  // issued by DialogRemoteStorageError

  'upgrade',
  // applies state upgrades
  // issued by upgrade controller

  'destroyLocalStorage',
  // no reducer
  // issued by DialogTools
  // listened by LocalStorageController
  // completely removes all local storage entries & reloads page

  'remoteStorageTouch',
  // remoteStorage uses this action to notify localStorage to store lastTouch
  // the lastTouch value is not required for any reason, but storing it
  // ensures that every remoteStorage action updates localStorage, allowing
  // other open tabs to be notified that remoteStorage has been queried.

  'firstRun',
  // no reducer
  // issued by options controller when options are loaded but none
  // exist

  'remoteStorageError',
  // updated remoteStorage.error in state
  // issued by remoteStorage controller

  'remoteStorageDriverSelect',
  // switch driver in DialogRemoteStorageOptions
  // this doesn't mean saving the remote storage options, just switching
  // the select box
  // issued by DialogRemoteStorageOptions

  'remoteStorageOptionsRequired',
  // sets optionsRequired in state
  // issued by remoteStorage controller in response to remoteStorageDriverSelect

  'remoteStorageDriverSave',
  // stores state.remoteStorage params
  // issued by DialogRemoteStorageOptions

]
