import renderBase from './base.js'
import renderItems from '../items.js'

export default (pagination, t = 'Catálogo BeTor') => {
  const title = pagination.pageNumber > 0
    ? `${t} - Página ${pagination.pageNumber + 1}`
    : t
  const itemsHTML = renderItems(pagination.items)
  const previousTag = pagination.href.previous
    ? `<a href="${pagination.href.previous}" class="previous">← Anterior</a>`
    : '<div class="previous"></div>'
  const nextTag = pagination.href.next
    ? `<a href="${pagination.href.next}" class="next">Próxima →</a>`
    : '<div class="next"></div>'
  return renderBase(`
    <p class="pagination-status">Página <strong>${pagination.pageNumber + 1}</strong> de ${pagination.pages.length}</p>
    ${itemsHTML}
    <nav>
      ${previousTag}
      ${nextTag}
    </nav>
  `, { title })
}
