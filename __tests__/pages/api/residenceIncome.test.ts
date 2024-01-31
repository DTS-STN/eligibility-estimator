import {
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest } from '../../utils/factory'
import {
  expectAllIneligible,
  expectAlwEligible,
  expectAlwMarital,
  expectAlwsMarital,
  expectAlwTooOld,
  expectAlwTooYoung,
  expectDeferralTable,
  expectFutureAwlBenefitEligible,
  expectFutureOasGisBenefitEligible,
  expectGisEligible,
  expectGisNotEligible,
  expectOasEligible,
  expectOasNotEligible,
} from '../../utils/expectUtils'

import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'

describe('ResidenceIncome', () => {
  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'
  /* CALC-188 */
  it('should pass the 188 test - CALC-188', async () => {
    const desiredName = 'CALC-188'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasNotEligible(res)
    expectAlwMarital(res)
    expectAlwsMarital(res)

    // client future results
    expectFutureOasGisBenefitEligible(res, 65, 349.3, 0, 0)
  })

  /* CALC-189 */
  it('should pass the 189 test - CALC-189', async () => {
    const desiredName = 'CALC-189'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client future results
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 349.3, 0, 1)

    // parther future results
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 0, 0, true)
  })

  /* CALC-190 */
  it('should pass the 190 test - CALC-190', async () => {
    const desiredName = 'CALC-190'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client results
    expectAlwEligible(res, 0.0)

    // client future results
    expectFutureOasGisBenefitEligible(res, 65, 611.28, 0, 0)

    // parther results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6, true)
    expectGisEligible(res, 223.82, true)

    // partner future results
    expectFutureOasGisBenefitEligible(res, 70, 698.6, 0, 0, true)
  })

  //   /* CALC-191 */
  it('should pass the 191 test - CALC-191', async () => {
    const desiredName = 'CALC-191'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client future results
    expectFutureOasGisBenefitEligible(res, 65, 454.09, 0, 0)
  })

  //   /* CALC-192 */
  it('should pass the 192 test - CALC-192', async () => {
    const desiredName = 'CALC-192'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client future results
    expectFutureOasGisBenefitEligible(res, 65, 523.95, 0, 0)

    // partner future results
    expectFutureOasGisBenefitEligible(res, 65, 436.63, 1305.42, 0, true)
    expectFutureOasGisBenefitEligible(res, 70, 436.63, 807.06, 1, true)
  })

  //   /* CALC-193 */
  it('should pass the 193 test - CALC-193', async () => {
    const desiredName = 'CALC-193'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client future results
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 0, 0)

    // partner future results
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 545.09, 0, true)
  })

  //   /* CALC-194 */
  it('should pass the 194 test - CALC-194', async () => {
    const desiredName = 'CALC-194'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client future results
    expectFutureOasGisBenefitEligible(res, 65, 384.23, 0, 0)

    // partner future results
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 270.3, 0, true)
  })

  //   /* CALC-195 */
  it('should pass the 195 test - CALC-195', async () => {
    const desiredName = 'CALC-195'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client future results
    expectFutureOasGisBenefitEligible(res, 65, 523.95, 0, 0)

    // partner future results
    expectFutureOasGisBenefitEligible(res, 65, 419.16, 0, 0, true)
  })

  //   /* CALC-196 */
  it('should pass the 196 test - CALC-196', async () => {
    const desiredName = 'CALC-196'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client future results
    expectFutureOasGisBenefitEligible(res, 65, 436.63, 0, 0)

    // partner future results
    expectAllIneligible(res, true)
  })

  //   /* CALC-197 */
  it('should pass the 197 test - CALC-197', async () => {
    const desiredName = 'CALC-197'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client future results
    expectFutureOasGisBenefitEligible(res, 65, 611.28, 0, 0)

    // partner future results
    expectAllIneligible(res, true)
  })

  //   /* CALC-198 */
  it('should pass the 198 test - CALC-198', async () => {
    const desiredName = 'CALC-198'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client future results
    expectFutureOasGisBenefitEligible(res, 65, 611.28, 1130.77, 0)

    // partner future results
    expectAllIneligible(res, true)
  })

  //   /* CALC-199 */
  it('should pass the 199 test - CALC-199', async () => {
    const desiredName = 'CALC-199'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 237.52)
    // expectGisEligible(res, 806.25) // 765.47

    // client future results
    // expectFutureOasGisBenefitEligible(res, 71, 237.52, 573.25, 0)

    // partner results
    // expectAlwEligible(res, 230.3, true)

    // partner future results
    // expectFutureOasGisBenefitEligible(res, 65, 192.12, 503.79, 0, true)
  })

  //   /* CALC-200 */
  it('should pass the 200 test - CALC-200', async () => {
    const desiredName = 'CALC-200'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client results
    expectOasNotEligible(res, true)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)

    // client future results
    expectFutureOasGisBenefitEligible(res, 69.5, 0, 0, 0)

    // partner future results
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 0, 1, true)
  })

  //   /* CALC-201 */
  it('should pass the 201 test - CALC-201', async () => {
    const desiredName = 'CALC-201'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client results
    // expectAlwsMarital(res)

    // partner results
    // expectOasEligible(res, EntitlementResultType.PARTIAL, 593.81, true)
    // expectGisEligible(res, 537.61, true)
  })

  //   /* CALC-202 */
  it('should pass the 202 test - CALC-202', async () => {
    const desiredName = 'CALC-202'
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    // client results
    // expectAlwEligible(res, 329.28)

    // client future results
    // expectFutureOasGisBenefitEligible(res, 65, 698.6, 23.82, 0)
  })
})
