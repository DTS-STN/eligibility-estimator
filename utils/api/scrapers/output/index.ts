import { OutputItem } from '../_base'
import partneredAllowance from './partneredAllowance.json'
import partneredAndOas from './partneredAndOas.json'
import partneredNoOas from './partneredNoOas.json'
import partneredSurvivor from './partneredSurvivor.json'
import single from './single.json'

interface ScraperCollection {
  single: OutputItem[]
  partneredAndOas: OutputItem[]
  partneredNoOas: OutputItem[]
  partneredAllowance: OutputItem[]
  partneredSurvivor: OutputItem[]
}

const data: ScraperCollection = {
  single,
  partneredAndOas,
  partneredNoOas,
  partneredAllowance,
  partneredSurvivor,
}

export default data
