import {
  EntitlementResultType,
  ResultReason,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest } from '../../utils/factory'
import {
  expectAlwAlwsTooOld,
  expectAlwEligible,
  expectAlwsMarital,
  expectAlwTooOld,
  expectDeferralTable,
  expectFutureOasGisBenefitEligible,
  expectGisEligible,
  expectGisNotEligible,
  expectOasEligible,
  expectOasNotEligible,
} from '../../utils/expectUtils'

import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'

describe('OasBenefit', () => {
  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'
  /* CALC-01  */
  it('should pass the first test - OAS-CALC-01', async () => {
    const desiredName = 'CALC-1' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 750.61)
    expectGisEligible(res, 977.91)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 628.74, true)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })
  /* CALC-02  
it('should pass the second test - OAS-CALC-02', async () => {
  const desiredName = 'CALC-2' // Replace with the desired name
  const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
  const res = await mockGetRequest(extractedPayload)
  
  //client results
  expectOasEligible(res, EntitlementResultType.FULL, 195.61)
  expectGisEligible(res, 572.77)
  expectAlwTooOld(res)
  expectAlwsMarital(res)
})
*/
  /* CALC-03  */
  it('should pass the 03 test - OAS-CALC-03', async () => {
    const desiredName = 'CALC-3' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 212.37 },
      { age: 70, amount: 224.95 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 199.8)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 530.77)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-04 */
  it('should pass the 04 test - OAS-CALC-04', async () => {
    const desiredName = 'CALC-4' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 853.45)
    expectGisEligible(res, 243.15)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 480.29, true)
    expectGisEligible(res, 454.47, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })
  /* CALC-05  */
  it('should pass the 05 test - OAS-CALC-05', async () => {
    const desiredName = 'CALC-5' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 384.23)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expectGisNotEligible(res, ResultReason.LEGAL_STATUS, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })
  /* CALC-06  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const desiredName = 'CALC-6' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-07  */
  it('should pass the 07 test - OAS-CALC-07', async () => {
    const desiredName = 'CALC-7' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 391.91)
    expectGisEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 384.23, true)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })
  /* CALC-08  */
  it('should pass the 08 test - OAS-CALC-08', async () => {
    const desiredName = 'CALC-8' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
    expectGisEligible(res, 1567.4, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })
  /* CALC-09  */
  it('should pass the 09 test - OAS-CALC-09', async () => {
    const desiredName = 'CALC-9' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-10  */
  it('should pass the 10 test - OAS-CALC-10', async () => {
    const desiredName = 'CALC-10' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwAlwsTooOld(res)
  })
  /* CALC-11  */
  it('should pass the 011 test - OAS-CALC-011', async () => {
    const desiredName = 'CALC-11' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY)
    expectAlwAlwsTooOld(res)
  })
  /* CALC-12  */
  it('should pass the 12 test - OAS-CALC-12', async () => {
    const desiredName = 'CALC-12' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwAlwsTooOld(res)
  })
  /* CALC-13  */
  it('should pass the 13 test - OAS-CALC-13', async () => {
    const desiredName = 'CALC-13' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-14  */
  it('should pass the 14 test - OAS-CALC-14', async () => {
    const desiredName = 'CALC-14' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expectGisNotEligible(res, ResultReason.LEGAL_STATUS, true)
    expectAlwTooOld(res, true)
    expectAlwsMarital(res, true)
  })
  /* CALC-15  */
  it('should pass the 15 test - OAS-CALC-15', async () => {
    const desiredName = 'CALC-15' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisNotEligible(res, ResultReason.LIVING_COUNTRY)
    expectAlwAlwsTooOld(res)
  })
  /* CALC-16 */
  it('should pass the 16 test - OAS-CALC-16', async () => {
    const desiredName = 'CALC-16' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 66, amount: 748.9 },
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 1043.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //future benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)
    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisEligible(res, 0.0)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expectAlwEligible(res, 1326.69, true)
    expectAlwsMarital(res, true)
    //future benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45, true)
  })
})
