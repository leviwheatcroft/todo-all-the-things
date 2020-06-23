import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './TaskInactive.template'
import template from './TaskInactive.html'
import styles from './TaskInactive.less'
import { base, tag } from '../../less'

import {
  publish
} from '../../store'

export class TaskInactive extends LitElement {
  static get styles () { return [base, tag, unsafeCSS(styles)] }

  static get properties () {
    return {
      task: {
        attribute: true
      }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      task,
      activate,
      toggleComplete,
      filterApply
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  activate () {
    const { task } = this
    publish({
      type: 'toggleTaskActive',
      payload: { task }
    })
  }

  filterApply (event) {
    const {
      priority,
      project,
      context,
      createdDate,
      key,
      value
    } = event.currentTarget.dataset

    let text
    if (priority)
      text = `(${priority})`
    else if (project)
      text = `+${project}`
    else if (context)
      text = `@${context}`
    else if (createdDate)
      text = createdDate
    else if (key && value)
      text = `${key}:${value}`

    publish({
      type: 'filterSet',
      payload: { filter: { text } }
    })
  }

  toggleComplete () {
    const { task } = this
    publish({
      type: 'toggleComplete',
      payload: { task }
    })
  }
}

customElements.define('tdw-task-inactive', TaskInactive)
