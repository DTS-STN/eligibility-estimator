import { OutputItemGis } from '../_baseTable'
import { OutputItemAlw } from '../tbl4PartneredAlwScraper'
import { OutputItemAfs } from '../tbl5PartneredAfsScraper'
import legalValues from './legalValuesJson.json'
import legalValuesForTest from './legalValuesJson_test.json'
import tbl1_single from './tbl1_single.json'
import tbl2_partneredAndOas from './tbl2_partneredAndOas.json'
import tbl3_partneredNoOas from './tbl3_partneredNoOas.json'
import tbl4_partneredAlw from './tbl4_partneredAlw.json'
import tbl5_partneredAfs from './tbl5_partneredAfs.json'

interface ScraperCollection {
  tbl1_single: OutputItemGis[]
  tbl2_partneredAndOas: OutputItemGis[]
  tbl3_partneredNoOas: OutputItemGis[]
  tbl4_partneredAlw: OutputItemAlw[]
  tbl5_partneredAfs: OutputItemAfs[]
}

export const scraperData: ScraperCollection = {
  tbl1_single,
  tbl2_partneredAndOas,
  tbl3_partneredNoOas,
  tbl4_partneredAlw,
  tbl5_partneredAfs,
}

const exportLegalValues =
  process.env.NODE_ENV === 'test' ? legalValuesForTest : legalValues

export default exportLegalValues
