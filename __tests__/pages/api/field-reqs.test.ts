import {
  EstimationSummaryState,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  OutsideCanada,
} from '../../../utils/api/definitions/enums'
import { FieldKey } from '../../../utils/api/definitions/fields'
import {
  canadaWholeLife,
  canadian,
  partnerNoHelpNeeded,
  partnerUndefined,
} from './expectUtils'
import { mockGetRequest } from './factory'

describe('field requirement analysis', () => {
  it('requires only income when nothing provided', async () => {
    const res = await mockGetRequest({
      income: undefined,
      age: undefined,
      oasAge: undefined,
      maritalStatus: undefined,
      livingCountry: undefined,
      legalStatus: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
    ])
  })

  it('requires fields when only income provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: undefined,
      oasAge: undefined,
      maritalStatus: undefined,
      livingCountry: undefined,
      legalStatus: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.MARITAL_STATUS,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
    ])
  })

  it('requires fields when only income/age provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: undefined,
      livingCountry: undefined,
      legalStatus: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.MARITAL_STATUS,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
    ])
  })

  it('requires fields when only income/age/marital provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: undefined,
      legalStatus: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })

  it('requires fields when only income/age/marital/country provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })

  it('requires fields when only income/age/marital/country/legal provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })

  it('requires fields when only income/age/marital/country/legal/lifeCanada provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: OutsideCanada.YES,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })

  it('requires fields when only income/age/marital/country/legal/lifeCanada/years provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: OutsideCanada.YES,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })

  it('requires fields when only income/age/marital/country/legal/lifeCanada/years/socialCountry provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: OutsideCanada.YES,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: true,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })

  it('requires fields when only income/age/marital/country/legal/lifeCanada/years/socialCountry/partnerBenefits provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: OutsideCanada.YES,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: undefined,
      ...partnerNoHelpNeeded,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.PARTNER_INCOME])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })

  it('requires no fields when all provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: OutsideCanada.YES,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncome: 10000,
      ...partnerNoHelpNeeded,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.missingFields).toEqual([])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
})

describe('field requirements analysis: conditional fields', () => {
  it('requires "yearsInCanadaSince18" when lifeCanada=false', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      canadaWholeLife: OutsideCanada.YES,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.YEARS_IN_CANADA_SINCE_18])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
    ])
  })

  it('requires "everLivedSocialCountry" when living in Canada and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      canadaWholeLife: OutsideCanada.YES,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.EVER_LIVED_SOCIAL_COUNTRY])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
    ])
  })

  it('requires "everLivedSocialCountry" when living in No Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      canadaWholeLife: OutsideCanada.YES,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.EVER_LIVED_SOCIAL_COUNTRY])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
    ])
  })

  it('requires partner questions when marital=married', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      oasAge: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.OAS_AGE,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.INCOME,
      FieldKey.MARITAL_STATUS,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
})
