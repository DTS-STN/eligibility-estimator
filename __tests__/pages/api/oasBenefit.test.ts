import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest } from './factory'
import { partnerUndefined } from './expectUtils'

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
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('769.86')
    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('960.45')

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '628.74'
    )

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alws.entitlement.result).toEqual(0)
  })
  /* CALC-02  
  it('should pass the second test - OAS-CALC-02', async () => {
    const desiredName = 'CALC-2' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('195.61')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })
*/
  /* CALC-03  */
  it('should pass the 03 test - OAS-CALC-03', async () => {
    const desiredName = 'CALC-3' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('199.80')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('530.77')

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })
  /* CALC-04 */
  it('should pass the 04 test - OAS-CALC-04', async () => {
    const desiredName = 'CALC-4' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('474.14')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('550.53')

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '480.29'
    )

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '454.47'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.AGE
    )

    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alws.entitlement.result).toEqual(0)
  })
  /* CALC-05  */
  it('should pass the 05 test - OAS-CALC-05', async () => {
    const desiredName = 'CALC-5' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('384.23')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.partnerResults.oas.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })
  /* CALC-06  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const desiredName = 'CALC-6' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })
  /* CALC-07  */
  it('should pass the 07 test - OAS-CALC-07', async () => {
    const desiredName = 'CALC-7' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('522.56')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '288.17'
    )

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.AGE
    )

    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alws.entitlement.result).toEqual(0)
  })
  /* CALC-08  */
  it('should pass the 08 test - OAS-CALC-08', async () => {
    const desiredName = 'CALC-8' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //  expect(res.status).toEqual(200)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '174.65'
    )

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1567.40'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.AGE
    )

    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alws.entitlement.result).toEqual(0)
  })
  /* CALC-09  
  it('should pass the 09 test - OAS-CALC-09', async () => {
    const desiredName = 'CALC-9' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })*/
  /* CALC-10  */
  it('should pass the 10 test - OAS-CALC-10', async () => {
    const desiredName = 'CALC-10' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })
  /* CALC-11  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const desiredName = 'CALC-11' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })
  /* CALC-12  */
  it('should pass the 12 test - OAS-CALC-12', async () => {
    const desiredName = 'CALC-12' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })
  /* CALC-13  */
  it('should pass the 13 test - OAS-CALC-13', async () => {
    const desiredName = 'CALC-13' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })
  /* CALC-14  */
  it('should pass the 14 test - OAS-CALC-14', async () => {
    const desiredName = 'CALC-14' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.LEGAL_STATUS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.AGE
    )

    expect(res.body.partnerResults.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alws.entitlement.result).toEqual(0)
  })
  /* CALC-15  */
  it('should pass the 16 test - OAS-CALC-16', async () => {
    const desiredName = 'CALC-15' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })
  /* CALC-16 to be updated when the test case will checked and updated*/
  it('should pass the 16 test - OAS-CALC-16', async () => {
    const desiredName = 'CALC-16' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1043.45'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expect(res.body.partnerResults.oas.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(1326.69)
  })
})
