/* eslint-disable no-new */
import { publish } from './store'
import { LocalStorage, RemoteStorage } from './controllers'
// require('milligram/dist/milligram.css')
require('./less/index.less')
require('./components')
// const {
//   Storage
// } = require('./controllers')
// const {
//   instancesTrigger
// } = require('./lib/StateObserver')

// eslint-disable-next-line no-new
// new Storage()
//
// instancesTrigger({ type: 'domLoaded' })

new LocalStorage()
new RemoteStorage()

publish('domLoaded')
