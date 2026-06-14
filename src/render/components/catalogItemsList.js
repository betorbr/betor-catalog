import renderCatalogItem from './catalogItem.js'

export default (catalogItems) => (`
  <div class="catalog-items">
    ${catalogItems.map(item => renderCatalogItem(item)).join('')}
  </div>
`)
