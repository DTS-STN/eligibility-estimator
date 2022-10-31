import { LinkIcon } from '../../../utils/api/definitions/enums'
import { LinkDefinitions } from './index'

export const links: LinkDefinitions = {
  faq: {
    text: 'Frequently asked questions',
    url: '#faqLink',
    order: 1,
  },
  contactSC: {
    text: 'Contact Service Canada',
    url: 'https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html',
    order: 2,
  },
  overview: {
    oas: {
      text: 'Learn more about Old Age Security',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.htm',
      order: 3,
      icon: LinkIcon.info,
    },
    gis: {
      text: 'Learn more about Guaranteed Income Supplement',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement.html',
      order: 4,
      icon: LinkIcon.info,
    },
    alw: {
      text: 'Learn more about Allowance',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance.html',
      order: 5,
      icon: LinkIcon.info,
    },
    afs: {
      text: 'Learn more about Allowance for the Survivor',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance-survivor.html',
      order: 6,
      icon: LinkIcon.info,
    },
  },
  oasMaxIncome: {
    text: 'Old Age Security: Maximum Income',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.htm',
    order: 7,
  },
  cpp: {
    text: 'CPP Retirement pension: Overview',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp.html',
    order: 8,
  },
  cric: {
    text: 'Canadian Retirement Income Calculator',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/retirement-income-calculator.html',
    order: 9,
  },
  paymentOverview: {
    text: 'How payment rates are calculated',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
    order: 10,
  },
  gisEntitlement: {
    text: 'Guaranteed Income Supplement: Payment Overview',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/benefit-amount.html',
    order: 11,
  },
  alwEntitlement: {
    text: 'Allowance: Payment Overview',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance/benefit-amount.html',
    order: 12,
  },
  afsEntitlement: {
    text: 'Allowance for the Survivor: Payment Overview',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance-survivor/benefit-amount.html',
    order: 13,
  },
  outsideCanada: {
    text: 'Living outside Canada: Overview',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/cpp-international.htm',
    order: 14,
  },
  outsideCanadaOas: {
    text: 'Living outside Canada: Old Age Security',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.htm',
    order: 15,
  },
  oasPartial: {
    text: 'Old Age Security: Less than 40 years in Canada',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html#h2.3-3.1',
    order: 16,
  },
  oasRecoveryTax: {
    text: 'Old Age Security: Recovery Tax',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.htm',
    order: 17,
  },
  oasDefer: {
    text: 'Old Age Security: Deferring your first payment',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html#h2.2',
    order: 18,
  },
  oasRetroactive: {
    text: 'Old Age Security: Retroactive Payments',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html#:~:text=Retroactive%20payments',
    order: 19,
  },
  apply: {
    oas: {
      text: 'Apply for Old Age Security',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/apply.html',
      order: 20,
      icon: LinkIcon.link,
    },
    gis: {
      text: 'Apply for Guaranteed Income Supplement',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/apply.html',
      order: 21,
      icon: LinkIcon.link,
    },
    alw: {
      text: 'Apply for Allowance',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance/apply.html',
      order: 22,
      icon: LinkIcon.link,
    },
    afs: {
      text: 'Apply for Allowance for the Survivor',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance-survivor/apply.html',
      order: 23,
      icon: LinkIcon.link,
    },
  },
  SC: {
    text: 'contact Service Canada',
    url: 'https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html',
    order: -1,
  },
  oasDeferClickHere: {
    text: 'click here',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html#h2.2',
    order: -1,
  },
  oasDeferInline: {
    text: 'OAS Deferral',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html#h2.2',
    order: -1,
  },
  socialAgreement: {
    text: 'social security agreement',
    url: 'https://www.canada.ca/en/revenue-agency/services/tax/canada-pension-plan-cpp-employment-insurance-ei-rulings/international-social-security-agreements-canada-pension-plan/what-purpose-international-social-security-agreements.html#tbl',
    order: -1,
  },
  reasons: {
    oas: {
      text: 'View full eligibility criteria for Old Age Security',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/eligibility.html#gc-document-nav',
      order: -1,
      icon: LinkIcon.note,
    },
    gis: {
      text: 'View full eligibility criteria for Guaranteed Income Supplement',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/eligibility.html',
      order: -1,
      icon: LinkIcon.note,
    },
    alw: {
      text: 'View full eligibility criteria for Allowance',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance/eligibility.html',
      order: -1,
      icon: LinkIcon.note,
    },
    afs: {
      text: 'View full eligibility criteria for Allowance for the Survivor',
      url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance-survivor/eligibility.html',
      order: -1,
      icon: LinkIcon.note,
    },
  },
  oasRecoveryTaxInline: {
    text: 'recovery tax',
    url: 'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.htm',
    order: -1,
  },
}
