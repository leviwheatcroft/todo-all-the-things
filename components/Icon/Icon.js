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
      },
      appearance: { attribute: true }
    }
  }

  /* eslint-disable no-eval, prefer-template, no-unused-vars */
  render () {
    console.assert(svg[this.icon], `required icon: ${this.icon}`)
    const classes = [
      'feather',
      this.spin ? 'spin' : false,
      this.appearance || 'dark'
    ].filter((i) => i).join(' ')
    const icon = svg[this.icon]
      .replace(/<svg/, `<svg class="${classes}"`)
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
