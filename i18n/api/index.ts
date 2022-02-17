import { Language, Locale } from '../../utils/api/definitions/enums'
import { Link } from '../../utils/api/definitions/types'
import en from './en'
import fr from './fr'

const apiTranslationsDict = { en, fr }

export interface KeyAndText {
  key: string
  text: string
}

export interface Translations {
  _language: Language
  _locale: Locale
  benefit: { oas: string; gis: string; alw: string; afs: string }
  category: {
    incomeDetails: string
    personalInformation: string
    partnerDetails: string
    legalStatus: string
    socialAgreement: string
  }
  result: {
    eligible: string
    ineligible: string
    unavailable: string
    moreInfo: string
    invalid: string
  }
  question: {
    income: string
    age: string
    maritalStatus: string
    livingCountry: string
    legalStatus: string
    legalStatusOther: string
    canadaWholeLife: string
    yearsInCanadaSince18: string
    everLivedSocialCountry: string
    partnerBenefitStatus: string
    partnerIncome: string
    partnerAge: string
    partnerLivingCountry: string
    partnerLegalStatus: string
    partnerCanadaWholeLife: string
    partnerYearsInCanadaSince18: string
    partnerEverLivedSocialCountry: string
  }
  questionOptions: {
    legalStatus: KeyAndText[]
    maritalStatus: KeyAndText[]
    partnerBenefitStatus: KeyAndText[]
    livingCountry: KeyAndText[]
  }
  detail: {
    eligible: string
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
    availableIneligibleIncome: string
  }
  links: {
    SC: Link
    socialAgreement: Link
    contactSC: Link
    oasOverview: Link
    cpp: Link
    cric: Link
    oasApply: Link
    alwApply: Link
    afsApply: Link
    oasEntitlement: Link
    oasMaxIncome: Link
    outsideCanada: Link
    oasPartial: Link
    workingOutsideCanada: Link
    gisEntitlement: Link
    oasEntitlement2: Link
    alwGisEntitlement: Link
    alwInfo: Link
    afsEntitlement: Link
    oasRecoveryTax: Link
    oasDefer: Link
    oasRetroactive: Link
    oasDeferClickHere: Link
    oasReasons: Link
    gisReasons: Link
    alwReasons: Link
    afsReasons: Link
  }
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
