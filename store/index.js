import { initialState } from './initialState'
import { reduce } from './reducers'
import { get } from '../lib/dotProp'

export const states = [{ ...initialState }]

states.isUpdated = function isUpdated (path) {
  return get(states[0], path) !== get(states[1], path)
}

const subscriptions = new Map()

export function subscribe (test, handler) {
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
    subscriptions[test] = subscriptions[test].filter((h) => h !== handler)
  }
}

export function publish (action, payload) {
  const actions = []

  function _publish (action, payload = {}) {
    if (typeof action === 'string')
      action = { type: action, payload }
    actions.push(action)
  }
  _publish(action, payload)

  let newState = states[0]
  for (let idx = 0; idx < actions.length; idx += 1) {
    console.log(`publish: ${actions[idx].type}`, actions[idx])
    newState = reduce(newState, actions[idx], _publish)
  }
  if (newState !== states[0])
    states.unshift(newState)
  for (let idx = 0; idx < actions.length; idx += 1) {
    subscriptions.forEach((handlers, re) => {
      if (re.test(actions[idx].type))
        handlers.forEach((h) => h({ action: actions[idx], state: states[0] }))
    })
  }
}

// export function publish (action, payload) {
//   inFlight.push(_publish(action, payload))
//   console.log('queued', inFlight)
//   if (inFlight.length === 1) {
//     Promise.all(inFlight).then(() => {
//       inFlight = []
//       console.log('clean queue')
//       subscriptions.forEach((handlers, test) => {
//         if (
//           (
//             test instanceof RegExp &&
//             test.test(action.type)
//           ) ||
//           (
//             typeof test === 'string' &&
//             test === action.type
//           )
//         )
//           handlers.forEach((h) => h({ state: states[0] }))
//       })
//     })
//   }
// }
//
// async function _publish (action, payload = {}) {
//   if (typeof action === 'string')
//     action = { type: action, payload }
//   const start = Date.now()
//   console.log(`publish: ${action.type}`, action)
//   const newState = reduce(states[0], action, publish)
//   if (newState !== states[0])
//     states.unshift(newState)
//   const duration = Date.now() - start
//   console.log(`published: ${action.type} in ${duration}ms`, states)
// }
