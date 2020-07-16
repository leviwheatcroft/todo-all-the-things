/* eslint-disable import/no-named-as-default-member */
import { initialState } from './initialState'
import { reduce } from './reducers'
import { get } from './reducers/lib/dotProp'
import { actionTypes } from './actionTypes'
import reporter from '../lib/reporter'

export { tasksDiff } from './tasksDiff'

export const states = [{ ...initialState }]

states.isUpdated = function isUpdated (path) {
  return get(states[0], path) !== get(states[1], path)
}

export function getState (path) {
  return get(states[0], path)
}

export function getSetting (key) {
  return getState().settings[key]
}

const subscriptions = new Map()

export function subscribe (tests, handler) {
  if (typeof tests === 'function') {
    handler = tests
    tests = /.*/
  }
  tests = [].concat(tests)
  const unsubscribers = tests.map((test) => {
    const existing = Array.from(subscriptions.keys()).find((re) => {
      const reAsString = re.toString().replace(/\//g, '')
      const testAsString = test.toString().replace(/\//g, '')
      return reAsString === testAsString
    })
    if (existing) {
      test = existing
    } else {
      if (typeof test === 'string')
        test = new RegExp(test.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&'))
      subscriptions.set(test, [])
    }
    subscriptions.get(test).push(handler)
    return function unsubscribe () {
      subscriptions.set(
        test,
        subscriptions.get(test).filter((h) => h !== handler)
      )
    }
  })
  return function unsubscribe () {
    unsubscribers.forEach((u) => u())
  }
}

const actions = []
export function publish (type, payload = {}, origin = false) {
  const action = typeof type === 'string' ? { type, origin, payload } : type
  actions.push(action)
  if (actions.length > 1)
    return

  while (actions.length) {
    const action = actions[0]
    reporter.assert(
      actionTypes.includes(action.type),
      `undefined action: ${action.type}`
    )
    reporter.group(action.type)
    // reporter.groupCollapsed(action.type)
    reporter.log(`publish: ${action.type}`)
    reporter.log(action)
    const state = reduce(states[0], action, publish)
    if (state !== states[0])
      states.unshift(state)
    states.splice(10)
    reporter.log([...states])

    const context = {
      action,
      state, // todo: remove this
      states,
      getState,
      getSetting
    }
    subscriptions.forEach((handlers, re) => {
      if (re.test(action.type))
        handlers.forEach((h) => h(context))
    })
    reporter.groupEnd(action.type)
    actions.shift()
  }

  // actions.push()
  // function _publish (type, origin = false, payload = {}) {
  //   const action = typeof type === 'string' ? { type, origin, payload } : type
  //   actions.push(action)
  // }
  // _publish(type, origin, payload)
  //
  // let newState = states[0]
  // for (let idx = 0; idx < actions.length; idx += 1) {
  //   // eslint-disable-next-line no-console
  //   console.log(`publish: ${actions[idx].type}`, actions[idx])
  //   if (!actionTypes.includes(actions[idx].type))
  //     throw new Error(`undefined action: ${actions[idx].type}`)
  //   newState = reduce(newState, actions[idx], _publish)
  // }
  // for (let idx = 0; idx < actions.length; idx += 1) {
  //   subscriptions.forEach((handlers, re) => {
  //     if (re.test(actions[idx].type))
  //       handlers.forEach((h) => h({ action: actions[idx], state: newState }))
  //   })
  // }
  // if (newState !== states[0])
  //   states.unshift(newState)
}
