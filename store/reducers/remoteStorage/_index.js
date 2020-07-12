import { remoteStoragePending } from './pending'
import { remoteStorageUnpending } from './unpending'

const reducers = [
  remoteStoragePending,
  remoteStorageUnpending
]

export function remoteStorage (action, context) {
  const { getState, wrapped } = context
  const result = reducers.reduce((state, reducer) => {
    reducer(action, context)
    return wrapped.result
  }, getState())
  return result
}
