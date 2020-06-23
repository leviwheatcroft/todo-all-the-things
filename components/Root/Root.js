import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import { states, subscribe } from '../../store'
import { grid } from '../../less'
import template from './Root.html'
import styles from './Root.less'

export class Root extends LitElement {
  constructor () {
    super()
    this.lists = {}
    subscribe('localStorageLoaded', () => {
      this.lists = states[0].lists
    })
  }

  static get styles () { return [grid, unsafeCSS(styles)] }

  static get properties () {
    return {
      lists: {
        attribute: false
      }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-root', Root)
