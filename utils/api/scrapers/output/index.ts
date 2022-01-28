import { OutputItemGis } from '../_base'
import { OutputItemAfs } from '../partneredAfsScraper'
import { OutputItemAlw } from '../partneredAlwScraper'
import partneredAfs from './partneredAfs.json'
import partneredAlw from './partneredAlw.json'
import partneredAndOas from './partneredAndOas.json'
import partneredNoOas from './partneredNoOas.json'
import single from './single.json'

interface ScraperCollection {
  single: OutputItemGis[]
  partneredAndOas: OutputItemGis[]
  partneredNoOas: OutputItemGis[]
  partneredAlw: OutputItemAlw[]
  partneredAfs: OutputItemAfs[]
}

const scraperData: ScraperCollection = {
  single,
  partneredAndOas,
  partneredNoOas,
  partneredAlw,
  partneredAfs,
}

export default scraperData
