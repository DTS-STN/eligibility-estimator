import {
  FieldCategory,
  Language,
  LegalStatus,
  Locale,
  MaritalStatus,
  PartnerBenefitStatus,
} from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import en from './en'
import fr from './fr'
import { LinkDefinitions } from './links'

const apiTranslationsDict = { en, fr }

export interface KeyAndText {
  key: string
  text: string
}

export interface TypedKeyAndText<T> {
  key: T
  text: string
}

export interface Translations {
  _language: Language
  _locale: Locale
  benefit: { oas: string; gis: string; alw: string; afs: string }
  category: { [key in FieldCategory]: string }
  result: {
    eligible: string
    ineligible: string
    unavailable: string
    moreInfo: string
    invalid: string
    incomeDependent: string
  }
  question: { [key in FieldKey]: string }
  questionShortText: { [key in FieldKey]: string }
  questionHelp: { [key in FieldKey]?: string }
  questionOptions: {
    incomeAvailable: TypedKeyAndText<boolean>[]
    oasDefer: TypedKeyAndText<boolean>[]
    legalStatus: TypedKeyAndText<LegalStatus>[]
    livedOutsideCanada: TypedKeyAndText<boolean>[]
    partnerLivedOutsideCanada: TypedKeyAndText<boolean>[]
    maritalStatus: TypedKeyAndText<MaritalStatus>[]
    partnerIncomeAvailable: TypedKeyAndText<boolean>[]
    partnerBenefitStatus: TypedKeyAndText<PartnerBenefitStatus>[]
    livingCountry: KeyAndText[]
  }
  detail: {
    eligible: string
    eligibleDependingOnIncome: string
    eligibleDependingOnIncomeNoEntitlement: string
    eligibleOas65to69: string
    eligibleEntitlementUnavailable: string
    eligiblePartialOas: string
    eligiblePartialOas65to69: string
    eligibleWhen60ApplyNow: string
    eligibleWhen65ApplyNowOas: string
    eligibleWhen60: string
    eligibleWhen65: string
    mustBe60to64: string
    mustBeInCanada: string
    mustBeOasEligible: string
    mustCompleteOasCheck: string
    mustBeWidowed: string
    mustBePartnered: string
    mustHavePartnerWithGis: string
    mustMeetIncomeReq: string
    mustMeetYearReq: string
    conditional: string
    dependingOnAgreement: string
    dependingOnAgreementWhen60: string
    dependingOnAgreementWhen65: string
    dependingOnLegal: string
    dependingOnLegalSponsored: string
    dependingOnLegalWhen60: string
    dependingOnLegalWhen65: string
    additionalReasons: string
    oasClawback: string
    oasIncreaseAt75: string
    oasIncreaseAt75Applied: string
    oasDeferralIncrease: string
    alwNotEligible: string
    afsNotEligible: string
    autoEnrollTrue: string
    autoEnrollFalse: string
  }
  summaryTitle: {
    moreInfo: string
    unavailable: string
    availableEligible: string
    availableIneligible: string
  }
  summaryDetails: {
    moreInfo: string
    unavailable: string
    availableEligible: string
    availableIneligible: string
  }
  links: LinkDefinitions
  incomeSingle: string
  incomeCombined: string
  csv: {
    appName: string
    formResponses: string
    question: string
    answer: string
    estimationResults: string
    benefit: string
    eligibility: string
    details: string
    entitlement: string
    links: string
    description: string
    url: string
  }
  yes: string
  no: string
}

export function getTranslations(language: Language): Translations {
  switch (language) {
    case Language.EN:
      return apiTranslationsDict.en
    case Language.FR:
      return apiTranslationsDict.fr
  }
}

/**
 * Reusable utility function that accepts a string, and outputs a locale-formatted currency string.
 * It rounds, it determines where to put the $ sign, it will use spaces or commas, all depending on the locale.
 */
export function numberToStringCurrency(
  number: number,
  locale: Locale,
  options?: { rounding?: number }
): string {
  const rounding = options?.rounding === undefined ? 2 : options.rounding
  return number.toLocaleString(locale, {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: rounding,
  })
}
