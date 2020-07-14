import { remoteStoragePending } from './pending'
import { remoteStorageUnpending } from './unpending'
import { remoteStorageTouch } from './touch'

const reducers = [
  remoteStoragePending,
  remoteStorageUnpending,
  remoteStorageTouch
]

export function remoteStorage (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
