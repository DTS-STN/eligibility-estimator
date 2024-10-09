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
    [FieldKey.ALREADY_RECEIVE_OAS]: TypedKeyAndText<boolean>[]
    [FieldKey.WHEN_TO_START]: TypedKeyAndText<boolean>[]
    [FieldKey.OAS_DEFER]: TypedKeyAndText<boolean>[]
    [FieldKey.LEGAL_STATUS]: TypedKeyAndText<LegalStatus>[]
    [FieldKey.LIVED_ONLY_IN_CANADA]: TypedKeyAndText<boolean>[]
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]: TypedKeyAndText<boolean>[]
    [FieldKey.MARITAL_STATUS]: TypedKeyAndText<MaritalStatus>[]
    [FieldKey.INV_SEPARATED]: TypedKeyAndText<boolean>[]
    [FieldKey.PARTNER_INCOME_AVAILABLE]: TypedKeyAndText<boolean>[]
    [FieldKey.PARTNER_BENEFIT_STATUS]: TypedKeyAndText<PartnerBenefitStatus>[]
    [FieldKey.LIVING_COUNTRY]: KeyAndText[]
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]: TypedKeyAndText<boolean>[]
  }
  detail: {
    eligible: string
    futureEligible60: string
    futureEligible: string
    eligibleIncomeTooHigh: string
    futureEligibleIncomeTooHigh: string
    futureEligibleIncomeTooHigh2: string
    eligibleDependingOnIncome: string
    eligibleDependingOnIncomeNoEntitlement: string
    eligibleEntitlementUnavailable: string
    eligiblePartialOas: string
    yourDeferralOptions: string
    retroactivePay: string
    sinceYouAreSixty: string
    futureDeferralOptions: string
    youCanAply: string
    delayMonths: string
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
    partnerContinues: string
    continueReceiving: string
    dependingOnAgreement: string
    dependingOnAgreementWhen60: string
    dependingOnAgreementWhen65: string
    dependingOnLegal: string
    dependingOnLegalWhen60: string
    dependingOnLegalWhen65: string
    youCantGetThisBenefit: string
    thisEstimate: string
    thisEstimateWhenZero: string
    alwNotEligible: string
    alwEligibleButPartnerAlreadyIs: string
    alwEligibleIncomeTooHigh: string
    alwIfYouApply: string
    alwsIfYouApply: string
    afsNotEligible: string
    alwsApply: string
    autoEnrollTrue: string
    autoEnrollFalse: string
    expectToReceive: string
    futureExpectToReceive: string
    futureExpectToReceivePartial1: string
    futureExpectToReceivePartial2: string
    futureExpectToReceivePartial3: string
    oasClawbackInCanada: string
    futureOasClawbackInCanada: string
    oasClawbackNotInCanada: string
    oas: {
      eligibleIfIncomeIsLessThan: string
      dependOnYourIncome: string
      eligibleIncomeTooHigh: string
      futureEligibleIncomeTooHigh: string
      serviceCanadaReviewYourPayment: string
      automaticallyBePaid: string
      youWillReceiveLetter: string
      youShouldReceiveLetter: string
      youShouldHaveReceivedLetter: string
      ifYouDidnt: string
      applyOnline: string
      over70: string
      eligibleWhenTurn65: string
      ifNotReceiveLetter64: string
      chooseToDefer: string
      receivePayment: string
    }
    gis: {
      eligibleDependingOnIncomeNoEntitlement: string
      incomeTooHigh: string
      futureEligibleIncomeTooHigh: string
      ifYouApply: string
      canApplyOnline: string
      ifYouAlreadyApplied: string
      ifYouAlreadyReceive: string
    }
  }
  detailWithHeading: {
    ifYouDeferYourPension: { heading: string; text: string }
    oasDeferralApplied: { heading: string; text: string }
    oasDeferralAvailable: { heading: string; text: string }
    oasClawback: { heading: string; text: string }
    oasIncreaseAt75: { heading: string; text: string }
    oasIncreaseAt75Applied: { heading: string; text: string }
    calculatedBasedOnIndividualIncome: { heading: string; text: string }
    partnerEligible: { heading: string; text: string }
    partnerDependOnYourIncome: { heading: string; text: string }
    partnerEligibleButAnsweredNo: { heading: string; text: string }
  }
  summaryTitle: { [key in SummaryState]?: string }
  summaryDetails: { [key in SummaryState]?: string }
  oasDeferralTable: {
    title: string
    headingAge: string
    futureHeadingAge: string
    headingAmount: string
  }
  links: LinkDefinitions
  incomeSingle: string
  incomeCombined: string
  opensNewWindow: string
  nextStepTitle: string
  yes: string
  no: string
  year: string
  month: string
  months: string
  your: string
  complete: string
  at: string
  atAge: string
}

export function getTranslations(language: Language): Translations {
  switch (language) {
    case Language.EN:
      return apiTranslationsDict.en
    case Language.FR:
      return apiTranslationsDict.fr
    default:
      return apiTranslationsDict.en
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
  return number
    .toLocaleString(languageCode, {
      style: 'currency',
      currency: 'CAD',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: rounding,
    })
    .replace('.00', '')
    .replace(/,00\s/, '\xa0')
}
