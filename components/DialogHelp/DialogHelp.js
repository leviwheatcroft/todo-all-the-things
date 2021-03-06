import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogHelp.template'
import template from './DialogHelp.html'
import styles from './DialogHelp.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base, button } from '../../less'
import { publish, subscribe } from '../../store'

// import {
//   publish,
//   states
// } from '../../store'

export class DialogHelp extends LitElement {
  constructor () {
    super()
    subscribe(/firstRun/, this.show.bind(this))
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
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  show () {
    publish('dialogsToggle', { dialog: 'help' })
  }
  // static get properties () {
  //   return {
  //     show: { attribute: false }
  //   }
  // }
}

customElements.define('tdw-dialog-help', DialogHelp)
