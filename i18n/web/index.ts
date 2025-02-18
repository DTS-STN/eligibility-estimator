import {
  Language,
  ISOLanguage,
  ValidationErrors,
} from '../../utils/api/definitions/enums'
import { Translations } from '../api'
import en from './en'
import fr from './fr'

export const webDictionary = { [Language.EN]: en, [Language.FR]: fr }

export type WebTranslations = {
  _language: Language
  ISOlang: ISOLanguage

  skipToMain: string
  skipToAbout: string
  switchToBasic: string
  globalHeader: string
  testSiteNotice: string
  officialSiteNavigation: string
  languageSelection: string
  logoAltText: string
  atLeast60: string
  haveNetIncomeLess: string
  headerWhatToKnow: string
  pleaseNodeText: string
  legaCitizenlText: string
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
  whatBenefitsIncluded: string
  inflationInfo: string
  notIncludeCPP: string
  learnMoreAboutCpp: string
  aboutResultText: string
  resultDefinition: string
  privacyHeading: string
  privacyDefinition: string
  usingSharedDevice: string
  usingSharedDeviceInfo: string
  oas: string
  gis: string
  alw: string
  alws: string
  testSiteTitle: string
  testSiteHeader: string
  otherLang: string
  otherLangCode: string
  creator: string
  search: string
  breadcrumb1aTitle: string
  breadcrumb1aURL: string
  breadcrumb2aTitle: string
  breadcrumb2aURL: string
  breadcrumb1Title: string
  breadcrumb1URL: string
  breadcrumb2Title: string
  breadcrumb2URL: string
  breadcrumb3Title: string
  breadcrumb3URL: string
  breadcrumb4Title: string
  breadcrumb4URL: string
  breadcrumb5Title: string
  breadcrumb5URL: string
  breadcrumb6Title: string
  breadcrumb6URL: string
  breadcrumb7Title: string
  breadcrumb7URL: string
  retirementUrl: string
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
  dateModified: string
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
  infoText: string
  category: Translations['category']
  errorBoxTitle: string
  useEstimatorIf: string
  incomeLabel: string
  incomeLabelReceiveOAS: string
  partnerIncomeLabel: string
  partnerIncomeLabelReceiveOAS: string
  incomeHintTitle: string
  incomeHintTitleReceiveOAS: string
  incomeHintText: string
  incomeHintTextReceiveOAS: string
  partnerIncomeHintTitleReceiveOAS: string
  partnerIncomeHintTitle: string
  partnerIncomeHintText: string
  partnerIncomeHintTextReceiveOAS: string

  //Main footer links
  aboutGovernment: string
  footerTitle: string
  aboutSite: string
  landscapeLinks: {
    contacts: { text: string; link: string }
    departments: { text: string; link: string }
    about: { text: string; link: string }
    jobs: { text: string; link: string }
    taxes: { text: string; link: string }
    canadaAndWorld: { text: string; link: string }
    immigration: { text: string; link: string }
    environment: { text: string; link: string }
    finance: { text: string; link: string }
    travel: { text: string; link: string }
    nationalSecurity: { text: string; link: string }
    innovation: { text: string; link: string }
    business: { text: string; link: string }
    culture: { text: string; link: string }
    indigenous: { text: string; link: string }
    benefit: { text: string; link: string }
    policing: { text: string; link: string }
    veterans: { text: string; link: string }
    health: { text: string; link: string }
    transport: { text: string; link: string }
    youth: { text: string; link: string }
  }
  brandLinks: {
    socialMedia: { text: string; link: string }
    mobile: { text: string; link: string }
    about: { text: string; link: string }
    terms: { text: string; link: string }
    privacy: { text: string; link: string }
  }
  woodmark: string
  // Error page
  errorPageHeadingTitle404: string
  errorPageHeadingTitle500: string
  errorPageHeadingTitle503: string
  errorPageErrorText404: string
  errorPageErrorText500: string
  errorPageErrorText503: string
  errorPageNextText: string
  errorTextLinkCommon: string
  errorTextLinkCommon_2: string
  errorTextLinkCommonLink: string
  errorAuthTextLinkCommon: string
  errorAuthTextLinkCommon_2: string
  errorAuthTextLinkCommonLink: string
  error500TextLink: string
  error503TextLink: string
  errorPageType: string
  //Stepper
  stepper: {
    yourInfo: string
    partnerInfo: string
    partnerInfoHelp: string
    nextStep: string
    previousStep: string
    getEstimate: string
    navWarning: string
  }
  //Date Picker
  datePicker: {
    month: string
    year: string
    day: string
    months: {
      1: string
      2: string
      3: string
      4: string
      5: string
      6: string
      7: string
      8: string
      9: string
      10: string
      11: string
      12: string
    }
  }
  // meta tags
  meta: {
    homeDescription: string
    homeShortDescription: string
    homeKeywords: string
    author: string
    homeSubject: string
  }
  //results page
  resultsPage: {
    moreInformation: string
    yourMonEstimateHeading: string
    changeInSituation: string
    youEstimateMayChange: string
    yourEstimateMayChangeList: string
    basedYourAge: string
    basedYourPartner: string
    ifYouChoseToDefer: string
    header: string
    general: string
    onThisPage: string
    tableHeader1: string
    tableHeader2: string
    tableTotalAmount: string
    whatYouToldUs: string
    youMayBeEligible: string
    youAreNotEligible: string
    partnerNotEligible: string
    basedOnYourInfoEligible: string
    basedOnYourInfoAndIncomeEligible: string
    basedOnYourInfoNotEligible: string
    basedOnPartnerInfoNotEligible: string
    yourEstimatedTotal: string
    partnerEstimatedTotal: string
    yourEstimatedNoIncome: string
    basedOnYourInfoTotal: string
    basedOnYourInfoAndIncomeTotal: string
    basedOnPartnerInfoTotal: string
    basedOnPartnerInfoAndIncomeTotal: string
    total: string
    futureTotal: string
    partnerTotal: string
    futurePartnerTotal: string
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
    CTATitle: string
    CTABody: string
    CTAButton: string
    month: string
    futureEligible: string
    partnerFutureEligible: string
    toReceive: string
    partnerToReceive: string
    theyToReceive: string
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

  openNewTab: string

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
