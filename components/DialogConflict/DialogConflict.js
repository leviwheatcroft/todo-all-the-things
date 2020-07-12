import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogConflict.template'
import template from './DialogConflict.html'
import styles from './DialogConflict.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base, button } from '../../less'

import {
  publish,
  subscribe,
  getState
} from '../../store'

export class DialogConflict extends LitElement {
  constructor () {
    super()
    this.lists = getState().lists
    subscribe(/^tasksConflict$/, this.tasksConflict.bind(this))
  }

  static get styles () {
    return [
      base,
      button,
      unsafeCSS(lightBox),
      unsafeCSS(styles)
    ]
  }

  static get properties () {
    return {
      lists: { attribute: false }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      lists,
      resolveConflict
    } = this
    const html = _html
    const tasks = []
    const {
      locals,
      remotes
    } = Object.values(lists)
      .reduce((_tasks, { tasks }) => {
        return _tasks.concat(Object.values(tasks))
      }, [])
      .filter((task) => task.conflicted)
      .reduce((_tasks, task) => {
        _tasks[`${task.conflicted}s`].push(task)
        return _tasks
      }, { locals: [], remotes: [] })

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  tasksConflict () {
    this.lists = getState().lists
    publish('dialogsToggle', { dialog: 'conflict' })
  }

  resolveConflict () {
    const resolution = this.shadowRoot.querySelector('input:checked').value
    publish('dialogsToggle')
    if (resolution !== 'manual')
      publish('tasksConflictResolve', { resolution })
  }
}

customElements.define('tdw-dialog-conflict', DialogConflict)
