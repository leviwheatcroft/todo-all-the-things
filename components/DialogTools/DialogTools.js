import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import {
  nothing as _nothing
} from 'lit-html'
// import { render } from './DialogTools.template'
import template from './DialogTools.html'
import styles from './DialogTools.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base, button, flex } from '../../less'

import {
  publish,
  states,
  getState
} from '../../store'

export class DialogTools extends LitElement {
  constructor () {
    super()
    this.deleteListShowConfirmation = false
  }

  static get styles () {
    return [
      base,
      button,
      flex,
      unsafeCSS(lightBox),
      unsafeCSS(styles)
    ]
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      deleteList,
      deleteListCancel,
      deleteListConfirm,
      deleteListShowConfirmation,
      destroyLocalStorage,
      destroyLocalStorageCancel,
      destroyLocalStorageConfirm,
      destroyLocalStorageShowConfirmation,
      dialogHelp,
      dialogImportTasks,
      exportTasks,
      purgeCompletedTasks,
      purgeCompletedTasksCancel,
      purgeCompletedTasksConfirm,
      purgeCompletedTasksShowConfirmation
    } = this
    const html = _html
    const nothing = _nothing

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  static get properties () {
    return {
      show: { attribute: false },
      deleteListShowConfirmation: { attribute: false },
      destroyLocalStorageShowConfirmation: { attribute: false },
      purgeCompletedTasksShowConfirmation: { attribute: false }
    }
  }

  purgeCompletedTasks () {
    this.purgeCompletedTasksShowConfirmation = true
  }

  purgeCompletedTasksCancel () {
    this.purgeCompletedTasksShowConfirmation = false
  }

  purgeCompletedTasksConfirm () {
    publish('tasksPurge')
    publish('dialogsToggle')
    this.purgeCompletedTasksShowConfirmation = false
  }

  deleteList () {
    this.deleteListShowConfirmation = true
  }

  deleteListCancel () {
    this.deleteListShowConfirmation = false
  }

  deleteListConfirm () {
    publish('dialogsToggle')
    publish('listsSetDeleted', { listId: getState().selectedListId })
    this.deleteListShowConfirmation = false
  }

  destroyLocalStorage () {
    this.destroyLocalStorageShowConfirmation = true
  }

  destroyLocalStorageCancel () {
    this.destroyLocalStorageShowConfirmation = false
  }

  destroyLocalStorageConfirm () {
    publish('dialogsToggle')
    publish('destroyLocalStorage')
    this.destroyLocalStorageShowConfirmation = false
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
