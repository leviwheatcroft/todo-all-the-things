import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogRemoteStorageOptions.template'
import template from './DialogRemoteStorageOptions.html'
import styles from './DialogRemoteStorageOptions.less'
import lightBoxStyles from '../LightBox/LightBoxConsumers.less'
import { base, button } from '../../less'

import {
  publish,
  states
} from '../../store'

export class DialogRemoteStorageOptions extends LitElement {
  constructor () {
    super()
    const {
      driver,
      refreshInterval,
      accessToken
    } = states[0].remoteStorage
    Object.assign(this, { driver, refreshInterval, accessToken })
  }

  static get styles () {
    return [
      base,
      button,
      unsafeCSS(lightBoxStyles),
      unsafeCSS(styles)
    ]
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      driver,
      accessToken,
      save
    } = this
    let {
      refreshInterval
    } = this
    refreshInterval = refreshInterval / 60 / 1000
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      driver: { attribute: false },
      refreshInterval: { attribute: false },
      accessToken: { attribute: false }
    }
  }

  save () {
    const $root = this.shadowRoot
    const driver = $root.querySelector('select.driver').value
    let refreshInterval = $root.querySelector('input.refresh-interval').value
    refreshInterval = Math.min(refreshInterval, 10)
    refreshInterval = Math.max(refreshInterval, 1)
    refreshInterval = refreshInterval * 60 * 1000
    const accessToken = $root.querySelector('input.access-token').value
    publish('optionsDriverSave', { driver, refreshInterval, accessToken })
    publish('dialogsToggle')
  }
}

customElements.define(
  'tdw-dialog-remote-storage-options',
  DialogRemoteStorageOptions
)
