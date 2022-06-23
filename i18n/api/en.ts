import {
  FieldCategory,
  Language,
  LegalStatus,
  Locale,
  MaritalStatus,
  PartnerBenefitStatus,
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
    [FieldCategory.AGE]: 'Age',
    [FieldCategory.INCOME]: 'Income',
    [FieldCategory.LEGAL]: 'Legal status',
    [FieldCategory.RESIDENCE]: 'Residence history',
    [FieldCategory.MARITAL]: 'Marital status',
  },
  result: {
    eligible: 'Eligible',
    ineligible: 'Not eligible',
    unavailable: 'Unavailable',
    moreInfo: 'Need more information...',
    invalid: 'Request is invalid!',
    incomeDependent: 'Missing income',
  },
  question: {
    incomeAvailable: 'Are you able to provide us your annual net income?',
    income:
      'What is your annual net income (income after taxes) in Canadian dollars?',
    age: 'How old are you?',
    oasDefer: 'When would you like to start receiving OAS?',
    oasAge: "Enter the age for when you'd like to start receiving OAS.",
    maritalStatus: 'What is your current marital status?',
    livingCountry: 'What country do you live in?',
    legalStatus: 'What is your legal status in Canada?',
    livedOutsideCanada:
      'Since the age of 18 years old, have you lived outside of Canada for longer than 6 months?',
    yearsInCanadaSince18:
      'Since the age of 18, how many years have you lived in Canada?',
    everLivedSocialCountry:
      'Have you ever lived in a country with an established {LINK_SOCIAL_AGREEMENT} with Canada?',
    partnerBenefitStatus: 'Which of the following applies to your partner?',
    partnerIncomeAvailable:
      "Are you able to provide us your partner's annual net income?",
    partnerIncome:
      "What is your partner's annual net income in Canadian dollars?",
    partnerAge: "What is your partner's current age?",
    partnerLivingCountry: 'What country is your partner currently living in?',
    partnerLegalStatus: "What is your partner's current legal status?",
    partnerLivedOutsideCanada:
      'Since the age of 18 years old, has your partner lived outside of Canada for longer than 6 months?',
    partnerYearsInCanadaSince18:
      'Since the age of 18, how many years has your partner lived in Canada?',
    partnerEverLivedSocialCountry:
      'Has your partner ever lived in a country with an established {LINK_SOCIAL_AGREEMENT} with Canada?',
  },
  questionShortText: {
    age: 'Age',
    oasDefer: 'OAS deferral',
    oasAge: 'OAS deferral age',
    incomeAvailable: 'Income provided',
    income: 'Net income',
    legalStatus: 'Legal status',
    livingCountry: 'Residence country',
    livedOutsideCanada: 'Lived outside Canada for longer of 6 months',
    yearsInCanadaSince18: 'Years lived outside Canada',
    everLivedSocialCountry: 'Lived in country with social agreement',
    maritalStatus: 'Marital status',
    partnerIncomeAvailable: 'Partner income provided',
    partnerIncome: "Partner's net income",
    partnerBenefitStatus: "Partner's old age benefits",
    partnerAge: "Partner's age",
    partnerLegalStatus: "Partner's legal status",
    partnerLivingCountry: "Partner's residence country",
    partnerLivedOutsideCanada:
      "Partner's lived outside Canada for longer of 6 months",
    partnerYearsInCanadaSince18: "Partner's years lived outside Canada",
    partnerEverLivedSocialCountry:
      'Partner lived in country with social agreement',
  },
  questionHelp: {
    incomeAvailable:
      'Providing your income will give you more helpful and accurate results.',
    partnerIncomeAvailable:
      "Providing your partner's income will give you more helpful and accurate results.",
    age: 'You can enter your current age, or a future age for planning purposes.',
    oasDefer:
      'If you already receive OAS, enter when you started receiving it.</br>Learn more about {LINK_OAS_DEFER_INLINE}.',
    oasAge: 'This should be between 65 and 70.',
    income:
      'You can find your net income on line 23600 of your personal income tax return (T1).',
    yearsInCanadaSince18:
      'If you are not sure of the exact number, you may enter an estimate. You will still be able to view your benefits estimation results.',
  },
  questionOptions: {
    incomeAvailable: [
      {
        key: true,
        text: 'Yes, I will provide my income',
      },
      {
        key: false,
        text: 'No, I will not provide my income at this time',
      },
    ],
    partnerIncomeAvailable: [
      {
        key: true,
        text: "Yes, I will provide my partner's income",
      },
      {
        key: false,
        text: "No, I will not provide my partner's income at this time",
      },
    ],
    oasDefer: [
      {
        key: false,
        text: 'I would like to start receiving OAS when I turn 65 (most common)',
      },
      {
        key: true,
        text: 'I would like to delay when I start receiving OAS (higher monthly payments)',
      },
    ],
    legalStatus: [
      { key: LegalStatus.CANADIAN_CITIZEN, text: 'Canadian citizen' },
      {
        key: LegalStatus.PERMANENT_RESIDENT,
        text: 'Permanent resident or landed immigrant (non-sponsored)',
      },
      {
        key: LegalStatus.SPONSORED,
        text: 'Permanent resident or landed immigrant (sponsored)',
      },
      { key: LegalStatus.INDIAN_STATUS, text: 'Indian status or status card' },
      {
        key: LegalStatus.OTHER,
        text: 'Other (for example, temporary resident, student, temporary worker)',
      },
    ],
    livedOutsideCanada: [
      {
        key: false,
        text: 'No, I have not lived outside of Canada for longer than 6 months',
      },
      {
        key: true,
        text: 'Yes, I have lived outside of Canada for longer than 6 months',
      },
    ],
    partnerLivedOutsideCanada: [
      {
        key: false,
        text: 'No, my partner has not lived outside of Canada for longer than 6 months',
      },
      {
        key: true,
        text: 'Yes, my partner has lived outside of Canada for longer than 6 months',
      },
    ],
    maritalStatus: [
      {
        key: MaritalStatus.SINGLE,
        text: 'Single, divorced, or separated',
      },
      {
        key: MaritalStatus.PARTNERED,
        text: 'Married or common-law',
      },
      { key: MaritalStatus.WIDOWED, text: 'Surviving partner or widowed' },
      { key: MaritalStatus.INV_SEPARATED, text: 'Involuntarily separated' },
    ],
    partnerBenefitStatus: [
      {
        key: PartnerBenefitStatus.OAS,
        text: 'My partner receives an Old Age Security pension',
      },
      {
        key: PartnerBenefitStatus.OAS_GIS,
        text: 'My partner receives an Old Age Security pension and the Guaranteed Income Supplement',
      },
      {
        key: PartnerBenefitStatus.ALW,
        text: 'My partner receives the Allowance',
      },
      { key: PartnerBenefitStatus.NONE, text: 'None of the above' },
      { key: PartnerBenefitStatus.HELP_ME, text: 'Help me find out' },
    ],
    livingCountry,
  },
  detail: {
    eligible: 'You are likely eligible for this benefit.',
    eligibleDependingOnIncome:
      'You are likely eligible for this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}.',
    eligibleDependingOnIncomeNoEntitlement:
      'You are likely eligible for this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}. An entitlement estimation is not available unless you provide your income.',
    eligibleEntitlementUnavailable:
      'You are likely eligible for this benefit, however an entitlement estimation is unavailable. You should contact {LINK_SERVICE_CANADA} for more information about your payment amounts.',
    eligiblePartialOas:
      'You are likely eligible to a partial Old Age Security pension.',
    eligibleWhen60ApplyNow:
      'You will likely be eligible when you turn 60, however you may be able to apply now. Please contact {LINK_SERVICE_CANADA} for more information.',
    eligibleWhen65ApplyNow:
      'You will likely be eligible when you turn 65. However, you may be able to apply now. Please contact {LINK_SERVICE_CANADA} for more information.',
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
      '{INCOME_SINGLE_OR_COMBINED} is too high to be eligible for this benefit.',
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
    oasClawback:
      'You may have to repay {OAS_CLAWBACK} in {LINK_RECOVERY_TAX} as {INCOME_SINGLE_OR_COMBINED} is over {OAS_RECOVERY_TAX_CUTOFF}.',
    oasIncreaseAt75:
      'Once you reach the age of 75, your monthly amount will increase by 10%, to {OAS_75_AMOUNT}.',
    oasIncreaseAt75Applied:
      'As you are over the age of 75, your OAS entitlement has been increased by 10%.',
    oasDeferralIncrease:
      'By deferring for {OAS_DEFERRAL_YEARS} years, your OAS pension has increased by {OAS_DEFERRAL_INCREASE}.',
    alwNotEligible:
      'Allowance is for individuals between the ages of 60 and 64 whose partner (spouse or common-law) is receiving the Guaranteed Income Supplement.',
    afsNotEligible:
      'Allowance for the Survivor is for individuals between 60 and 64 years old whose partner (spouse or common-law) has died.',
    autoEnrollTrue:
      'Based on what you told us, <strong>you do not need to apply to get this benefit</strong>. You will receive a letter in the mail letting you know of your <strong>automatic enrollment</strong> the month after you turn 64.',
    autoEnrollFalse:
      'Based on what you told us, <strong>you may have to apply for this benefit</strong>. We may not have enough information to enroll you automatically.',
    expectToReceive:
      'You should expect to receive around {ENTITLEMENT_AMOUNT} every month.',
  },
  detailWithHeading: {
    oasDeferralApplied: {
      heading: 'How deferral affects your payments',
      text: 'You have deferred your OAS benefits by {DEFERRAL_YEARS}. This means that your OAS payments will start once you turn {DEFERRAL_AGE}, and you will be be receiving an extra {DEFERRAL_INCREASE} per month.',
    },
    oasDeferralAvailable: {
      heading: 'You may be able to defer your payments',
      text: 'To learn more about your option to delay your first payment, {LINK_OAS_DEFER_CLICK_HERE}.',
    },
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
  incomeSingle: 'your income',
  incomeCombined: "you and your partner's combined income",
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
