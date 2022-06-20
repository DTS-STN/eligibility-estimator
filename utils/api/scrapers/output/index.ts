import { OutputItemGis } from '../_baseTable'
import { OutputItemAlw } from '../tbl4PartneredAlwScraper'
import { OutputItemAfs } from '../tbl5PartneredAfsScraper'
import _legalValues from './legalValuesJson.json'
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

export const legalValues = {
  MAX_OAS_ENTITLEMENT: _legalValues.oas.amount,
  OAS_RECOVERY_TAX_CUTOFF: _legalValues.oas.clawbackIncomeLimit,
  MAX_OAS_INCOME: _legalValues.oas.incomeLimit,
  MAX_GIS_INCOME_SINGLE: _legalValues.gis.singleIncomeLimit,
  MAX_GIS_AMOUNT_SINGLE: _legalValues.gis.singleAmount,
  MAX_GIS_INCOME_SINGLE_ALW: _legalValues.gis.spouseAlwIncomeLimit,
  MAX_GIS_AMOUNT_SINGLE_ALW: _legalValues.gis.spouseAlwAmount,
  MAX_GIS_INCOME_SINGLE_AFS: _legalValues.alw.afsIncomeLimit,
  MAX_GIS_AMOUNT_SINGLE_AFS: _legalValues.alw.afsAmount,
  MAX_GIS_INCOME_PARTNER_OAS: _legalValues.gis.spouseOasIncomeLimit,
  MAX_GIS_AMOUNT_PARTNER_OAS: _legalValues.gis.spouseOasAmount,
  MAX_GIS_INCOME_PARTNER_ALW: _legalValues.gis.spouseAlwIncomeLimit,
  MAX_GIS_AMOUNT_PARTNER_ALW: _legalValues.gis.spouseAlwAmount,
  MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW: _legalValues.gis.spouseNoOasIncomeLimit,
  MAX_GIS_AMOUNT_PARTNER_NO_OAS_NO_ALW: _legalValues.gis.spouseNoOasAmount,
  MAX_ALW_INCOME: _legalValues.alw.alwIncomeLimit,
  MAX_AFS_INCOME: _legalValues.alw.afsIncomeLimit,
  MAX_GIS_TOPUP_SINGLE: _legalValues.topUp.single,
  MAX_GIS_TOPUP_PARTNER: _legalValues.topUp.married,
}
