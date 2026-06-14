import renderBase from './components/pages/base.js'

export default class Ok {
  data () {
    return {
      permalink: '200.html'
    }
  }

  render () {
    return renderBase('<p class="text-center">Nada por aqui...</p>')
  }
}
