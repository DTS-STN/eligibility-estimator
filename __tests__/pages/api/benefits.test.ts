import {
  EntitlementResultType,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
  SummaryState,
} from '../../../utils/api/definitions/enums'
import { FieldKey } from '../../../utils/api/definitions/fields'
import roundToTwo from '../../../utils/api/helpers/roundToTwo'
import legalValues from '../../../utils/api/scrapers/output'
import {
  age60NoDefer,
  age65NoDefer,
  age75NoDefer,
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
  income10k,
  partnerIncomeZero,
  partnerNoHelpNeeded,
  partnerUndefined,
} from './expectUtils'
import { mockGetRequest, mockGetRequestError } from './factory'

describe('consolidated benefit tests: unavailable', () => {
  it('returns "unavailable" - living in Canada, under 10 years in Canada, lived in social country', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      livedOutsideCanada: true,
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
      ...income10k,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(SummaryState.UNAVAILABLE)
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
      ...income10k,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(SummaryState.UNAVAILABLE)
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
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
    })
    expect(res.body.summary.state).toEqual(SummaryState.UNAVAILABLE)
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
      incomeAvailable: true,
      income: 20000,
      age: 50,
      oasDefer: false,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
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
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
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
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
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
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
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
  it(`OAS: max income is ${legalValues.oas.incomeLimit}`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.oas.incomeLimit,
      ...age65NoDefer,
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
      income: legalValues.oas.incomeLimit - 1,
    })
    expectOasEligible(resSuccess)
  })

  it(`OAS: max income at 75 is ${legalValues.oas.incomeLimit75}`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.oas.incomeLimit75,
      ...age75NoDefer,
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
      income: legalValues.oas.incomeLimit75 - 1,
    })
    expectOasEligible(
      resSuccess,
      EntitlementResultType.FULL,
      legalValues.oas.amount75
    )
  })

  it(`GIS: max income when single is ${legalValues.gis.singleIncomeLimit}`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.gis.singleIncomeLimit,
      ...age65NoDefer,
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
      income: legalValues.gis.singleIncomeLimit - 1,
    })
    expectGisEligible(res)
  })
  it(`GIS: max income when married and no partner OAS is ${legalValues.gis.spouseNoOasIncomeLimit}`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.gis.spouseNoOasIncomeLimit,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.gis.spouseNoOasIncomeLimit - 1,
    })
    expectGisEligible(res)
  })
  it(`GIS: max income when married and partner OAS is ${legalValues.gis.spouseOasIncomeLimit}`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.gis.spouseOasIncomeLimit,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.gis.spouseOasIncomeLimit - 1,
    })
    expectGisEligible(res)
  })
  it(`GIS: max income when married and partner ALW is ${legalValues.gis.spouseAlwIncomeLimit}`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.gis.spouseAlwIncomeLimit,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.ALW,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.gis.spouseAlwIncomeLimit - 1,
    })
    expectGisEligible(res)
  })
  it(`ALW: max income when married and partner OAS is ${legalValues.alw.alwIncomeLimit}`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.alw.alwIncomeLimit,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
    }
    let res = await mockGetRequest(input)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.alw.alwIncomeLimit - 1,
    })
    expectAlwEligible(res)
  })

  it(`AFS: max income when widowed is ${legalValues.alw.afsIncomeLimit}`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.alw.afsIncomeLimit,
      ...age60NoDefer,
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
      income: legalValues.alw.afsIncomeLimit - 1,
    })
    expectAfsEligible(res)
  })
})

describe('consolidated benefit tests: eligible: 65+', () => {
  it('returns "eligible" - separated, partial oas', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expectOasGisEligible(
      res,
      EntitlementResultType.PARTIAL,
      roundToTwo(legalValues.oas.amount / 4)
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "eligible" - single, 20 years in Canada, high income (partial gis edge case)', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 100000,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expectOasGisEligible(
      res,
      EntitlementResultType.PARTIAL,
      roundToTwo(legalValues.oas.amount / 2),
      333.41
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "eligible" - single, living in Agreement, 20 years in Canada', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expectOasEligible(
      res,
      EntitlementResultType.PARTIAL,
      roundToTwo(legalValues.oas.amount / 2)
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
      ...income10k,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expectOasEligible(
      res,
      EntitlementResultType.PARTIAL,
      roundToTwo(legalValues.oas.amount / 2)
    )
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwAfsTooOld(res)
  })

  it('returns "eligible" - married, full oas (no clawback)', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
      partnerIncome: 10000,
      ...partnerNoHelpNeeded,
    })
    expectOasGisEligible(res)
    expectAlwAfsTooOld(res)

    // test clawback: expect none due to low income
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    // test oas increase at 75
    expect(res.body.results.oas.entitlement.resultAt75).toEqual(
      roundToTwo(res.body.results.oas.entitlement.result * 1.1)
    )
  })

  it('returns "eligible" - deferral', async () => {
    const deferralIncreaseByMonth = 0.006 // the increase to the monthly payment per month deferred
    const oasBaseAmount = legalValues.oas.amount
    const deferYears = 5
    const oasDeferredAmount = roundToTwo(
      oasBaseAmount * (1 + deferYears * 12 * deferralIncreaseByMonth)
    )

    let inputBase = {
      ...income10k,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
      partnerIncome: 10000,
      ...partnerNoHelpNeeded,
    }
    let inputNoDefer65 = { ...inputBase, age: 65, oasDefer: false, oasAge: 65 }
    let res = await mockGetRequest(inputNoDefer65)
    expect(res.body.results.oas.entitlement.result).toEqual(oasBaseAmount)

    let inputNoDefer70 = { ...inputBase, age: 70, oasDefer: false, oasAge: 65 }
    res = await mockGetRequest(inputNoDefer70)
    expect(res.body.results.oas.entitlement.result).toEqual(oasBaseAmount)

    let input65Defer70 = { ...inputBase, age: 65, oasDefer: true, oasAge: 70 }
    res = await mockGetRequest(input65Defer70)
    expect(res.body.results.oas.entitlement.result).toEqual(oasDeferredAmount)

    let input70Defer70 = { ...inputBase, age: 70, oasDefer: true, oasAge: 70 }
    res = await mockGetRequest(input70Defer70)
    expect(res.body.results.oas.entitlement.result).toEqual(oasDeferredAmount)

    let input75Defer70 = { ...inputBase, age: 75, oasDefer: true, oasAge: 70 }
    res = await mockGetRequest(input75Defer70)
    expect(res.body.results.oas.entitlement.result).toEqual(
      roundToTwo(oasDeferredAmount * 1.1) // age 75 gets 10% more
    )
  })

  it('returns "eligible" - married, income high so OAS only (with clawback)', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: legalValues.oas.incomeLimit - 1,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
    })
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwAfsTooOld(res)

    // test clawback: expect some due to high income
    expect(res.body.results.oas.entitlement.clawback).toEqual(7873.65)

    // test oas increase at 75
    expect(res.body.results.oas.entitlement.resultAt75).toEqual(
      roundToTwo(res.body.results.oas.entitlement.result * 1.1)
    )
  })

  it('returns "eligible" - married, full oas, age 75', async () => {
    const res = await mockGetRequest({
      ...income10k,
      age: 75,
      oasDefer: false,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
      partnerIncome: 10000,
      ...partnerNoHelpNeeded,
    })
    expectOasGisEligible(
      res,
      EntitlementResultType.FULL,
      roundToTwo(legalValues.oas.amount * 1.1)
    )
    expectAlwAfsTooOld(res)

    // test clawback: expect none due to low income
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    // test oas increase at 75: expect same result since current age is 75
    expect(res.body.results.oas.entitlement.resultAt75).toEqual(
      roundToTwo(res.body.results.oas.entitlement.result)
    )
  })
})

describe('consolidated benefit tests: eligible: 60-64', () => {
  it('returns "ALW eligible" - married', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
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
      ...income10k,
      ...age60NoDefer,
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
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
    })
    expectOasGisTooYoung(res)
    expectAlwEligible(res)
  })
  it('returns "ALW eligible" - married, living in Agreement, 10 years in Canada', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
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
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
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
      ...income10k,
      age: 64,
      oasDefer: false,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
    })
    expectOasGisTooYoung(res)
    expectAlwEligible(res)
  })
})
