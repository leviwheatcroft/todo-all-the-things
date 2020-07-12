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
import { base } from '../../less'

export class TaskActive extends LitElement {
  constructor () {
    super()
    this.raw = ''
  }

  static get styles () { return [base, unsafeCSS(styles)] }

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
      keyUp,
      save
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  keyUp (event) {
    if (event.keyCode === 13)
      this.save()
  }

  save () {
    const { task } = this
    const raw = this.shadowRoot.querySelector('input').value
    const payload = { task: { ...task, raw } }
    publish('tasksEdit', payload)
    publish('tasksToggleActive', payload)
  }
}

customElements.define('tdw-task-active', TaskActive)
