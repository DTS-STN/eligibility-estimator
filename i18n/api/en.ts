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
    [BenefitKey.alws]: 'Allowance for the Survivor',
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
    [ResultKey.WILL_BE_ELIGIBLE]: 'Will\xA0be\xA0eligible',
    [ResultKey.UNAVAILABLE]: 'Unavailable',
    [ResultKey.MORE_INFO]: 'Need more information...',
    [ResultKey.INVALID]: 'Request is invalid!',
    [ResultKey.INCOME_DEPENDENT]: 'Missing income',
  },
  question: {
    [FieldKey.INCOME_AVAILABLE]:
      'Are you able to provide us your annual net income?',
    [FieldKey.INCOME]:
      'What will be your annual net income when you start receiving your benefits?',
    [FieldKey.INCOME_WORK]:
      'How much of this amount is from work or self-employment income?',
    [FieldKey.AGE]: 'When were you born?',
    [FieldKey.ALREADY_RECEIVE_OAS]:
      'Do you already receive the Old Age Security pension?',
    [FieldKey.WHEN_TO_START]:
      'When do you want your Old Age Security pension to start?',
    [FieldKey.START_DATE_FOR_OAS]: 'Enter start date',
    [FieldKey.OAS_DEFER_DURATION]:
      'How long did you defer your Old Age Security pension?',
    [FieldKey.OAS_DEFER]:
      'When would you like to start receiving the Old Age Security (OAS) pension?',
    [FieldKey.OAS_AGE]:
      'At what age would you like to start receiving the OAS pension?',
    [FieldKey.MARITAL_STATUS]: 'What is your marital status?',
    [FieldKey.INV_SEPARATED]:
      'Do you live apart from your partner for reasons outside of your control?',
    [FieldKey.LIVING_COUNTRY]: 'Where do you live?',
    [FieldKey.LEGAL_STATUS]: 'Do you have legal status in Canada?',
    [FieldKey.LIVED_ONLY_IN_CANADA]:
      'Since the age of 18, have you only lived in Canada?',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Since the age of 18, how many years have you lived in Canada?',
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]:
      'How many years had you lived in Canada when you started receiving your Old Age Security pension?',
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Have you ever lived in a country with a {LINK_SOCIAL_AGREEMENT} with Canada?',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Does your partner receive the Old Age Security pension?',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      "Are you able to provide us your partner's annual net income?",
    [FieldKey.PARTNER_INCOME]: "What is your partner's annual net income?",
    [FieldKey.PARTNER_INCOME_WORK]:
      'How much of this amount is from work or self-employment income?',
    [FieldKey.PARTNER_AGE]: 'When was your partner born?',
    [FieldKey.PARTNER_LIVING_COUNTRY]: 'Where does your partner live?',
    [FieldKey.PARTNER_LEGAL_STATUS]:
      'Does your partner have legal status in Canada?',
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]:
      'Since the age of 18, has your partner only lived in Canada?',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Since the age of 18, how many years has your partner lived in Canada?',
  },
  questionShortText: {
    [FieldKey.AGE]: 'Age',
    [FieldKey.ALREADY_RECEIVE_OAS]: 'Already receive OAS pension',
    [FieldKey.WHEN_TO_START]: 'OAS pension start date',
    [FieldKey.START_DATE_FOR_OAS]: 'Start date',
    [FieldKey.OAS_DEFER]: 'OAS pension deferral',
    [FieldKey.OAS_DEFER_DURATION]: 'Deferred OAS pension',
    [FieldKey.OAS_AGE]: 'OAS pension deferral',
    [FieldKey.INCOME_AVAILABLE]: 'Net income',
    [FieldKey.INCOME]: 'Net income',
    [FieldKey.INCOME_WORK]: 'Salary exemption',
    [FieldKey.LEGAL_STATUS]: 'Legal status',
    [FieldKey.LIVING_COUNTRY]: 'Country of residence',
    [FieldKey.LIVED_ONLY_IN_CANADA]: 'Only lived in Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]: 'Years lived in Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]: 'Years lived in Canada',
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Lived in country with social security agreement',
    [FieldKey.MARITAL_STATUS]: 'Marital status',
    [FieldKey.INV_SEPARATED]: 'Involuntarily separated',
    [FieldKey.PARTNER_INCOME_AVAILABLE]: "Partner's net income",
    [FieldKey.PARTNER_INCOME]: "Partner's net income",
    [FieldKey.PARTNER_INCOME_WORK]: 'Partner’s salary exemption',
    [FieldKey.PARTNER_BENEFIT_STATUS]: 'Partner receives OAS pension',
    [FieldKey.PARTNER_AGE]: "Partner's age",
    [FieldKey.PARTNER_LEGAL_STATUS]: 'Partner has legal status',
    [FieldKey.PARTNER_LIVING_COUNTRY]: "Partner's country of residence",
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]: 'Partner only lived in Canada',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Years partner lived in Canada',
  },
  questionAriaLabel: {
    [FieldKey.AGE]: 'Edit your age',
    [FieldKey.OAS_AGE]: 'Start at',
    [FieldKey.ALREADY_RECEIVE_OAS]:
      'Edit if you already receive the OAS pension',
    [FieldKey.WHEN_TO_START]:
      'When do you want your Old Age Security pension to start?',
    [FieldKey.START_DATE_FOR_OAS]: 'Edit your start date',
    [FieldKey.OAS_DEFER_DURATION]: 'Edit your OAS pension deferral',
    [FieldKey.OAS_DEFER]: 'Edit your deferral decision',
    [FieldKey.INCOME_AVAILABLE]: 'Edit if you will provide your income',
    [FieldKey.INCOME]: 'Edit your net income',
    [FieldKey.INCOME_WORK]: 'Edit your salary',
    [FieldKey.LEGAL_STATUS]: 'Edit your legal status',
    [FieldKey.LIVING_COUNTRY]: 'Edit your country of residence',
    [FieldKey.LIVED_ONLY_IN_CANADA]: 'Edit if you have only lived in Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Edit how long you have lived in Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]:
      'Edit how long you have lived in Canada',
    [FieldKey.MARITAL_STATUS]: 'Edit your marital status',
    [FieldKey.INV_SEPARATED]: 'Edit your involuntary separation status',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      "Edit if you will provide your partner's income",
    [FieldKey.PARTNER_INCOME]: 'Edit your partner’s net income',
    [FieldKey.PARTNER_INCOME_WORK]: "Edit your partner's salary",
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Edit if your partner receives the OAS pension',
    [FieldKey.PARTNER_AGE]: "Edit your partner's age",
    [FieldKey.PARTNER_LEGAL_STATUS]: 'Edit if your partner has legal status',
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      'Edit your partner’s country of residence',
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]:
      'Edit if your partner has only lived in Canada',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Edit how long your partner has lived in Canada',
  },
  questionHelp: {
    [FieldKey.INCOME_AVAILABLE]:
      'Providing your income will give you more accurate results.',
    [FieldKey.INCOME]:
      'Add all types of income after deductions, including: <ul><li>pensions (including <dfn><abbr title="Canada Pension Plan">CPP</abbr></dfn> and <dfn><abbr title="Québec Pension Plan">QPP</abbr></dfn>)</li><li>benefits</li><li>salaries</li><li>retirement fund withdrawals (including <dfn><abbr title="Registered Retirement Savings Plans">RRSPs</abbr></dfn>).</li></ul> Do not include payments from the: <ul><li>Old Age Security pension</li><li>Guaranteed Income Supplement</li><li>Allowance</li><li>Allowance for the Survivor</li></ul>',
    [FieldKey.INCOME_WORK]:
      'Enter any salary from a job or self-employment that you included in your annual net income. ',
    [FieldKey.INV_SEPARATED]:
      'For example, because your partner lives in a care home or lives in a separate home to be close to work or medical help.',
    [FieldKey.PARTNER_INCOME]:
      'Add all types of income after deductions, including: <ul><li>pensions (including <dfn><abbr title="Canada Pension Plan">CPP</abbr></dfn> and <dfn><abbr title="Québec Pension Plan">QPP</abbr></dfn>)</li><li>benefits</li><li>salaries</li><li>retirement fund withdrawals (including <dfn><abbr title="Registered Retirement Savings Plans">RRSPs</abbr></dfn>).</li></ul> Do not include payments from the: <ul><li>Old Age Security pension</li><li>Guaranteed Income Supplement</li><li>Allowance</li><li>Allowance for the Survivor</li></ul>',
    [FieldKey.PARTNER_INCOME_WORK]:
      'Enter any salary from a job or self-employment that you included in your partner’s annual net income.',
    [FieldKey.OAS_DEFER_DURATION]:
      'If you didn’t delay your payments, go to the next step.',
    [FieldKey.OAS_DEFER]:
      'If you already receive the OAS pension, enter when you started receiving it. {LINK_OAS_DEFER_INLINE}',
    [FieldKey.WHEN_TO_START]:
      "If you're eligible, you can start as early as the month after your 65th birthday",
    [FieldKey.OAS_AGE]: 'This should be between 65 and 70.',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Do not include periods when you were outside Canada for at least 6 months at a time. Some exceptions apply, such as working for a Canadian employer abroad.',
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]:
      'Only count the number of years since the age of 18.',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Do not include periods when they were outside Canada for at least 6 months at a time. Some exceptions apply, such as working for a Canadian employer abroad.',
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
    [FieldKey.ALREADY_RECEIVE_OAS]: [
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
    [FieldKey.WHEN_TO_START]: [
      {
        key: true,
        text: 'As soon as possible',
        shortText: 'As soon as possible',
      },
      {
        key: false,
        text: 'As of a specific month',
        shortText: 'As of a specific month',
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
    [FieldKey.LIVED_ONLY_IN_CANADA]: [
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
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]: [
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
    [FieldKey.MARITAL_STATUS]: [
      {
        key: MaritalStatus.SINGLE,
        text: 'Single, divorced or separated',
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
    futureEligible60:
      "You'll likely be eligible once you turn {EARLIEST_ELIGIBLE_AGE}.",
    futureEligible:
      "You'll likely be eligible once you turn {EARLIEST_ELIGIBLE_AGE}.",
    eligibleIncomeTooHigh:
      "You're likely eligible for this benefit, but your income is too high to receive a monthly payment at this time.",
    futureEligibleIncomeTooHigh:
      'You may be eligible once you turn {EARLIEST_ELIGIBLE_AGE}. Since your income is too high, you may not receive a monthly payment.',
    futureEligibleIncomeTooHigh2:
      'You may be eligible once you turn {EARLIEST_ELIGIBLE_AGE}. If your income stays the same, you may not receive a monthly payment.',
    eligibleDependingOnIncome:
      "You're likely eligible for this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}. Depending on your income, you should expect to receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month.",
    eligibleDependingOnIncomeNoEntitlement:
      'You could likely receive this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}. Provide {YOUR_OR_COMPLETE} to get a monthly payment estimate.',
    eligibleEntitlementUnavailable:
      "You're likely eligible for this benefit, however an entitlement estimation is unavailable. You should contact {LINK_SERVICE_CANADA} for more information about your payment amounts.",
    eligiblePartialOas:
      "You're likely eligible to a partial Old Age Security pension.",
    yourDeferralOptions: 'Your deferral options',
    retroactivePay: 'Retroactive payment',
    sinceYouAreSixty:
      "Since you're {CURRENT_AGE}, you can start receiving your payments right away or wait for up to {WAIT_MONTHS} more {MONTH_MONTHS}.",
    futureDeferralOptions:
      "You can start receiving your payments at {EARLIEST_ELIGIBLE_AGE} or wait until you're 70.",
    youCanAply:
      'You can apply 11 months before the date you want your payments to start.',
    delayMonths:
      'You can delay your pension for up to {DELAY_MONTHS} more {MONTH_MONTHS}.',
    eligibleWhen60ApplyNow:
      'You may be eligible when you turn 60, however you may be able to apply now. Please contact {LINK_SERVICE_CANADA} for more information.',
    eligibleWhen65ApplyNow:
      'You may be eligible when you turn 65. However, you may be able to apply now. Please contact {LINK_SERVICE_CANADA} for more information.',
    eligibleWhen60:
      "You may be eligible for this benefit once you turn 60. You can <a class='text-default-text' style='text-decoration: underline' href='/en/questions#age'>edit your answers</a> to see what you could receive at a future age. <p class='mt-6'>You can apply for this benefit 1 month after you turn 59.</p>",
    eligibleWhen65: 'You may be eligible when you turn 65.',
    mustBeInCanada:
      "You need to live in Canada to receive this benefit. You can <a class='text-default-text' style='text-decoration: underline' href='/en/questions#livingCountry'>edit your answers</a> to see what you could get if you lived in Canada.",
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
    partnerContinues: 'If your partner continues receiving at',
    continueReceiving: 'If you continue receiving at',
    dependingOnAgreement:
      "You may be eligible to receive this benefit, depending on Canada's agreement with this country. We encourage you to contact Service Canada for a better assessment.",
    dependingOnAgreementWhen60:
      "You may be eligible to receive this benefit when you turn 60, depending on Canada's agreement with this country. We encourage you to contact Service Canada for a better assessment.",
    dependingOnAgreementWhen65:
      "You may be eligible to receive this benefit when you turn 65, depending on Canada's agreement with this country. We encourage you to contact Service Canada for a better assessment.",
    dependingOnLegal:
      'You may be eligible to receive this benefit, depending on your legal status in Canada. We encourage you to contact Service Canada for a better assessment.',
    dependingOnLegalWhen60:
      'You may be eligible to receive this benefit when you turn 60, depending on your legal status in Canada. We encourage you to contact Service Canada for a better assessment.',
    dependingOnLegalWhen65:
      'You may be eligible to receive this benefit when you turn 65, depending on your legal status in Canada. We encourage you to contact Service Canada for a better assessment.',
    youCantGetThisBenefit:
      'You can’t get this benefit if you don’t receive the Old Age Security pension. Your Guaranteed Income Supplement payments won’t increase if you defer your pension.',
    thisEstimate:
      'This estimate is based on the information you provided. Your actual amount may be different. To confirm that your information is up to date, consult your {MY_SERVICE_CANADA}.',
    thisEstimateWhenZero:
      'This estimate is based on the information you provided. To confirm that your information is up to date, consult your {MY_SERVICE_CANADA}.',
    alwNotEligible:
      'The Allowance is for individuals between the ages of 60 and 64 whose spouse or common-law partner is receiving the Guaranteed Income Supplement.',
    alwEligibleButPartnerAlreadyIs:
      'To be eligible for this benefit, your partner must receive the Old Age Security pension and the Guaranteed Income Supplement. You can <a class="text-default-text" style="text-decoration: underline" href="/en/questions#partnerBenefitStatus">edit your answers</a> to see what you could get if your partner received these benefits.',
    alwEligibleIncomeTooHigh:
      "You're likely eligible for this benefit, but you and your partner’s combined income is too high to receive a monthly payment at this time.",
    alwIfYouApply:
      "If you apply, Service Canada will review your income tax return every year. You'll automatically be paid if your combined income is less than ",
    alwsIfYouApply:
      "If you apply, Service Canada will review your income tax return every year. You'll automatically be paid if your income is less than ",
    afsNotEligible:
      'The Allowance for the Survivor is for widowed individuals between the ages of 60 and 64 who have not remarried or entered into a new common-law relationship.',
    alwsApply: 'You can apply for this benefit 1 month after you turn 59. ',
    autoEnrollTrue:
      'Based on what you told us, <strong>you do not need to apply to get this benefit</strong>. You will receive a letter in the mail letting you know of your <strong>automatic enrolment</strong> the month after you turn 64.',
    autoEnrollFalse:
      'Based on what you told us, <strong>you may have to apply for this benefit</strong>. We may not have enough information to enroll you automatically.',
    expectToReceive:
      'You can expect to receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month.',
    futureExpectToReceive:
      'If your income stays the same, you could receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month.',
    futureExpectToReceivePartial1: 'If your income stays the same,',
    futureExpectToReceivePartial2:
      ' and you live in Canada for {CALCULATED_YEARS_IN_CANADA} years,',
    futureExpectToReceivePartial3:
      ' you could receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month.',
    oasClawbackInCanada:
      'Since your income is over {OAS_RECOVERY_TAX_CUTOFF}, you will have to repay some or all of your Old Age Security pension due to {LINK_RECOVERY_TAX}.',
    futureOasClawbackInCanada:
      "Since your income is over {OAS_RECOVERY_TAX_CUTOFF}, you won't receive some or all of your Old Age Security pension due to {LINK_RECOVERY_TAX}.",
    oasClawbackNotInCanada:
      'Since your income is over {OAS_RECOVERY_TAX_CUTOFF} and you live outside Canada, you won’t receive some or all of your Old Age Security pension due to: <ul class="list-disc" style="padding-left: 24px;"><li style="padding-left: 2px;">the {LINK_RECOVERY_TAX}</li><li style="padding-left: 2px;">the {LINK_NON_RESIDENT_TAX}</li></ul>',
    oas: {
      eligibleIfIncomeIsLessThan:
        "You're likely eligible for this benefit if your income is less than {INCOME_LESS_THAN}. If your income is over {OAS_RECOVERY_TAX_CUTOFF}, you may have to pay {LINK_RECOVERY_TAX}.",
      dependOnYourIncome:
        'Depending on your income, you can expect to receive around {ENTITLEMENT_AMOUNT_FOR_BENEFIT} every month. Provide your income to get an accurate estimate.',
      eligibleIncomeTooHigh:
        "You're likely eligible for this benefit, but your income is too high to receive a monthly payment at this time.",
      futureEligibleIncomeTooHigh:
        'You may be eligible once you turn {EARLIEST_ELIGIBLE_AGE}. Since your income is too high, you may not receive a monthly payment.',
      serviceCanadaReviewYourPayment:
        'If you apply, Service Canada will review your payment amount each year based on your income tax return.',
      automaticallyBePaid:
        "You'll automatically be paid if your income qualifies.",
      youWillReceiveLetter:
        'You should receive a letter about your enrolment status the month after you turn 64.',
      youShouldReceiveLetter:
        'You should receive a letter about your enrolment status the month after you turn 64.',
      youShouldHaveReceivedLetter:
        'You should have received a letter about your enrolment status the month after you turned 64.',
      ifYouDidnt:
        "If you didn't, <a id='oasLink2' class='text-default-text' style='text-decoration: underline' target='_blank' aria-label='opens a new tab' href='https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'>contact us</a> to find out if you need to apply.",
      applyOnline: "If you didn't, you can apply online.",
      over70:
        "If you're over the age of 70 and are not receiving an Old Age Security pension, apply now.",
      eligibleWhenTurn65:
        "You may be eligible for this benefit once you turn 65. You can <a class='text-default-text' style='text-decoration: underline' href='/en/questions#age'>edit your answers</a> to see what you could receive at a future age.",
      ifNotReceiveLetter64:
        "If you didn't, <a class='text-default-text addOpenNew' style='text-decoration: underline' target='_blank' aria-label='opens a new tab' href='https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'>contact us</a> to find out if you need to apply.",
      chooseToDefer:
        "You can choose to defer your pension or increase your years of residence in Canada. To find out which option is best for you, <a id='oasLink2' class='text-default-text' style='text-decoration: underline' target='_blank' aria-label='opens a new tab' href='https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'>contact us</a>.",
      receivePayment:
        'You may be able to receive payment for up to the last 11 months.',
    },
    gis: {
      eligibleDependingOnIncomeNoEntitlement:
        'You could likely receive this benefit if {INCOME_SINGLE_OR_COMBINED} is less than {INCOME_LESS_THAN}. Provide {YOUR_OR_COMPLETE} to get a monthly payment estimate.',
      incomeTooHigh:
        "You're likely eligible for this benefit, but your income is too high to receive a monthly payment at this time.",
      futureEligibleIncomeTooHigh:
        'You may be eligible once you turn {EARLIEST_ELIGIBLE_AGE}. If your income stays the same, you may not receive a monthly payment.',
      ifYouApply:
        "If you apply, Service Canada will review your income tax return every year. You'll automatically be paid if your income qualifies.",
      canApplyOnline: 'You can apply for this benefit online.',
      ifYouAlreadyApplied:
        'If you already applied for the Guaranteed Income Supplement, you can confirm that your information is up to date in your {MY_SERVICE_CANADA}.',
      ifYouAlreadyReceive:
        'If you already receive the Guaranteed Income Supplement, you can confirm that your information is up to date in your {MY_SERVICE_CANADA}.',
    },
  },
  detailWithHeading: {
    ifYouDeferYourPension: {
      heading: 'If you defer your pension',
      text: 'You can’t get this benefit if you don’t receive the Old Age Security pension. Your Guaranteed Income Supplement payments won’t increase if you defer your pension.',
    },
    oasDeferralApplied: {
      heading: 'How deferral affects your payments',
      text: 'You have deferred your OAS benefits by {OAS_DEFERRAL_YEARS}. This means that your OAS payments will start once you turn {OAS_DEFERRAL_AGE}, and you will be receiving an extra {OAS_DEFERRAL_INCREASE} per month.',
    },
    oasDeferralAvailable: {
      heading: 'You may be able to defer your payments',
      text: 'Learn more about the {LINK_OAS_DEFER_CLICK_HERE}.',
    },
    oasClawback: {
      heading: 'You may have to repay a part of your pension',
      text: 'Since {INCOME_SINGLE_OR_COMBINED} is over {OAS_RECOVERY_TAX_CUTOFF}, you may have to repay {OAS_CLAWBACK} in {LINK_RECOVERY_TAX}.',
    },
    oasIncreaseAt75: {
      heading: 'Your payments will increase when you turn 75',
      text: 'Once you turn 75, your payments will increase by 10%.',
    },
    oasIncreaseAt75Applied: {
      heading: "Your payments have increased because you're over 75",
      text: "Since you're over the age of 75, your payments have increased by 10%.",
    },
    calculatedBasedOnIndividualIncome: {
      heading: 'Some amounts were calculated based on individual income',
      text: `Since you and your partner are living apart for reasons beyond your control, you're eligible for higher monthly payments.`,
    },
    partnerEligible: {
      heading: 'Your partner may be eligible',
      text: 'Based on what you told us, your partner could receive {PARTNER_BENEFIT_AMOUNT} every month. They can use the estimator to get detailed results.',
    },
    partnerDependOnYourIncome: {
      heading: 'Your partner may be eligible',
      text: 'Depending on your income, you can expect to receive around {PARTNER_BENEFIT_AMOUNT} every month. Provide your income to get an accurate estimate.',
    },
    partnerEligibleButAnsweredNo: {
      heading: 'Your partner may be eligible',
      text: 'You can <a href="/en/questions#partnerBenefitStatus" class="text-default-text" style="text-decoration: underline">edit your answers</a> to see what you and your partner could get if they received the Old Age Security pension.',
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
  oasDeferralTable: {
    title: 'Estimated deferral amounts',
    headingAge: 'If you wait until age...',
    futureHeadingAge: 'If you start receiving at age...',
    headingAmount: 'Your monthly payment could be...',
  },
  links,
  incomeSingle: 'your income',
  incomeCombined: "you and your partner's combined income",
  opensNewWindow: 'opens a new window',
  nextStepTitle: 'Next steps',
  yes: 'Yes',
  no: 'No',
  year: 'year',
  month: 'month',
  months: 'months',
  your: 'your income',
  complete: 'complete income information',
  at: 'At',
  atAge: ',',
}
export default en
