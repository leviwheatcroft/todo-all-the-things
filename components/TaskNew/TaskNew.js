import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'

// import { render } from './TaskNew.template'
import template from './TaskNew.html'
import styles from './TaskNew.less'
import {
  publish
} from '../../store'

export class TaskNew extends LitElement {
  static get styles () { return unsafeCSS(styles) }

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
    const task = {
      raw: $input.value,
      listId: this.listId
    }
    publish('tasksCreateNew', this, { tasks: [task] })
    $input.value = ''
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */
}

customElements.define('tdw-task-new', TaskNew)
