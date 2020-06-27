import {
  LitElement,
  unsafeCSS,
  html as _html
} from 'lit-element'

import styles from './Icon.less'
import svg from './svg'

export class Icon extends LitElement {
  static get styles () { return unsafeCSS(styles) }

  static get properties () {
    return {
      icon: { attribute: true },
      spin: {
        attribute: true,
        type: Boolean
      }
    }
  }

  /* eslint-disable no-eval, prefer-template, no-unused-vars */
  render () {
    const icon = svg[this.icon]
      .replace(/<svg/, `<svg class="feather${this.spin ? ' spin' : ''}"`)
      .replace(/height="24"/, '')
      .replace(/width="24"/, '')
      .replace(/<\/svg>/, '')
    // console.log(innerSvg)
    const html = _html
    return eval('html`' + icon + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-icon', Icon)
