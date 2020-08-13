import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
import { nothing as _nothing } from 'lit-html'
// import { render } from './TaskInactive.template'
import template from './TaskInactive.html'
import styles from './TaskInactive.less'
import { base } from '../../less'

import {
  getState,
  publish,
  subscribe
} from '../../store'

export class TaskInactive extends LitElement {
  constructor () {
    super()
    subscribe(
      'optionsToggleShowCreatedDate',
      this.setShowCreatedDate.bind(this)
    )
    this.setShowCreatedDate()
  }

  static get styles () { return [base, unsafeCSS(styles)] }

  static get properties () {
    return {
      task: { attribute: true },
      showCreatedDate: { attribute: false }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      task,
      activate,
      toggleComplete,
      filterApply,
      showCreatedDate
    } = this
    const html = _html
    const nothing = _nothing

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  activate () {
    const { task } = this
    publish('tasksToggleActive', { task })
  }

  filterApply (event) {
    const {
      priority,
      project,
      context,
      createdDate,
      conflicted,
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
    else if (conflicted)
      text = '!conflicted'
    else if (key && value)
      text = `${key}:${value}`

    publish({
      type: 'filterSet',
      payload: { filter: { text } }
    })
  }

  toggleComplete () {
    const { task } = this
    publish('tasksToggleComplete', { task })
  }

  setShowCreatedDate () {
    this.showCreatedDate = getState().settings.showCreatedDate
  }
}

customElements.define('tdw-task-inactive', TaskInactive)
