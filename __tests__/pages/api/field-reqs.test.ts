import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  SummaryState,
} from '../../../utils/api/definitions/enums'
import { FieldKey } from '../../../utils/api/definitions/fields'
import {
  age65NoDefer,
  canadaWholeLife,
  canadian,
  income10k,
  partnerUndefined,
} from '../../utils/expectUtils'
import { mockGetRequest } from '../../utils/factory'

describe('field requirement analysis', () => {
  it('requires base questions when nothing provided', async () => {
    const res = await mockGetRequest({
      incomeAvailable: undefined,
      income: undefined,
      incomeWork: undefined, //default to 0
      partnerIncomeWork: undefined, //default to 0
      age: undefined,
      oasDefer: undefined,
      oasAge: undefined,
      receiveOAS: false,
      whenToStartOAS: undefined, //asap
      oasDeferDuration: undefined,
      maritalStatus: undefined,
      livingCountry: undefined,
      legalStatus: undefined,
      livedOnlyInCanada: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      invSeparated: undefined,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(SummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.AGE,
      FieldKey.WHEN_TO_START,
      FieldKey.INCOME,
      //FieldKey.INCOME_WORK,
      FieldKey.LEGAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LIVED_ONLY_IN_CANADA,
      FieldKey.MARITAL_STATUS,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.WHEN_TO_START,
      FieldKey.INCOME,
      FieldKey.INCOME_WORK,
      FieldKey.LEGAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LIVED_ONLY_IN_CANADA,
      FieldKey.MARITAL_STATUS,
    ])
  })

  it('requires no fields when all provided', async () => {
    const res = await mockGetRequest({
      ...income10k,
      incomeWork: 0,
      partnerIncomeWork: 0,
      age: 65,
      oasDefer: true,
      oasAge: 70,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: '{ "months": 0, "years": 5 }',
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: true,
      invSeparated: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: undefined,
      partnerIncome: 10000,
      partnerAge: 65,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 5,
    })
    // expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
    expect(res.body.missingFields).toEqual([])
    expect(res.body.visibleFields).toEqual([
      FieldKey.AGE,
      FieldKey.ALREADY_RECEIVE_OAS,
      FieldKey.WHEN_TO_START,
      FieldKey.OAS_AGE,
      // FieldKey.INCOME_AVAILABLE,
      FieldKey.INCOME,
      FieldKey.INCOME_WORK,
      FieldKey.LEGAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LIVED_ONLY_IN_CANADA,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      // FieldKey.EVER_LIVED_SOCIAL_COUNTRY, // this field is odd because when visible, no matter what is selected it will return an error
      FieldKey.MARITAL_STATUS,
      FieldKey.INV_SEPARATED,
      FieldKey.PARTNER_AGE,
      // FieldKey.PARTNER_INCOME_AVAILABLE,
      FieldKey.PARTNER_INCOME,
      FieldKey.PARTNER_INCOME_WORK,
      // FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_LEGAL_STATUS,
      FieldKey.PARTNER_LIVING_COUNTRY,
      FieldKey.PARTNER_LIVED_ONLY_IN_CANADA,
      FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18,
    ])
  })
})

describe('field requirements analysis: conditional fields', () => {
  it('requires "yearsInCanadaSince18" when livedOnlyInCanada=true', async () => {
    const res = await mockGetRequest({
      ...income10k,
      incomeWork: 0,
      partnerIncomeWork: 0,
      ...age65NoDefer,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      invSeparated: false,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(SummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.YEARS_IN_CANADA_SINCE_18])
    expect(res.body.visibleFields).toContain(FieldKey.YEARS_IN_CANADA_SINCE_18)
  })

  it('requires "everLivedSocialCountry" when living in Canada and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      ...income10k,
      incomeWork: 0,
      partnerIncomeWork: 0,
      ...age65NoDefer,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      ...canadian,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: undefined,
      invSeparated: false,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(SummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.EVER_LIVED_SOCIAL_COUNTRY])
    expect(res.body.visibleFields).toContain(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
  })

  it('requires "everLivedSocialCountry" when living in No Agreement and under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      ...income10k,
      incomeWork: 0,
      partnerIncomeWork: 0,
      ...age65NoDefer,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: undefined,
      invSeparated: false,
      ...partnerUndefined,
    })
    expect(res.body.summary.state).toEqual(SummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.EVER_LIVED_SOCIAL_COUNTRY])
    expect(res.body.visibleFields).toContain(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
  })

  it('requires partner questions when marital=married', async () => {
    const res = await mockGetRequest({
      ...income10k,
      incomeWork: 0,
      partnerIncomeWork: 0,
      ...age65NoDefer,
      receiveOAS: false,
      whenToStartOAS: true, //asap
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      ...canadian,
      ...canadaWholeLife,
      ...partnerUndefined,
      invSeparated: undefined,
    })

    expect(res.body.summary.state).toEqual(SummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.INV_SEPARATED,
      FieldKey.PARTNER_AGE,
      FieldKey.PARTNER_INCOME,
    ])
    // expect(res.body.visibleFields).toContain(FieldKey.PARTNER_INCOME_AVAILABLE)
    expect(res.body.visibleFields).toContain(FieldKey.PARTNER_AGE)
    expect(res.body.visibleFields).toContain(FieldKey.INV_SEPARATED)
  })
})
