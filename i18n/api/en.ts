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
    [BenefitKey.oas]: 'Old Age Security pension',
    [BenefitKey.gis]: 'Guaranteed Income Supplement',
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
    [ResultKey.INELIGIBLE]: 'Not\xA0eligible',
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
    [FieldKey.AGE]: 'In what month and year were you born?',
    [FieldKey.OAS_DEFER]:
      'When would you like to start receiving the Old Age Security (OAS) pension?',
    [FieldKey.OAS_AGE]:
      'At what age would you like to start receiving the OAS pension?',
    [FieldKey.MARITAL_STATUS]: 'What is your marital status?',
    [FieldKey.INV_SEPARATED]:
      'Are you and your partner living apart for reasons beyond your control?',
    [FieldKey.LIVING_COUNTRY]: 'What country do you live in?',
    [FieldKey.LEGAL_STATUS]: 'Do you have legal status in Canada?',
    [FieldKey.LIVED_OUTSIDE_CANADA]:
      'Since the age of 18, have you lived outside of Canada for longer than 6&nbsp;months?',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Since the age of 18, how many years have you lived in Canada?',
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Have you ever lived in a country with an established {LINK_SOCIAL_AGREEMENT} with Canada?',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Does your partner receive the Old Age Security pension?',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      "Are you able to provide us your partner's annual net income?",
    [FieldKey.PARTNER_INCOME]:
      "What is your partner's annual net income (income after taxes) in Canadian dollars?",
    [FieldKey.PARTNER_AGE]: 'In what month and year was your partner born?',
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      'What country does your partner live in?',
    [FieldKey.PARTNER_LEGAL_STATUS]:
      'Does your partner have legal status in Canada?',
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      'Since the age of 18, has your partner lived outside of Canada for longer than 6&nbsp;months?',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Since the age of 18, how many years has your partner lived in Canada?',
  },
  questionShortText: {
    [FieldKey.AGE]: 'Age',
    [FieldKey.OAS_DEFER]: 'OAS pension deferral',
    [FieldKey.OAS_AGE]: 'OAS pension deferral',
    [FieldKey.INCOME_AVAILABLE]: 'Net income',
    [FieldKey.INCOME]: 'Net income',
    [FieldKey.LEGAL_STATUS]: 'Legal status',
    [FieldKey.LIVING_COUNTRY]: 'Country of residence',
    [FieldKey.LIVED_OUTSIDE_CANADA]: 'Lived outside Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]: 'Years lived in Canada',
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Lived in country with social agreement',
    [FieldKey.MARITAL_STATUS]: 'Marital status',
    [FieldKey.INV_SEPARATED]: 'Involuntarily separated',
    [FieldKey.PARTNER_INCOME_AVAILABLE]: "Partner's net income",
    [FieldKey.PARTNER_INCOME]: "Partner's net income",
    [FieldKey.PARTNER_BENEFIT_STATUS]: 'Partner receives OAS pension',
    [FieldKey.PARTNER_AGE]: "Partner's age",
    [FieldKey.PARTNER_LEGAL_STATUS]: "Partner's legal status",
    [FieldKey.PARTNER_LIVING_COUNTRY]: "Partner's country of residence",
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]: 'Partner lived outside Canada',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Years partner lived in Canada',
  },
  questionAriaLabel: {
    [FieldKey.AGE]: 'Edit your age',
    [FieldKey.OAS_AGE]: 'Start at',
    [FieldKey.OAS_DEFER]: 'Edit your deferral decision',
    [FieldKey.INCOME_AVAILABLE]: 'Edit if you will provide your income',
    [FieldKey.INCOME]: 'Edit your net income',
    [FieldKey.LEGAL_STATUS]: 'Edit your legal status',
    [FieldKey.LIVING_COUNTRY]: 'Edit your country of residence',
    [FieldKey.LIVED_OUTSIDE_CANADA]: 'Edit if you have lived outside Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Edit how long you have lived in Canada',
    [FieldKey.MARITAL_STATUS]: 'Edit your marital status',
    [FieldKey.INV_SEPARATED]: 'Edit your involuntary separation status',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      "Edit if you will provide your partner's income",
    [FieldKey.PARTNER_INCOME]: 'Edit your partner’s net income',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Edit if your partner receives the OAS pension',
    [FieldKey.PARTNER_AGE]: "Edit your partner's age",
    [FieldKey.PARTNER_LEGAL_STATUS]: 'Edit your partner’s legal status',
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      'Edit your partner’s country of residence',
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      'Edit if your partner has lived outside Canada',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Edit how long your partner has lived in Canada',
  },
  questionHelp: {
    [FieldKey.INCOME_AVAILABLE]:
      'Providing your income will give you more accurate results.',
    [FieldKey.INV_SEPARATED]:
      'An involuntary separation could happen when one partner is living away for work, school or health reasons.',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      "Providing your partner's income will give you more accurate results.",
    [FieldKey.OAS_DEFER]:
      'If you already receive the OAS pension, enter when you started receiving it. {LINK_OAS_DEFER_INLINE}',
    [FieldKey.OAS_AGE]: 'This should be between 65 and 70.',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "If you're not sure of the exact number, you may enter an estimate.",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "If you're not sure of the exact number, you may enter an estimate.",
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
        shortText: 'Not provided',
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
        shortText: 'Not provided',
      },
    ],
    [FieldKey.OAS_DEFER]: [
      {
        key: false,
        text: 'I would like to start at age 65 (most common)',
        shortText: 'Start at 65',
      },
      {
        key: true,
        text: 'I would like to delay my first payment (higher amounts)',
        shortText: 'Delay',
      },
    ],
    [FieldKey.LEGAL_STATUS]: [
      {
        key: LegalStatus.YES,
        text: 'Yes',
        shortText: 'Yes',
      },
      {
        key: LegalStatus.NO,
        text: 'No',
        shortText: 'No',
      },
    ],
    [FieldKey.LIVED_OUTSIDE_CANADA]: [
      {
        key: false,
        text: 'No, I have not lived outside of Canada for longer than 6&nbsp;months',
        shortText: 'No',
      },
      {
        key: true,
        text: 'Yes, I have lived outside of Canada for longer than 6&nbsp;months',
        shortText: 'Yes',
      },
    ],
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]: [
      {
        key: false,
        text: 'No, my partner has not lived outside of Canada for longer than 6&nbsp;months',
        shortText: 'No',
      },
      {
        key: true,
        text: 'Yes, my partner has lived outside of Canada for longer than 6&nbsp;months',
        shortText: 'Yes',
      },
    ],
    [FieldKey.MARITAL_STATUS]: [
      {
        key: MaritalStatus.SINGLE,
        text: 'Single, divorced, or separated',
        shortText: 'Single, divorced or separated',
      },
      {
        key: MaritalStatus.PARTNERED,
        text: 'Married or common-law',
        shortText: 'Married or common-law',
      },
      {
        key: MaritalStatus.WIDOWED,
        text: 'Widowed',
        shortText: 'Widowed',
      },
    ],
    [FieldKey.INV_SEPARATED]: [
      {
        key: true,
        text: 'Yes',
        shortText: 'Yes',
      },
      {
        key: false,
        text: 'No',
        shortText: 'No',
      },
    ],
    [FieldKey.PARTNER_BENEFIT_STATUS]: [
      // {
      //   key: PartnerBenefitStatus.OAS,
      //   text: 'My partner receives an Old Age Security pension',
      //   shortText: 'Yes',
      // },
      {
        key: PartnerBenefitStatus.OAS_GIS,
        text: 'Yes, my partner receives the Old Age Security pension',
        shortText: 'Yes',
      },
      // {
      //   key: PartnerBenefitStatus.ALW,
      //   text: 'My partner receives the Allowance',
      //   shortText: 'Yes',
      // },
      {
        key: PartnerBenefitStatus.NONE,
        text: 'No, my partner does not receive the Old Age Security pension',
        shortText: 'No',
      },
      {
        key: PartnerBenefitStatus.HELP_ME,
        text: "I don't know",
        shortText: "I don't know",
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
        shortText: 'No',
      },
    ],
  },
  detail: {
    eligible: "You're likely eligible for this benefit.",
    eligibleIncomeTooHigh:
      "You're likely eligible for this benefit, but your income is too high to receive a monthly payment at this time.",
    eligibleDependingOnIncome:
      "You're likely eligible for this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}. Depending on your income, you should expect to receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month.",
    eligibleDependingOnIncomeNoEntitlement:
      "You're likely eligible for this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}. Provide {YOUR_OR_COMPLETE} to get a monthly payment estimate.",
    eligibleEntitlementUnavailable:
      "You're likely eligible for this benefit, however an entitlement estimation is unavailable. You should contact {LINK_SERVICE_CANADA} for more information about your payment amounts.",
    eligiblePartialOas:
      "You're likely eligible to a partial Old Age Security pension.",
    eligibleWhen60ApplyNow:
      'You will likely be eligible when you turn 60, however you may be able to apply now. Please contact {LINK_SERVICE_CANADA} for more information.',
    eligibleWhen65ApplyNow:
      'You will likely be eligible when you turn 65. However, you may be able to apply now. Please contact {LINK_SERVICE_CANADA} for more information.',
    eligibleWhen60:
      "You'll likely be eligible for this benefit once you turn 60. You can <a class='underline text-default-text' href='/eligibility/#age'>edit your answers</a> to see what you could receive at a future age. <p class='mt-6'>You can apply for this benefit 1&nbsp;month after you turn&nbsp;59.</p>",
    eligibleWhen65: 'You will likely be eligible when you turn 65.',
    mustBeInCanada:
      "You need to live in Canada to receive this benefit. You can <a class='underline text-default-text' href='/eligibility/#livingCountry'>edit your answers</a> to see what you could get if you lived in Canada.",
    mustBeOasEligible:
      'You need to be eligible for the Old Age Security pension to be eligible for this benefit.',
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
      'The Allowance is for individuals between the ages of&nbsp;60 and&nbsp;64 whose spouse or common-law partner is receiving the Guaranteed Income Supplement.',
    alwEligibleIncomeTooHigh:
      "You're likely eligible for this benefit, but you and your partner’s combined income is too high to receive a monthly payment at this time.",
    alwIfYouApply:
      "If you apply, Service Canada will review your income tax return every year. You'll automatically be paid if your income is less than&nbsp;",
    afsNotEligible:
      'The Allowance for the Survivor is for widowed individuals between the ages of&nbsp;60 and&nbsp;64 who have not remarried or entered into a new common-law relationship.',
    autoEnrollTrue:
      'Based on what you told us, <strong>you do not need to apply to get this benefit</strong>. You will receive a letter in the mail letting you know of your <strong>automatic enrollment</strong> the month after you turn 64.',
    autoEnrollFalse:
      'Based on what you told us, <strong>you may have to apply for this benefit</strong>. We may not have enough information to enroll you automatically.',
    expectToReceive:
      'You can expect to receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month.',
    oasClawbackInCanada:
      'Since your income is over {OAS_RECOVERY_TAX_CUTOFF}, you will have to repay some or all of your Old Age Security pension due to {LINK_RECOVERY_TAX}.',
    oasClawbackNotInCanada:
      'Since your income is over {OAS_RECOVERY_TAX_CUTOFF} and you live outside Canada, you will have to repay some or all of your Old Age Security pension due to: <ul class="list-disc" style="padding-left: 24px;"><li style="padding-left: 2px;">the {LINK_RECOVERY_TAX}</li><li style="padding-left: 2px;">the {LINK_NON_RESIDENT_TAX}</li></ul>',
    oas: {
      eligibleIfIncomeIsLessThan:
        "You're likely eligible for this benefit if your income is less than {INCOME_LESS_THAN}. If your income is over {OAS_RECOVERY_TAX_CUTOFF}, you may have to pay {LINK_RECOVERY_TAX}.",
      dependOnYourIncome:
        'Depending on your income, you can expect to receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month. Provide your income to get an accurate estimate.',
      eligibleIncomeTooHigh:
        "You're likely eligible for this benefit, but your income is too high to receive a monthly payment at this time.",
      serviceCanadaReviewYourPayment:
        'If you apply, Service Canada will review your payment amount each year based on your income tax return.',
      automaticallyBePaid:
        "You'll automatically be paid if your income qualifies.",
      youShouldReceiveLetter:
        'You should receive a letter about your enrolment status the month after you turn 64.',
      youShouldHaveReceivedLetter:
        'You should have received a letter about your enrolment status the month after you turned 64.',
      applyOnline:
        "If you didn't receive a letter about the Old Age Security pension the month after you turned 64, you can apply online.",
      over70:
        "If you're over the age of 70 and are not receiving an Old Age Security pension, apply now.",
      eligibleWhenTurn65:
        "You'll likely be eligible for this benefit once you turn 65. You can <a class='text-default-text' href='/eligibility/#age'>edit your answers</a> to see what you could receive at a future age.",
      ifNotReceiveLetter64:
        "If you didn't receive a letter about the Old Age Security pension the month after you turned 64, <a class='text-default-text' target='_blank' href='https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'>contact us</a> to find out if you need to apply.",
    },
    gis: {
      eligibleDependingOnIncomeNoEntitlement:
        "You're likely eligible for this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}. Provide {YOUR_OR_COMPLETE} to get a monthly payment estimate.",
      incomeTooHigh:
        "You're likely eligible for this benefit, but your income is too high to receive a monthly payment at this time.",
      ifYouApply:
        "<p class='mt-6'>If you apply, Service Canada will review your income tax return every year. You'll automatically be paid if your income qualifies.</p>",
    },
  },
  detailWithHeading: {
    oasDeferralApplied: {
      heading: 'How deferral affects your payments',
      text: 'You have deferred your OAS benefits by {OAS_DEFERRAL_YEARS}. This means that your OAS payments will start once you turn {OAS_DEFERRAL_AGE}, and you will be receiving an extra {OAS_DEFERRAL_INCREASE} per month.',
    },
    oasDeferralAvailable: {
      heading: 'You may be able to defer your payments',
      text: 'Learn more about the {LINK_OAS_DEFER_CLICK_HERE}.',
    },
    oasClawback: {
      heading: 'You may have to repay a part of your pension',
      text: 'Since {INCOME_SINGLE_OR_COMBINED} is over {OAS_RECOVERY_TAX_CUTOFF}, you may have to repay {OAS_CLAWBACK} in {LINK_RECOVERY_TAX}.',
    },
    oasIncreaseAt75: {
      heading: 'Your payments will increase when you turn&nbsp;75',
      text: 'Once you turn 75, your payments will increase by&nbsp;10%, meaning you will receive {OAS_75_AMOUNT} per month.',
    },
    oasIncreaseAt75Applied: {
      heading: "Your payments have increased because you're over&nbsp;75",
      text: "Since you're over the age of 75, your payments have increased by&nbsp;10%.",
    },
    calculatedBasedOnIndividualIncome: {
      heading: 'Amounts were calculated based on individual income',
      text: `Since you and your partner are living apart for reasons beyond your control, you're eligible for higher monthly payments.`,
    },
    partnerEligible: {
      heading: 'Your partner may be eligible',
      text: 'Based on what you told us, your partner could receive&nbsp;{PARTNER_BENEFIT_AMOUNT} every month. They can use the estimator to get detailed results.',
    },
    partnerDependOnYourIncome: {
      heading: 'Your partner may be eligible',
      text: 'Depending on your income, you can expect to receive around&nbsp;{PARTNER_BENEFIT_AMOUNT} every month. Provide your income to get an accurate estimate.',
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
      "Please fill out the form. Based on the information you will provide today, the application will estimate your eligibility. If you're a qualified candidate, the application will also provide an estimate for your monthly payment.",
    [SummaryState.UNAVAILABLE]:
      'Based on the information you provided today, we are unable to determine your eligibility. We encourage you to {LINK_SERVICE_CANADA}.',
    [SummaryState.AVAILABLE_ELIGIBLE]:
      "Based on the information you provided today, you're likely eligible for an estimated total monthly amount of {ENTITLEMENT_AMOUNT_SUM}. Note that this only provides an estimate of your monthly payment. Changes in your circumstances may impact your results.",
    [SummaryState.AVAILABLE_INELIGIBLE]:
      "Based on the information you provided today, you're likely not eligible for any benefits. See the details below for more information.",
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
  your: 'your income',
  complete: 'complete income information',
}
export default en
