import { ResultKey, ResultReason } from '../../../utils/api/definitions/enums'

import { mockGetRequest } from './factory'
import {
  expectAlwsEligible,
  expectGisNotEligible,
  expectOasNotEligible,
} from './expectUtils'
import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'

describe('AlwsBenefit', () => {
  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

  /* CALC-017  */
  it('should pass the sanity test 17 - CALC-17', async () => {
    const desiredName = 'CALC-17' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expectAlwsEligible(res, 1581.51)
  })

  /* CALC-018  */
  it('should pass the sanity test 18 - CALC-18', async () => {
    const desiredName = 'CALC-18' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expectAlwsEligible(res, 1458.51)
  })

  /* CALC-019 */
  it('should pass the sanity test 19 - CALC-19', async () => {
    const desiredName = 'CALC-19' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expectAlwsEligible(res, 811.51)
  })

  /* CALC-20*/
  it('should pass the sanity test 20 - CALC-20', async () => {
    const desiredName = 'CALC-20' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expectAlwsEligible(res, 723.88)
  })

  /* CALC-21*/
  it('should pass the sanity test 21 - CALC-21', async () => {
    const desiredName = 'CALC-21' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expectAlwsEligible(res, 539.28)
  })

  /* CALC-22*/
  it('should pass the sanity test 22 - CALC-22', async () => {
    const desiredName = 'CALC-22' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expectAlwsEligible(res, 0)
  })
})
