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

describe('gisCoupleOnePenBenefit', () => {
  /* CALC-166 */
  it('should pass 166 test - CALC-166', async () => {
    const desiredName = 'CALC-166'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46)
    expectGisEligible(res, 62.3)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 192.12, true)
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
    expectGisNotEligible(res, ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 192.12, true)
    expectGisNotEligible(res, ResultReason.INCOME, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-168 */
  it('should pass 168 test - CALC-168', async () => {
    const desiredName = 'CALC-168'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasNotEligible(res)
    expectGisNotEligible(res, ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 192.12, true)
    expectGisNotEligible(res, ResultReason.INCOME, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-169 */
  it('should pass 169 test - CALC-169', async () => {
    const desiredName = 'CALC-169'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 403.45)
    expectGisNotEligible(res, ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 192.12, true)
    expectGisNotEligible(res, ResultReason.INCOME, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-170 */
  it('should pass 170 test - CALC-170', async () => {
    const desiredName = 'CALC-170'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 365.02)
    expectGisEligible(res, 465.74)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 537.92, true)
    expectGisEligible(res, 292.84, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-171 */
  it('should pass 171 test - CALC-171', async () => {
    const desiredName = 'CALC-171'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 403.45)
    expectGisNotEligible(res, ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 326.6, true)
    expectGisNotEligible(res, ResultReason.INCOME), true
    expectAlwTooOld(res, true)
  })

  /* CALC-172 */
  it('should pass 172 test - CALC-172', async () => {
    const desiredName = 'CALC-172'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 241.69)
    expectGisEligible(res, 429.64)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 192.12, true)
    expectGisEligible(res, 429.64, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-173 */
  it('should pass 173 test - CALC-173', async () => {
    const desiredName = 'CALC-173'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 212.6)
    expectGisEligible(res, 514.43)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 192.12, true)
    expectGisEligible(res, 533.64, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-174 */
  it('should pass 174 test - CALC-174', async () => {
    const desiredName = 'CALC-174'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 23.99)
    expectGisEligible(res, 1204.43)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 192.12, true)
    expectGisEligible(res, 1204.43, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-175 */
  it('should pass 175 test - CALC-175', async () => {
    const desiredName = 'CALC-175'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 326.6)
    expectGisNotEligible(res, ResultReason.INCOME)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 268.96, true)
    expectGisNotEligible(res, ResultReason.INCOME, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-176 */
  it('should pass 176 test - CALC-176', async () => {
    const desiredName = 'CALC-176'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 365.79)
    expectGisEligible(res, 769.8)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 211.33, true)
    expectGisEligible(res, 827.43, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-177 */
  it('should pass 177 test - CALC-177', async () => {
    const desiredName = 'CALC-177'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 403.45)
    expectGisNotEligible(res, ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwAlwsTooOld(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 192.12, true)
    expectGisNotEligible(res, ResultReason.INCOME, true)
    expectAlwTooOld(res, true)
  })
})
