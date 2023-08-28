import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest } from './factory'
import { partnerUndefined } from './expectUtils'
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
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
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
  })

  /* CALC-112 */
  it('should pass the 112 test - CALC-112', async () => {
    const desiredName = 'CALC-112' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
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
  })
  /* CALC-113 */
  it('should pass the 113 test - CALC-113', async () => {
    const desiredName = 'CALC-113' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
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
  })
  /* CALC-114 */
  it('should pass the 114 test - CALC-114', async () => {
    const desiredName = 'CALC-114' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
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
  })
  /* CALC-115 */
  it('should pass the 115 test - CALC-115', async () => {
    const desiredName = 'CALC-115' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
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
  })
  /* CALC-116 */
  it('should pass the 116 test - CALC-116', async () => {
    const desiredName = 'CALC-116' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
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
  })
  /* CALC-117 */
  it('should pass the 117 test - CALC-117', async () => {
    const desiredName = 'CALC-117' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('261.98')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1397.08'
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
  })
  /* CALC-118 */
  it('should pass the 118 test - CALC-118', async () => {
    const desiredName = 'CALC-118' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('356.29')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('913.08')

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
  /* CALC-119 */
  it('should pass the 119 test - CALC-119', async () => {
    const desiredName = 'CALC-119' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('524.77')

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
  /* CALC-120 */
  it('should pass the 120 test - CALC-120', async () => {
    const desiredName = 'CALC-120' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('261.98')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('436.45')

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
  /* CALC-121 */
  it('should pass the 121 test - CALC-121', async () => {
    const desiredName = 'CALC-121' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1619.80'
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
  })
  /* CALC-122 */
  it('should pass the 122 test - CALC-122', async () => {
    const desiredName = 'CALC-122' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('288.18')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1440.74'
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
  })
  /* CALC-123 */
  it('should pass the 123 test - CALC-123', async () => {
    const desiredName = 'CALC-123' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('288.18')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('956.74')

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
  /* CALC-124 */
  it('should pass the 124 test - CALC-124', async () => {
    const desiredName = 'CALC-124' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('577.17')

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
  /* CALC-125 */
  it('should pass the 125 test - CALC-125', async () => {
    const desiredName = 'CALC-125' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('334.86')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('480.11')

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
})
