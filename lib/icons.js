// const feather = require('feather-icons')
//
// module.exports = {
//   square: feather.icons.square.toSvg(),
//   checkSquare: feather.icons['check-square'].toSvg()
// }
import { html } from 'lit-element'

export function icons (icon) {
  return html`
    <svg class="feather">
      <use xlink:href="/feather-sprite.svg#${icon}"/>
    </svg>
  `
}
