import { Link } from '../../utils/api/definitions/types'
import en from './en'
import fr from './fr'

const apiTranslationsDict = { en, fr }

export enum Language {
  EN = 'EN',
  FR = 'FR',
}

export interface KeyAndText {
  key: string
  text: string
}

export interface Translations {
  benefit: { oas: string; gis: string; allowance: string; afs: string }
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
    conditional: string
    moreInfo: string
    invalid: string
  }
  question: {
    income: string
    age: string
    livingCountry: string
    legalStatus: string
    legalStatusOther: string
    canadaWholeLife: string
    yearsInCanadaSince18: string
    maritalStatus: string
    partnerIncome: string
    partnerBenefitStatus: string
    everLivedSocialCountry: string
  }
  questionOptions: {
    legalStatus: KeyAndText[]
    maritalStatus: KeyAndText[]
    partnerBenefitStatus: KeyAndText[]
    livingCountry: KeyAndText[]
  }
  detail: {
    eligible: string
    eligibleEntitlementUnavailable: string
    eligiblePartialOas: string
    eligibleWhen60ApplyNow: string
    eligibleWhen65ApplyNow: string
    eligibleWhen60: string
    eligibleWhen65: string
    mustBe60to64: string
    mustBeInCanada: string
    mustBeOasEligible: string
    mustCompleteOasCheck: string
    mustBeWidowed: string
    mustBePartnered: string
    mustHavePartnerWithOas: string
    mustMeetIncomeReq: string
    mustMeetYearReq: string
    ineligibleYearsOrCountry: string
    conditional: string
    dependingOnAgreement: string
    dependingOnAgreementWhen60: string
    dependingOnAgreementWhen65: string
    dependingOnLegal: string
    dependingOnLegalSponsored: string
    dependingOnLegalWhen60: string
    dependingOnLegalWhen65: string
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
    contactSC: Link
    oasOverview: Link
    oasEntitlement: Link
    oasMaxIncome: Link
    outsideCanada: Link
    oasQualify: Link
    oasPartial: Link
    gisQualify: Link
    allowanceQualify: Link
    afsQualify: Link
    workingOutsideCanada: Link
    gisEntitlement: Link
    oasEntitlement2: Link
    allowanceGisEntitlement: Link
    allowanceInfo: Link
    afsEntitlement: Link
    oasRecoveryTax: Link
    oasDefer: Link
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
