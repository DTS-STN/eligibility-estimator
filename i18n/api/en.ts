import {
  FieldCategory,
  Language,
  Locale,
} from '../../utils/api/definitions/enums'
import { livingCountry } from './countries/en'
import { Translations } from './index'
import { links } from './links/en'

const en: Translations = {
  _language: Language.EN,
  _locale: Locale.EN,
  benefit: {
    oas: 'Old Age Security (OAS)',
    gis: 'Guaranteed Income Supplement (GIS)',
    alw: 'Allowance',
    afs: 'Allowance for the Survivor',
  },
  category: {
    [FieldCategory.PERSONAL_INFORMATION]: 'Your information',
    [FieldCategory.OAS_DEFERRAL]: 'OAS deferral',
    [FieldCategory.PARTNER_INFORMATION]: "Your partner's information",
  },
  result: {
    eligible: 'Eligible',
    ineligible: 'Not eligible',
    unavailable: 'Unavailable',
    moreInfo: 'Need more information...',
    invalid: 'Request is invalid!',
  },
  question: {
    income: 'What is your current annual net income in Canadian dollars?',
    age: 'What is your current age?',
    oasAge: 'At what age would you like to start receiving OAS?',
    maritalStatus: 'What is your current marital status?',
    livingCountry: 'What country are you currently living in?',
    legalStatus: 'What is your current legal status in Canada?',
    canadaWholeLife: 'Since the age of 18, have you only lived in Canada?',
    yearsInCanadaSince18:
      'Since the age of 18, how many years have you lived in Canada?',
    everLivedSocialCountry:
      'Have you ever lived in a country with an established {LINK_SOCIAL_AGREEMENT} with Canada?',
    partnerBenefitStatus: 'Which of the following applies to your partner?',
    partnerIncome:
      "What is your partner's annual net income in Canadian dollars?",
    partnerAge: "What is your partner's current age?",
    partnerLivingCountry: 'What country is your partner currently living in?',
    partnerLegalStatus: "What is your partner's current legal status?",
    partnerCanadaWholeLife:
      'Since the age of 18, has your partner only lived in Canada?',
    partnerYearsInCanadaSince18:
      'Since the age of 18, how many years has your partner lived in Canada?',
    partnerEverLivedSocialCountry:
      'Has your partner ever lived in a country with an established {LINK_SOCIAL_AGREEMENT} with Canada?',
  },
  questionOptions: {
    legalStatus: [
      { key: 'canadianCitizen', text: 'Canadian citizen' },
      {
        key: 'permanentResident',
        text: 'Permanent resident or landed immigrant (non-sponsored)',
      },
      {
        key: 'sponsored',
        text: 'Permanent resident or landed immigrant (sponsored)',
      },
      { key: 'indianStatus', text: 'Indian status or status card' },
      {
        key: 'other',
        text: 'Other (for example, temporary resident, student, temporary worker)',
      },
    ],
    maritalStatus: [
      { key: 'single', text: 'Single' },
      { key: 'married', text: 'Married' },
      { key: 'commonLaw', text: 'Common-law' },
      { key: 'widowed', text: 'Surviving Partner/Widowed' },
      { key: 'divorced', text: 'Divorced' },
      { key: 'separated', text: 'Separated' },
    ],
    partnerBenefitStatus: [
      { key: 'oas', text: 'My partner receives an Old Age Security pension' },
      {
        key: 'oasGis',
        text: 'My partner receives an Old Age Security pension and the Guaranteed Income Supplement',
      },
      { key: 'alw', text: 'My partner receives the Allowance' },
      { key: 'none', text: 'None of the above' },
      { key: 'helpMe', text: 'Help me find out' },
    ],
    livingCountry,
  },
  detail: {
    eligible: 'You are likely eligible for this benefit.',
    eligibleOas65to69:
      'You are likely eligible for this benefit. To learn more about your option to delay your first payment, {LINK_OAS_DEFER}.',
    eligibleEntitlementUnavailable:
      'You are likely eligible for this benefit, however an entitlement estimation is unavailable. You should contact {LINK_SERVICE_CANADA} for more information about your payment amounts.',
    eligiblePartialOas:
      'You are likely eligible to a partial Old Age Security pension.',
    eligiblePartialOas65to69:
      'You are likely eligible to a partial Old Age Security pension. To learn more about your option to delay your first payment, {LINK_OAS_DEFER}.',
    eligibleWhen60ApplyNow:
      'You will likely be eligible when you turn 60, however you may be able to apply now. Please contact {LINK_SERVICE_CANADA} for more information.',
    eligibleWhen65ApplyNowOas:
      'You will likely be eligible when you turn 65. However, you may be able to apply now. Please contact {LINK_SERVICE_CANADA} for more information. To learn more about your option to delay your first payment, {LINK_OAS_DEFER}.',
    eligibleWhen60: 'You will likely be eligible when you turn 60.',
    eligibleWhen65: 'You will likely be eligible when you turn 65.',
    mustBe60to64:
      'You must be between the ages of 60 and 64 to be eligible for this benefit.',
    mustBeInCanada:
      'You need to live in Canada to be eligible for this benefit.',
    mustBeOasEligible:
      'You need to be eligible for Old Age Security to be eligible for this benefit.',
    mustCompleteOasCheck:
      'You need to complete the Old Age Security eligibility assessment first.',
    mustBeWidowed:
      'You must be a surviving partner or widowed to be eligible for this benefit.',
    mustBePartnered:
      'You must be common-law or married to be eligible for this benefit.',
    mustHavePartnerWithGis:
      'Your partner must be receiving the Guaranteed Income Supplement to be eligible for this benefit.',
    mustMeetIncomeReq:
      'Your income is too high to be eligible for this benefit.',
    mustMeetYearReq:
      'You have not lived in Canada for the required number of years to be eligible for this benefit.',
    conditional:
      'You may be eligible for this benefit. We encourage you to contact Service Canada for a better assessment.',
    dependingOnAgreement:
      "You may be eligible to receive this benefit, depending on Canada's agreement with this country. We encourage you to contact Service Canada for a better assessment.",
    dependingOnAgreementWhen60:
      "You may be eligible to receive this benefit when you turn 60, depending on Canada's agreement with this country. We encourage you to contact Service Canada for a better assessment.",
    dependingOnAgreementWhen65:
      "You may be eligible to receive this benefit when you turn 65, depending on Canada's agreement with this country. We encourage you to contact Service Canada for a better assessment.",
    dependingOnLegal:
      'You may be eligible to receive this benefit, depending on your legal status in Canada. We encourage you to contact Service Canada for a better assessment.',
    dependingOnLegalSponsored:
      'You may be eligible for this benefit. We encourage you to contact Service Canada for a better assessment.',
    dependingOnLegalWhen60:
      'You may be eligible to receive this benefit when you turn 60, depending on your legal status in Canada. We encourage you to contact Service Canada for a better assessment.',
    dependingOnLegalWhen65:
      'You may be eligible to receive this benefit when you turn 65, depending on your legal status in Canada. We encourage you to contact Service Canada for a better assessment.',
    additionalReasons:
      '{LINK_MORE_REASONS} for possible additional ineligibility reasons.',
    oasClawback:
      'You may have to repay {OAS_CLAWBACK} in {LINK_RECOVERY_TAX} as your income is over {OAS_RECOVERY_TAX_CUTOFF}.',
    oasIncreaseAt75:
      'Once you reach the age of 75, this will increase by 10%, to {OAS_75_AMOUNT}.',
    oasIncreaseAt75Applied:
      'As you are over the age of 75, your OAS entitlement has been increased by 10%.',
    oasDeferralIncrease:
      'By deferring for {OAS_DEFERRAL_YEARS} years, your OAS pension has increased by {OAS_DEFERRAL_INCREASE}.',
  },
  summaryTitle: {
    moreInfo: 'More information needed',
    unavailable: 'Unable to provide an estimation',
    availableEligible: 'Likely eligible for benefits',
    availableIneligible: 'Likely not eligible for benefits',
  },
  summaryDetails: {
    moreInfo:
      'Please fill out the form. Based on the information you will provide today, the application will estimate your eligibility. If you are a qualified candidate, the application will also provide an estimate for your monthly payment.',
    unavailable:
      'Based on the information you provided today, we are unable to determine your eligibility. We encourage you to contact {LINK_SERVICE_CANADA}.',
    availableEligible:
      'Based on the information you provided today, you are likely eligible for an estimated total monthly amount of {ENTITLEMENT_AMOUNT}. Note that this only provides an estimate of your monthly payment. Changes in your circumstances may impact your results.',
    availableIneligible:
      'Based on the information you provided today, you are likely not eligible for any benefits. See the details below for more information.',
  },
  links,
  csv: {
    appName: 'Canadian Old Age Benefits Estimator',
    formResponses: 'FORM RESPONSES',
    question: 'Question',
    answer: 'Answer',
    estimationResults: 'ESTIMATION RESULTS',
    benefit: 'Benefit',
    eligibility: 'Eligibility',
    details: 'Details',
    entitlement: 'Estimated monthly amount',
    links: 'LINKS',
    description: 'Description',
    url: 'URL',
  },
  yes: 'Yes',
  no: 'No',
}
export default en
