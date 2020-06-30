import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogRemoteStorageOptions.template'
import template from './DialogRemoteStorageOptions.html'
import styles from './DialogRemoteStorageOptions.less'
import { base, button } from '../../less'

import {
  publish,
  states
} from '../../store'

export class DialogRemoteStorageOptions extends LitElement {
  constructor () {
    super()
    this.accessToken = states[0].remoteStorage.accessToken
    this.driver = states[0].remoteStorage.driver
  }

  static get styles () { return [base, button, unsafeCSS(styles)] }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      driver,
      accessToken,
      setAccessToken,
      selectDriver
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      accessToken: { attribute: false }
    }
  }

  setAccessToken (event) {
    const accessToken = event.target.value
    publish('optionsDriverAccessToken', { accessToken })
  }

  selectDriver (event) {
    const driver = event.target.value === 'none' ? false : event.target.value
    publish('optionsDriverSelect', { driver })
  }
}

customElements.define(
  'tdw-dialog-remote-storage-options',
  DialogRemoteStorageOptions
)
