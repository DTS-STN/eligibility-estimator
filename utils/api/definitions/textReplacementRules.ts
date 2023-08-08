import { numberToStringCurrency } from '../../../i18n/api'
import { BenefitHandler } from '../benefitHandler'
import legalValues from '../scrapers/output'
import { Language } from './enums'
import { BenefitResult, Link } from './types'

type TextReplacementRules = {
  [x: string]: (
    handler: BenefitHandler,
    benefitResult?: BenefitResult
  ) => string
}

export const textReplacementRules: TextReplacementRules = {
  ENTITLEMENT_AMOUNT_SUM: (handler) =>
    `<strong>${numberToStringCurrency(
      handler.summary.entitlementSum,
      handler.translations._language
    )}</strong>`,
  ENTITLEMENT_AMOUNT_FOR_BENEFIT: (handler, benefitResult) =>
    `<strong>${numberToStringCurrency(
      benefitResult.entitlement.result,
      handler.translations._language
    )}</strong>`,
  CALCULATED_YEARS_IN_CANADA: (handler) => {
    const yearsInCanada = handler.rawInput.yearsInCanadaSince18
    return String(yearsInCanada)
  },
  OAS_75_AMOUNT: (handler) =>
    `<strong>${numberToStringCurrency(
      handler.benefitResults.client.oas?.entitlement.resultAt75 ?? 0,
      handler.translations._language
    )}</strong>`,
  CURRENT_AGE: (handler) => {
    const current_age =
      handler.benefitResults.client.oas?.cardDetail?.meta?.currentAge
    return `${current_age}`
  },
  WAIT_MONTHS: (handler) => {
    const months =
      handler.benefitResults.client.oas?.cardDetail?.meta?.monthsTo70
    return `${months}`
  },
  DELAY_MONTHS: (handler) => {
    const months =
      handler.benefitResults.client.oas?.cardDetail?.meta?.monthsTo70
    return `${months}`
  },
  MONTH_MONTHS: (handler) => {
    const months =
      handler.benefitResults.client.oas?.cardDetail?.meta?.monthsTo70
    return `${
      months == 1 ? handler.translations.month : handler.translations.months
    }`
  },
  OAS_DEFERRAL_INCREASE: (handler) =>
    `<strong>${numberToStringCurrency(
      handler.benefitResults.client.oas?.entitlement.deferral.increase ?? 0,
      handler.translations._language
    )}</strong>`,
  OAS_DEFERRAL_YEARS: (handler) => {
    const years = handler.benefitResults.client.oas?.entitlement.deferral.years
    return `<strong>${years ?? 0} ${handler.translations.year}${
      years !== 1 ? 's' : ''
    }</strong>`
  },
  OAS_DEFERRAL_AGE: (handler) =>
    String(handler.benefitResults.client.oas.entitlement.deferral.age),
  OAS_CLAWBACK: (handler) =>
    `<strong>${numberToStringCurrency(
      handler.benefitResults.client.oas?.entitlement.clawback ?? 0,
      handler.translations._language
    )}</strong>`,
  OAS_RECOVERY_TAX_CUTOFF: (handler) =>
    `<strong>${numberToStringCurrency(
      legalValues.oas.clawbackIncomeLimit,
      handler.translations._language,
      { rounding: 0 }
    )}</strong>`,
  OAS_MAX_INCOME: (handler) =>
    `<strong>${numberToStringCurrency(
      legalValues.oas.incomeLimit,
      handler.translations._language,
      { rounding: 0 }
    )}</strong>`,
  INCOME_LESS_THAN: (handler, benefitResult) =>
    `<strong>${numberToStringCurrency(
      benefitResult.eligibility.incomeMustBeLessThan,
      handler.translations._language,
      { rounding: 0 }
    )}</strong>`,
  INCOME_SINGLE_OR_COMBINED: (handler) =>
    handler.input.client.maritalStatus.partnered
      ? handler.translations.incomeCombined
      : handler.translations.incomeSingle,
  EARLIEST_ELIGIBLE_AGE: (handler) => String(handler.rawInput.age),
  LINK_SERVICE_CANADA: (handler) => generateLink(handler.translations.links.SC),
  MY_SERVICE_CANADA: (handler) =>
    generateLink(handler.translations.links.SCAccount),
  LINK_SOCIAL_AGREEMENT: (handler) =>
    generateLink(handler.translations.links.socialAgreement),
  LINK_MORE_REASONS: (handler, benefitResult) =>
    generateLink(handler.translations.links.reasons[benefitResult.benefitKey]),
  LINK_OAS_DEFER_CLICK_HERE: (handler) =>
    generateLink(handler.translations.links.oasDeferClickHere),
  LINK_OAS_DEFER_INLINE: (handler) =>
    generateLink(
      handler.translations.links.oasDeferInline,
      handler.translations.opensNewWindow
    ),
  LINK_RECOVERY_TAX: (handler) =>
    generateLink(handler.translations.links.oasRecoveryTaxInline),
  LINK_LEARN_ABOUT_RECOVERY_TAX: (handler) =>
    generateLink(handler.translations.links.oasLearnAboutRecoveryTax),
  LINK_NON_RESIDENT_TAX: (handler) =>
    generateLink(handler.translations.links.oasNonResidentTax),
  PARTNER_BENEFIT_AMOUNT: (handler, benefitResult) =>
    `<strong>${numberToStringCurrency(
      benefitResult.entitlement.result,
      handler.translations._language
    )}</strong>`,
  YOUR_OR_COMPLETE: (handler) =>
    handler.input.client.maritalStatus.partnered
      ? handler.translations.complete
      : handler.translations.your,
}

export function generateLink(link: Link, opensNewWindow?: string): string {
  return `<a class="underline text-default-text generatedLink" href="${link.url}" target="_blank">${link.text}</a>`
}

export function getMaxYear(): number {
  return new Date().getFullYear() - 18
}

export function getMaximumIncomeThreshold(language: Language): string {
  return numberToStringCurrency(legalValues.oas.incomeLimit, language)
}
