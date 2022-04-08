import {
  EntitlementResultType,
  EstimationSummaryState,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import { legalValues } from '../../../utils/api/scrapers/output'
import {
  expectAfsEligible,
  expectAlwEligible,
  expectGisEligible,
  expectOasEligible,
  expectOasGisEligible,
  expectOasGisTooYoung,
} from './expectUtils'
import { mockGetRequest, mockPartialGetRequest } from './factory'

describe('OAS entitlement scenarios', () => {
  it('returns "eligible for $317.63" when 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectOasEligible(res, EntitlementResultType.PARTIAL, 324.33)
  })
  it('returns "eligible for $619.38" when 39 years in Canada (rounding test)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 39,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectOasEligible(res, EntitlementResultType.PARTIAL, 632.45)
  })
  it('returns "eligible for $635.26" when 40 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectOasEligible(res)
  })
})

describe('GIS entitlement scenarios', () => {
  it('returns "$394.68" when single and 10000 income', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 402.79)
  })
  it('returns "$959.26" when single and 0 income', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 968.86)
  })
  it('returns "$850.26" when married and 10000 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 861.86)
  })
  it('returns "$959.26" when married and 0 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 968.86)
  })
  it('returns "$819.26" when married and 10000 income + 1000 partner income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 1000,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 830.86)
  })
  it('returns "$306.33" when married and 10000 income + 1000 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 1000,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 311.68)
  })
  it('returns "$521.33" when married and 10000 income + 1000 partner income and partner Allowance', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.ALW,
      partnerIncome: 1000,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 528.68)
  })
  it('returns "$577.43" when married and 0 income + 0 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 583.2)
  })
  it('returns "$577.43" when married and 0 income + 0 partner income and partner Allowance', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.ALW,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 583.2)
  })
  it('returns "$1239.38" when single and 1000 income, only 20 years in Canada (Partial OAS)', async () => {
    const res = await mockGetRequest({
      income: 1000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 1252.2)
  })
  it('returns "$1399.95" when single and 1000 income, only 10 years in Canada (Partial OAS)', async () => {
    const res = await mockGetRequest({
      income: 1000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectGisEligible(res, 1414.36)
  })
})

describe('basic Allowance scenarios', () => {
  it('returns "ineligible" when widowed', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })

  it('returns "ineligible" when partner not receiving OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.PARTNER
    )
  })

  it('returns "eligible" when living in No Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAlwEligible(res)
  })
  it('returns "ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
  })
})

describe('Allowance entitlement scenarios', () => {
  it('returns "eligible for $334.33" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAlwEligible(res, 341.68)
  })

  it('returns "eligible for $565.35" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAlwEligible(res, 565.35)
  })
  it('returns "eligible for $1231.87" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAlwEligible(res, 1231.87)
  })
})

describe('basic Allowance for Survivor scenarios', () => {
  it(`returns "ineligible" when income equal to ${legalValues.MAX_AFS_INCOME}`, async () => {
    const res = await mockGetRequest({
      income: legalValues.MAX_AFS_INCOME,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "ineligible due to age" when age 65 and high income', async () => {
    const res = await mockPartialGetRequest({
      income: 26257,
      age: 65,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age over 64', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age under 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 59,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
  })
  it('returns "unavailable" when not citizen (other)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
  })
  it('returns "ineligible" when citizen and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
  })
  it('returns "ineligible" when married', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
  it('returns "eligible" when widowed', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAfsEligible(res)
  })
  it('returns "eligible" when living in Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAfsEligible(res)
  })
  it('returns "unavailable" when living in Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
  })
  it('returns "eligible" when living in No Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAfsEligible(res)
  })
  it('returns "ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
  })
  it('returns "ineligible" when under 60, legal=other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
  })
})

describe('AFS entitlement scenarios', () => {
  it('returns "eligible for $260.10" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAfsEligible(res, 270.73)
  })
  it('returns "eligible for $681.35" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAfsEligible(res, 694.4)
  })
  it('returns "eligible for $1468.47" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAfsEligible(res, 1468.47)
  })
})

describe('Help Me Find Out scenarios', () => {
  it(`works when client old, partner old (partner=noOas, therefore gis income limit ${legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW}, gis table 3)`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 0,
      partnerEverLivedSocialCountry: false,
    }
    let res = await mockGetRequest(input)
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW - 1,
    })
    expectOasGisEligible(res)
    expect(res.body.results.gis.entitlement.result).toEqual(0.79) // table 3
  })
  it(`works when client old, partner old (partner=partialOas, therefore gis income limit ${legalValues.MAX_GIS_INCOME_PARTNER_OAS}, gis table 2)`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 20,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS - 1,
    })
    expectOasGisEligible(res)
    expect(res.body.results.gis.entitlement.result).toEqual(0.68) // table 2
  })
  it(`works when client old, partner old (partner=fullOas, therefore gis income limit ${legalValues.MAX_GIS_INCOME_PARTNER_OAS}, gis table 2)`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS - 1,
    })
    expectOasGisEligible(res)
    expect(res.body.results.gis.entitlement.result).toEqual(0.68) // table 2
  })
  it(`works when client old, partner young (partner=noAllowance, therefore gis table 3)`, async () => {
    const input = {
      income: legalValues.MAX_ALW_INCOME, // too high for allowance
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expectOasGisEligible(res)

    expect(res.body.results.gis.entitlement.result).toEqual(223.79) // table 3
  })
  it('works when client old, partner young (partner=allowance, therefore gis table 4)', async () => {
    const input = {
      income: legalValues.MAX_ALW_INCOME - 1, // okay for allowance
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expectOasGisEligible(res)
    expect(res.body.results.gis.entitlement.result).toEqual(224.11) // table 4
  })
  it('works when client young, partner young (no one gets anything)', async () => {
    const input = {
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_INELIGIBLE
    )
    expectOasGisTooYoung(res)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.PARTNER
    )
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
  it('works when client young, partner old (partner=gis, therefore client alw eligible)', async () => {
    const input = {
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
    expectOasGisTooYoung(res)
    expectAlwEligible(res, 1231.87) // table 4
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
  it('works when client young, partner old (partner=noGis, therefore client alw ineligible)', async () => {
    const input = {
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.NO_AGREEMENT, // gis ineligible
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_INELIGIBLE
    )
    expectOasGisTooYoung(res)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.PARTNER
    )
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
})
