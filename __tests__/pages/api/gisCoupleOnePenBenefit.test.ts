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
    expectOasEligible(res, EntitlementResultType.FULL, 0.0)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res, true)
  })

  /* CALC-48 */
  it('should pass 48 test - CALC-48', async () => {
    const desiredName = 'CALC-48' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 727.38)
    expectGisEligible(res, 1078.38)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 0.0)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res, true)
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
    expectFutureOasGisBenefitEligible(res, 66.92, 726.25, 370.76, 0)
    //partner results
    expectAllIneligible(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 76.92, 192.12, 929.64, 0, true)
  })

  /* CALC-50 */
  // it('should pass 50 test - CALC-50', async () => {
  //   const desiredName = 'CALC-50' // Replace with the desired name
  //   const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
  //   const res = await mockGetRequest(extractedPayload)

  //   //client results
  //   // expectOasEligible(res, EntitlementResultType.FULL, 1045.11)
  //   expectGisEligible(res, 651.45)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)

  //   //partner is not eligible for any benefit
  //   expectAllIneligible(res, true)
  // })

  /* CALC-51 */
  // it('should pass 51 test - CALC-51', async () => {
  //   const desiredName = 'CALC-51' // Replace with the desired name
  //   const extractedPayload = getTransformedPayloadByName(filePath, desiredName)

  //   const res = await mockGetRequest(extractedPayload)

  //   //client results
  //   expectOasEligible(res, EntitlementResultType.FULL, 768.46)
  //   expectGisEligible(res, 0.82)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)

  //   //Future Benefit
  //   expectFutureOasGisBenefitEligible(res, 82, 768.46, 0.82, 0)
  //   expectFutureOasGisBenefitEligible(res, 87, 768.46, 0.0, 1)

  //   //partner results
  //   expectAllIneligible(res, true)

  //   //Future Benefit
  //   expectFutureAwlBenefitEligible(res, 60, 0.0, true)
  //   expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, 1, true)
  // })

  /* CALC-52 */
  // it('should pass 52 test - CALC-52', async () => {
  //   const desiredName = 'CALC-52' // Replace with the desired name
  //   const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
  //   const res = await mockGetRequest(extractedPayload)

  //   //client results
  //   expectOasEligible(res, EntitlementResultType.PARTIAL, 882.19)
  //   expectGisEligible(res, 0)
  //   expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)

  //   //partner results
  //   expectOasNotEligible(res, true)
  //   expectGisNotEligible(res, ResultReason.OAS, true)
  //   expectAlwTooOld(res, true)
  // })

  /* CALC-53 */
  it('should pass 53 test - CALC-53', async () => {
    const desiredName = 'CALC-53' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    const deferralTable = [
      { age: 66, amount: 599.12 },
      { age: 67, amount: 639.36 },
      { age: 68, amount: 679.6 },
      { age: 69, amount: 719.84 },
      { age: 70, amount: 760.08 },
    ]
    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1326.69)
    expectFutureOasGisBenefitEligible(res, 65, 558.88, 767.81, 1)
    expectFutureDeferralTable(res, 65, 1, deferralTable)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 331.84, true)
    expectGisEligible(res, 1410.22, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 68, 331.84, 994.85, 0, true)
    expectFutureOasGisBenefitEligible(res, 73, 331.84, 994.85, 1, true)
  })

  /* CALC-54 */
  it('should pass 54 test - CALC-54', async () => {
    const desiredName = 'CALC-54' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1077.69)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 545.09, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 314.37, true)
    expectGisEligible(res, 1427.68, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 78.25, 345.81, 1050.74, 0, true)
    expectFutureOasGisBenefitEligible(res, 83.25, 345.81, 967.74, 1, true)
  })

  /* CALC-55*/
  it('should pass 55 test - CALC-55', async () => {
    const desiredName = 'CALC-55' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 593.9)
    expectFutureOasGisBenefitEligible(res, 65, 611.28, 440.62, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1423.94, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 79, 211.33, 1139.43, 0, true)
    expectFutureOasGisBenefitEligible(res, 84, 211.33, 910.43, 1, true)
  })

  /* CALC-56 */
  it('should pass 56 test - CALC-56', async () => {
    const desiredName = 'CALC-56' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 409.3)
    expectFutureOasGisBenefitEligible(res, 65, 541.42, 333.48, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 1227.8, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 76, 192.12, 985.64, 0, true)
    expectFutureOasGisBenefitEligible(res, 81, 192.12, 752.64, 1, true)
  })

  /* CALC-57 */
  it('should pass 57 test - CALC-57', async () => {
    const desiredName = 'CALC-57' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)

    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 681.14, 0.0, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 577.17, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 89, 192.12, 577.16, 0, true)
    expectFutureOasGisBenefitEligible(res, 94, 192.12, 102.64, 1, true)
  })

  /* CALC-58 */
  it('should pass 58 test - CALC-58', async () => {
    const desiredName = 'CALC-58' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)

    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 0, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.INCOME
    )
    expectAlwTooOld(res, true)
  })

  /* CALC-59 */
  it('should pass 59 test - CALC-59', async () => {
    const desiredName = 'CALC-59' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)

    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1326.69)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 557.13, true)
    expectGisEligible(res, 1254.78, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-60 */
  it('should pass 60 test - CALC-60', async () => {
    const desiredName = 'CALC-60' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 1203.69)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 960.45, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46, true)
    expectGisEligible(res, 1043.45, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 80, 768.46, 960.45, 0, true)
    expectFutureOasGisBenefitEligible(res, 85, 768.46, 960.45, 1, true)
  })

  /* CALC-61 */
  it('should pass 61 test - CALC-61', async () => {
    const desiredName = 'CALC-61' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 931.69)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 710.45, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.45, true)
    expectGisEligible(res, 917.45, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 88, 768.46, 773.45, 0, true)
    expectFutureOasGisBenefitEligible(res, 93, 768.46, 773.45, 1, true)
  })

  /* CALC-62 */
  it('should pass 62 test - CALC-62', async () => {
    const desiredName = 'CALC-62' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 409.3)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 68.82, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 523.95, true)
    expectGisEligible(res, 1218.1, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 76.75, 576.35, 1235.56, 0, true)
    expectFutureOasGisBenefitEligible(res, 81.75, 576.35, 1235.56, 1, true)
  })

  /* CALC-63 */
  it('should pass 63 test - CALC-63', async () => {
    const desiredName = 'CALC-63' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45, 1)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6, true)
    expectGisEligible(res, 0.82, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 66, 698.6, 0.82, 0, true)
    expectFutureOasGisBenefitEligible(res, 71, 698.6, 0, 1, true)
  })

  /* CALC-64 */
  it('should pass 64 test - CALC-64', async () => {
    const desiredName = 'CALC-64' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectAllIneligible(res)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 0.0)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, 1)
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 681.14, true)
    expectGisEligible(res, 66.29, true)
    expectAlwTooOld(res, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 74.5, 681.14, 66.28, 0, true)
    expectFutureOasGisBenefitEligible(res, 79.5, 749.25, 68.03, 1, true)
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
    expectOasEligible(res, EntitlementResultType.PARTIAL, 0.0, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
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
    expectOasEligible(res, EntitlementResultType.PARTIAL, 0.0, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-67 */
  // it('should pass 67 test - CALC-67', async () => {
  //   const desiredName = 'CALC-67' // Replace with the desired name
  //   const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
  //   const res = await mockGetRequest(extractedPayload)

  //   //client results
  //   expectOasEligible(res, EntitlementResultType.PARTIAL, 480.29)
  //   expectGisEligible(res, 1205.62)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)

  //   //Future Benefit
  //   expectFutureOasGisBenefitEligible(res, 92, 480.29, 998.62, 0)

  //   //partner results - NO
  //   expectAllIneligible(res, true)

  //   //Future Benefit
  //   expectFutureOasGisBenefitEligible(res, 71, 174.65, 1297.4, 0, true)
  // })

  /* CALC-68 */
  // it('should pass 68 test - CALC-68', async () => {
  //   const desiredName = 'CALC-68' // Replace with the desired name
  //   const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
  //   const res = await mockGetRequest(extractedPayload)
  //   const deferralTable = [
  //     { age: 69, amount: 472.39 },
  //     { age: 70, amount: 498.8 },
  //   ]

  //   //client results
  //   expectOasEligible(res, EntitlementResultType.PARTIAL, 461.39)
  //   expectDeferralTable(res, deferralTable)
  //   expectGisEligible(res, 983.28)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)

  //   //Future Benefit
  //   expectFutureOasGisBenefitEligible(res, 69.58, 461.39, 400.65, 0)
  //   expectFutureOasGisBenefitEligible(res, 74.58, 461.39, 400.65, 1)

  //   //partner results
  //   expectAllIneligible(res, true)

  //   //Future Benefit
  //   expectFutureAwlBenefitEligible(res, 60, 1326.69, true)
  //   expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45, 1, true)
  // })

  /* CALC-69 */
  it('should pass 69 test - CALC-69', async () => {
    const desiredName = 'CALC-69' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 459.53 },
      { age: 68, amount: 488.46 },
      { age: 69, amount: 517.38 },
      { age: 70, amount: 546.31 },
    ]

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 452.31)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 1340.36)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 0.0, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-70 */
  // it('should pass 70 test - CALC-70', async () => {
  //   const desiredName = 'CALC-70' // Replace with the desired name
  //   const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
  //   const res = await mockGetRequest(extractedPayload)

  //   //client results
  //   expectOasEligible(res, EntitlementResultType.PARTIAL, 458.28)
  //   expectGisEligible(res, 0)
  //   expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)

  //   //partner results
  //   expectOasNotEligible(res, true)
  //   expectGisNotEligible(res, ResultReason.OAS, true)
  //   expectAlwTooOld(res, true)
  // })
})
