import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import template from './DialogImportTasks.html'
import styles from './DialogImportTasks.less'
import { base, button } from '../../less'

import {
  publish
} from '../../store'

export class DialogImportTasks extends LitElement {
  static get styles () { return [base, button, unsafeCSS(styles)] }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      showFilePicker,
      importTasks
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  showFilePicker () {
    this.shadowRoot.querySelector('input').click()
  }

  async importTasks () {
    const fileContent = await this.shadowRoot.querySelector('input')
      .files[0].text()
    publish('dialogsToggle')

    const listId = 'todo'
    publish('tasksImport', { fileContent, listId })
  }
}

customElements.define('tdw-dialog-import-tasks', DialogImportTasks)
