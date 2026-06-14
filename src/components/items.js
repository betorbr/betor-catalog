import renderItem from './item.js'

export default (items) => {
  const contentHTML = items.map(renderItem).join('')
  return `<div class="items">${contentHTML}</div>`
}
