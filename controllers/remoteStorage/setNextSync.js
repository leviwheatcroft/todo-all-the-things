import {
  publish,
  getState
} from '../../store'

let nextSync

export function setNextSync (offset = 0) {
  const { refreshInterval } = getState().remoteStorage.options
  if (!refreshInterval) {
    console.error('no refreshInterval!')
    return
  }
  if (nextSync)
    clearTimeout(nextSync)
  nextSync = setTimeout(
    () => publish('requestSync'),
    (refreshInterval * 60 * 1000) + offset,
    { getState }
  )
}
