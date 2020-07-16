import {
  LitElement,
  html as _html,
  unsafeCSS
} from 'lit-element'
// import { render } from './DialogError.template'
import template from './DialogError.html'
import styles from './DialogError.less'
import lightBox from '../LightBox/LightBoxConsumers.less'
import { base } from '../../less'
import { publish, subscribe, getState } from '../../store'
import { logHistory } from '../../lib/reporter'

// import {
//   publish,
//   states
// } from '../../store'

export class DialogError extends LitElement {
  constructor () {
    super()
    window.addEventListener('error', this.show.bind(this))
    subscribe(/optionsToggle/, this.optionsToggle.bind(this))
    this.optionsToggle()
  }

  static get styles () {
    return [
      base,
      unsafeCSS(lightBox),
      unsafeCSS(styles)
    ]
  }

  static get properties () {
    return {
      includeTasksInErrorReport: { attribute: false }
    }
  }

  /* eslint-disable no-unused-vars, no-eval, prefer-template */
  render () {
    const {
      report,
      reload,
      showTools
    } = this
    const html = _html

    return eval('html`' + template + '`')
  }
  /* eslint-enable */

  optionsToggle () {
    this.includeTasksInErrorReport =
      getState().settings.includeTasksInErrorReport
  }

  show (event) {
    this.error = event.error
    publish('dialogsToggle', { dialog: 'error' })
  }

  prepareReport () {
    const {
      message,
      lineNumber,
      columnNumber,
      fileName,
      stack
    } = this.error
    const report = `
      Error Details
      ------------
      Message: ${message}
      File: ${fileName} [${lineNumber}:${columnNumber}]
      Stack:
      ${stack}

      Log (text)
      ----------
      ${logHistory.toString()}
    `.replace(/^ {6}/gm, '')
    if (this.includeTasksInErrorReport) {
      report.concat(`
        Log (JSON)
        ----------
        ${JSON.stringify(logHistory)}
      `)
    }
    return report
  }

  report (event) {
    event.preventDefault()
    const report = this.prepareReport()
    const $a = document.createElement('a')
    $a.href = URL.createObjectURL(new Blob([report], { type: 'text' }))
    $a.download = 'report.txt'
    $a.style.display = 'none'
    this.shadowRoot.append($a)
    $a.click()
  }

  reload (event) {
    event.preventDefault()
    window.location.reload(false)
  }

  showTools (event) {
    event.preventDefault()
    publish('dialogsToggle', { dialog: 'tools' })
  }
}

customElements.define('tdw-dialog-error', DialogError)
