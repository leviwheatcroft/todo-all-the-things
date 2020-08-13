/**
 * remoteStorage controller
 *
 * interfaces with drivers, difficult to get the interface right, sync is a
 * complex operation, and simplicity needs to be balanced against "decoupled"
 * drivers.
 *
 * controller must provide 'context' to driver, to abstract away state
 * operations.
 */
import {
  publish,
  subscribe,
  getState
} from '../../store'
import * as context from './context'
import drivers from '../../drivers'
import { setNextSync } from './setNextSync'

export { setNextSync } from './setNextSync'

let driver

export function initialiseRemoteStorage () {
  // the order in which listeners are subscribed is the list in which they
  // will be executed
  // both this.driverSave and this.tasksLoadRemoteStorage are handlers
  // for the 'remoteStorageDriverSave' action.
  // because this.driverSave is subscribed first, it will be called first
  subscribe([
    /^optionsLoadLocalStorage$/,
    /^remoteStorageDriverSelect$/
  ], driverSelect)
  subscribe([
    /^optionsLoadLocalStorage$/,
    /^remoteStorageDriverSave$/
  ], driverInitialise)
  subscribe([
    /optionsLoadLocalStorage/,
    /remoteStorageDriverSave/,
    /requestSync/,
    /^tasksCreateNew$/,
    /tasksToggleComplete/,
    /tasksEdit/,
    /tasksPurge/,
    /tasksImport/,
    /tasksConflictResolve/,
    /listsAdd/
  ], sync)

  driverInitialise()
}

function driverSelect (ctx) {
  let { driver } = getState().remoteStorage.options
  driver = ctx.action.payload.driver || driver || 'none'
  let optionsRequired
  if (driver === 'none')
    optionsRequired = []
  else
    optionsRequired = drivers[driver].optionsRequired
  publish(
    'remoteStorageOptionsRequired',
    { optionsRequired }
  )
}

function driverInitialise () {
  const selected = getState().remoteStorage.options.driver
  driver = selected ? drivers[selected] : false
  if (!driver)
    return

  driver.initialise(context)
}

/**
 * sync - sync local and remote lists
 *
 * _queue calls_
 * if there's no sync in progress, sync immediately
 * if there's a sync in progress, queue another sync on completion
 * if there's already a queued sync, do not add additional calls
 */
let pending = false
let queued = false
function sync () {
  if (!driver)
    return
  if (pending) {
    queued = true
    return
  }
  pending = true
  driver.sync().then(() => {
    pending = false
    if (queued) {
      queued = false
      sync()
    } else {
      setNextSync()
    }
  })
}
