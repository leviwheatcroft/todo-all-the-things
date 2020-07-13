import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogConflict.template'
import template from './DialogConflict.html'
import styles from './DialogConflict.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base, button, flex } from '../../less'

import {
  publish,
  subscribe
} from '../../store'

export class DialogConflict extends LitElement {
  constructor () {
    super()
    this.conflictedLocals = []
    this.conflictedRemotes = []
    subscribe(/^tasksConflict$/, this.tasksConflict.bind(this))
  }

  static get properties () {
    return {
      conflictedLocals: { attribute: false },
      conflictedRemotes: { attribute: false }
    }
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
      // lists,
      resolveConflict,
      conflictedLocals,
      conflictedRemotes
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  tasksConflict ({ action }) {
    this.conflictedLocals = action.payload.conflictedLocals
    this.conflictedRemotes = action.payload.conflictedRemotes
    publish('dialogsToggle', { dialog: 'conflict' })
  }

  resolveConflict () {
    const resolution = this.shadowRoot.querySelector('input:checked').value
    const {
      conflictedLocals,
      conflictedRemotes
    } = this
    publish('dialogsToggle')
    if (resolution === 'manual')
      return
    publish('tasksConflictResolve', {
      resolution,
      conflictedLocals,
      conflictedRemotes
    })
  }
}

customElements.define('tdw-dialog-conflict', DialogConflict)
