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
import roundToTwo from '../../../utils/api/helpers/roundToTwo'
import { legalValues } from '../../../utils/api/scrapers/output'
import {
  canadaWholeLife,
  canadian,
  expectAfsEligible,
  expectAllIneligible,
  expectAlwAfsTooOld,
  expectAlwEligible,
  expectGisEligible,
  expectOasEligible,
  expectOasGisEligible,
  expectOasGisTooYoung,
  expectOasGisUnavailable,
  partnerNoHelpNeeded,
  partnerUndefined,
} from './expectUtils'
import { mockGetRequest, mockGetRequestError } from './factory'

describe('consolidated benefit tests: unavailable', () => {
  it('returns "unavailable" - sponsored', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      ...canadaWholeLife,
      ...partnerUndefined,
    })
    expectOasGisUnavailable(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "unavailable" - legal other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      ...canadaWholeLife,
      ...partnerUndefined,
    })
    expectOasGisUnavailable(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "unavailable" - living in Canada, under 10 years in Canada, lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: true,
      ...partnerUndefined,
    })
    expectOasGisUnavailable(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expectAlwAfsTooOld(res)
  })

  it('returns "unavailable" - living in No Agreement, under 20 years in Canada, lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
      ...partnerUndefined,
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

  it('returns "unavailable" - living in Agreement, under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
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
  it('returns "unavailable" - age 60, living in Agreement, under 10 years in Canada', async () => {
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
      ...partnerNoHelpNeeded,
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
  it('returns "ineligible" - age 50', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 50,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      ...partnerNoHelpNeeded,
    })
    expectAllIneligible(res)
    expectOasGisTooYoung(res)
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
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      ...partnerNoHelpNeeded,
    })
    expectAllIneligible(res)
    expectOasGisTooYoung(res)
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })

  it('returns "ineligible" - age 60, married, living in Canada, under 10 years in Canada, not lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      ...partnerNoHelpNeeded,
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

  it('returns "ineligible" - age 60, single, living in No Agreement, under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: false,
      ...partnerUndefined,
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

  it('returns "ineligible" - age 60, married, living in No Agreement, under 10 years in Canada', async () => {
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
      ...partnerNoHelpNeeded,
    })
    expectAllIneligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
})

describe('consolidated benefit tests: max income checks', () => {
  it(`OAS: max income is ${legalValues.MAX_OAS_INCOME}`, async () => {
    const input = {
      income: legalValues.MAX_OAS_INCOME,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
    }
    let resError = await mockGetRequestError(input)
    expect(resError.status).toEqual(400)
    expect(resError.body.error).toEqual(ResultKey.INVALID)
    if (!('details' in resError.body.detail)) throw Error('missing details')
    expect(resError.body.detail.details[0].path[0]).toEqual(FieldKey.INCOME)
    let resSuccess = await mockGetRequest({
      ...input,
      income: legalValues.MAX_OAS_INCOME - 1,
    })
    expectOasEligible(resSuccess)
  })

  it(`GIS: max income when single is ${legalValues.MAX_GIS_INCOME_SINGLE}`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_SINGLE,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
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
    expectGisEligible(res)
  })
  it(`GIS: max income when married and no partner OAS is ${legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW}`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
      ...partnerNoHelpNeeded,
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
    expectGisEligible(res)
  })
  it(`GIS: max income when married and partner OAS is ${legalValues.MAX_GIS_INCOME_PARTNER_OAS}`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      ...partnerNoHelpNeeded,
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
    expectGisEligible(res)
  })
  it(`ALW: max income when married and partner OAS is ${legalValues.MAX_ALW_INCOME}`, async () => {
    const input = {
      income: legalValues.MAX_ALW_INCOME,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      ...partnerNoHelpNeeded,
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
    expectAlwEligible(res)
  })

  it(`AFS: max income when widowed is ${legalValues.MAX_AFS_INCOME}`, async () => {
    const input = {
      income: legalValues.MAX_AFS_INCOME,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_AFS_INCOME - 1,
    })
    expectAfsEligible(res)
  })
})

describe('consolidated benefit tests: eligible: 65+', () => {
  it('returns "eligible" - single, partial oas', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expectOasGisEligible(
      res,
      EntitlementResultType.PARTIAL,
      roundToTwo(legalValues.MAX_OAS_ENTITLEMENT / 4)
    )
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
      ...partnerUndefined,
    })
    expectOasEligible(
      res,
      EntitlementResultType.PARTIAL,
      roundToTwo(legalValues.MAX_OAS_ENTITLEMENT / 2)
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "eligible" - single, living in No Agreement, 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expectOasEligible(
      res,
      EntitlementResultType.PARTIAL,
      roundToTwo(legalValues.MAX_OAS_ENTITLEMENT / 2)
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
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      ...partnerNoHelpNeeded,
    })
    expectOasGisEligible(res)
    expectAlwAfsTooOld(res)
  })
  it('returns "eligible" - married, income high so OAS only', async () => {
    const res = await mockGetRequest({
      income: legalValues.MAX_OAS_INCOME - 1,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      ...partnerNoHelpNeeded,
    })
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwAfsTooOld(res)
  })
})

describe('consolidated benefit tests: eligible: 60-64', () => {
  it('returns "ALW eligible" - married', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      ...partnerNoHelpNeeded,
    })
    expectOasGisTooYoung(res)
    expectAlwEligible(res)
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })

  it('returns "AFS eligible" - widowed', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
    })
    expectOasGisTooYoung(res)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expectAfsEligible(res)
  })

  it('returns "ALW eligible" - married, 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      ...partnerNoHelpNeeded,
    })
    expectOasGisTooYoung(res)
    expectAlwEligible(res)
  })
  it('returns "ALW eligible" - married, living in Agreement, 10 years in Canada', async () => {
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
      ...partnerNoHelpNeeded,
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
    expectAlwEligible(res)
  })

  it('returns "ALW eligible" - married, living in No Agreement, 10 years in Canada', async () => {
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
      ...partnerNoHelpNeeded,
    })
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
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
    expectAlwEligible(res)
  })

  it('returns "ALW eligible" - age 64, married, 19 years in Canada, lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 64,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 0,
      ...partnerNoHelpNeeded,
    })
    expectOasGisTooYoung(res)
    expectAlwEligible(res)
  })
})
