import {
  Language,
  Locale,
  ValidationErrors,
} from '../../utils/api/definitions/enums'
import { Translations } from '../api'
import en from './en'
import fr from './fr'

export const webDictionary = { [Language.EN]: en, [Language.FR]: fr }

export type WebTranslations = {
  _language: Language
  _locale: Locale

  atLeast60: string
  haveNetIncomeLess: string
  headerWhatToKnow: string
  pleaseNodeText: string
  estimatorIncludeQuestionText: string
  ageText: string
  netIncomeText: string
  legalStatusText: string
  residenceHistoryText: string
  maritalStatusText: string
  partnerText: string
  timeToCompleteText: string
  startBenefitsEstimator: string
  estimatorTimeEstimate: string
  whatBenefitsTheEstimatorIsFor: string
  benefitAvailable: string
  learnMoreAboutOldAgeSecurity: string
  gisDefinitionText: string
  learnMoreAboutGis: string
  alwDefinitionText: string
  learnMoreAboutAlw: string
  afsDefinitionText: string
  learnMoreAboutAfs: string
  notIncludeCPP: string
  learnMoreAboutCpp: string
  aboutResultText: string
  resultDefinition: string
  privacyHeading: string
  privacyDefinition: string
  oas: string
  gis: string
  alw: string
  afs: string
  testSiteTitle: string
  testSiteHeader: string
  otherLang: string
  otherLangCode: string
  langLong: string
  creator: string
  search: string
  breadcrumb1Title: string
  breadcrumb1URL: string
  breadcrumb2Title: string
  breadcrumb2URL: string
  title: string
  menuTitle: string
  clear: string
  back: string
  next: string
  questions: string
  results: string
  needHelp: string
  faq: string
  saveToCsv: string
  nextStep: string
  getResults: string
  getEstimate: string
  applyHeader: string
  applyText: string
  applyForLabel: string
  required: string
  homePageHeader1: string
  homePageP1: string
  homePageP3: string
  homePageP4: string
  homePageP5: string
  homePageP6: string
  disclaimer: string
  disclaimerTitle: string
  footerlink1: string
  footerlink2: string
  footerlink3: string
  footerlink4: string
  footerlink5: string
  footerlink6: string
  footerlink7: string
  footerlink8: string
  footerlink9: string
  socialLink1: string
  socialLink2: string
  socialLink3: string
  socialLink4: string
  socialLink5: string
  youMayBeEligible: string

  category: Translations['category']

  //results page
  contactCTA: string
  resultsPage: {
    header: string
    onThisPage: string
    tableHeader1: string
    tableHeader2: string
    tableTotalAmount: string
    whatYouToldUs: string
    youMayBeEligible: string
    basedOnYourInfo: string
    yourEstimatedTotal: string
    basedOnYourInfoTotal: string
    nextSteps: string
    youMayNotBeEligible: string
    edit: string
    info: string
    note: string
    link: string
    dollarSign: string
    oasInfoUrl: string
    oasInfoText: string
    oasMessage: string
    gisInfoUrl: string
    gisInfoText: string
    gisMessage: string
    gisApplyUrl: string
    gisApplyText: string
    alwInfoUrl: string
    alwInfoText: string
    alwMessage: string
    alwApplyUrl: string
    alwApplyText: string
    afsInfoUrl: string
    afsInfoText: string
    afsMessage: string
    afsApplyUrl: string
    afsApplyText: string
  }
  resultsQuestions: {
    age: string
    livingCountry: string
    legalStatus: string
    livedOutsideCanada: string
    yearsInCanadaSince18: string
    income: string
    maritalStatus: string
    partnerBenefitStatus: string
    partnerAge: string
    partnerLivingCountry: string
    partnerLegalStatus: string
    partnerlivedOutsideCanada: string
    partnerYearsInCanadaSince18: string
    partnerIncome: string
  }
  moreInfoHeader: string
  startOver: string
  modifyAnswers: string
  modifyAnswersText: string
  errors: {
    empty: string
  }
  validationErrors: { [key in ValidationErrors]: string }
  unableToProceed: string
  unavailableImageAltText: string
  govt: string
  yes: string
  no: string
  year: string
  years: string
  unavailable: string

  selectText: {
    maritalStatus: string
    livingCountry: string
    partnerLivingCountry: string
    default: string
  }
}

export function getWebTranslations(language: Language): WebTranslations {
  switch (language) {
    case Language.EN:
      return webDictionary.en
    case Language.FR:
      return webDictionary.fr
  }
}
