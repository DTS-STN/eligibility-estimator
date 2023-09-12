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
  expectFutureOasGisBenefitEligible,
  expectFutureAwlBenefitEligible,
} from '../../utils/expectUtils'

import { mockGetRequest } from '../../utils/factory'

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
    expectOasEligible(res, EntitlementResultType.FULL, 727.38)
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
      { age: 66, amount: 730.18 },
      { age: 67, amount: 779.22 },
      { age: 68, amount: 828.26 },
      { age: 69, amount: 877.3 },
      { age: 70, amount: 926.34 },
    ]

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 726.09)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 934.91)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 66, 726.25, 370.76)
    //partner results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 192.12, 929.64, true)
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
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 82, 1045.11, 0.0)
    expectFutureOasGisBenefitEligible(res, 87, 1045.11, 0.0)
    //partner results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, true)
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
    const deferralTable = [
      { age: 67, amount: 730.18 },
      { age: 68, amount: 779.22 },
      { age: 69, amount: 828.26 },
      { age: 70, amount: 926.34 },
    ]
    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1326.69)
    expectFutureOasGisBenefitEligible(res, 65, 558.88, 767.81)
    expectDeferralTable(res, deferralTable)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 331.84, true)
    expectGisEligible(res, 1410.22, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 68, 331.84, 994.85, true)
    expectFutureOasGisBenefitEligible(res, 73, 331.84, 994.85, true)
  })

  /* CALC-54 */
  it('should pass 54 test - CALC-54', async () => {
    const desiredName = 'CALC-54' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1077.69)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 545.09)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 314.37, true)
    expectGisEligible(res, 1427.68, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 78, 345.81, 1050.74, true)
    expectFutureOasGisBenefitEligible(res, 83, 345.81, 967.74, true)
  })

  /* CALC-55*/
  it('should pass 55 test - CALC-55', async () => {
    const desiredName = 'CALC-55' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 593.9)
    expectFutureOasGisBenefitEligible(res, 65, 611.28, 440.62)
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1423.94, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 79, 211.33, 1139.43, true)
    expectFutureOasGisBenefitEligible(res, 84, 211.33, 910.43, true)
  })

  /* CALC-56 */
  it('should pass 56 test - CALC-56', async () => {
    const desiredName = 'CALC-56' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 409.3)
    expectFutureOasGisBenefitEligible(res, 65, 541.42, 333.48)
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1227.8, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 76, 192.12, 985.64, true)
    expectFutureOasGisBenefitEligible(res, 84, 192.12, 752.64, true)
  })

  /* CALC-57 */
  it('should pass 57 test - CALC-57', async () => {
    const desiredName = 'CALC-57' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 681.14, 0.0)
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 577.17, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 94, 192.12, 102.64, true)
  })

  /* CALC-58 */
  it('should pass 58 test - CALC-58', async () => {
    const desiredName = 'CALC-58' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)
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
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1326.69)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)
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
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1200.69)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 960.45)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 768.46, true)
    expectGisEligible(res, 1043.45, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 80, 768.46, 960.45, true)
    expectFutureOasGisBenefitEligible(res, 85, 768.46, 960.45, true)
  })

  /* CALC-61 */
  it('should pass 61 test - CALC-61', async () => {
    const desiredName = 'CALC-61' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 931.69)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 710.45)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 768.45, true)
    expectGisEligible(res, 917.45, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 88, 768.46, 773.45, true)
    expectFutureOasGisBenefitEligible(res, 93, 768.46, 773.45, true)
  })

  /* CALC-62 */
  it('should pass 62 test - CALC-62', async () => {
    const desiredName = 'CALC-62' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 409.3)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 68.82)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 523.95, true)
    expectGisEligible(res, 1218.1, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 76, 576.35, 1235.56, true)
    expectFutureOasGisBenefitEligible(res, 81, 576.35, 1235.56, true)
  })

  /* CALC-63 */
  it('should pass 63 test - CALC-63', async () => {
    const desiredName = 'CALC-63' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 698.6, true)
    expectGisEligible(res, 0.82, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 71, 698.6, 0.0, true)
  })

  /* CALC-64 */
  it('should pass 64 test - CALC-64', async () => {
    const desiredName = 'CALC-64' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 681.14, true)
    expectGisEligible(res, 66.29, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 79, 749.25, 68.03, true)
  })

  /* CALC-65 */
  it('should pass 65 test - CALC-65', async () => {
    const desiredName = 'CALC-65' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 480.29)
    expectGisEligible(res, 1331.62)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-66 */
  it('should pass 66 test - CALC-66', async () => {
    const desiredName = 'CALC-66' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 484.28)
    expectGisEligible(res, 1370.05)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

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
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 92, 192.12, 1286.79)
    //partner results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 71, 174.65, 1297.4, true)
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
    expectOasEligible(res, EntitlementResultType.PARTIAL, 461.4)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 983.28)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 69, 461.39, 400.65)
    expectFutureOasGisBenefitEligible(res, 74, 461.39, 400.65)

    //partner results
    expectAllIneligible(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1326.69, true)
    expectFutureOasGisBenefitEligible(res, 74, 698.6, 1043.45, true)
  })

  /* CALC-69 */
  it('should pass 69 test - CALC-69', async () => {
    const desiredName = 'CALC-69' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 459.53 },
      { age: 68, amount: 488.47 },
      { age: 69, amount: 517.39 },
      { age: 70, amount: 546.31 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 452.31)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 1340.35)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectAllIneligible(res, true)
  })

  /* CALC-70 */
  it('should pass 70 test - CALC-70', async () => {
    const desiredName = 'CALC-70' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 458.28)
    expectGisEligible(res, 0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectAllIneligible(res, true)
  })
})