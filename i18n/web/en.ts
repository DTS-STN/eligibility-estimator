import { WebTranslations } from '.'
import { Language, Locale } from '../../utils/api/definitions/enums'

const en: WebTranslations = {
  _language: Language.EN,
  _locale: Locale.EN,

  oas: 'Old Age Security (OAS)',
  gis: 'Guaranteed Income Supplement (GIS)',
  alw: 'Allowance',
  afs: 'Allowance for the Survivor',
  testSiteTitle: 'TEST SITE',
  testSiteHeader:
    'You cannot apply for services or benefits through this test site. Parts of this site may not work and will change.',
  otherLang: 'Français',
  otherLangCode: 'FR',
  langLong: 'eng',
  creator: 'Employment and Social Development Canada',
  search: 'Search Canada.ca',
  breadcrumb1Title: 'Canada.ca',
  breadcrumb1URL: 'https://www.canada.ca',
  breadcrumb2Title: 'Service Canada',
  breadcrumb2URL:
    'https://www.canada.ca/en/employment-social-development/corporate/portfolio/service-canada.html',
  title: 'Canadian Old Age Benefits Estimator',
  menuTitle: 'Service Canada',
  clear: 'Clear',
  back: 'Back',
  next: 'Next',
  questions: 'Questions',
  results: 'Results',
  needHelp: 'Need help?',
  faq: 'Frequently Asked Questions',
  saveToCsv: 'Download',
  getResults: 'Get Results',
  applyHeader: 'Apply for benefits',
  applyText:
    'Now that you have estimated your benefits, please use the button(s) below to apply.',
  applyForLabel: 'Apply for',
  required: 'required',
  homePageP1:
    'The Canadian Old Age Benefits Estimator is a prototype in development. Based on the information you provide, this will estimate your eligibility for the Old Age Security (OAS), Guaranteed Income Supplement (GIS), Allowance, and Allowance for the survivor. If eligible to receive the benefit, it will also estimate your monthly payment.',
  homePageHeader1: 'Types of benefits programs',
  homePageP3:
    'The Old Age Security pension is a monthly payment you can get if you are 65 and older. In most cases, Service Canada will be able to automatically enroll you. In other cases, you will have to apply. Service Canada will inform you if you have been automatically enrolled.',
  homePageP4:
    'The Guaranteed Income Supplement is a monthly non-taxable benefit for Old Age Security pension recipients aged 65 and older who have a low income and are living in Canada.',
  homePageP5:
    'The Allowance is a monthly benefit available to low-income individuals aged 60 to 64 whose spouse or common-law partner receives the Guaranteed Income Supplement.',
  homePageP6:
    'The Allowance for the Survivor is a monthly benefit available to individuals aged 60 to 64 who have a low income, who are living in Canada, and whose spouse or common-law partner has passed away.',
  disclaimerTitle: 'Privacy and terms of use',
  disclaimer: `The Canadian Old Age Benefits Estimator does not collect or transmit any personal information. Anonymous usage data may be collected for research purposes. The information provided is governed in accordance with the <a className="underline text-default-text" href="https://laws-lois.justice.gc.ca/eng/acts/P-21/index.html" target="_blank">Privacy Act</a>.</br></br>Please note that any information provided by this tool is only an estimate, and should not be considered financial advice. For an official assessment, you are encouraged to contact <a className='text-default-text underline' target='_blank' href='https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'>Service Canada</a>.`,
  footerlink1: 'Contact Us',
  footerlink2: 'Prime Minister',
  footerlink3: 'Treaties, laws and regulations',
  footerlink4: 'Public service and military',
  footerlink5: 'Open government',
  footerlink6: 'News',
  footerlink7: 'Departments and agencies',
  footerlink8: 'About government',
  footerlink9: 'Government-wide reporting',
  socialLink1: 'Social media',
  socialLink2: 'Mobile applications',
  socialLink3: 'About Canada.ca',
  socialLink4: 'Terms and conditions',
  socialLink5: 'Privacy',

  category: {
    incomeDetails: 'Income Details',
    personalInformation: 'Personal Information',
    legalStatus: 'Legal Status',
  },

  contactCTA:
    'We encourage you to contact <a className="text-default-text underline" target="_blank" href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html">Service Canada</a> for an official assessment of your application.',
  resultsPage: {
    header: 'Table of estimation results',
    tableHeader1: 'Sample Benefits',
    tableHeader2: 'Eligibility',
    tableHeader3: 'Estimated monthly amount (CAD)',
    tableTotalAmount: 'Total estimated monthly benefit amount',
  },
  moreInfoHeader: 'More Information',
  modifyAnswers: 'Modify answers',
  modifyAnswersText:
    'If you think you have made a mistake in filling out the form, or you would like to change your answers to see what would happen in a different scenario, please use the button below to modify your answers.',
  errors: {
    empty: 'This information is required',
  },
  unavailableImageAltText: 'Happy people',
  govt: 'Government of Canada',
  yes: 'Yes',
  no: 'No',

  selectText: {
    maritalStatus: 'Select a marital status',
    livingCountry: 'Select a country',
    partnerLivingCountry: 'Select a country',
    default: 'Select from',
  },
}

export default en
