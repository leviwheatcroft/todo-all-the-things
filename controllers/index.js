import { LocalStorage } from './LocalStorage'
import { initialiseRemoteStorage } from './remoteStorage'
import { initialiseOptions } from './options'

export function initialiseControllers () {
  new LocalStorage()
  initialiseRemoteStorage()
  initialiseOptions() // this is a more appropriate pattern a than using classes
}
