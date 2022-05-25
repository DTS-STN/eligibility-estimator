import {
  Language,
  Locale,
  ValidationErrors,
} from '../../utils/api/definitions/enums'
import { legalValues } from '../../utils/api/scrapers/output'
import { numberToStringCurrency } from '../api'
import en from './en'
import fr from './fr'

export const webDictionary = { [Language.EN]: en, [Language.FR]: fr }

export type WebTranslations = {
  _language: Language
  _locale: Locale

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
  category: {
    age: string
    incomeDetails: string
    personalInformation: string
    legalStatus: string
    residence: string
    marital: string
  }

  //results page
  contactCTA: string
  resultsPage: {
    header: string
    tableHeader1: string
    tableHeader2: string
    tableHeader3: string
    tableHeader4: string
    tableTotalAmount: string
  }
  moreInfoHeader: string
  modifyAnswers: string
  modifyAnswersText: string
  errors: {
    empty: string
  }
  validationErrors: { [key in ValidationErrors]: string }
  unavailableImageAltText: string
  govt: string
  yes: string
  no: string

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

/**
 * Takes an input string, and applies variable replacements according to the current language.
 */
export function applyReplacements(input: string, language: Language): string {
  console.log('inside APPLY REPLACEMENTS')
  console.log(`input`, input)
  console.log(`language`, language)
  const locale = language === Language.EN ? Locale.EN : Locale.FR
  return input.replace(
    '{MAX_OAS_INCOME}',
    numberToStringCurrency(legalValues.MAX_OAS_INCOME, locale, { rounding: 0 })
  )
}
