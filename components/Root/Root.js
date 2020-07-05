import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import { subscribe, getState } from '../../store'
import template from './Root.html'
import styles from './Root.less'

export class Root extends LitElement {
  constructor () {
    super()
    const { lists, selectedListId } = getState()
    this.lists = lists
    this.selectedListId = lists[selectedListId]
    subscribe(({ state: { lists, selectedListId } }) => {
      if (this.lists !== lists)
        this.lists = lists
      if (this.selectedListId !== selectedListId)
        this.selectedListId = selectedListId
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
      },
      selectedListId: {
        attribute: false
      }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const html = _html
    const {
      lists,
      selectedListId
    } = this

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-root', Root)
