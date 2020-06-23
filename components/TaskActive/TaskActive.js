import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import template from './TaskActive.html'
import styles from './TaskActive.less'
import {
  publish
} from '../../store'
import { base, button } from '../../less'

export class TaskActive extends LitElement {
  constructor () {
    super()
    this.raw = ''
  }

  static get styles () { return [base, button, unsafeCSS(styles)] }

  static get properties () {
    return {
      task: {
        attribute: true
      }
    }
  }

  connectedCallback () {
    super.connectedCallback()
    this.updateComplete.then(() => {
      this.shadowRoot.querySelector('input').focus()
    })
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      task,
      save
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  save () {
    const { task } = this
    const raw = this.shadowRoot.querySelector('input').value
    const payload = { task: { ...task, raw } }
    publish({ type: 'updateTask', payload })
    publish({ type: 'toggleTaskActive', payload })
  }
}

customElements.define('tdw-task-active', TaskActive)
