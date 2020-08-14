/**
 * when writing upgrades, remember that the object passed to the upgrade fn
 * is not a copy of state, it's a copy of the dehydrated version of state.
 * This is because the hydrate fn of the present version can only work with
 * state dehydrated by the present version.
 */

/* eslint-disable camelcase */
import { v1_0_7 } from './v1_0_7'
import { v1_1_0 } from './v1_1_0'

export const upgrades = {
  'v1.0.7': v1_0_7,
  'v1.1.0': v1_1_0
}
