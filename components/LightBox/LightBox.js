import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import template from './LightBox.html'
import styles from './LightBox.less'
import { base, button } from '../../less'
import {
  publish,
  subscribe,
  states
} from '../../store'

export class LightBox extends LitElement {
  constructor () {
    super()
    this.show = states[0].dialogs.show
    subscribe('dialogsToggle', ({ state }) => {
      this.show = state.dialogs.show
    })
  }

  static get styles () { return [base, button, unsafeCSS(styles)] }

  static get properties () {
    return {
      show: { attribute: false },
      dialog: { attribute: true }
    }
  }

  maskClose (event) {
    if (!event.originalTarget.classList.contains('light-box-mask'))
      return
    this.close()
  }

  close () {
    publish('toggleDialog')
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      show,
      dialog,
      maskClose,
      close
    } = this
    if (show !== dialog)
      return ''
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-light-box', LightBox)
