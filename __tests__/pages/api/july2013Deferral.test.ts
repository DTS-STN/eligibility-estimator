import {
  EntitlementResultType,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'
import {
  expectOasEligible,
  expectGisEligible,
  expectAlwTooOld,
  expectAlwsMarital,
  expectAllIneligible,
  expectDeferralTable,
  expectFutureDeferralTable,
  expectFutureOasGisBenefitEligible,
  expectFutureAwlBenefitEligible,
  expectOasNotEligible,
  expectGisNotEligible,
  expectAlwAlwsTooOld,
} from '../../utils/expectUtils'

import { mockGetRequest } from '../../utils/factory'

//file for extracting test data
const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

describe('july2013Deferral', () => {
  /* CALC-166 */
  it('should pass 166 test - CALC-166', async () => {
    const desiredName = 'CALC-166'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46)
    expectGisEligible(res, 62.3)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 638.34, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-167 */
  it('should pass 167 test - CALC-167', async () => {
    const desiredName = 'CALC-167'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 365.02)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 0), true
    expectAlwTooOld(res, true)
  })

  /* CALC-168 */
  it('should pass 168 test - CALC-168', async () => {
    const desiredName = 'CALC-168'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-169 */
  it('should pass 169 test - CALC-169', async () => {
    const desiredName = 'CALC-169'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 403.45)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-170 */
  it('should pass 170 test - CALC-170', async () => {
    const desiredName = 'CALC-170'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 365.02)
    expectGisEligible(res, 465.74)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 537.92, true)
    expectGisEligible(res, 292.84, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-171 */
  it('should pass 171 test - CALC-171', async () => {
    const desiredName = 'CALC-171'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 403.45)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 326.6, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-172 */
  it('should pass 172 test - CALC-172', async () => {
    const desiredName = 'CALC-172'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 403.45)
    expectGisEligible(res, 218.32)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 429.64, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-173 */
  it('should pass 173 test - CALC-173', async () => {
    const desiredName = 'CALC-173'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 422.65)
    expectGisEligible(res, 303.11)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 533.64, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-174 */
  it('should pass 174 test - CALC-174', async () => {
    const desiredName = 'CALC-174'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 365.02)
    expectGisEligible(res, 1031.53)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1204.43, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-175 */
  it('should pass 175 test - CALC-175', async () => {
    const desiredName = 'CALC-175'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 326.6)
    expectGisEligible(res, 0)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 268.96, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-176 */
  it('should pass 176 test - CALC-176', async () => {
    const desiredName = 'CALC-176'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 480.29)
    expectGisEligible(res, 558.47)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 211.33, true)
    expectGisEligible(res, 827.43, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-177 */
  it('should pass 177 test - CALC-177', async () => {
    const desiredName = 'CALC-177'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 403.45)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-178 */
  it('should pass 178 test - CALC-178', async () => {
    const desiredName = 'CALC-178'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 365.02)
    expectGisEligible(res, 0)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 307.38, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-179 */
  it('should pass 179 test - CALC-179', async () => {
    const desiredName = 'CALC-179'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 345.81)
    expectGisEligible(res, 1050.74)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 537.92, true)
    expectGisEligible(res, 858.63, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-180 */
  it('should pass 180 test - CALC-180', async () => {
    const desiredName = 'CALC-180'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 422.65)
    expectGisEligible(res, 303.11)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 288.18, true)
    expectGisEligible(res, 437.59, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-181 */
  it('should pass 181 test - CALC-181', async () => {
    const desiredName = 'CALC-181'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 365.02, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-182 */
  it('should pass 182 test - CALC-182', async () => {
    const desiredName = 'CALC-182'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 576.35)
    expectGisEligible(res, 254.41)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 268.96, true)
    expectGisEligible(res, 561.8, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-183 */
  it('should pass 183 test - CALC-183', async () => {
    const desiredName = 'CALC-183'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-184 */
  it('should pass 184 test - CALC-184', async () => {
    const desiredName = 'CALC-184'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 365.02)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-185 */
  it('should pass 185 test - CALC-185', async () => {
    const desiredName = 'CALC-185'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 307.38)
    expectGisEligible(res, 627.38)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 742.64, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-186 */
  it('should pass 186 test - CALC-186', async () => {
    const desiredName = 'CALC-186'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 403.44)
    expectGisEligible(res, 635.32)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 557.14, true)
    expectGisEligible(res, 481.63, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-187 */
  it('should pass 187 test - CALC-187', async () => {
    const desiredName = 'CALC-187'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 403.45)
    expectGisEligible(res, 0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46, true)
    expectGisEligible(res, 0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-187 */
  it('should TEST TEST - CALC-187', async () => {
    const desiredName = 'CALC-187'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest({
      ...extractedPayload,
      maritalStatus: 'single',
      invSeparated: 'false',
      age: 55.0,
      clientBirthDate: '1969;08',
      yearsInCanadaSince18: '10',
      income: 2000,
      whenToStartOAS: false,
      startDateForOAS: -10.08,
      partnerBenefitStatus: undefined,
      partnerIncome: 0,
      partnerIncomeWork: 0,
      partnerAge: undefined,
      partnerBirthDate: undefined,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerLivedOnlyInCanada: undefined,
    })

    const future = res.body.futureClientResults[0][65]
    console.log('#####', future)
    expect(res.status).toEqual(400)
    expect(res.body.summary.state).toEqual('AVAILABLE_INELIGIBLE')
    expect(future.oas.eligibility.result).toEqual('eligible')
    expect(future.oas.entitlement.result).toBeCloseTo(359.17, 0.01)
  })
})
