import {
  EntitlementResultType,
  ResultReason,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest } from '../../utils/factory'
import {
  expectAlwsMarital,
  expectAlwTooOld,
  expectGisEligible,
  expectOasEligible,
} from '../../utils/expectUtils'
import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'

describe('OasBenefit', () => {
  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

  /* CALC-111 */
  it('should pass the 111 test - CALC-111', async () => {
    const desiredName = 'CALC-111' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6)
    expectGisEligible(res, 1043.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-112 */
  it('should pass the 112 test - CALC-112', async () => {
    const desiredName = 'CALC-112' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6)
    expectGisEligible(res, 960.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-113 */
  it('should pass the 113 test - CALC-113', async () => {
    const desiredName = 'CALC-113' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6)
    expectGisEligible(res, 476.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-114 */
  it('should pass the 114 test - CALC-114', async () => {
    const desiredName = 'CALC-114' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 874.65)
    expectGisEligible(res, 0.82)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-115 */
  it('should pass the 115 test - CALC-115', async () => {
    const desiredName = 'CALC-115' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-116 */
  it('should pass the 116 test - CALC-116', async () => {
    const desiredName = 'CALC-116' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectGisEligible(res, 1567.4)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-117 */
  it('should pass the 117 test - CALC-117', async () => {
    const desiredName = 'CALC-117' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 261.98)
    expectGisEligible(res, 1397.08)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-118 */
  it('should pass the 118 test - CALC-118', async () => {
    const desiredName = 'CALC-118' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 237.52)
    expectGisEligible(res, 1000.4)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-119 */
  it('should pass the 119 test - CALC-119', async () => {
    const desiredName = 'CALC-119' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectGisEligible(res, 524.77)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-120 */
  it('should pass the 120 test - CALC-120', async () => {
    const desiredName = 'CALC-120' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 261.98)
    expectGisEligible(res, 436.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-121 */
  it('should pass the 121 test - CALC-121', async () => {
    const desiredName = 'CALC-121' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectGisEligible(res, 1619.8)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-122 */
  it('should pass the 122 test - CALC-122', async () => {
    const desiredName = 'CALC-122' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 288.18)
    expectGisEligible(res, 1440.74)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-123 */
  it('should pass the 123 test - CALC-123', async () => {
    const desiredName = 'CALC-123' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 288.18)
    expectGisEligible(res, 956.74)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-124 */
  it('should pass the 124 test - CALC-124', async () => {
    const desiredName = 'CALC-124' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectGisEligible(res, 577.17)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-125 */
  it('should pass the 125 test - CALC-125', async () => {
    const desiredName = 'CALC-125' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 267.89)
    expectGisEligible(res, 537.74)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    expectAlwsMarital(res, true)
  })
})
