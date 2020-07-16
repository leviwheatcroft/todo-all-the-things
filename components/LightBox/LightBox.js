import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import {
  nothing as _nothing
} from 'lit-html'
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
    subscribe(
      [
        /dialogsToggle/,
        /optionsLoadLocalStorage/
      ],
      ({ getState }) => {
        this.show = getState().dialogs.show
      }
    )
  }

  static get styles () { return [base, button, unsafeCSS(styles)] }

  static get properties () {
    return {
      show: { attribute: false },
      dialog: { attribute: true },
      nonDismissable: { attribute: true, type: Boolean }
    }
  }

  maskClose (event) {
    if (this.nonDismissable)
      return
    if (event.target !== event.currentTarget) // event has bubbled from desc
      return
    this.close()
  }

  close () {
    publish('dialogsToggle')
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      show,
      dialog,
      maskClose,
      close,
      nonDismissable
    } = this
    if (show !== dialog)
      return ''
    const html = _html
    const nothing = _nothing

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-light-box', LightBox)
