import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './Import.template'
import template from './Import.html'
import styles from './Import.less'
import { base, button } from '../../less'

import {
  publish
} from '../../store'

export class Import extends LitElement {
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
    console.log('import tasks handler')
    const content = await this.shadowRoot.querySelector('input').files[0].text()
    publish('toggleDialog')
    // easier to convert all line endings before splitting
    const lines = content.replace(/\r\n?/g, '\n').split(/\n/).filter((l) => l)
    const listId = 'todo'
    publish({
      type: 'importTasks',
      payload: { lines, listId }
    })
  }
}

customElements.define('tdw-import', Import)
