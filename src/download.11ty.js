import renderDownload from './render/pages/download.js'

export default class Download {
  data () {
    return {
      permalink: 'guia/baixar/index.html'
    }
  }

  render () {
    return renderDownload()
  }
}
