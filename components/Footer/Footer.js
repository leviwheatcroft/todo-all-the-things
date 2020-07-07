import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import template from './Footer.html'
import { base } from '../../less'
import styles from './Footer.less'
import { version as _version } from '../../package.json'

export class Footer extends LitElement {
  static get styles () { return [base, unsafeCSS(styles)] }

  static get properties () { return {} }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const html = _html
    const version = _version

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-footer', Footer)
