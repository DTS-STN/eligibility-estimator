import en from './en'
import fr from './fr'

export const webDictionary = { en, fr }

export type WebTranslations = {
  otherLang: string
  search: string
  breadcrumb1Title: string
  breadcrumb1URL: string
  breadcrumb2Title: string
  breadcrumb2URL: string
  breadcrumb3Title: string
  breadcrumb3URL: string
  title: string
  menuTitle: string
  clear: string
  back: string
  next: string
  questions: string
  results: string
  needHelp: string
  faq: string
  estimate: string
  required: string
  homePageP1: string
  homePageP2: string
  homePageP3: string
  homePageP4: string
  homePageP5: string
  homePageP6: string
  emptyResultsMessage: string
  disclaimer: string
  contactSC: string
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
  privacyDisclaimer: string
  category: {
    incomeDetails: string
    personalInformation: string
    legalStatus: string
  }

  //results page
  contactCTA: string
  resultsPage: {
    tableHeader1: string
    tableHeader2: string
    tableHeader3: string
    tableTotalAmount: string
  }
  moreInfoHeader: string

  errors: {
    empty: string
  }
}
