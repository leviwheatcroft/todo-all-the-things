import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogOptions.template'
import template from './DialogOptions.html'
import styles from './DialogOptions.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base, button } from '../../less'

import {
  subscribe,
  publish,
  getState
} from '../../store'

export class DialogOptions extends LitElement {
  constructor () {
    super()
    subscribe(
      'optionsToggleShowCreatedDate',
      this.setShowCreatedDate.bind(this)
    )
    this.setShowCreatedDate()
  }

  static get styles () {
    return [
      base,
      button,
      unsafeCSS(lightBox),
      unsafeCSS(styles)
    ]
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      dialogRemoteStorageOptions,
      toggleShowCreatedDate,
      showCreatedDate
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      show: { attribute: false },
      showCreatedDate: { attribute: false }
    }
  }

  dialogRemoteStorageOptions () {
    publish('dialogsToggle', { dialog: 'remoteStorageOptions' })
  }

  setShowCreatedDate () {
    this.showCreatedDate = getState().settings.showCreatedDate
  }

  toggleShowCreatedDate () {
    publish('optionsToggleShowCreatedDate')
  }
}

customElements.define('tdw-dialog-options', DialogOptions)
