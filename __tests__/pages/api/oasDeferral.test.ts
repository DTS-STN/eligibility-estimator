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

describe('OasDEferral', () => {
  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'
  /* CALC-01  */
  it('should pass the 126 test - OAS-CALC-126', async () => {
    const desiredName = 'CALC-126' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    // expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('769.86') // we need to use the new levalValue "July to September 2023"

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)

    // expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('960.45')

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
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })
  /* CALC-02  */
  it('should pass the test 127 - OAS-CALC-127', async () => {
    const desiredName = 'CALC-127' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('244.51')
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

  /* CALC-03  */
  it('should pass the 128 test - OAS-CALC-128', async () => {
    const desiredName = 'CALC-128' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('244.51')

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
  })
  /* CALC-129 */
  it('should pass the 129 test - OAS-CALC-129', async () => {
    const desiredName = 'CALC-129' // Replace with the desired name
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
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* CALC-130  */
  it('should pass the 130 test - OAS-CALC-130', async () => {
    const desiredName = 'CALC-130' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('314.37')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
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
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })
  /* CALC-131  */
  it('should pass the 131 test - OAS-CALC-131', async () => {
    const desiredName = 'CALC-131' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')

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
  /* CALC-132  */
  it('should pass the 132 test - OAS-CALC-132', async () => {
    const desiredName = 'CALC-132' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('244.51')

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual(
      '1290.54'
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
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
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

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })
  /* CALC-133  */
  it('should pass the 133 test - OAS-CALC-133', async () => {
    const desiredName = 'CALC-133' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //  expect(res.status).toEqual(200)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('48.82')

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
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual(
      '0.00'
    )

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })
  /* CALC-134  */
  it('should pass the 134 test - OAS-CALC-134', async () => {
    const desiredName = 'CALC-134' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
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
  })
  /* CALC-135  */
  it('should pass the 135 test - OAS-CALC-135', async () => {
    const desiredName = 'CALC-135' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('765.47')

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
  /* CALC-136  */
  it('should pass the 136 test - OAS-CALC-136', async () => {
    const desiredName = 'CALC-136' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('174.65')
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
  /* CALC-137  */
  it('should pass the 137 test - OAS-CALC-137', async () => {
    const desiredName = 'CALC-137' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('295.30')

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
  /* CALC-138  */
  it('should pass the 138 test - OAS-CALC-138', async () => {
    const desiredName = 'CALC-138' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('241.52')

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
  /* CALC-139  */
  it('should pass the 139 test - OAS-CALC-139', async () => {
    const desiredName = 'CALC-139' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('241.52')

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
      ResultReason.OAS
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

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
    expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual(
      '86.30'
    )
  })
  /* CALC-140  */
  it('should pass the 140 test - OAS-CALC-140', async () => {
    const desiredName = 'CALC-140' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('48.82')

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
  /* CALC-141 */
  it('should pass the 141 test - OAS-CALC-141', async () => {
    const desiredName = 'CALC-141' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('192.12')
    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('748.01')

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')

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
      ResultReason.AGE_YOUNG
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
    expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual(
      '86.30'
    )
  })
})
