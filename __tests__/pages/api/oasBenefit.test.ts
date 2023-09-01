import {
  EntitlementResultType,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest } from './factory'
import {
  expectAlwAlwsTooOld,
  expectAlwEligible,
  expectAlwsEligible,
  expectAlwsMarital,
  expectAlwTooOld,
  expectGisEligible,
  expectGISEligibleEntZero,
  expectGisNotEligible,
  expectOasEligible,
  expectOasNotEligible,
  partnerUndefined,
} from './expectUtils'

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
    expectOasEligible(res, EntitlementResultType.FULL, 769.86)
    expectGisEligible(res, 960.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 628.74, true)
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
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

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 199.8)
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
    expectOasEligible(res, EntitlementResultType.FULL, 474.14)
    expectGisEligible(res, 550.53)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 480.29, true)
    expectGisEligible(res, 454.47, true)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
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
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
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
    expectOasEligible(res, EntitlementResultType.PARTIAL, 522.56)
    expectGisEligible(res, true)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 288.17, true)
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
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
  /* CALC-09  
  it('should pass the 09 test - OAS-CALC-09', async () => {
    const desiredName = 'CALC-9' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 0.0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expectGisNotEligible(res)
     expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })*/
  /* CALC-10  */
  it('should pass the 10 test - OAS-CALC-10', async () => {
    const desiredName = 'CALC-10' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expectGisNotEligible(res, true)
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
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwAlwsTooOld(res)
  })
  /* CALC-12  */
  it('should pass the 12 test - OAS-CALC-12', async () => {
    const desiredName = 'CALC-12' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.NONE, 0.0)
    expectGisNotEligible(res, true)
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
    expectGisNotEligible(res, true)
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
    expectGisNotEligible(res, true)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
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
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwAlwsTooOld(res)
  })
  /* CALC-16 to be updated when the test case will checked and updated*/
  it('should pass the 16 test - OAS-CALC-16', async () => {
    const desiredName = 'CALC-16' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 698.6)
    expectGisEligible(res, 1043.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expectAlwEligible(res, 1326.69, true)
    expectAlwsMarital(res, true)
  })
})
