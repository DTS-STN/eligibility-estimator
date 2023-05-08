import { Language, ValidationErrors } from '../../utils/api/definitions/enums'
import { Translations } from '../api'
import en from './en'
import fr from './fr'

export const webDictionary = { [Language.EN]: en, [Language.FR]: fr }

export type WebTranslations = {
  _language: Language

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
  youNeedEndingText: string
  timeToCompleteText: string
  startBenefitsEstimator: string
  estimatorTimeEstimate: string
  whatBenefitsIncluded: string
  benefitAvailable: string
  learnMoreAboutOldAgeSecurity: string
  gisDefinitionText: string
  learnMoreAboutGis: string
  alwDefinitionText: string
  learnMoreAboutAlw: string
  inflationInfo: string
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
  introPageTitle: string
  questionPageTitle: string
  resultPageTitle: string
  menuTitle: string
  clear: string
  back: string
  faq: string
  nextStep: string
  getEstimate: string
  required: string
  homePageHeader1: string
  workInProgress: string
  workInProgressBody: string
  homePageP1: string
  homePageP3: string
  homePageP4: string
  homePageP5: string
  homePageP6: string
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
  pageNotFound: string
  warningText: string
  category: Translations['category']
  errorBoxTitle: string

  //results page
  resultsPage: {
    header: string
    general: string
    onThisPage: string
    tableHeader1: string
    tableHeader2: string
    tableTotalAmount: string
    whatYouToldUs: string
    youMayBeEligible: string
    youAreNotEligible: string
    basedOnYourInfoEligible: string
    basedOnYourInfoAndIncomeEligible: string
    basedOnYourInfoNotEligible: string
    yourEstimatedTotal: string
    yourEstimatedNoIncome: string
    basedOnYourInfoTotal: string
    basedOnYourInfoAndIncomeTotal: string
    total: string
    ifIncomeNotProvided: string
    nextSteps: string
    youMayNotBeEligible: string
    noAnswersFound: string
    noBenefitsFound: string
    edit: string
    info: string
    note: string
    link: string
    nextStepTitle: string
    nextStepGis: string
    CTAFeedbackTitle: string
    CTAFeedbackBody: string
    CTAFeedbackButton: string
    //nextStepOas: string
  }

  resultsQuestions: Translations['questionShortText']
  resultsEditAriaLabels: Translations['questionAriaLabel']
  modifyAnswers: string
  errors: {
    empty: string
  }
  validationErrors: { [key in ValidationErrors]: string }
  unableToProceed: string
  yes: string
  no: string
  unavailable: string

  selectText: {
    maritalStatus: string
    livingCountry: string
    partnerLivingCountry: string
    default: string
  }

  tooltip: {
    moreInformation: string
  }

  partnerIsNotEligible: string
  partnerLegalStatusNotEligible: string
  partnerYearsLivingCanadaNotEligible: string
  partnerInformation: string
  partnerInformationDescription: string

  // duration component
  duration: {
    months: string
    years: string
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
