import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogOverflow.template'
import template from './DialogOverflow.html'
import styles from './DialogOverflow.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base } from '../../less'

import {
  publish
} from '../../store'

export class DialogOverflow extends LitElement {
  static get styles () {
    return [
      base,
      unsafeCSS(lightBox),
      unsafeCSS(styles)
    ]
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      dialogsToggle
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      show: { attribute: false }
    }
  }

  dialogsToggle (event) {
    const { dialog } = event.currentTarget.dataset
    publish('dialogsToggle', { dialog })
  }
}

customElements.define('tdw-dialog-overflow', DialogOverflow)
