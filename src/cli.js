#!/usr/bin/env node

import dotenv from 'dotenv'
import { program } from 'commander'
import BetorCatalog from './index.js'

dotenv.config()

program
  .option('-u, --download-items-url <string>', 'Download items endpoint URL', 'https://v1.betor.top/download-items/')
  .option('--exclude-dead-torrents', 'Exclude torrents where torrent_is_dead is true when building catalog data')
  .option('-p, --pages-limit <number>', 'Limit number of pages to fetch for data-fetch-items (optional, no limit by default)')
  .argument('<action>', 'data-fetch-items|data-catalog-items|serve|build')
  .action(async (action, options) => {
    console.log('action:', action)
    console.log('options:', options)
    const betorCatalog = new BetorCatalog(options)
    switch (action) {
      case 'data-fetch-items':
        await betorCatalog.dataFetchItems()
        break
      case 'data-catalog-items':
        await betorCatalog.dataCatalogItems()
        break
      case 'serve':
        await betorCatalog.serve()
        break
      case 'build':
        await betorCatalog.build()
        break
      default:
        console.warn(`Invalid action: ${action}`)
    }
  })

program.parse()
