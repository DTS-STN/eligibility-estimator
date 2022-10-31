import {
  BenefitKey,
  FieldCategory,
  Language,
  LegalStatus,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  SummaryState,
} from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import { livingCountry } from './countries/en'
import { Translations } from './index'
import { links } from './links/en'

const en: Translations = {
  _language: Language.EN,
  benefit: {
    [BenefitKey.oas]: 'Old Age Security (OAS)',
    [BenefitKey.gis]: 'Guaranteed Income Supplement (GIS)',
    [BenefitKey.alw]: 'Allowance',
    [BenefitKey.afs]: 'Allowance for the Survivor',
  },
  category: {
    [FieldCategory.AGE]: 'Age',
    [FieldCategory.INCOME]: 'Income',
    [FieldCategory.LEGAL]: 'Legal status',
    [FieldCategory.RESIDENCE]: 'Residence history',
    [FieldCategory.MARITAL]: 'Marital status',
  },
  result: {
    [ResultKey.ELIGIBLE]: 'Eligible',
    [ResultKey.INELIGIBLE]: 'Not eligible',
    [ResultKey.UNAVAILABLE]: 'Unavailable',
    [ResultKey.MORE_INFO]: 'Need more information...',
    [ResultKey.INVALID]: 'Request is invalid!',
    [ResultKey.INCOME_DEPENDENT]: 'Missing income',
  },
  question: {
    [FieldKey.INCOME_AVAILABLE]:
      'Are you able to provide us your annual net income?',
    [FieldKey.INCOME]:
      'What is your annual net income (income after taxes) in Canadian dollars?',
    [FieldKey.AGE]: 'What month and year were you born?',
    [FieldKey.OAS_DEFER]: 'When would you like to start receiving OAS?',
    [FieldKey.OAS_AGE]: 'At what age would you like to start receiving OAS?',
    [FieldKey.MARITAL_STATUS]: 'What is your current marital status?',
    [FieldKey.LIVING_COUNTRY]: 'What country do you live in?',
    [FieldKey.LEGAL_STATUS]: 'What is your legal status in Canada?',
    [FieldKey.LIVED_OUTSIDE_CANADA]:
      'Since the age of 18 years old, have you lived outside of Canada for longer than 6 months?',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Since the age of 18, how many years have you lived in Canada?',
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Have you ever lived in a country with an established {LINK_SOCIAL_AGREEMENT} with Canada?',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Which of the following applies to your partner?',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      "Are you able to provide us your partner's annual net income?",
    [FieldKey.PARTNER_INCOME]:
      "What is your partner's annual net income in Canadian dollars?",
    [FieldKey.PARTNER_AGE]: 'What month and year was your partner born?',
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      'What country is your partner currently living in?',
    [FieldKey.PARTNER_LEGAL_STATUS]:
      "What is your partner's current legal status?",
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      'Since the age of 18 years old, has your partner lived outside of Canada for longer than 6 months?',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Since the age of 18, how many years has your partner lived in Canada?',
    [FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY]:
      'Has your partner ever lived in a country with an established {LINK_SOCIAL_AGREEMENT} with Canada?',
  },
  questionShortText: {
    [FieldKey.AGE]: 'Age',
    [FieldKey.OAS_DEFER]: 'OAS deferral',
    [FieldKey.OAS_AGE]: 'OAS deferral age',
    [FieldKey.INCOME_AVAILABLE]: 'Income provided',
    [FieldKey.INCOME]: 'Net income',
    [FieldKey.LEGAL_STATUS]: 'Legal status',
    [FieldKey.LIVING_COUNTRY]: 'Residence country',
    [FieldKey.LIVED_OUTSIDE_CANADA]: 'Lived outside Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]: 'Years',
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Lived in country with social agreement',
    [FieldKey.MARITAL_STATUS]: 'Marital status',
    [FieldKey.PARTNER_INCOME_AVAILABLE]: 'Partner income provided',
    [FieldKey.PARTNER_INCOME]: "Partner's net income",
    [FieldKey.PARTNER_BENEFIT_STATUS]: "Partner's old age benefits",
    [FieldKey.PARTNER_AGE]: "Partner's age",
    [FieldKey.PARTNER_LEGAL_STATUS]: "Partner's legal status",
    [FieldKey.PARTNER_LIVING_COUNTRY]: "Partner's residence country",
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]: "Partner's lived outside Canada",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]: 'Years',
    [FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY]:
      'Partner lived in country with social agreement',
  },
  questionAriaLabel: {
    [FieldKey.AGE]: 'Edit your age',
    [FieldKey.OAS_DEFER]:
      'Edit when you would like to start receiving Old Age Security',
    [FieldKey.INCOME_AVAILABLE]: 'Edit if you will provide your income',
    [FieldKey.INCOME]: 'Edit your net income',
    [FieldKey.LEGAL_STATUS]: 'Edit your legal status',
    [FieldKey.LIVING_COUNTRY]: 'Edit your country of residence',
    [FieldKey.LIVED_OUTSIDE_CANADA]:
      'Edit if you have lived outside Canada for longer than 6 months',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Edit the years you have lived in Canada since 18',
    [FieldKey.MARITAL_STATUS]: 'Edit your marital status',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      "Edit if you will provide your partner's income",
    [FieldKey.PARTNER_INCOME]: "Edit your partner's net income",
    [FieldKey.PARTNER_BENEFIT_STATUS]: "Edit your partner's old age benefits",
    [FieldKey.PARTNER_AGE]: "Edit your partner's age",
    [FieldKey.PARTNER_LEGAL_STATUS]: "Edit your partner's legal status",
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      "Edit your partner's country of residence",
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      'Edit if your partner has lived outside Canada for longer than 6 months',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Edit the years your partner have lived in Canada since 18',
  },
  questionHelp: {
    [FieldKey.INCOME_AVAILABLE]:
      'Providing your income will give you more helpful and accurate results.',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      "Providing your partner's income will give you more helpful and accurate results.",
    [FieldKey.OAS_DEFER]:
      '<div>If you already receive OAS, enter when you started receiving it.</div> <div>Learn more about {LINK_OAS_DEFER_INLINE}.</div>',
    [FieldKey.OAS_AGE]: 'This should be between 65 and 70.',
    [FieldKey.INCOME]:
      'You can find your net income on line 23600 of your personal income tax return (T1).',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'If you are not sure of the exact number, you may enter an estimate. You will still be able to view your benefits estimation results.',
  },
  questionOptions: {
    [FieldKey.INCOME_AVAILABLE]: [
      {
        key: true,
        text: 'Yes, I will provide my income',
        shortText: 'Yes',
      },
      {
        key: false,
        text: 'No, I will not provide my income at this time',
        shortText: 'No',
      },
    ],
    [FieldKey.PARTNER_INCOME_AVAILABLE]: [
      {
        key: true,
        text: "Yes, I will provide my partner's income",
        shortText: 'Yes',
      },
      {
        key: false,
        text: "No, I will not provide my partner's income at this time",
        shortText: 'No',
      },
    ],
    [FieldKey.OAS_DEFER]: [
      {
        key: false,
        text: 'I would like to start receiving OAS when I turn 65 (most common)',
        shortText: 'Start at 65',
      },
      {
        key: true,
        text: 'I would like to delay when I start receiving OAS (higher monthly payments)',
        shortText: 'Delay',
      },
    ],
    [FieldKey.LEGAL_STATUS]: [
      {
        key: LegalStatus.CANADIAN_CITIZEN,
        text: 'Canadian citizen',
        shortText: 'Canadian',
      },
      {
        key: LegalStatus.INDIAN_STATUS,
        text: 'Indian status',
        shortText: 'Indian',
      },
      {
        key: LegalStatus.PERMANENT_RESIDENT,
        text: 'Permanent resident or landed immigrant',
        shortText: 'PR or LI',
      },
      {
        key: LegalStatus.REFUGEE,
        text: 'Refugee',
        shortText: 'Refugee',
      },
      {
        key: LegalStatus.OTHER,
        text: 'Other (for example, temporary resident, student or temporary worker)',
        shortText: 'Other',
      },
    ],
    [FieldKey.LIVED_OUTSIDE_CANADA]: [
      {
        key: false,
        text: 'I have not lived outside of Canada for longer than 6 months',
        shortText: 'No',
      },
      {
        key: true,
        text: 'I have lived outside of Canada for longer than 6 months',
        shortText: 'Yes',
      },
    ],
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]: [
      {
        key: false,
        text: 'No, my partner has not lived outside of Canada for longer than 6 months',
        shortText: 'No',
      },
      {
        key: true,
        text: 'Yes, my partner has lived outside of Canada for longer than 6 months',
        shortText: 'Yes',
      },
    ],
    [FieldKey.MARITAL_STATUS]: [
      {
        key: MaritalStatus.SINGLE,
        text: 'Single, divorced, or separated',
        shortText: 'Single / divorced / separated',
      },
      {
        key: MaritalStatus.PARTNERED,
        text: 'Married or common-law',
        shortText: 'Married / common-law',
      },
      {
        key: MaritalStatus.WIDOWED,
        text: 'Surviving partner or widowed',
        shortText: 'Widowed / Partner',
      },
      {
        key: MaritalStatus.INV_SEPARATED,
        text: 'Involuntarily separated',
        shortText: 'Separated',
      },
    ],
    [FieldKey.PARTNER_BENEFIT_STATUS]: [
      {
        key: PartnerBenefitStatus.OAS,
        text: 'My partner receives an Old Age Security pension',
        shortText: 'Yes',
      },
      {
        key: PartnerBenefitStatus.OAS_GIS,
        text: 'My partner receives an Old Age Security pension and the Guaranteed Income Supplement',
        shortText: 'Yes',
      },
      {
        key: PartnerBenefitStatus.ALW,
        text: 'My partner receives the Allowance',
        shortText: 'Yes',
      },
      {
        key: PartnerBenefitStatus.NONE,
        text: 'None of the above',
        shortText: 'No benefits',
      },
      {
        key: PartnerBenefitStatus.HELP_ME,
        text: 'Help me find out',
        shortText: 'Help me find out',
      },
    ],
    [FieldKey.LIVING_COUNTRY]: livingCountry,
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]: [
      {
        key: true,
        text: 'Yes',
        shortText: 'Yes',
      },
      {
        key: false,
        text: 'No',
        shortText: 'Yes',
      },
    ],
  },
  detail: {
    eligible: 'You are likely eligible for this benefit.',
    eligibleDependingOnIncome:
      'You are likely eligible for this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}. Depending on your income, you should expect to receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month.',
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
    mustBeInCanada:
      'You need to live in Canada to be eligible for this benefit.',
    mustBeOasEligible:
      'You need to be eligible for Old Age Security to be eligible for this benefit.',
    mustCompleteOasCheck:
      'You need to complete the Old Age Security eligibility assessment first.',
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
    dependingOnLegalWhen60:
      'You may be eligible to receive this benefit when you turn 60, depending on your legal status in Canada. We encourage you to contact Service Canada for a better assessment.',
    dependingOnLegalWhen65:
      'You may be eligible to receive this benefit when you turn 65, depending on your legal status in Canada. We encourage you to contact Service Canada for a better assessment.',
    alwNotEligible:
      'Allowance is for individuals between the ages of 60 and 64 whose partner (spouse or common-law) is receiving the Guaranteed Income Supplement.',
    afsNotEligible:
      'Allowance for the Survivor is for individuals between 60 and 64 years old whose partner (spouse or common-law) has died.',
    autoEnrollTrue:
      'Based on what you told us, <strong>you do not need to apply to get this benefit</strong>. You will receive a letter in the mail letting you know of your <strong>automatic enrollment</strong> the month after you turn 64.',
    autoEnrollFalse:
      'Based on what you told us, <strong>you may have to apply for this benefit</strong>. We may not have enough information to enroll you automatically.',
    expectToReceive:
      'You should expect to receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month.',
  },
  detailWithHeading: {
    oasDeferralApplied: {
      heading: 'How deferral affects your payments',
      text: 'You have deferred your OAS benefits by {OAS_DEFERRAL_YEARS}. This means that your OAS payments will start once you turn {OAS_DEFERRAL_AGE}, and you will be be receiving an extra {OAS_DEFERRAL_INCREASE} per month.',
    },
    oasDeferralAvailable: {
      heading: 'You may be able to defer your payments',
      text: 'To learn more about your option to delay your first payment, {LINK_OAS_DEFER_CLICK_HERE}.',
    },
    oasClawback: {
      heading: 'You may have to repay a part of your pension',
      text: 'Since {INCOME_SINGLE_OR_COMBINED} is over {OAS_RECOVERY_TAX_CUTOFF}, you may have to repay {OAS_CLAWBACK} in {LINK_RECOVERY_TAX}.',
    },
    oasIncreaseAt75: {
      heading: 'Your payments will increase when you turn 75',
      text: 'Once you turn 75, your OAS payments will increase by 10%, meaning you will receive {OAS_75_AMOUNT} per month.',
    },
    oasIncreaseAt75Applied: {
      heading: 'Your payments have increased because you are over 75',
      text: 'Since you are over the age of 75, your OAS payments have been increased by 10%.',
    },
  },
  summaryTitle: {
    [SummaryState.MORE_INFO]: 'More information needed',
    [SummaryState.UNAVAILABLE]: 'Unable to provide an estimation',
    [SummaryState.AVAILABLE_ELIGIBLE]: 'Likely eligible for benefits',
    [SummaryState.AVAILABLE_INELIGIBLE]: 'Likely not eligible for benefits',
    [SummaryState.AVAILABLE_DEPENDING]: 'You may be eligible for benefits',
  },
  summaryDetails: {
    [SummaryState.MORE_INFO]:
      'Please fill out the form. Based on the information you will provide today, the application will estimate your eligibility. If you are a qualified candidate, the application will also provide an estimate for your monthly payment.',
    [SummaryState.UNAVAILABLE]:
      'Based on the information you provided today, we are unable to determine your eligibility. We encourage you to contact {LINK_SERVICE_CANADA}.',
    [SummaryState.AVAILABLE_ELIGIBLE]:
      'Based on the information you provided today, you are likely eligible for an estimated total monthly amount of {ENTITLEMENT_AMOUNT_SUM}. Note that this only provides an estimate of your monthly payment. Changes in your circumstances may impact your results.',
    [SummaryState.AVAILABLE_INELIGIBLE]:
      'Based on the information you provided today, you are likely not eligible for any benefits. See the details below for more information.',
    [SummaryState.AVAILABLE_DEPENDING]:
      'Depending on your income, you may be eligible for old age benefits. See the details below for more information.',
  },
  links,
  incomeSingle: 'your income',
  incomeCombined: "you and your partner's combined income",
  opensNewWindow: 'opens a new window',
  yes: 'Yes',
  no: 'No',
  year: 'year',
}
export default en
