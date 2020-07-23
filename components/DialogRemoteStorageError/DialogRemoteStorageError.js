import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogRemoteStorageError.template'
import template from './DialogRemoteStorageError.html'
import styles from './DialogRemoteStorageError.less'
import lightBoxStyles from '../LightBox/LightBoxConsumers.less'
import { base, button } from '../../less'

import {
  publish,
  subscribe,
  getState
} from '../../store'

export class DialogRemoteStorageError extends LitElement {
  constructor () {
    super()
    subscribe(/remoteStorageError/, this.updateRemoteStorageError.bind(this))
    this.updateRemoteStorageError()
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
      remoteStorageError,
      remoteStorageOptions,
      remoteStorageUpdate
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      remoteStorageError: { attribute: false }
    }
  }

  updateRemoteStorageError () {
    this.remoteStorageError = getState().remoteStorage.error
    if (
      this.remoteStorageError &&
      getState().dialogs.show !== 'remoteStorageError'
    )
      publish('dialogsToggle', { dialog: 'remoteStorageError' })
  }

  remoteStorageOptions (event) {
    event.preventDefault()
    publish('dialogsToggle', { dialog: 'remoteStorageOptions' })
  }

  remoteStorageUpdate (event) {
    event.preventDefault()
    publish('dialogsToggle')
    publish('requestSync')
  }
}

customElements.define(
  'tdw-dialog-remote-storage-error',
  DialogRemoteStorageError
)
