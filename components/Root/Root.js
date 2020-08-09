import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import template from './Root.html'
import styles from './Root.less'

export class Root extends LitElement {
  static get styles () { return [unsafeCSS(styles)] }

  static get properties () {
    return {
      list: {
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
