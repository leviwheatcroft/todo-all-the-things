import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './Tools.template'
import template from './Tools.html'
import styles from './Tools.less'
import { base, button } from '../../less'

import {
  publish,
  states
} from '../../store'

export class Tools extends LitElement {
  static get styles () { return [base, button, unsafeCSS(styles)] }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      purge,
      importTasks,
      exportTasks
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      show: { attribute: false }
    }
  }

  purge () {
    publish('tasksPurge')
    publish('dialogsToggle')
  }

  importTasks () {
    publish('dialogsToggle', { dialog: 'import' })
  }

  exportTasks () {
    const text = Object.values(states[0].lists.todo.tasks)
      .sort((a, b) => a.lineNumber - b.lineNumber)
      .map((t) => t.raw)
      .join('\n')

    const $a = document.createElement('a')
    $a.href = URL.createObjectURL(new Blob([text], { type: 'text' }))
    $a.download = 'todo.txt'
    $a.style.display = 'none'
    this.shadowRoot.append($a)
    $a.click()
    publish('toggleDialog')
  }
}

customElements.define('tdw-tools', Tools)
