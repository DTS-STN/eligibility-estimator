import { numberToStringCurrency } from '../../../i18n/api'
import { LinkKey } from '../../../i18n/api/links'
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
  LINK_SERVICE_CANADA: (handler) => generateLink(handler, LinkKey.SC),
  LINK_SOCIAL_AGREEMENT: (handler) =>
    generateLink(handler, LinkKey.socialAgreement),
  LINK_MORE_REASONS_OAS: (handler) => generateLink(handler, LinkKey.oasReasons),
  LINK_MORE_REASONS_GIS: (handler) => generateLink(handler, LinkKey.gisReasons),
  LINK_MORE_REASONS_ALW: (handler) => generateLink(handler, LinkKey.alwReasons),
  LINK_MORE_REASONS_AFS: (handler) => generateLink(handler, LinkKey.afsReasons),
  LINK_OAS_DEFER_CLICK_HERE: (handler) =>
    generateLink(handler, LinkKey.oasDeferClickHere),
  LINK_OAS_DEFER_INLINE: (handler) =>
    generateLink(handler, LinkKey.oasDeferInline),
  LINK_RECOVERY_TAX: (handler) =>
    generateLink(handler, LinkKey.oasRecoveryTaxInline),
}

function generateLink(handler: BenefitHandler, linkKey: LinkKey): string {
  return `<a class="underline text-default-text" href="${handler.translations.links[linkKey].url}" target="_blank">${handler.translations.links[linkKey].text}</a>`
}
