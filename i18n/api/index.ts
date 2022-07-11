import {
  FieldCategory,
  Language,
  LanguageCode,
  LegalStatus,
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
    everLivedSocialCountry: TypedKeyAndText<boolean>[]
  }
  detail: {
    eligible: string
    eligibleDependingOnIncome: string
    eligibleDependingOnIncomeNoEntitlement: string
    eligibleEntitlementUnavailable: string
    eligiblePartialOas: string
    eligibleWhen60ApplyNow: string
    eligibleWhen65ApplyNow: string
    eligibleWhen60: string
    eligibleWhen65: string
    mustBeInCanada: string
    mustBeOasEligible: string
    mustCompleteOasCheck: string
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
    alwNotEligible: string
    afsNotEligible: string
    autoEnrollTrue: string
    autoEnrollFalse: string
    expectToReceive: string
  }
  detailWithHeading: {
    oasDeferralApplied: { heading: string; text: string }
    oasDeferralAvailable: { heading: string; text: string }
    oasClawback: { heading: string; text: string }
    oasIncreaseAt75: { heading: string; text: string }
    oasIncreaseAt75Applied: { heading: string; text: string }
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
  year: string
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
  language: Language,
  options?: { rounding?: number }
): string {
  const languageCode =
    language === Language.EN ? LanguageCode.EN : LanguageCode.FR
  const rounding = options?.rounding === undefined ? 2 : options.rounding
  return number.toLocaleString(languageCode, {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: rounding,
  })
}
