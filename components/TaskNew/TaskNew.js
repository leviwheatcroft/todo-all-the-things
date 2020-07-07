import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'

// import { render } from './TaskNew.template'
import template from './TaskNew.html'
import styles from './TaskNew.less'
import { base } from '../../less'
import {
  publish
} from '../../store'

export class TaskNew extends LitElement {
  static get styles () { return [base, unsafeCSS(styles)] }

  static get properties () {
    return {
      listId: { attribute: false }
    }
  }

  keyUp (event) {
    if (event.keyCode === 13)
      this.save()
  }

  save () {
    const $input = this.shadowRoot.querySelector('input')
    const raw = $input.value
    const tasks = [{ raw }]
    const { listId } = this
    publish('tasksCreateNew', { tasks, listId })
    $input.value = ''
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      keyUp,
      save
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-task-new', TaskNew)
