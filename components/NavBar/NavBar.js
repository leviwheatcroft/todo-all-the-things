import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import { nothing as _nothing } from 'lit-html'
import template from './NavBar.html'
import { base, button } from '../../less'
import styles from './NavBar.less'
import { publish, subscribe, getState } from '../../store'

export class NavBar extends LitElement {
  constructor () {
    super()
    subscribe(this.setSelectedListId.bind(this))
    this.setSelectedListId()
  }

  static get styles () { return [base, button, unsafeCSS(styles)] }

  static get properties () {
    return {
      selectedListId: { attribute: false }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      showOverflow,
      selectedListId,
      showLists
    } = this
    const html = _html
    const nothing = _nothing

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  showOverflow () {
    publish('dialogsToggle', { dialog: 'overflow' })
  }

  showLists () {
    publish('dialogsToggle', { dialog: 'lists' })
  }

  setSelectedListId () {
    this.selectedListId = getState().selectedListId
  }
}

customElements.define('tdw-nav-bar', NavBar)
