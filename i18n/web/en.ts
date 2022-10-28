import { WebTranslations } from '.'
import { Language, ValidationErrors } from '../../utils/api/definitions/enums'
import { generateLink } from '../../utils/api/definitions/textReplacementRules'
import apiEn from '../api/en'

const en: WebTranslations = {
  _language: Language.EN,

  oas: 'Old Age Security pension',
  gis: 'Guaranteed Income Supplement',
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
  introPageTitle: 'Canadian Old Age Security Benefits Estimator',
  questionPageTitle: 'Canadian Old Age Security Benefits Estimator - Questions',
  resultPageTitle: 'Canadian Old Age Security Benefits Estimator - Results',
  menuTitle: 'Service Canada',
  clear: 'Clear',
  back: 'Back',
  faq: 'Frequently Asked Questions',
  nextStep: 'Next step',
  getEstimate: 'Estimate my benefits',
  required: '(required)',
  homePageP1:
    'Use this estimator to find out how much money you could get from Old Age Security benefits. Please note that this is an estimator and not an application for benefits.',
  homePageHeader1: 'Who these benefits are for',
  youMayBeEligible: 'You may be eligible for old age benefits if:',
  atLeast60: 'you are at least 60 years old',
  haveNetIncomeLess: 'your net income is less than $133,141',
  headerWhatToKnow: "What you'll need",
  pleaseNodeText:
    'Please note that this is an estimator and not an application for benefits.',
  estimatorIncludeQuestionText: "You'll need information about your:",
  ageText: '<b>age</b>',
  netIncomeText: '<b>net income</b>',
  legalStatusText:
    '<b>legal status</b> (such as Canadian citizen, Indian Status, refugee or permanent resident)',
  residenceHistoryText:
    '<b>residence history</b> (number of years lived in Canada)',
  maritalStatusText: '<b>marital status</b>',
  partnerText: `<b>partner</b> (income, legal status, and residence history), if applicable`,
  youNeedEndingText:
    'You can enter your current information, or future information for planning purposes.',
  timeToCompleteText: 'Time to complete',
  startBenefitsEstimator: 'Start benefits estimator',
  estimatorTimeEstimate:
    'This estimator will take about 5 to 10 minutes to complete.',
  whatBenefitsIncluded: 'Benefits included in the estimator',
  benefitAvailable: 'A taxable benefit available to those 65 and older',
  learnMoreAboutOldAgeSecurity: `<a className="underline text-default-text" href="${apiEn.links.overview.oas.url}" target="_blank">Learn more about the Old Age Security pension</a>`,
  gisDefinitionText:
    'A non-taxable benefit available to those who receive the Old Age Security pension, are aged 65 and older, have a low income, and are living in Canada',
  learnMoreAboutGis: `<a className="underline text-default-text" href="${apiEn.links.overview.gis.url}" target="_blank">Learn more about the Guaranteed Income Supplement</a>`,
  alwDefinitionText:
    'A non-taxable benefit available to low-income individuals aged 60 to 64, who are living in Canada, and whose spouse or common-law partner receives the Guaranteed Income Supplement',
  learnMoreAboutAlw: `<a className="underline text-default-text" href="${apiEn.links.overview.alw.url}" target="_blank">Learn more about the Allowance</a>`,
  afsDefinitionText:
    'A non-taxable benefit available to low-income individuals aged 60 to 64, who are living in Canada, and whose spouse or common-law partner has passed away',
  learnMoreAboutAfs: `<a className="underline text-default-text" href="${apiEn.links.overview.afs.url}" target="_blank">Learn more about the Allowance for the Survivor</a>`,
  notIncludeCPP:
    'This estimator tool does not include the Canada Pension Plan (CPP) retirement pension.',
  learnMoreAboutCpp: `<a className="underline text-default-text" href="${apiEn.links.cpp.url}" target="_blank">Learn more about the Canada Pension Plan</a>`,
  aboutResultText: 'About the results',
  resultDefinition: `The results are estimates and not a final decision. For a more accurate assessment of your estimated benefits amount, please <a className='text-default-text underline' target='_blank' href='https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'>contact Service Canada</a>. The results are not financial advice.`,
  privacyHeading: 'Privacy',
  privacyDefinition:
    'We protect your information under the <em><a className="underline text-default-text" href="https://laws-lois.justice.gc.ca/eng/acts/P-21/index.html" target="_blank">Privacy Act</a></em>. The estimator does not collect information that can identify you. Your anonymous results may be used for research purposes.',
  homePageP3:
    'The Old Age Security pension is a monthly payment you can get if you are 65 and older. In most cases, Service Canada will be able to automatically enroll you. In other cases, you will have to apply. Service Canada will inform you if you have been automatically enrolled.',
  homePageP4:
    'The Guaranteed Income Supplement is a monthly non-taxable benefit for Old Age Security pension recipients aged 65 and older who have a low income and are living in Canada.',
  homePageP5:
    'The Allowance is a monthly benefit available to low-income individuals aged 60 to 64 whose spouse or common-law partner receives the Guaranteed Income Supplement.',
  homePageP6:
    'The Allowance for the Survivor is a monthly benefit available to individuals aged 60 to 64 who have a low income, who are living in Canada, and whose spouse or common-law partner has passed away.',
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
  pageNotFound: 'Page not found',
  warningText: 'warning',
  category: apiEn.category,

  resultsPage: {
    header: 'Table of estimated monthly amounts',
    onThisPage: 'On This Page:',
    tableHeader1: 'Benefit',
    tableHeader2: 'Estimated monthly amount (CAD)',
    tableTotalAmount: 'Total',
    whatYouToldUs: 'What you told us',
    youMayBeEligible: 'You may be eligible at this time',
    youAreNotEligible: 'You likely are not eligible at this time',
    basedOnYourInfoEligible:
      'Based on your information, you may be eligible for:',
    basedOnYourInfoAndIncomeEligible:
      'Depending on your income and based on your information, you may be eligible for:',
    basedOnYourInfoNotEligible: `Based on your information, you may not be eligible for any old age benefits. See below, or contact ${generateLink(
      apiEn.links.SC
    )} for more information.`,
    yourEstimatedTotal: 'Your estimated monthly total is ',
    basedOnYourInfoTotal:
      "Based on the information you've provided, you should expect to receive around {AMOUNT} per month.",
    basedOnYourInfoAndIncomeTotal:
      "Based on the information you've provided, you should expect to receive around {AMOUNT} per month. However, this amount may be lower or higher depending on your income.",
    nextSteps: 'Next steps for benefits you may be eligible for',
    youMayNotBeEligible: 'Benefits you may not be eligible for',
    noAnswersFound: 'No answers found',
    noBenefitsFound: 'No benefits found',
    edit: 'Edit',
    info: 'info',
    note: 'note',
    link: 'link',
  },
  resultsQuestions: apiEn.questionShortText,
  resultsEditAriaLabels: apiEn.questionAriaLabel,
  modifyAnswers: 'Modify answers',
  errors: {
    empty: 'This information is required',
  },
  validationErrors: {
    [ValidationErrors.incomeBelowZero]: 'Your income must be above zero.',
    [ValidationErrors.partnerIncomeBelowZero]:
      "Your partner's income must be above zero.",
    [ValidationErrors.incomeTooHigh]:
      'Your annual income must be less than {OAS_MAX_INCOME} to receive any of the benefits covered by this tool.',
    [ValidationErrors.partnerIncomeTooHigh]:
      "The sum of you and your partner's annual income must be less than {OAS_MAX_INCOME} to receive any of the benefits covered by this tool.",
    [ValidationErrors.ageUnder18]:
      'You must be at least 60 years old to receive Canadian old age benefits.',
    [ValidationErrors.partnerAgeUnder18]:
      "Your partner's age must be over 18 to be able to use this tool.",
    [ValidationErrors.ageOver150]: 'Your age should be less than 150.',
    [ValidationErrors.partnerAgeOver150]:
      "Your partner's age should be less than 150.",
    [ValidationErrors.oasAge65to70]: 'You must enter an age between 65 and 70.',
    [ValidationErrors.yearsInCanadaNotEnough]:
      'The number of years you have lived in Canada is not enough to receive any old age benefits.',
    [ValidationErrors.yearsInCanadaMinusAge]:
      'The number of years you have lived in Canada should be no more than your age minus 18.',
    [ValidationErrors.partnerYearsInCanadaMinusAge]:
      "Your partner's number of years in Canada should be no more than their age minus 18.",
    [ValidationErrors.maritalUnavailable]:
      'You have indicated a marital status that is not covered by this tool. For further help, please contact {LINK_SERVICE_CANADA}.',
    [ValidationErrors.legalUnavailable]:
      'You have indicated a legal status that is not covered by this tool. For further help, please contact {LINK_SERVICE_CANADA}.',
    [ValidationErrors.socialCountryUnavailable]:
      'You have indicated that you have lived in a country with a social security agreement with Canada, but have not lived in Canada for a number of years supported by this tool. For further help, please contact {LINK_SERVICE_CANADA}.',
  },
  unableToProceed: 'Unable to proceed',
  yes: 'Yes',
  no: 'No',
  unavailable: 'unavailable',

  selectText: {
    maritalStatus: 'Select a marital status',
    livingCountry: 'Select a country',
    partnerLivingCountry: 'Select a country',
    default: 'Select from',
  },

  tooltip: {
    moreInformation: 'More information',
  },
}

export default en
