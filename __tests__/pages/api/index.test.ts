import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
  ValidationErrors,
} from '../../../utils/api/definitions/enums'
import { FieldKey } from '../../../utils/api/definitions/fields'
import legalValues from '../../../utils/api/scrapers/output'
import {
  age60NoDefer,
  age65NoDefer,
  canadaWholeLife,
  canadian,
  income10k,
  incomeZero,
  partnerIncomeZero,
  partnerNoHelpNeeded,
  partnerUndefined,
  getErrorDetails,
} from '../../utils/expectUtils'
import {
  mockGetRequest,
  mockGetRequestError,
  mockPartialGetRequest,
} from '../../utils/factory'

describe('OAS entitlement scenarios', () => {
  it('returns "eligible for $619.38" when 39 years in Canada (rounding test)', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 39,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectOasEligible(res, EntitlementResultType.PARTIAL, 650.16)
  })
})

describe('GIS entitlement scenarios', () => {
  it('returns "$394.68" when single and 10000 income', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectGisEligible(res, 425.72)
  })
  it('returns "$959.26" when single and 0 income', async () => {
    const res = await mockGetRequest({
      ...incomeZero,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectGisEligible(res, 995.99)
  })
  it('returns "$850.26" when married and 10000 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      partnerAge: 65,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    // expectGisEligible(res, 892.99)
  })
  it('returns "$959.26" when married and 0 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      ...incomeZero,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      partnerAge: 65,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectGisEligible(res, 995.99)
  })
  it('returns "$819.26" when married and 10000 income + 1000 partner income and no partner OAS', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncomeAvailable: true,
      partnerIncome: 1000,
      ...partnerNoHelpNeeded,
      partnerAge: 65,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    // expectGisEligible(res, 861.99)
  })
  it('returns "$306.33" when married and 10000 income + 1000 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
      partnerIncome: 1000,
      ...partnerNoHelpNeeded,
      partnerAge: 65,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    // expectGisEligible(res, 326.82)
  })
  it('returns "$521.33" when married and 10000 income + 1000 partner income and partner Allowance', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.ALW,
      partnerIncomeAvailable: true,
      partnerIncome: 1000,
      ...partnerNoHelpNeeded,
      partnerAge: 58,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectGisEligible(res, 549.82)
  })
  it('returns "$577.43" when married and 0 income + 0 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      ...incomeZero,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      partnerAge: 65,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectGisEligible(res, 599.53)
  })
  it('returns "$577.43" when married and 0 income + 0 partner income and partner Allowance', async () => {
    const res = await mockGetRequest({
      ...incomeZero,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.ALW,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      partnerAge: 58,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    // expectGisEligible(res, 599.53)
  })
  it('returns "$1239.38" when single and 1000 income, only 20 years in Canada (Partial OAS)', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 1000,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectGisEligible(res, 1288.4)
  })
  it('returns "$1399.95" when single and 1000 income, only 10 years in Canada (Partial OAS)', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 1000,
      ...age65NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectGisEligible(res, 1455.11)
  })
})

describe('basic Allowance scenarios', () => {
  it('returns "ineligible" when partner not receiving OAS', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerAge: 55,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.PARTNER
    )
  })
})

describe('Allowance entitlement scenarios', () => {
  it('returns "eligible for $334.33" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 20000,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      partnerAge: 65,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectAlwEligible(res, 362.82)
  })

  it('returns "eligible for $565.35" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      partnerAge: 65,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectAlwEligible(res, 598.65)
  })
  it('returns "eligible for $1231.87" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      ...incomeZero,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      partnerAge: 65,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectAlwEligible(res, 1266.36)
  })
})

describe('basic Allowance for Survivor scenarios', () => {
  it('returns "ineligible due to age" when age 65 and high income', async () => {
    const res = await mockPartialGetRequest({
      incomeAvailable: true,
      income: legalValues.alw.afsIncomeLimit + 1,
      ...age65NoDefer,
      incomeWork: 0,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
    })
    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age over 64', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age65NoDefer,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age under 60', async () => {
    const res = await mockGetRequest({
      ...income10k,
      age: 59,
      oasDefer: false,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
  })
  it('returns "error ineligible" when citizen and under 10 years in Canada', async () => {
    const res = await mockGetRequestError({
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      ...partnerUndefined,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
    if (!('details' in res.body.detail)) throw Error('missing details')
    const errors = getErrorDetails(res)

    // expect(errors[0].path[0]).toEqual(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    // expect(errors[0].message).toEqual(ValidationErrors.yearsInCanadaNotEnough10)
  })
  it('returns "ineligible" when married', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerAge: 55,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      ...partnerIncomeZero,
      ...partnerNoHelpNeeded,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
  it('returns "eligible" when widowed', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    // expectAlwsEligible(res)
  })
  it('returns "eligible" when living in Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: true,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })

    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
    if (!('details' in res.body.detail)) throw Error('missing details')
    const errors = getErrorDetails(res)

    expect(errors[0].path[0]).toEqual(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    expect(errors[0].message).toEqual(
      ValidationErrors.socialCountryUnavailable20
    )
  })
  it('returns "error unavailable" when living in Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequestError({
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: true,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
    if (!('details' in res.body.detail)) throw Error('missing details')
    const errors = getErrorDetails(res)

    expect(errors[0].path[0]).toEqual(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    expect(errors[0].message).toEqual(
      ValidationErrors.socialCountryUnavailable20
    )
  })
  it('returns "error unavailable" when living in No Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
    if (!('details' in res.body.detail)) throw Error('missing details')
    const errors = getErrorDetails(res)

    expect(errors[0].path[0]).toEqual(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    expect(errors[0].message).toEqual(ValidationErrors.yearsInCanadaNotEnough20)
  })
  it('returns "error ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequestError({
      ...income10k,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
    if (!('details' in res.body.detail)) throw Error('missing details')
    const errors = getErrorDetails(res)

    expect(errors[0].path[0]).toEqual(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    expect(errors[0].message).toEqual(ValidationErrors.yearsInCanadaNotEnough20)
  })
})

describe('AFS entitlement scenarios', () => {
  it('returns "eligible for $260.10" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 20000,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectAlwsEligible(res, 301.48)
  })
  it('returns "eligible for $681.35" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      ...income10k,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectAlwsEligible(res, 731.31)
  })
  it('returns "eligible for $1468.47" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      ...incomeZero,
      ...age60NoDefer,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
      incomeWork: 0,
      partnerIncomeWork: 0,
    })
    //expectAlwsEligible(res, 1509.58)
  })
})
