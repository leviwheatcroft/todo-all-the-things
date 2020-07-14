import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogTools.template'
import template from './DialogTools.html'
import styles from './DialogTools.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base, button } from '../../less'

import {
  publish,
  states
} from '../../store'

export class DialogTools extends LitElement {
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
      purge,
      dialogImportTasks,
      destroyLocalStorage,
      exportTasks,
      dialogHelp
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

  destroyLocalStorage () {
    publish('dialogsToggle')
    publish('destroyLocalStorage')
  }

  dialogImportTasks () {
    publish('dialogsToggle', { dialog: 'importTasks' })
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

customElements.define('tdw-dialog-tools', DialogTools)
