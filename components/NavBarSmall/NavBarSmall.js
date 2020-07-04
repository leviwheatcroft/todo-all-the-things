import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import { nothing as _nothing } from 'lit-html'
import template from './NavBarSmall.html'
import { base, button } from '../../less'
import styles from './NavBarSmall.less'
import { publish } from '../../store'

export class NavBarSmall extends LitElement {
  constructor () {
    super()
    this.state = 'collapsed'
  }

  static get styles () { return [base, button, unsafeCSS(styles)] }

  static get properties () {
    return {
      state: {
        attribute: false
      }
    }
  }

  toMenu () { this.state = 'menu' }

  toCollapsed () { this.state = 'collapsed' }

  toFilter () { this.state = 'filter' }

  showTools () {}

  showOptions () {}

  showHelp () {}

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      toMenu,
      toCollapsed,
      toFilter,
      showTools,
      showOptions,
      showHelp,
      state
    } = this
    const html = _html
    const nothing = _nothing

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-nav-bar-small', NavBarSmall)
