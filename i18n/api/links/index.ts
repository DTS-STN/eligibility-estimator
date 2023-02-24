import { BenefitKey } from '../../../utils/api/definitions/enums'
import { Link } from '../../../utils/api/definitions/types'

export interface LinkDefinitions {
  contactSC: Link
  faq: Link
  overview: { [key in BenefitKey]: Link }
  oasMaxIncome: Link
  cpp: Link
  cric: Link
  outsideCanada: Link
  outsideCanadaOas: Link
  oasPartial: Link
  paymentOverview: Link
  gisEntitlement: Link
  alwEntitlement: Link
  afsEntitlement: Link
  oasRecoveryTax: Link
  oasDefer: Link
  oasRetroactive: Link
  apply: { [key in BenefitKey]: Link }
  SC: Link
  oasDeferClickHere: Link
  oasDeferInline: Link
  socialAgreement: Link
  reasons: { [key in BenefitKey]: Link }
  oasRecoveryTaxInline: Link
  oasLearnAboutRecoveryTax: Link
}
