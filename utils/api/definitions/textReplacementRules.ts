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
      handler.fields.translations._language
    )}</strong>`,
  ENTITLEMENT_AMOUNT_FOR_BENEFIT: (handler, benefitResult) =>
    `<strong data-cy='benefit-estimate'>${numberToStringCurrency(
      benefitResult.entitlement.result,
      handler.fields.translations._language
    )}</strong>`,
  CALCULATED_YEARS_IN_CANADA: (handler) => {
    const yearsInCanada = handler.rawInput.yearsInCanadaSince18
    return String(yearsInCanada)
  },
  OAS_75_AMOUNT: (handler) =>
    `<strong>${numberToStringCurrency(
      handler.benefitResults.client.oas?.entitlement.resultAt75 ?? 0,
      handler.fields.translations._language
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
      months == 1
        ? handler.fields.translations.month
        : handler.fields.translations.months
    }`
  },
  OAS_DEFERRAL_INCREASE: (handler) =>
    `<strong>${numberToStringCurrency(
      handler.benefitResults.client.oas?.entitlement.deferral.increase ?? 0,
      handler.fields.translations._language
    )}</strong>`,
  OAS_DEFERRAL_YEARS: (handler) => {
    const years = handler.benefitResults.client.oas?.entitlement.deferral.years
    return `<strong>${years ?? 0} ${handler.fields.translations.year}${
      years !== 1 ? 's' : ''
    }</strong>`
  },
  OAS_DEFERRAL_AGE: (handler) =>
    String(handler.benefitResults.client.oas.entitlement.deferral.age),
  OAS_CLAWBACK: (handler) =>
    `<strong>${numberToStringCurrency(
      handler.benefitResults.client.oas?.entitlement.clawback ?? 0,
      handler.fields.translations._language
    )}</strong>`,
  OAS_RECOVERY_TAX_CUTOFF: (handler) =>
    `<strong>${numberToStringCurrency(
      legalValues.oas.clawbackIncomeLimit,
      handler.fields.translations._language,
      { rounding: 0 }
    )}</strong>`,
  OAS_MAX_INCOME: (handler) =>
    `<strong>${numberToStringCurrency(
      legalValues.oas.incomeLimit,
      handler.fields.translations._language,
      { rounding: 0 }
    )}</strong>`,
  INCOME_LESS_THAN: (handler, benefitResult) =>
    `<strong>${numberToStringCurrency(
      benefitResult.eligibility.incomeMustBeLessThan,
      handler.fields.translations._language,
      { rounding: 0 }
    )}</strong>`,
  INCOME_SINGLE_OR_COMBINED: (handler) =>
    handler.fields.input.client.maritalStatus.partnered
      ? handler.fields.translations.incomeCombined
      : handler.fields.translations.incomeSingle,
  EARLIEST_ELIGIBLE_AGE: (handler) => String(handler.rawInput.age),
  LINK_SERVICE_CANADA: (handler) =>
    generateLink(handler.fields.translations.links.SC),
  MY_SERVICE_CANADA: (handler) =>
    generateLink(handler.fields.translations.links.SCAccount),
  LINK_SOCIAL_AGREEMENT: (handler) =>
    generateLink(handler.fields.translations.links.socialAgreement),
  LINK_MORE_REASONS: (handler, benefitResult) =>
    generateLink(
      handler.fields.translations.links.reasons[benefitResult.benefitKey]
    ),
  LINK_OAS_DEFER_CLICK_HERE: (handler) =>
    generateLink(handler.fields.translations.links.oasDeferClickHere),
  LINK_OAS_DEFER_INLINE: (handler) =>
    generateLink(
      handler.fields.translations.links.oasDeferInline,
      handler.fields.translations.opensNewWindow
    ),
  LINK_RECOVERY_TAX: (handler) =>
    generateLink(handler.fields.translations.links.oasRecoveryTaxInline),
  LINK_LEARN_ABOUT_RECOVERY_TAX: (handler) =>
    generateLink(handler.fields.translations.links.oasLearnAboutRecoveryTax),
  LINK_NON_RESIDENT_TAX: (handler) =>
    generateLink(handler.fields.translations.links.oasNonResidentTax),
  PARTNER_BENEFIT_AMOUNT: (handler, benefitResult) =>
    `<strong data-cy='benefit-estimate'>${numberToStringCurrency(
      benefitResult.entitlement.result,
      handler.fields.translations._language
    )}</strong>`,
  YOUR_OR_COMPLETE: (handler) =>
    handler.fields.input.client.maritalStatus.partnered
      ? handler.fields.translations.complete
      : handler.fields.translations.your,
}

export function generateLink(link: Link, opensNewWindow?: string): string {
  return `<a class="underline text-default-text generatedLink" href="${link.url}" target="_blank">${link.text}</a> 
  <svg width="16" height="16" y="4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path class="newTabIcon" d="M13.5 10H12.5C12.3674 10 12.2402 10.0527
    12.1464 10.1464C12.0527 10.2402 12 10.3674 12
    10.5V14H2V4H6.5C6.63261 4 6.75979 3.94732
    6.85355 3.85355C6.94732 3.75979 7 3.63261 7
    3.5V2.5C7 2.36739 6.94732 2.24021 6.85355
    2.14645C6.75979 2.05268 6.63261 2 6.5
    2H1.5C1.10218 2 0.720644 2.15804 0.43934
    2.43934C0.158035 2.72064 0 3.10218 0 3.5L0
    14.5C0 14.8978 0.158035 15.2794 0.43934
    15.5607C0.720644 15.842 1.10218 16 1.5
    16H12.5C12.8978 16 13.2794 15.842 13.5607
    15.5607C13.842 15.2794 14 14.8978 14
    14.5V10.5C14 10.3674 13.9473 10.2402
    13.8536 10.1464C13.7598 10.0527 13.6326 10
    13.5 10ZM15.25 0H11.25C10.5822 0 10.2484
    0.809687 10.7188 1.28125L11.8353 2.39781L4.21875
    10.0116C4.14883 10.0812 4.09335 10.164 4.0555
    10.2552C4.01764 10.3464 3.99816 10.4441 3.99816
    10.5428C3.99816 10.6415 4.01764 10.7393 4.0555
    10.8304C4.09335 10.9216 4.14883 11.0044 4.21875
    11.0741L4.92719 11.7812C4.99687 11.8512 5.07966
    11.9066 5.17082 11.9445C5.26199 11.9824 5.35973
    12.0018 5.45844 12.0018C5.55715 12.0018 5.65489
    11.9824 5.74605 11.9445C5.83721 11.9066 5.92001
    11.8512 5.98969 11.7812L13.6025 4.16625L14.7188
    5.28125C15.1875 5.75 16 5.42188 16 4.75V0.75C16
    0.551088 15.921 0.360322 15.7803 0.21967C15.6397
    0.0790176 15.4489 0 15.25 0Z" fill="#284162"/>
</svg>`
}

export function getMaxYear(): number {
  return new Date().getFullYear() - 18
}

export function getMaximumIncomeThreshold(language: Language): string {
  return numberToStringCurrency(legalValues.oas.incomeLimit, language)
}
