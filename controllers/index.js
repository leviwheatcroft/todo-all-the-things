import { LocalStorage } from './LocalStorage'
import { RemoteStorage } from './RemoteStorage'
import { initialiseOptions } from './options'

export function initialiseControllers () {
  new LocalStorage()
  new RemoteStorage()
  initialiseOptions() // this is a more appropriate pattern a than using classes
}
