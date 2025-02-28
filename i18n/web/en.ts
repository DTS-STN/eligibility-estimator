import { WebTranslations } from '.'
import {
  ISOLanguage,
  Language,
  ValidationErrors,
} from '../../utils/api/definitions/enums'
import {
  generateLink,
  getMaxYear,
  getMaximumIncomeThreshold,
} from '../../utils/api/definitions/textReplacementRules'
import apiEn from '../api/en'

const en: WebTranslations = {
  _language: Language.EN,
  ISOlang: ISOLanguage.EN,

  skipToMain: 'Skip to main content',
  skipToAbout: "Skip to 'About government'",
  switchToBasic: 'Switch to basic HTML version',
  globalHeader: 'Global header',
  testSiteNotice: 'Test site notice',
  officialSiteNavigation: 'Canada.ca official site',
  languageSelection: 'Language selection',
  logoAltText: 'Government of Canada',
  oas: 'Old Age Security pension',
  gis: 'Guaranteed Income Supplement',
  alw: 'Allowance',
  alws: 'Allowance for the Survivor',
  testSiteTitle: 'TEST SITE',
  testSiteHeader:
    'You cannot apply for services or benefits through this test site. Parts of this site may not work and will change.',
  otherLang: 'Français',
  otherLangCode: 'FR',
  creator: 'Employment and Social Development Canada',
  search: 'Search Canada.ca',
  aboutGovernment: 'About Government',
  footerTitle: 'Government of Canada',
  aboutSite: 'About this site',
  // Main footer links
  landscapeLinks: {
    contacts: {
      text: 'All contacts',
      link: 'https://www.canada.ca/en/contact.html',
    },
    departments: {
      text: 'Departments and agencies',
      link: 'https://www.canada.ca/en/government/dept.html',
    },
    about: {
      text: 'About government',
      link: 'https://www.canada.ca/en/government/system.html',
    },
    jobs: { text: 'Jobs', link: 'https://www.canada.ca/en/services/jobs.html' },
    taxes: {
      text: 'Taxes',
      link: 'https://www.canada.ca/en/services/taxes.html',
    },
    canadaAndWorld: {
      text: 'Canada and the world',
      link: 'https://international.gc.ca/world-monde/index.aspx?lang=eng',
    },
    immigration: {
      text: 'Immigration and citizenship',
      link: 'https://www.canada.ca/en/services/immigration-citizenship.html',
    },
    environment: {
      text: 'Environment and natural resources',
      link: 'https://www.canada.ca/en/services/environment.html',
    },
    finance: {
      text: 'Money and finance',
      link: 'https://www.canada.ca/en/services/finance.html',
    },
    travel: { text: 'Travel and tourism', link: 'https://travel.gc.ca/' },
    nationalSecurity: {
      text: 'National security and defence',
      link: 'https://www.canada.ca/en/services/defence.html',
    },
    innovation: {
      text: 'Science and innovation',
      link: 'https://www.canada.ca/en/services/science.html',
    },
    business: {
      text: 'Business',
      link: 'https://www.canada.ca/en/services/business.html',
    },
    culture: {
      text: 'Culture, history and sport',
      link: 'https://www.canada.ca/en/services/culture.html',
    },
    indigenous: {
      text: 'Indigenous peoples',
      link: 'https://www.canada.ca/en/services/indigenous-peoples.html',
    },
    benefit: {
      text: 'Benefits',
      link: 'https://www.canada.ca/en/services/benefits.html',
    },
    policing: {
      text: 'Policing, justice and emergencies',
      link: 'https://www.canada.ca/en/services/policing.html',
    },
    veterans: {
      text: 'Veterans and military',
      link: 'https://www.canada.ca/en/services/veterans-military.html',
    },
    health: {
      text: 'Health',
      link: 'https://www.canada.ca/en/services/health.html',
    },
    transport: {
      text: 'Transport and infrastructure',
      link: 'https://www.canada.ca/en/services/transport.html',
    },
    youth: {
      text: 'Youth',
      link: 'https://www.canada.ca/en/services/youth.html',
    },
  },
  // Subfooter brand links
  brandLinks: {
    socialMedia: {
      text: 'Social media',
      link: 'https://www.canada.ca/en/social.html',
    },
    mobile: {
      text: 'Mobile applications',
      link: 'https://www.canada.ca/en/mobile.html',
    },
    about: {
      text: 'About Canada.ca',
      link: 'https://www.canada.ca/en/government/about.html',
    },
    terms: {
      text: 'Terms and conditions',
      link: 'https://www.canada.ca/en/transparency/terms.html',
    },
    privacy: {
      text: 'Privacy',
      link: 'https://www.canada.ca/en/transparency/privacy.html',
    },
  },
  woodmark: 'Symbol of the Government of Canada',
  // Error page
  errorPageHeadingTitle404: 'We couldn’t find that web page',
  errorPageHeadingTitle500: "We're having a problem with that page",
  errorPageHeadingTitle503: 'This service is currently not available',
  errorPageErrorText404:
    "We're sorry you ended up here. Sometimes a page gets moved or deleted, but hopefully we can help you find what you're looking for.",
  errorPageErrorText500:
    "We expect the problem to be fixed shortly. It's not your computer or Internet connection but a problem with our website's server. We apologize for the inconvenience.",
  errorPageErrorText503:
    'The web server that provides this service is currently overloaded, or may be temporarily down for maintenance. We apologize for the inconvenience. ',
  errorPageNextText: ' What next?',
  errorTextLinkCommon: '• Go to the ',
  errorTextLinkCommon_2: ' Service Canada home page',
  errorTextLinkCommonLink:
    'https://www.canada.ca/en/employment-social-development/corporate/portfolio/service-canada.html',
  errorAuthTextLinkCommon: '• Go to your ',
  errorAuthTextLinkCommon_2: 'My Service Canada Account dashboard',
  errorAuthTextLinkCommonLink:
    'https://www.canada.ca/en/employment-social-development/services/my-account.html',
  error500TextLink: '• Try refreshing the page or try again later',
  error503TextLink: '• Try again later',
  errorPageType: 'Error',
  //
  // alpha service canada labs breadcrumbs
  breadcrumb1aTitle: 'Canada.ca',
  breadcrumb1aURL: 'https://www.canada.ca/en',
  breadcrumb2aTitle: 'Service Canada Labs',
  breadcrumb2aURL:
    'https://alpha.service.canada.ca/en/projects/oas-benefits-estimator',
  //
  // Production Canada.ca breadcrumbs
  breadcrumb1Title: 'Canada.ca',
  breadcrumb1URL: 'https://www.canada.ca/en',
  breadcrumb2Title: 'Benefits',
  breadcrumb2URL: 'https://www.canada.ca/en/services/benefits.html',
  breadcrumb3Title: 'Public pensions',
  breadcrumb3URL:
    'https://www.canada.ca/en/services/benefits/publicpensions.html',
  breadcrumb4Title: 'Old Age Security',
  breadcrumb4URL:
    'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html',
  breadcrumb5Title: 'Payment amounts',
  breadcrumb5URL:
    'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
  breadcrumb6Title: 'Estimator',
  breadcrumb6URL: '/en',
  breadcrumb7Title: 'Questions',
  breadcrumb7URL: '/en/questions',
  retirementUrl: 'https://www.canada.ca/en/services/retirement.html',
  //
  title: 'Old Age Benefits Estimator',
  introPageTitle: 'Old Age Security Benefits Estimator',
  questionPageTitle: 'Old Age Security Benefits Estimator: Questions',
  resultPageTitle: 'Old Age Security Benefits Estimator: Results',
  menuTitle: 'Service Canada',
  clear: 'Clear',
  back: 'Back',
  faq: 'Frequently Asked Questions',
  nextStep: 'Next step',
  getEstimate: 'Estimate my benefits',
  required: '(required)',
  workInProgress: 'This estimator is a work in progress',
  workInProgressBody:
    'You can help improve it by giving your <a class="underline text-default-text generatedLink" href="https://srv217.services.gc.ca/ihst4/Intro.aspx?cid=74938e05-8e91-42a9-8e9d-29daf79f6fe0&lc=eng" target="_blank">feedback</a>.',
  homePageP1:
    'Use this estimator to find out how much money you could get from Old Age Security benefits. This is not an application for benefits.',
  homePageHeader1: 'Who these benefits are for',
  youMayBeEligible: 'You may be able to receive Old Age Security benefits if:',
  atLeast60: "you're at least 60 years old",
  haveNetIncomeLess: `your net income is less than ${getMaximumIncomeThreshold(
    Language.EN
  )}`,
  headerWhatToKnow: 'Before you begin',
  pleaseNodeText:
    'Please note that this is an estimator and not an application for benefits.',
  legaCitizenlText:
    'To be eligible for Old Age Security benefits, you must be a citizen or legal resident of Canada.',
  estimatorIncludeQuestionText:
    'The estimator will ask you questions about your:',
  ageText: 'age',
  netIncomeText: 'net income',
  legalStatusText: 'legal status',
  residenceHistoryText: 'residence history',
  maritalStatusText: 'marital status',
  partnerText: 'spouse or common-law partner, if applicable',
  timeToCompleteText: 'Time to complete',
  startBenefitsEstimator: 'Start benefits estimator',
  estimatorTimeEstimate: 'It will take about 5 to 10 minutes to complete.',
  overviewDisclaimer:
    "<strong>This tool gives an estimate only</strong>. It doesn't guarantee that you'll be eligible or that you'll receive the amount estimated.",
  whatBenefitsIncluded: 'Benefits included in the estimator',
  inflationInfo: `This estimator uses January to March&nbsp;2025 benefit rates. Future benefit amounts may be higher due to inflation.`,
  notIncludeCPP:
    'This estimator does not include the Canada Pension Plan retirement pension.',
  learnMoreAboutCpp: `<a className="underline text-default-text" href="${apiEn.links.cpp.url}" target="_blank">Learn more about the Canada Pension Plan</a>`,
  aboutResultText: 'About the results',
  resultDefinition: `The results are not financial advice and are subject to change. For a more accurate assessment of your estimated benefits amount, please <a className='text-default-text underline' target='_blank' aria-label='opens a new tab'href='https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'>contact us</a>.`,
  privacyHeading: 'Privacy',
  privacyDefinition:
    'We don’t collect the information you enter in the estimator.',
  usingSharedDevice: 'If using a shared or public device',
  usingSharedDeviceInfo:
    'Others who use this device may be able to see your answers. To avoid this, clear your Internet browser history after using the estimator.',
  homePageP3:
    "The Old Age Security pension is a monthly payment you can get if you're 65 and older. In most cases, Service Canada will be able to automatically enroll you. In other cases, you will have to apply. Service Canada will inform you if you have been automatically enrolled.",
  homePageP4:
    'The Guaranteed Income Supplement is a monthly non-taxable benefit for Old Age Security pension recipients aged 65 and older who have a low income and are living in Canada.',
  homePageP5:
    'The Allowance is a monthly benefit available to low-income individuals aged 60 to 64 whose spouse or common-law partner receives the Guaranteed Income Supplement.',
  homePageP6:
    'The Allowance for the Survivor is a monthly benefit available to individuals aged 60 to 64 who have a low income, who are living in Canada, and whose spouse or common-law partner has passed away.',
  dateModified: 'Date modified:',
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
  infoText: 'information',
  category: apiEn.category,
  errorBoxTitle: 'The information could not be submitted because ',
  useEstimatorIf:
    'Use the estimator to see if you meet all eligibility criteria.',
  stepper: {
    yourInfo: 'Your information',
    partnerInfo: `Partner's information`,
    partnerInfoHelp: `Since you have a partner, we'll also need their information to estimate your benefits.`,
    previousStep: 'Previous',
    nextStep: 'Next',
    getEstimate: 'Estimate my benefits',
    navWarning: `Note: Please navigate using the "Previous" and "Next" buttons. Using your browser's navigation buttons is not recommended.`,
  },
  datePicker: {
    month: 'Month',
    year: 'Year',
    day: 'Day',
    months: {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December',
    },
  },
  meta: {
    homeDescription:
      'Find out how much you could receive from the Old Age Security pension, the Guaranteed Income Supplement, the Allowance and the Allowance for the Survivor.',
    homeShortDescription:
      'Find out how much you could receive from Canadian Old Age Security benefits.',
    homeKeywords:
      'old age pension, old age security, calculating GIS, OAS amount, OAS payments, estimate OAS, benefits, personal finance, widow’s pension, retirement planning',
    author: 'Service Canada',
    homeSubject:
      'EC Economics and Industry;Allowances;Benefits;Survivor benefits;Finance;Personal finance;Income;Pensions;Public pensions,PE Persons;Adults;Seniors,So Society and Culture;Old age',
  },
  resultsPage: {
    moreInformation: 'More information on ',
    yourMonEstimateHeading: 'Your monthly estimate',
    changeInSituation: 'Changes in your situation may impact your results.',
    youEstimateMayChange: 'Your estimate may change over time based on',
    yourEstimateMayChangeList: 'Your estimate may change over time based on:',
    basedYourAge: 'your age',
    basedYourPartner: 'the benefits your partner receives',
    ifYouChoseToDefer:
      'If you choose to defer your pension, your future estimate will be higher.',
    header: 'Table of estimated monthly amounts',
    general:
      'This is only an estimate of your monthly payments. Amounts use <strong>current rates</strong> and will increase with the cost of living. <p class="mt-4">You must be a citizen or legal resident of Canada to receive these benefits.</p>',
    onThisPage: 'On this page',
    tableHeader1: 'Benefit',
    tableHeader2: 'Estimated monthly amount (CAD)',
    tableTotalAmount: 'Total',
    whatYouToldUs: 'What you told us',
    youMayBeEligible: 'You may be eligible',
    youAreNotEligible: "You're likely not eligible at this time",
    partnerNotEligible: 'Your partner is likely not eligible at this time',
    basedOnYourInfoEligible:
      'Based on your information, you may be eligible for the:',
    basedOnYourInfoAndIncomeEligible:
      'Depending on your income and based on your information, you may be eligible for:',
    basedOnYourInfoNotEligible: `Based on what you told us, you may not be eligible for any Old Age Security benefits. See below, or ${generateLink(
      apiEn.links.SC
    )} for more information.`,
    basedOnPartnerInfoNotEligible: `Based on what you told us, your partner may not be eligible for any Old Age Security benefits. See below, or ${generateLink(
      apiEn.links.SC
    )} for more information.`,
    yourEstimatedTotal: ' Your estimate',
    partnerEstimatedTotal: " Your partner's estimate",
    yourEstimatedNoIncome: " You're likely eligible",
    basedOnYourInfoTotal: 'You could be eligible to receive:',
    basedOnYourInfoAndIncomeTotal: 'You could be eligible to receive:',
    basedOnPartnerInfoTotal: 'Your partner could be eligible to receive:',
    basedOnPartnerInfoAndIncomeTotal:
      'Your partner could be eligible to receive:',
    total: 'Your total monthly amount is ',
    futureTotal: 'Your total monthly amount will be ',
    partnerTotal: 'Their total monthly amount is ',
    futurePartnerTotal: 'Their total monthly amount will be ',
    ifIncomeNotProvided:
      'However, this amount may be lower or higher depending on your income.',
    nextSteps: 'Next steps for benefits you may be eligible for',
    youMayNotBeEligible: 'Benefits you may not be eligible for',
    noAnswersFound: 'No answers found',
    noBenefitsFound: 'No benefits found',
    edit: 'Edit',
    info: 'info',
    note: 'note',
    link: 'link',
    nextStepTitle: 'Next steps',
    nextStepGis:
      'You can apply for the Guaranteed Income Supplement when you apply for the Old Age Security pension.',
    CTATitle: 'Learn about your retirement options',
    CTABody:
      'Find out about public pensions, when to collect them and tips to consider for your retirement income.',
    CTAButton: 'Visit the Retirement Hub',
    month: 'month',
    futureEligible: " You'll likely be eligible",
    partnerFutureEligible: ' Your partner will likely be eligible',
    toReceive: "you'll likely be eligible to receive:",
    partnerToReceive: 'your partner will likely be eligible to receive:',
    theyToReceive: 'they will likely be eligible to receive:',
    psdTitle: 'Change your pension start date',
    psdDescription:
      'You can delay until age 70. For each month you wait, your pension increases by 0.6%.',
    psdUpdateBtn: 'Update estimate',
  },
  resultsQuestions: apiEn.questionShortText,
  resultsEditAriaLabels: apiEn.questionAriaLabel,
  modifyAnswers: 'Edit answers',
  errors: {
    empty: 'This information is required',
  },
  validationErrors: {
    [ValidationErrors.invalidAge]: `Please enter a year between 1900 and ${getMaxYear()}.`,
    [ValidationErrors.receiveOASEmpty]:
      'Please indicate if you receive the Old Age Security pension.',
    [ValidationErrors.providePartnerIncomeEmpty]:
      "Please indicate if you're able to provide your partner's income.",
    [ValidationErrors.partnerIncomeEmpty]:
      "Please enter your partner's expected net income.",
    [ValidationErrors.partnerIncomeEmptyReceiveOAS]:
      "Please enter your partner's net income.",
    [ValidationErrors.incomeWorkEmpty]:
      'Please enter your work or self-employment income.',
    [ValidationErrors.incomeWorkGreaterThanNetIncome]:
      'This amount can’t be higher than your annual net income.',
    [ValidationErrors.partnerIncomeWorkEmpty]:
      "Please enter your partner's work or self-employment income.",
    [ValidationErrors.partnerIncomeWorkGreaterThanNetIncome]:
      'This amount can’t be higher than your partner’s annual net income.',
    [ValidationErrors.partnerYearsSince18Empty]:
      "Please enter a number no higher than your partner's age minus 18.",
    [ValidationErrors.maritalStatusEmpty]: 'Please select a marital status.',
    [ValidationErrors.yearsInCanadaMinusAge]:
      'Please enter a number no higher than your age minus 18.',
    [ValidationErrors.yearsInCanadaMinusDeferred]:
      'This number must be at least 10 at the time you deferred your pension.',
    [ValidationErrors.yearsNotInCanadaMinusDeferred]:
      'This number must be at least 20 at the time you deferred your pension.',
    [ValidationErrors.partnerResCanadaNotEnough10]:
      'This number must be at least 10 because your partner receives the Old Age Security pension.',
    [ValidationErrors.partnerResCanadaNotEnough20]:
      'This number must be at least 20 because your partner receives the Old Age Security pension outside Canada.',
    [ValidationErrors.legalStatusNotSelected]:
      'Please indicate if you have legal status in Canada.',
    [ValidationErrors.partnerLegalStatusNotSelected]:
      'Please indicate if your partner has legal status in Canada.',
    [ValidationErrors.partnerBenefitStatusEmpty]:
      'Please indicate if your partner receives the Old Age Security pension.',
    [ValidationErrors.onlyInCanadaEmpty]:
      "Please indicate if you've only lived in Canada.",
    [ValidationErrors.partnerOnlyInCanadaEmpty]:
      'Please indicate if your partner has only lived in Canada.',
    [ValidationErrors.socialCountryEmpty]:
      "Please indicate if you've ever lived in a country with an established social security agreement with Canada.",
    [ValidationErrors.partnerSocialCountryEmpty]:
      'Please indicate if your partner has ever lived in a country with an established social security agreement with Canada.',
    [ValidationErrors.invSeparatedEmpty]:
      "Please indicate if you're involuntarily separated.",
    [ValidationErrors.provideIncomeEmpty]:
      "Please indicate if you're able to provide your income.",
    [ValidationErrors.incomeEmpty]: 'Please enter your expected net income.',
    [ValidationErrors.incomeEmptyReceiveOAS]: 'Please enter your net income.',
    [ValidationErrors.oasDeferEmpty]:
      "Please select when you'd like to start receiving the OAS pension.",
    [ValidationErrors.incomeBelowZero]: 'Your income must be above zero.',
    [ValidationErrors.partnerIncomeBelowZero]:
      "Your partner's income must be above zero.",
    [ValidationErrors.incomeTooHigh]:
      'Your annual income must be less than {OAS_MAX_INCOME} to receive any of the benefits covered by this tool.',
    [ValidationErrors.partnerIncomeTooHigh]:
      "The sum of you and your partner's annual income must be less than {OAS_MAX_INCOME} to receive any of the benefits covered by this tool.",
    [ValidationErrors.ageUnder18]: 'You must be at least 18.',
    [ValidationErrors.partnerAgeUnder18]: 'Your partner must be at least 18.',
    [ValidationErrors.ageOver150]: 'Your age should be less than 150.',
    [ValidationErrors.partnerAgeOver150]:
      "Your partner's age should be less than 150.",
    [ValidationErrors.oasAge65to70]: 'Please enter an age between 65 and 70.',
    [ValidationErrors.yearsInCanadaNotEnough10]:
      'You need to have lived in Canada for at least 10&nbsp;years to receive any of the benefits covered by this tool.',
    [ValidationErrors.yearsInCanadaNotEnough20]:
      'You need to have at least 20&nbsp;years of Canadian residence to receive the Old Age Security pension outside Canada.',
    [ValidationErrors.partnerYearsInCanadaMinusAge]:
      "Your partner's number of years in Canada should be no more than their age minus 18.",
    [ValidationErrors.maritalUnavailable]:
      'You have indicated a marital status that is not covered by this tool. For further help, please {LINK_SERVICE_CANADA}.',
    [ValidationErrors.legalUnavailable]:
      'You need to have legal status in Canada to receive any of the benefits covered by this tool. For help, please {LINK_SERVICE_CANADA}.',
    [ValidationErrors.socialCountryUnavailable10]:
      "This tool can't estimate your benefits because you have lived in Canada for less than 10&nbsp;years. To find out if you're eligible for old age benefits, please {LINK_SERVICE_CANADA}.",
    [ValidationErrors.socialCountryUnavailable20]:
      'You need to have at least 20&nbsp;years of Canadian residence to receive the Old Age Security pension outside Canada. Since you lived in a country with a social security agreement with Canada, {LINK_SERVICE_CANADA} to find out if you’re eligible.',
  },
  unableToProceed: 'We can’t estimate your benefits',
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
  openNewTab: 'Opens in a new tab',
  partnerIsNotEligible: 'Your partner is not eligible',
  partnerLegalStatusNotEligible:
    "Your partner's legal status indicates that they are not receiving the Old Age Security pension.",
  partnerYearsLivingCanadaNotEligible:
    'Your partner has not lived in Canada long enough to receive the Old Age Security pension.',
  partnerInformation: "Partner's information",
  partnerInformationDescription:
    "Since you have a partner, we'll also need their information to estimate your benefits.",

  duration: {
    months: 'Months',
    years: 'Years',
  },
  incomeLabel:
    'What will be your annual net income when you start receiving your benefits?',
  incomeHintTitle: 'What is included as income?',
  incomeHintText:
    '<p class="text-multi-neutrals-grey90a">Add all types of income, such as:</p> \
      <ul class="list-disc" style="margin-left:36px;"> \
      <li class="text-multi-neutrals-grey90a">private and public pensions (including retirement and disability)</li> \
      <li class="text-multi-neutrals-grey90a">benefits (including <dfn><abbr title="Employment Insurance">EI</abbr></dfn> and worker’s compensation)</li> \
      <li class="text-multi-neutrals-grey90a">salaries</li> \
      <li class="text-multi-neutrals-grey90a">rental income</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Registered Retirement Savings Plans">RRSP</abbr></dfn> withdrawals</li> \
      <li class="text-multi-neutrals-grey90a">taxable interest, dividends and capital gains</li> \
      </ul> \
      <p class="mt-4 text-multi-neutrals-grey90a">Don’t include:</p> \
      <ul class="list-disc" style="margin-left:36px;"> \
      <li class="text-multi-neutrals-grey90a">Old Age Security pension, Guaranteed Income Supplement, Allowance or Allowance for the Survivor payments</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Registered Disability Savings Plan">RDSP</abbr></dfn> payments</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Goods and services tax/Harmonized sales tax">GST/HST</abbr></dfn> credit payments</li> \
      </ul>',
  incomeLabelReceiveOAS: 'What was your annual net income in',
  incomeHintTitleReceiveOAS: 'What is included as income?',
  incomeHintTextReceiveOAS:
    '<p class="text-multi-neutrals-grey90a">Add all types of income, such as:</p> \
      <ul class="list-disc" style="margin-left:36px;"> \
      <li class="text-multi-neutrals-grey90a">private and public pensions (including retirement and disability)</li> \
      <li class="text-multi-neutrals-grey90a">benefits (including <dfn><abbr title="Employment Insurance">EI</abbr></dfn> and worker’s compensation)</li> \
      <li class="text-multi-neutrals-grey90a">salaries</li> \
      <li class="text-multi-neutrals-grey90a">rental income</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Registered Retirement Savings Plans">RRSP</abbr></dfn> withdrawals</li> \
      <li class="text-multi-neutrals-grey90a">taxable interest, dividends and capital gains</li> \
      </ul> \
      <p class="mt-4 text-multi-neutrals-grey90a">Don’t include:</p> \
      <ul class="list-disc" style="margin-left:36px;"> \
      <li class="text-multi-neutrals-grey90a">Old Age Security pension, Guaranteed Income Supplement, Allowance or Allowance for the Survivor payments</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Registered Disability Savings Plan">RDSP</abbr></dfn> payments</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Goods and services tax/Harmonized sales tax">GST/HST</abbr></dfn> credit payments</li> \
      </ul>',
  partnerIncomeLabel:
    'What will be your partner’s annual net income when you start receiving your benefits?',
  partnerIncomeHintTitle: 'What is included as income?',
  partnerIncomeHintText:
    '<p class="text-multi-neutrals-grey90a">Add all types of income, such as:</p> \
      <ul class="list-disc" style="margin-left:36px;"> \
      <li class="text-multi-neutrals-grey90a">private and public pensions (including retirement and disability)</li> \
      <li class="text-multi-neutrals-grey90a">benefits (including <dfn><abbr title="Employment Insurance">EI</abbr></dfn> and worker’s compensation)</li> \
      <li class="text-multi-neutrals-grey90a">salaries</li> \
      <li class="text-multi-neutrals-grey90a">rental income</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Registered Retirement Savings Plans">RRSP</abbr></dfn> withdrawals</li> \
      <li class="text-multi-neutrals-grey90a">taxable interest, dividends and capital gains</li> \
      </ul> \
      <p class="mt-4 text-multi-neutrals-grey90a">Don’t include:</p> \
      <ul class="list-disc" style="margin-left:36px;"> \
      <li class="text-multi-neutrals-grey90a">Old Age Security pension, Guaranteed Income Supplement, Allowance or Allowance for the Survivor payments</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Registered Disability Savings Plan">RDSP</abbr></dfn> payments</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Goods and services tax/Harmonized sales tax">GST/HST</abbr></dfn> credit payments</li> \
      </ul>',
  partnerIncomeLabelReceiveOAS: 'What was your partner’s annual net income in',
  partnerIncomeHintTitleReceiveOAS: 'What is included as income?',
  partnerIncomeHintTextReceiveOAS:
    '<p class="text-multi-neutrals-grey90a">Add all types of income, such as:</p> \
      <ul class="list-disc" style="margin-left:36px;"> \
      <li class="text-multi-neutrals-grey90a">private and public pensions (including retirement and disability)</li> \
      <li class="text-multi-neutrals-grey90a">benefits (including <dfn><abbr title="Employment Insurance">EI</abbr></dfn> and worker’s compensation)</li> \
      <li class="text-multi-neutrals-grey90a">salaries</li> \
      <li class="text-multi-neutrals-grey90a">rental income</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Registered Retirement Savings Plans">RRSP</abbr></dfn> withdrawals</li> \
      <li class="text-multi-neutrals-grey90a">taxable interest, dividends and capital gains</li> \
      </ul> \
      <p class="mt-4 text-multi-neutrals-grey90a">Don’t include:</p> \
      <ul class="list-disc" style="margin-left:36px;"> \
      <li class="text-multi-neutrals-grey90a">Old Age Security pension, Guaranteed Income Supplement, Allowance or Allowance for the Survivor payments</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Registered Disability Savings Plan">RDSP</abbr></dfn> payments</li> \
      <li class="text-multi-neutrals-grey90a"><dfn><abbr title="Goods and services tax/Harmonized sales tax">GST/HST</abbr></dfn> credit payments</li> \
      </ul>',
  incomeHelpText:
    '<p>Your income tax return will be used when you apply. For now, estimate what you could be receiving per year.</p>',
  incomeHelpTextReceiveOAS:
    "<p>From January to June, your benefits are based on income from 2 years ago. From July to December, they're based on last year's income.</p> \
      <p style='margin-top: 16px;'>If you retired this year and your income changed significantly, enter this year's income.</p>",
  partnerIncomeHelpText:
    '<p>Their income tax return will be used when you apply. For now, estimate what they could be receiving per year.</p>',
  partnerIncomeHelpTextReceiveOAS:
    "<p>From January to June, your benefits are based on income from 2 years ago. From July to December, they're based on last year's income.</p>",
}

export default en
