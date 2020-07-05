import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import template from './ListSwitcher.html'
import styles from './ListSwitcher.less'
import {
  publish,
  states
} from '../../store'
import { base, button } from '../../less'

export class ListSwitcher extends LitElement {
  constructor () {
    super()
    const lists = Object.keys(states[0].lists)
    const idx = indexOf()
  }

  static get styles () { return [base, unsafeCSS(styles)] }

  static get properties () {
    return {
      selected: {
        attribute: true
      },
      prev: {
        attribute: false
      },
      next: {
        attribute: false
      }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      selected,
      prev,
      next,
      toPrev,
      toNext
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  toPrev () {
    if (this.prev)
      publish('listsSelect', { list: this.prev })
  }

  toNext () {
    if (this.next)
      return publish('listsSelect', { list: this.next })
    publish('dialogsToggle', { dialog: 'addList' })
  }
}

customElements.define('tdw-list-switcher', ListSwitcher)
