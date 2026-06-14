import renderItem from './item.js'

export default (items) => (`
  <div class="items-list">
    ${items.map(item => renderItem(item)).join('')}
  </div>
`)
