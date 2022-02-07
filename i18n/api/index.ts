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
    cpp: Link
    cric: Link
    oasApply: Link
    gisApply: Link
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
