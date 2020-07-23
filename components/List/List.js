import {
  LitElement,
  unsafeCSS,
  html as _html
} from 'lit-element'
import { nothing as _nothing } from 'lit-html'
import { repeat as _repeat } from 'lit-html/directives/repeat'
import template from './List.html'
import { button } from '../../less'

import styles from './List.less'

export class List extends LitElement {
  static get styles () { return [button, unsafeCSS(styles)] }

  static get properties () {
    return {
      list: { attribute: true }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      id: listId,
      tasks
    } = this.list
    const html = _html
    const repeat = _repeat
    const nothing = _nothing
    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-list', List)
