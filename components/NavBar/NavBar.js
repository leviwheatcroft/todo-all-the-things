import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import template from './NavBar.html'
import { base, button } from '../../less'
import styles from './NavBar.less'
import { publish } from '../../store'

export class NavBar extends LitElement {
  static get styles () { return [base, button, unsafeCSS(styles)] }

  tools () {
    publish({
      type: 'toggleDialog',
      payload: {
        dialog: 'tools'
      }
    })
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      tools
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-nav-bar', NavBar)
