import {
  subscribe,
  publish
} from '../store'

const available = [
  'v1.0.7'
]

let unsubscribe
export function initialiseUpgrade () {
  unsubscribe = subscribe(/optionsLoadLocalStorage/, upgrade.bind(this))
}

function upgrade ({ getState }) {
  unsubscribe()
  const current = getState().version
  const next = available.indexOf((upg) => versionCompare(current, upg) < 0)
  if (next === -1)
    return
  available.slice(next).forEach((version) => publish('upgrade', { version }))
}

function versionCompare (a, b) {
  if (a === undefined)
    return -1
  a = a.replace('v', '').split('.')
  b = b.replace('v', '').split('.')
  for (let i = 0; i < 3; i += 1) {
    const na = Number(a[i])
    const nb = Number(b[i])
    if (na > nb)
      return 1
    if (nb > na)
      return -1
    if (
      !Number.isNaN(na) &&
      Number.isNaN(nb)
    )
      return 1
    if (
      Number.isNaN(na) &&
      !Number.isNaN(nb)
    )
      return 1
    return 0
  }
}
