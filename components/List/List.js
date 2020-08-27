import {
  LitElement,
  unsafeCSS,
  html as _html
} from 'lit-element'
import { nothing as _nothing } from 'lit-html'
import { repeat as _repeat } from 'lit-html/directives/repeat'
import template from './List.html'
import { button } from '../../less'
import { subscribe, getState } from '../../store'

import styles from './List.less'

export class List extends LitElement {
  constructor () {
    super()
    subscribe(() => {
      this.setList()
      this.setShowCreatedDate()
    })
    this.setList()
    this.setShowCreatedDate()
  }

  static get styles () { return [button, unsafeCSS(styles)] }

  static get properties () {
    return {
      list: { attribute: false },
      showCreatedDate: { attribute: false }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      list: {
        id: listId,
        tasks
      },
      showCreatedDate
    } = this
    const html = _html
    const repeat = _repeat
    const nothing = _nothing
    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  setList () {
    const { lists, selectedListId } = getState()
    this.list = lists[selectedListId]
  }

  setShowCreatedDate () {
    const { settings: { showCreatedDate } } = getState()
    this.showCreatedDate = showCreatedDate
  }
}

customElements.define('tdw-list', List)
