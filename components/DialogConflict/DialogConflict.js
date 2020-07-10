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
    subscribe(/tasksConflict/, this.tasksConflict.bind(this))
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
    const html = _html
    const tasks = []
    const {
      locals,
      localOriginals,
      remotes
    } = Object.values(this.lists)
      .reduce((_tasks, { tasks }) => {
        return _tasks.concat(Object.values(tasks))
      }, [])
      .filter((task) => task.conflicted)
      .reduce((_tasks, task) => {
        _tasks[`${task.conflicted.type}s`].push(task)
        return _tasks
      }, { locals: [], localOriginals: [], remotes: [] })

    console.log(locals, localOriginals, remotes)
    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  tasksConflict () {
    this.lists = getState().lists
    publish('dialogsToggle', { dialog: 'conflict' })
  }
}

customElements.define('tdw-dialog-conflict', DialogConflict)
