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
  publish,
  subscribe,
  getSetting
} from '../../store'

export class TaskNew extends LitElement {
  constructor () {
    super()
    subscribe(/optionsToggle/, this.options.bind(this))
    this.options()
  }

  static get styles () { return [base, unsafeCSS(styles)] }

  static get properties () {
    return {
      listId: { attribute: false },
      prependCreatedDate: { attribute: false }
    }
  }

  options () {
    this.prependCreatedDate = getSetting('prependCreatedDate')
  }

  keyUp (event) {
    if (event.keyCode === 13)
      this.save()
  }

  save () {
    const $input = this.shadowRoot.querySelector('input')
    let raw = $input.value
    if (this.prependCreatedDate)
      raw = [(new Date()).toISOString().slice(0, 10), raw].join(' ')
    const raws = [raw]
    const { listId } = this
    publish('tasksCreateNew', { raws, listId })
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
