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
  subscribe,
  getState
} from '../../store'

export class DialogRemoteStorageOptions extends LitElement {
  constructor () {
    super()
    subscribe(
      /^remoteStorageOptionsRequired$/,
      this.setOptions.bind(this)
    )
    this.setOptions()
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
      options,
      optionsRequired,
      driverSelect,
      save
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      options: { attribute: false },
      optionsRequired: { attribute: false }
    }
  }

  setOptions () {
    this.options = getState().remoteStorage.options
    this.optionsRequired = getState().remoteStorage.optionsRequired
  }

  save () {
    const $root = this.shadowRoot
    const driver = $root.querySelector('select.driver').value
    const options = Object.fromEntries(
      ['driver', driver],
      $root.querySelectorAll('.optionsRequired')
        .map((input) => {
          return [input.dataset.key, input.value]
        })
        .filter(([, value]) => value)
    )
    publish('remoteStorageDriverSave', { options })
    publish('dialogsToggle')
  }

  driverSelect () {
    const $root = this.shadowRoot
    const driver = $root.querySelector('select.driver').value
    publish('remoteStorageDriverSelect', { driver })
  }
}

customElements.define(
  'tdw-dialog-remote-storage-options',
  DialogRemoteStorageOptions
)
