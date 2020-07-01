import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import { subscribe } from '../../store'
import template from './Root.html'
import styles from './Root.less'

export class Root extends LitElement {
  constructor () {
    super()
    this.lists = {}
    subscribe(({ state: { lists } }) => {
      if (this.lists === lists)
        return
      this.lists = lists
    })
  }

  static get styles () { return [unsafeCSS(styles)] }

  static get properties () {
    return {
      lists: {
        attribute: false
        // hasChanged (current, previous) {
        //   if (!previous)
        //     return true
        //   previous = Object.keys(previous)
        //   current = Object.keys(current)
        //   if (current.length !== previous.length)
        //     return true
        //   return current.some((v, idx) => v !== previous[idx])
        // }
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
