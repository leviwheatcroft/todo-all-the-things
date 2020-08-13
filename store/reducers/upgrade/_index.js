/* eslint-disable camelcase */
import { v1_0_7 } from './v1.0.7'
import { v1_1_0 } from './v1.1.0'

const upgrades = {
  'v1.0.7': v1_0_7,
  'v1.1.0': v1_1_0
}

export function upgrade (action, context) {
  if (action.type !== 'upgrade')
    return

  const { version } = action.payload

  upgrades[version](context)
}
