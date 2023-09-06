import {
  EntitlementResultType,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
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
} from './expectUtils'

import { mockGetRequest, mockGetRequestError } from './factory'

//file for extracting test data
const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

describe('gisCoupleOnePenBenefit', () => {
  /* CALC-47 */
  it('should pass 47 test - CALC-47', async () => {
    const desiredName = 'CALC-47' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6)
    expectGisEligible(res, 1043.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-48 */
  it('should pass 48 test - CALC-48', async () => {
    const desiredName = 'CALC-48' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
   // expectOasEligible(res, EntitlementResultType.FULL, 727.38)
    expectGisEligible(res, 1078.38)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-49 */
  it('should pass 49 test - CALC-49', async () => {
    const desiredName = 'CALC-49' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 730.18 },
      { age: 68, amount: 779.22 },
      { age: 69, amount: 828.26 },
      { age: 70, amount: 926.34 },
    ]

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 726.25)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 934.91)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 929.64, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-50 */
  it('should pass 50 test - CALC-50', async () => {
    const desiredName = 'CALC-50' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 1045.11)
    expectGisEligible(res, 651.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-51 */
  it('should pass 51 test - CALC-51', async () => {
    const desiredName = 'CALC-51' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 1045.11)
    expectGisEligible(res, 0.82)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //TODO Add future benefit estimate
    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-52 */
  it('should pass 52 test - CALC-52', async () => {
    const desiredName = 'CALC-52' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 882.19)
    expectGisEligible(res, 0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-53 */
  it('should pass 53 test - CALC-53', async () => {
    const desiredName = 'CALC-53' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 331.84, true)
    expectGisEligible(res, 1410.22, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-54 */
  it('should pass 54 test - CALC-54', async () => {
    const desiredName = 'CALC-54' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 313.37, true)
    expectGisEligible(res, 1427.68, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-55*/
  it('should pass 55 test - CALC-55', async () => {
    const desiredName = 'CALC-55' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1423.94, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-56 */
  it('should pass 56 test - CALC-56', async () => {
    const desiredName = 'CALC-56' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1227.8, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-57 */
  it('should pass 57 test - CALC-57', async () => {
    const desiredName = 'CALC-57' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 577.17, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-58 */
  it('should pass 58 test - CALC-58', async () => {
    const desiredName = 'CALC-58' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 0, true)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-59 */
  it('should pass 59 test - CALC-59', async () => {
    const desiredName = 'CALC-59' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 557.13, true)
    expectGisEligible(res, 1254.78, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-60 */
  it('should pass 60 test - CALC-60', async () => {
    const desiredName = 'CALC-60' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 768.46, true)
    expectGisEligible(res, 1043.45, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-61 */
  it('should pass 61 test - CALC-61', async () => {
    const desiredName = 'CALC-61' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 768.45, true)
    expectGisEligible(res, 917.45, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-62 */
  it('should pass 62 test - CALC-62', async () => {
    const desiredName = 'CALC-62' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 523.95, true)
    expectGisEligible(res, 1218.1, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-63 */
  it('should pass 63 test - CALC-63', async () => {
    const desiredName = 'CALC-63' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 698.6, true)
    expectGisEligible(res, 0.82, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-64 */
  it('should pass 64 test - CALC-64', async () => {
    const desiredName = 'CALC-64' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //TODO Add future benefit estimate
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 681.14, true)
    expectGisEligible(res, 66.29, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })

  /* CALC-65 */
  it('should pass 65 test - CALC-65', async () => {
    const desiredName = 'CALC-65' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectGisEligible(res, 1619.79)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //TODO Add future benefit estimate
    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-66 */
  it('should pass 66 test - CALC-66', async () => {
    const desiredName = 'CALC-66' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 526.28)
    expectGisEligible(res, 1248.62)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //TODO Add future benefit estimate
    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-67 */
  it('should pass 67 test - CALC-67', async () => {
    const desiredName = 'CALC-67' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectGisEligible(res, 1493.79)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //TODO Add future benefit estimate
    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-68 */
  it('should pass 68 test - CALC-68', async () => {
    const desiredName = 'CALC-68' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 472.39 },
      { age: 70, amount: 498.8 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 462.39)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 983.28)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //TODO Add future benefit estimate
    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-69 */
  it('should pass 69 test - CALC-69', async () => {
    const desiredName = 'CALC-69' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 468.06 },
      { age: 68, amount: 499.5 },
      { age: 69, amount: 530.94 },
      { age: 70, amount: 538.8 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 436.63)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 1305.42)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //TODO Add future benefit estimate
    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-70 */
  it('should pass 70 test - CALC-70', async () => {
    const desiredName = 'CALC-70' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 572.86)
    expectGisEligible(res, 0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //TODO Add future benefit estimate
    //partner results
    expectAllIneligible(res, true)
  })
})
