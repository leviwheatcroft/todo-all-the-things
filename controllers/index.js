import { initialiseLocalStorage } from './LocalStorage'
import { initialiseRemoteStorage } from './remoteStorage'
import { initialiseOptions } from './options'

export function initialiseControllers () {
  // eslint-disable-next-line no-new
  initialiseLocalStorage()
  initialiseRemoteStorage()
  initialiseOptions() // this is a more appropriate pattern a than using classes
}
