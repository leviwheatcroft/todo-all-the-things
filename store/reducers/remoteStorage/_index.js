import { remoteStoragePending } from './pending'
import { remoteStorageUnpending } from './unpending'
import { remoteStorageTouch } from './touch'
import { remoteStorageError } from './error'

const reducers = [
  remoteStoragePending,
  remoteStorageUnpending,
  remoteStorageTouch,
  remoteStorageError
]

export function remoteStorage (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
