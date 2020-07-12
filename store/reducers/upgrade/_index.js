/* eslint-disable camelcase */
import { v1_0_7 } from './v1.0.7'

const upgrades = {
  'v1.0.7': v1_0_7
}

export function upgrade (action, context) {
  if (action.type !== 'upgrade')
    return

  const { version } = action.payload

  upgrades[version](context)
}
