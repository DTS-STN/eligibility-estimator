import { Link } from '../../../utils/api/definitions/types'

export enum LinkKey {
  contactSC = 'contactSC',
  faq = 'faq',
  oasOverview = 'oasOverview',
  gisOverview = 'gisOverview',
  alwOverview = 'alwOverview',
  afsOverview = 'afsOverview',
  oasMaxIncome = 'oasMaxIncome',
  cpp = 'cpp',
  cric = 'cric',
  outsideCanada = 'outsideCanada',
  outsideCanadaOas = 'outsideCanadaOas',
  oasPartial = 'oasPartial',
  paymentOverview = 'paymentOverview',
  gisEntitlement = 'gisEntitlement',
  alwEntitlement = 'alwEntitlement',
  afsEntitlement = 'afsEntitlement',
  oasRecoveryTax = 'oasRecoveryTax',
  oasDefer = 'oasDefer',
  oasRetroactive = 'oasRetroactive',
  oasApply = 'oasApply',
  gisApply = 'gisApply',
  alwApply = 'alwApply',
  afsApply = 'afsApply',
  SC = 'SC',
  oasDeferClickHere = 'oasDeferClickHere',
  socialAgreement = 'socialAgreement',
  oasReasons = 'oasReasons',
  gisReasons = 'gisReasons',
  alwReasons = 'alwReasons',
  afsReasons = 'afsReasons',
  oasRecoveryTaxInline = 'oasRecoveryTaxInline',
}

export type LinkDefinitions = {
  [x in LinkKey]: Link
}
