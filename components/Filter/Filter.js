import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import template from './Filter.html'
import { base, button } from '../../less'
import styles from './Filter.less'
import { subscribe, publish, states } from '../../store'

export class Filter extends LitElement {
  constructor () {
    super()
    this.filterText = states[0].filter.text
    subscribe('filterSet', ({ state }) => {
      this.filterText = state.filter.text
    })
  }

  firstUpdated () {
    this.$input = this.shadowRoot.querySelector('input')
  }

  static get styles () { return [base, button, unsafeCSS(styles)] }

  static get properties () {
    return {
      filterText: { attribute: false }
    }
  }

  keyUp (event) {
    // keyCode 8 is backspace
    if (this.$input.value.length < 3 && event.keyCode !== 8)
      return
    publish('filterSet', { filter: { text: this.$input.value } })
  }

  filterApply () {
    publish('filterSet', { filter: { text: this.$input.value } })
  }

  clear () {
    publish('filterSet', { filter: { text: '' } })
  }

  tools () {
    publish('toggleDialog', { dialog: 'tools' })
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      filterText,
      // filterApply,
      keyUp,
      clear
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-filter', Filter)
