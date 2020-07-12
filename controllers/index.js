import { LocalStorage } from './LocalStorage'
import { RemoteStorage } from './RemoteStorage'
import { initialiseOptions } from './options'
import { initialiseUpgrade } from './upgrade'

export function initialiseControllers () {
  new LocalStorage()
  new RemoteStorage()
  initialiseOptions() // this is a more appropriate pattern a than using classes
  initialiseUpgrade()
}
