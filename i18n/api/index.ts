import {
  BenefitKey,
  FieldCategory,
  Language,
  LanguageCode,
  LegalStatus,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  SummaryState,
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
  shortText: string
}

export interface Translations {
  _language: Language
  benefit: { [key in BenefitKey]: string }
  category: { [key in FieldCategory]: string }
  result: { [key in ResultKey]: string }
  question: { [key in FieldKey]: string }
  questionShortText: { [key in FieldKey]?: string }
  questionAriaLabel: { [key in FieldKey]?: string }
  questionHelp: { [key in FieldKey]?: string }
  questionOptions: {
    [FieldKey.INCOME_AVAILABLE]: TypedKeyAndText<boolean>[]
    [FieldKey.OAS_DEFER]: TypedKeyAndText<boolean>[]
    [FieldKey.LEGAL_STATUS]: TypedKeyAndText<LegalStatus>[]
    [FieldKey.LIVED_OUTSIDE_CANADA]: TypedKeyAndText<boolean>[]
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]: TypedKeyAndText<boolean>[]
    [FieldKey.MARITAL_STATUS]: TypedKeyAndText<MaritalStatus>[]
    [FieldKey.INV_SEPARATED]: TypedKeyAndText<boolean>[]
    [FieldKey.PARTNER_INCOME_AVAILABLE]: TypedKeyAndText<boolean>[]
    [FieldKey.PARTNER_BENEFIT_STATUS]: TypedKeyAndText<PartnerBenefitStatus>[]
    [FieldKey.LIVING_COUNTRY]: KeyAndText[]
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]: TypedKeyAndText<boolean>[]
  }
  detail: {
    eligible: string
    eligibleIncomeTooHigh: string
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
    dependingOnLegalWhen60: string
    dependingOnLegalWhen65: string
    alwNotEligible: string
    alwIfYouApply: string
    afsNotEligible: string
    autoEnrollTrue: string
    autoEnrollFalse: string
    expectToReceive: string
    oasClawback: string
    gis: {
      eligibleDependingOnIncomeNoEntitlement: string
      incomeTooHigh: string
      ifYouApply: string
    }
  }
  detailWithHeading: {
    oasDeferralApplied: { heading: string; text: string }
    oasDeferralAvailable: { heading: string; text: string }
    oasClawback: { heading: string; text: string }
    oasIncreaseAt75: { heading: string; text: string }
    oasIncreaseAt75Applied: { heading: string; text: string }
    calculatedBasedOnIndividualIncome: { heading: string; text: string }
    partnerEligible: { heading: string; text: string }
  }
  summaryTitle: { [key in SummaryState]?: string }
  summaryDetails: { [key in SummaryState]?: string }
  links: LinkDefinitions
  incomeSingle: string
  incomeCombined: string
  opensNewWindow: string
  yes: string
  no: string
  year: string
  your: string
  complete: string
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
