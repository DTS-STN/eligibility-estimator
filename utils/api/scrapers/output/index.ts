import { OutputItemGis } from '../_baseTable'
import { OutputItemLegalValues } from '../legalValuesScraper'
import { OutputItemAlw } from '../tbl4PartneredAlwScraper'
import { OutputItemAfs } from '../tbl5PartneredAfsScraper'
import _legalValues from './legalValues.json'
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
export const legalValues: OutputItemLegalValues = _legalValues
