import { numberToStringCurrency } from '../../../i18n/api'
import { BenefitHandler } from '../benefitHandler'
import { legalValues } from '../scrapers/output'

type TextReplacementRules = {
  [x: string]: (handler: BenefitHandler) => string
}

export const textReplacementRules: TextReplacementRules = {
  ENTITLEMENT_AMOUNT: (handler) =>
    `<strong className="font-bold">${numberToStringCurrency(
      handler.summary.entitlementSum,
      handler.translations._locale
    )}</strong>`,
  OAS_75_AMOUNT: (handler) =>
    numberToStringCurrency(
      handler.benefitResults.oas?.entitlement.resultAt75 ?? 0,
      handler.translations._locale
    ),
  OAS_DEFERRAL_INCREASE: (handler) =>
    numberToStringCurrency(
      handler.benefitResults.oas?.entitlement.deferral.increase ?? 0,
      handler.translations._locale
    ),
  OAS_DEFERRAL_YEARS: (handler) =>
    String(handler.benefitResults.oas?.entitlement.deferral.years ?? 0),
  OAS_CLAWBACK: (handler) =>
    numberToStringCurrency(
      handler.benefitResults.oas?.entitlement.clawback ?? 0,
      handler.translations._locale
    ),
  OAS_RECOVERY_TAX_CUTOFF: (handler) =>
    numberToStringCurrency(
      legalValues.OAS_RECOVERY_TAX_CUTOFF,
      handler.translations._locale,
      { rounding: 0 }
    ),
  OAS_MAX_INCOME: (handler) =>
    `<strong className="font-bold">${numberToStringCurrency(
      legalValues.MAX_OAS_INCOME,
      handler.translations._locale,
      { rounding: 0 }
    )}</strong>`,
  LINK_SERVICE_CANADA: (handler) =>
    `<a href="${handler.translations.links.SC.url}" target="_blank">${handler.translations.links.SC.text}</a>`,
  LINK_SOCIAL_AGREEMENT: (handler) =>
    `<a href="${handler.translations.links.socialAgreement.url}" target="_blank">${handler.translations.links.socialAgreement.text}</a>`,
  LINK_MORE_REASONS_OAS: (handler) =>
    `<a href="${handler.translations.links.oasReasons.url}" target="_blank">${handler.translations.links.oasReasons.text}</a>`,
  LINK_MORE_REASONS_GIS: (handler) =>
    `<a href="${handler.translations.links.gisReasons.url}" target="_blank">${handler.translations.links.gisReasons.text}</a>`,
  LINK_MORE_REASONS_ALW: (handler) =>
    `<a href="${handler.translations.links.alwReasons.url}" target="_blank">${handler.translations.links.alwReasons.text}</a>`,
  LINK_MORE_REASONS_AFS: (handler) =>
    `<a href="${handler.translations.links.afsReasons.url}" target="_blank">${handler.translations.links.afsReasons.text}</a>`,
  LINK_OAS_DEFER: (handler) =>
    `<a href="${handler.translations.links.oasDeferClickHere.url}" target="_blank">${handler.translations.links.oasDeferClickHere.text}</a>`,
  LINK_RECOVERY_TAX: (handler) =>
    `<a href="${handler.translations.links.oasRecoveryTaxInline.url}" target="_blank">${handler.translations.links.oasRecoveryTaxInline.text}</a>`,
}
