import { ResultKey, ResultReason } from '../../../utils/api/definitions/enums'

import { mockGetRequest } from '../../utils/factory'
import {
  expectAlwsEligible,
  expectAlwsMarital,
  expectAlwTooOld,
  expectDeferralTable,
  expectFutureOasGisBenefitEligible,
  expectGisNotEligible,
  expectOasNotEligible,
} from '../../utils/expectUtils'
import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'

describe('AlwsBenefit', () => {
  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

  /* CALC-017  */
  it('should pass the sanity test 17 - CALC-17', async () => {
    const desiredName = 'CALC-17' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const futureDeferralTable = [
      { age: 66, amount: 748.9 },
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res, ResultReason.OAS)
    //expectAlwsMarital(res, true)
    expectAlwsEligible(res, 1581.51)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)
    expectDeferralTable(res, futureDeferralTable, true)
  })
  /* CALC-018  */
  it('should pass the sanity test 18 - CALC-18', async () => {
    const desiredName = 'CALC-18' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const futureDeferralTable = [
      { age: 66, amount: 748.9 },
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res, ResultReason.OAS)
    expectAlwsMarital(res, true)
    expectAlwsEligible(res, 1458.51)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 960.45)
    expectDeferralTable(res, futureDeferralTable, true)
  })

  /* CALC-019 */
  it('should pass the sanity test 19 - CALC-19', async () => {
    const desiredName = 'CALC-19' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const futureDeferralTable = [
      { age: 66, amount: 748.9 },
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res, ResultReason.OAS)
    expectAlwsMarital(res)
    expectAlwsEligible(res, 811.51)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 960.45)
    expectDeferralTable(res, futureDeferralTable, true)
  })

  /* CALC-20*/
  it('should pass the sanity test 20 - CALC-20', async () => {
    const desiredName = 'CALC-20' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const futureDeferralTable = [
      { age: 66, amount: 748.9 },
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res, ResultReason.OAS)
    expectAlwsMarital(res)
    expectAlwsEligible(res, 723.88)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 416.82)
    expectDeferralTable(res, futureDeferralTable, true)
  })

  /* CALC-21*/
  it('should pass the sanity test 21 - CALC-21', async () => {
    const desiredName = 'CALC-21' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const futureDeferralTable = [
      { age: 66, amount: 748.9 },
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res, ResultReason.OAS)
    expectAlwsMarital(res)
    expectAlwsEligible(res, 539.28)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 233.82)
    expectDeferralTable(res, futureDeferralTable, true)
  })

  /* CALC-22*/
  it('should pass the sanity test 22 - CALC-22', async () => {
    const desiredName = 'CALC-22' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const futureDeferralTable = [
      { age: 66, amount: 748.9 },
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res, ResultReason.OAS)
    expectAlwTooOld(res)
    expectAlwsEligible(res, 0)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 960.45)
    expectDeferralTable(res, futureDeferralTable, true)
  })
})
