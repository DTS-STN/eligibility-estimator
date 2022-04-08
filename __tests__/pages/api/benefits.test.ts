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
import { FieldKey } from '../../../utils/api/definitions/fields'
import { legalValues } from '../../../utils/api/scrapers/output'
import {
  expectAllIneligible,
  expectAlwAfsTooOld,
  expectOasEligible,
  expectOasGisTooYoung,
} from './expectUtils'
import { mockGetRequest, mockGetRequestError } from './factory'

describe('consolidated benefit tests: unavailable', () => {
  it('returns "unavailable" when sponsored', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
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
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "unavailable" when legal other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
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
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "unavailable" when living in Canada and under 10 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: true,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expectAlwAfsTooOld(res)
  })

  it('returns "unavailable" when living in No Agreement and under 20 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "unavailable" when age 60 living in Agreement and under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
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
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwAfsTooOld(res)
  })
  it('returns "unavailable" when age 60 living in Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
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
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.UNAVAILABLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
  })
})

describe('consolidated benefit tests: ineligible', () => {
  it('returns "ineligible" when age 50', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 50,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAllIneligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
  it('returns "ineligible" - age 50, legal sponsored', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 50,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAllIneligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })

  it('returns "ineligible" when living in Canada and under 10 years in Canada and not lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectAllIneligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })

  it('returns "ineligible" when single and not living in Canada and under 20 years in Canada and not lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
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
    expectAllIneligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
})

describe('consolidated benefit tests: max income checks', () => {
  it(`returns income error when income equal to ${legalValues.MAX_OAS_INCOME}`, async () => {
    const res = await mockGetRequestError({
      income: legalValues.MAX_OAS_INCOME,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
    if (!('details' in res.body.detail)) throw Error('missing details')
    expect(res.body.detail.details[0].path[0]).toEqual(FieldKey.INCOME)
  })

  it(`GIS: max income when single is ${legalValues.MAX_GIS_INCOME_SINGLE}`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_SINGLE,
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
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_SINGLE - 1,
    })
    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  })
  it(`GIS: max income when married and no partner OAS is ${legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW}`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW,
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
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW - 1,
    })
    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  })
  it(`GIS: max income when married and partner OAS is ${legalValues.MAX_GIS_INCOME_PARTNER_OAS}`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS,
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
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS - 1,
    })
    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  })
  it(`ALW: max income when married and partner OAS is ${legalValues.MAX_ALW_INCOME}`, async () => {
    const input = {
      income: legalValues.MAX_ALW_INCOME,
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
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_ALW_INCOME - 1,
    })
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.NONE)
  })
})

describe('consolidated benefit tests: eligible: 65+', () => {
  it('returns "eligible" - single, partial oas', async () => {
    const res = await mockGetRequest({
      income: 10000,
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
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expectAlwAfsTooOld(res)
  })

  it('returns "eligible" - single, living in Agreement, 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
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
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "eligible" - married, full oas', async () => {
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
      partnerIncome: 10000,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expectAlwAfsTooOld(res)
  })
  it('returns "eligible" - married, income high so OAS only', async () => {
    const res = await mockGetRequest({
      income: legalValues.MAX_OAS_INCOME - 1,
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
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwAfsTooOld(res)
  })
})

describe('consolidated benefit tests: eligible: 60-64', () => {
  it('returns "eligible" when citizen and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
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
    expectOasGisTooYoung(res)
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.NONE)
  })

  it('returns "ALW eligible" when living in Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
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
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.NONE)
  })

  it('returns "ALW eligible" when 64 and 19 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 64,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      partnerAge: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerCanadaWholeLife: undefined,
      partnerYearsInCanadaSince18: undefined,
      partnerEverLivedSocialCountry: undefined,
    })
    expectOasGisTooYoung(res)
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.NONE)
  })
})
