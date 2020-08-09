import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import {
  nothing as _nothing
} from 'lit-html'
import template from './RemoteStorageState.html'
import { base, button } from '../../less'
import styles from './RemoteStorageState.less'
import { publish, subscribe, getState } from '../../store'

export class RemoteStorageState extends LitElement {
  constructor () {
    super()
    subscribe([
      /remoteStorage/,
      /optionsLoadLocalStorage/
    ], this.setState.bind(this))
    this.setState()
  }

  static get styles () { return [base, button, unsafeCSS(styles)] }

  static get properties () {
    return {
      remoteStorageState: { attribute: false }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      remoteStorageState,
      requestSync
    } = this
    const html = _html
    const nothing = _nothing
    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  setState () {
    this.remoteStorageState = getState().remoteStorage.state
  }

  requestSync () {
    publish('requestSync')
  }
}

customElements.define('tdw-remote-storage-state', RemoteStorageState)
