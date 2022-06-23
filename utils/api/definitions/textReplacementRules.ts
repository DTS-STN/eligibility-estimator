import { numberToStringCurrency } from '../../../i18n/api'
import { BenefitHandler } from '../benefitHandler'
import legalValues from '../scrapers/output'
import { BenefitResult, Link } from './types'

type TextReplacementRules = {
  [x: string]: (
    handler: BenefitHandler,
    benefitResult?: BenefitResult
  ) => string
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
    `<strong className="font-bold">${String(
      handler.benefitResults.oas?.entitlement.deferral.years ?? 0
    )} ${handler.translations.years}</strong>`,
  OAS_DEFERRAL_AGE: (handler) =>
    String(handler.benefitResults.oas.entitlement.deferral.age),
  OAS_CLAWBACK: (handler) =>
    numberToStringCurrency(
      handler.benefitResults.oas?.entitlement.clawback ?? 0,
      handler.translations._locale
    ),
  OAS_RECOVERY_TAX_CUTOFF: (handler) =>
    numberToStringCurrency(
      legalValues.oas.clawbackIncomeLimit,
      handler.translations._locale,
      { rounding: 0 }
    ),
  OAS_MAX_INCOME: (handler) =>
    `<strong className="font-bold">${numberToStringCurrency(
      legalValues.oas.incomeLimit,
      handler.translations._locale,
      { rounding: 0 }
    )}</strong>`,
  INCOME_LESS_THAN: (handler, benefitResult) =>
    `<strong className="font-bold">${numberToStringCurrency(
      benefitResult.eligibility.incomeMustBeLessThan,
      handler.translations._locale,
      { rounding: 0 }
    )}</strong>`,
  INCOME_SINGLE_OR_COMBINED: (handler) =>
    handler.input.client.maritalStatus.partnered
      ? handler.translations.incomeCombined
      : handler.translations.incomeSingle,
  LINK_SERVICE_CANADA: (handler) => generateLink(handler.translations.links.SC),
  LINK_SOCIAL_AGREEMENT: (handler) =>
    generateLink(handler.translations.links.socialAgreement),
  LINK_MORE_REASONS: (handler, benefitResult) =>
    generateLink(handler.translations.links.reasons[benefitResult.benefitKey]),
  LINK_OAS_DEFER_CLICK_HERE: (handler) =>
    generateLink(handler.translations.links.oasDeferClickHere),
  LINK_OAS_DEFER_INLINE: (handler) =>
    generateLink(handler.translations.links.oasDeferInline),
  LINK_RECOVERY_TAX: (handler) =>
    generateLink(handler.translations.links.oasRecoveryTaxInline),
}

function generateLink(link: Link): string {
  return `<a class="underline text-default-text" href="${link.url}" target="_blank">${link.text}</a>`
}
