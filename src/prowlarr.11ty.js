import renderProwlarr from './render/pages/prowlarr.js'

export default class Prowlarr {
  data () {
    return {
      permalink: 'guia/prowlarr/index.html'
    }
  }

  render () {
    return renderProwlarr()
  }
}
