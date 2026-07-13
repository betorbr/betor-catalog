import renderNotFound from './render/pages/notFound.js'

export default class NotFound {
  data () {
    return {
      permalink: '200.html'
    }
  }

  render () {
    return renderNotFound()
  }
}
