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

import { mockGetRequest, mockGetRequestError } from './factory'

//file for extracting test data
const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

describe('gisCoupleTwoPenBenefit', () => {
  /* CALC-23 */
  it('should pass 23 test - CALC-23', async () => {
    const desiredName = 'CALC-23' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('628.09')

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
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '628.09'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-24 */
  it('should pass 24 test - CALC-24', async () => {
    const desiredName = 'CALC-24' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('782.43')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('545.09')

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
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '545.09'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-25 */
  it('should pass 25 test - CALC-25', async () => {
    const desiredName = 'CALC-25' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('452.09')

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
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '452.09'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-26 */
  it('should pass 26 test - CALC-26', async () => {
    const desiredName = 'CALC-26' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('409.09')

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
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '409.09'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-27 */
  it('should pass 27 test - CALC-27', async () => {
    const desiredName = 'CALC-27' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('0.00')

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
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '0.30'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-28 */
  it('should pass 28 test - CALC-28', async () => {
    const desiredName = 'CALC-28' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('866.26')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('0.00')

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
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
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

  /* CALC-29 */
  it('should pass 29 test - CALC-29', async () => {
    const desiredName = 'CALC-29' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1204.44'
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
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '523.95'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '802.74'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-23 */
  it('should pass 30 test - CALC-30', async () => {
    const desiredName = 'CALC-30' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('215.17')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1121.44'
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
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '523.95'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '719.74'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-31*/
  it('should pass 31 test - CALC-31', async () => {
    const desiredName = 'CALC-31' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1028.44'
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
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '523.95'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '626.74'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-32 */
  it('should pass 32 test - CALC-32', async () => {
    const desiredName = 'CALC-32' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('985.44')

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
      '523.95'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '583.74'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-33 */
  it('should pass 33 test - CALC-33', async () => {
    const desiredName = 'CALC-33' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('576.65')

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
      '523.95'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
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

  /* CALC-34 */
  it('should pass 34 test - CALC-34', async () => {
    const desiredName = 'CALC-34' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('238.23')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('0.00')

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
      '523.95'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
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

  /* CALC-35 */
  it('should pass 35 test - CALC-35', async () => {
    const desiredName = 'CALC-35' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('0.00')

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
      '698.60'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1043.45'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-36 */
  it('should pass 36 test - CALC-36', async () => {
    const desiredName = 'CALC-36' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('860.67')

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
      '698.60'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '960.45'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-37 */
  it('should pass 37 test - CALC-37', async () => {
    const desiredName = 'CALC-37' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('836.45')

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
      '698.60'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '898.45'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-38 */
  it('should pass 38 test - CALC-38', async () => {
    const desiredName = 'CALC-38' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('561.45')

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
      '698.60'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1043.45'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-39 */
  it('should pass 39 test - CALC-39', async () => {
    const desiredName = 'CALC-39' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('92.82')

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
      '698.60'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '523.45'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-41 */
  it('should pass 41 test - CALC-41', async () => {
    const desiredName = 'CALC-41' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1567.40'
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
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '523.95'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
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

  /* CALC-42 */
  it('should pass 42 test - CALC-42', async () => {
    const desiredName = 'CALC-42' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('195.61')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1484.40'
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
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '576.35'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1152.56'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-43 */
  it('should pass 43 test - CALC-43', async () => {
    const desiredName = 'CALC-43' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1360.40'
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
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '576.35'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1090.56'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-44 */
  it('should pass 44 test - CALC-44', async () => {
    const desiredName = 'CALC-44' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1085.40'
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
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '576.35'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1235.56'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-45 */
  it('should pass 45 test - CALC-45', async () => {
    const desiredName = 'CALC-45' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('616.77')

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
      '576.35'
    )
    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '715.57'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-46 */
  it('should pass 46 test - CALC-46', async () => {
    const desiredName = 'CALC-46' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('216.57')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('0.00')

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
      '576.35'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '240.93'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })
})
