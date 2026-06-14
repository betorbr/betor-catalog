import catalogItemsList from './catalogItemsList.js'

export default (items, previousPage = null, nextPage = null) => (`
  <div class="items-paginated">
    ${catalogItemsList(items)}
    <div class="pagination">
      ${previousPage ? `<a class="previous" href="${previousPage}">&laquo; Anterior</a>` : ''}
      ${nextPage ? `<a class="next" href="${nextPage}">Próximo &raquo;</a>` : ''}
    </div>
  </div>
`)
