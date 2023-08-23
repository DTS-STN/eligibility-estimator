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

describe('gisCoupleOnePenBenefit', () => {
  /* CALC-47 */
  it('should pass 47 test - CALC-47', async () => {
    const desiredName = 'CALC-47' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '628.09'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-48 */
  it('should pass 48 test - CALC-48', async () => {
    const desiredName = 'CALC-48' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('765.67')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '545.09'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-49 */
  it('should pass 49 test - CALC-49', async () => {
    const desiredName = 'CALC-49' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)

    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('917.45')

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
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.NONE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-50 */
  it('should pass 50 test - CALC-50', async () => {
    const desiredName = 'CALC-50' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('651.45')

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
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-51 */
  it('should pass 51 test - CALC-51', async () => {
    const desiredName = 'CALC-51' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('0.82')

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
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-52 */
  it('should pass 52 test - CALC-52', async () => {
    const desiredName = 'CALC-52' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual(
      '1008.22'
    )

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
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-53 */
  it('should pass 53 test - CALC-53', async () => {
    const desiredName = 'CALC-53' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '349.30'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1392.75'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-23 */
  it('should pass 54 test - CALC-54', async () => {
    const desiredName = 'CALC-54' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '349.30'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1392.75'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-55*/
  it('should pass 55 test - CALC-55', async () => {
    const desiredName = 'CALC-55' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '349.30'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1266.75'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-56 */
  it('should pass 56 test - CALC-56', async () => {
    const desiredName = 'CALC-56' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '384.23'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1035.68'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-57 */
  it('should pass 57 test - CALC-57', async () => {
    const desiredName = 'CALC-57' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '384.23'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '385.05'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-58 */
  it('should pass 58 test - CALC-58', async () => {
    const desiredName = 'CALC-58' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '384.23'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.INCOME
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-59 */
  it('should pass 59 test - CALC-59', async () => {
    const desiredName = 'CALC-59' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1043.45'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-60 */
  it('should pass 60 test - CALC-60', async () => {
    const desiredName = 'CALC-60' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1043.45'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-61 */
  it('should pass 61 test - CALC-61', async () => {
    const desiredName = 'CALC-61' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '768.46'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '917.45'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-62 */
  it('should pass 62 test - CALC-62', async () => {
    const desiredName = 'CALC-62' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('651.45')

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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '698.60'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1043.45'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-63 */
  it('should pass 63 test - CALC-63', async () => {
    const desiredName = 'CALC-63' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.NONE
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '698.60'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '0.82'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-64 */
  it('should pass 64 test - CALC-64', async () => {
    const desiredName = 'CALC-64' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.NONE
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0.00')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '698.60'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.INCOME
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '48.82'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-65 */
  it('should pass 65 test - CALC-65', async () => {
    const desiredName = 'CALC-65' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('480.29')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1331.62'
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '349.30'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1392.75'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-66 */
  it('should pass 66 test - CALC-66', async () => {
    const desiredName = 'CALC-66' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('526.41')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1248.62'
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
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '349.30'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '1309.75'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-67 */
  it('should pass 67 test - CALC-67', async () => {
    const desiredName = 'CALC-67' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('480.29')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1205.62'
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
    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
  })

  /* CALC-68 */
  it('should pass 68 test - CALC-68', async () => {
    const desiredName = 'CALC-68' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('436.63')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('913.43')

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
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.NONE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-69 */
  it('should pass 69 test - CALC-69', async () => {
    const desiredName = 'CALC-69' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('436.63')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1305.43'
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
      '384.23'
    )

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /* CALC-70 */
  it('should pass 70 test - CALC-70', async () => {
    const desiredName = 'CALC-70' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('572.86')
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
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })
})
