/* global moment */

const updatedAt = () => {
  const elements = document.querySelectorAll('[data-updated-at]')
  elements.forEach(el => {
    const date = el.getAttribute('data-updated-at')
    if (date) {
      el.textContent = `Atualizado ${moment.utc(date).locale('pt-br').fromNow()}`
    }
  })
}

const insertedAt = () => {
  const elements = document.querySelectorAll('[data-inserted-at]')
  elements.forEach(el => {
    const date = el.getAttribute('data-inserted-at')
    if (date) {
      el.textContent = `Adicionado ${moment.utc(date).locale('pt-br').fromNow()}`
    }
  })
}

(() => {
  updatedAt()
  insertedAt()
})()
