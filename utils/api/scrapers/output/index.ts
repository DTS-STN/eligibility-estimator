import { OutputItemGis } from '../_base'
import { OutputItemAllowance } from '../partneredAllowanceScraper'
import { OutputItemAfs } from '../partneredSurvivorScraper'
import partneredAllowance from './partneredAllowance.json'
import partneredAndOas from './partneredAndOas.json'
import partneredNoOas from './partneredNoOas.json'
import partneredSurvivor from './partneredSurvivor.json'
import single from './single.json'

interface ScraperCollection {
  single: OutputItemGis[]
  partneredAndOas: OutputItemGis[]
  partneredNoOas: OutputItemGis[]
  partneredAllowance: OutputItemAllowance[]
  partneredSurvivor: OutputItemAfs[]
}

const scraperData: ScraperCollection = {
  single,
  partneredAndOas,
  partneredNoOas,
  partneredAllowance,
  partneredSurvivor,
}

export default scraperData
