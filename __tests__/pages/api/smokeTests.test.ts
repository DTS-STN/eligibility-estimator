import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
  ValidationErrors,
  EntitlementResultType,
  SummaryState,
} from '../../../utils/api/definitions/enums'
import { FieldKey } from '../../../utils/api/definitions/fields'
import roundToTwo from '../../../utils/api/helpers/roundToTwo'
import legalValues from '../../../utils/api/scrapers/output'
import {
  age60NoDefer,
  age65NoDefer,
  canadaWholeLife,
  canadian,
  expectAlwsMarital,
  expectAllIneligible,
  expectAlwTooOld,
  expectOasGisTooYoung,
  income10k,
  partnerIncomeZero,
  partnerNoHelpNeeded,
  partnerUndefined,
  getErrorDetails,
  expectOasEligible,
} from '../../utils/expectUtils'
import { mockGetRequest } from '../../utils/factory'

const obsolete = {
  incomeWork: 0,
  oasDefer: false,
  oasAge: 0,
  livedOnlyInCanada: false,
  everLivedSocialCountry: false,
  partnerIncomeWork: 0,
}

describe('Smoke tests', () => {
  it('SMKTST-17', async () => {
    const res = await mockGetRequest({
      age: 55.0,
      receiveOAS: false,
      oasDeferDuration: undefined,
      whenToStartOAS: false,
      startDateForOAS: -10.08,
      incomeAvailable: undefined,
      income: 2000,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      ...canadian,
      ...partnerUndefined,
      ...obsolete,
      clientBirthDate: '1969;08',
    })

    const future = res.body.futureClientResults[0][65]

    expect(res.status).toEqual(400)
    expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_INELIGIBLE)
    expect(future.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(future.oas.entitlement.result).toBeCloseTo(359.17, 0.01)
  })

  it('SMKTST-18', async () => {
    const res = await mockGetRequest({
      age: 45.5,
      receiveOAS: false,
      oasDeferDuration: undefined,
      whenToStartOAS: false,
      startDateForOAS: -20.08,
      incomeAvailable: undefined,
      income: 15000,
      yearsInCanadaSince18: 15,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: undefined,
      ...partnerUndefined,
      ...canadian,
      ...obsolete,
    })

    const future = res.body.futureClientResults[0][65]

    expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_INELIGIBLE)
    expect(future.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(future.oas.entitlement.result).toBeCloseTo(632.56, 0.01)
  })

  it('SMKTST-19', async () => {
    const res = await mockGetRequest({
      age: 50,
      receiveOAS: false,
      oasDeferDuration: undefined,
      whenToStartOAS: false,
      startDateForOAS: -26.0,
      incomeAvailable: undefined,
      income: 5000,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: undefined,
      partnerIncome: 25000,
      partnerAge: 65.0,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 20,
      ...canadian,
      ...obsolete,
    })

    const future = res.body.futureClientResults[0][65]

    expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_INELIGIBLE)
    expect(future.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(future.oas.entitlement.result).toBeCloseTo(359.17, 0.01)
  })

  it('SMKTST-25C', async () => {
    const res = await mockGetRequest({
      age: 66.32,
      receiveOAS: false,
      oasDeferDuration: undefined,
      whenToStartOAS: false,
      startDateForOAS: -0.669, // 67yrs
      incomeAvailable: undefined,
      income: 0,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: undefined,
      ...partnerUndefined,
      ...canadian,
      ...obsolete,
      clientBirthDate: '1958;04',
    })

    const result = res.body.results

    expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
    expect(result.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(result.oas.entitlement.result).toBeCloseTo(376.4, 0.01)
  })

  it('SMKTST-25D', async () => {
    const res = await mockGetRequest({
      age: 66.32,
      receiveOAS: false,
      oasDeferDuration: undefined,
      whenToStartOAS: false,
      startDateForOAS: -1.58, // 67yrs 11 months
      incomeAvailable: undefined,
      income: 0,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: undefined,
      ...partnerUndefined,
      ...canadian,
      ...obsolete,
      clientBirthDate: '1958;04',
    })

    const result = res.body.results

    expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
    expect(result.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(result.oas.entitlement.result).toBeCloseTo(392.96, 0.01)
  })

  it('SMKTST-20B', async () => {
    const res = await mockGetRequest({
      age: 68.75,
      receiveOAS: false,
      oasDeferDuration: undefined,
      whenToStartOAS: false,
      startDateForOAS: -0.58, // 69yrs 4 months
      incomeAvailable: undefined,
      income: 0,
      yearsInCanadaSince18: 15,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: undefined,
      ...partnerUndefined,
      ...canadian,
      ...obsolete,
      clientBirthDate: '1955;11',
    })

    const result = res.body.results

    expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
    expect(result.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(result.oas.entitlement.result).toBeCloseTo(280.69, 0.01)
  })
  //
})
