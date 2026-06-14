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

(() => {
  updatedAt()
})()
