import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogLists.template'
import template from './DialogLists.html'
import styles from './DialogLists.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base, button } from '../../less'

import {
  publish,
  subscribe,
  getState
} from '../../store'

export class DialogLists extends LitElement {
  constructor () {
    super()
    this.listIds = Object.keys(getState().lists)
    subscribe(({ state: { lists } }) => {
      this.listIds = Object.keys(lists)
    })
  }

  static get styles () {
    return [
      base,
      button,
      unsafeCSS(lightBox),
      unsafeCSS(styles)
    ]
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      listsAdd,
      listsSelect,
      listIds
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      listIds: { attribute: false }
    }
  }

  listsAdd () {
    const $listsAdd = this.shadowRoot.querySelector('.lists-add')
    const listId = $listsAdd.value
    $listsAdd.value = ''
    if (!listId)
      return
    publish('listsAdd', { listId })
    publish('listsSelect', { listId })
    publish('dialogsToggle')
  }

  listsSelect (event) {
    const { dataset: { listId } } = event.currentTarget
    publish('listsSelect', { listId })
    publish('dialogsToggle')
  }
}

customElements.define('tdw-dialog-lists', DialogLists)
