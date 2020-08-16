import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import {
  nothing as _nothing
} from 'lit-html'
// import { render } from './DialogRemoteStorageError.template'
import template from './DialogRemoteStorageError.html'
import styles from './DialogRemoteStorageError.less'
import lightBoxStyles from '../LightBox/LightBoxConsumers.less'
import { base, button } from '../../less'

import {
  publish,
  subscribe
} from '../../store'

export class DialogRemoteStorageError extends LitElement {
  constructor () {
    super()
    subscribe(/remoteStorageError/, this.remoteStorageError.bind(this))
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
      error,
      errorDetail,
      remoteStorageOptions,
      remoteStorageUpdate
    } = this
    const html = _html
    const nothing = _nothing

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      error: { attribute: false },
      errorDetail: { attribute: false }
    }
  }

  remoteStorageError ({ action: { payload } }) {
    const {
      error,
      errorDetail
    } = payload
    this.error = error
    this.errorDetail = errorDetail
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
