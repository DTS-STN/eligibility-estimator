import {
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest } from '../../utils/factory'
import {
  expectAlwEligible,
  expectAlwsMarital,
  expectAlwTooOld,
  expectAlwTooYoung,
  expectDeferralTable,
  expectFutureAwlBenefitEligible,
  expectFutureOasGisBenefitEligible,
  expectGisEligible,
  expectGisNotEligible,
  expectOasEligible,
  expectOasNotEligible,
} from '../../utils/expectUtils'

import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'

describe('OasDEferral', () => {
  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'
  /* CALC-126 */
  it('should pass the 126 test - OAS-CALC-126', async () => {
    const desiredName = 'CALC-126' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 748.9)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 48.82)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-127 */
  it('should pass the 127 test - OAS-CALC-127', async () => {
    const desiredName = 'CALC-127' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 259.74 },
      { age: 68, amount: 276.09 },
      { age: 69, amount: 292.44 },
      { age: 70, amount: 308.79 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 710.91)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-128 */
  it('should pass the 128 test - OAS-CALC-128', async () => {
    const desiredName = 'CALC-128' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 259.74 },
      { age: 68, amount: 276.09 },
      { age: 69, amount: 292.44 },
      { age: 70, amount: 308.79 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-129 */
  it('should pass the 129 test - OAS-CALC-129', async () => {
    const desiredName = 'CALC-129' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 950.1)
    expectGisEligible(res, 1043.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-130 */
  it('should pass the 130 test - OAS-CALC-130', async () => {
    const desiredName = 'CALC-130' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 314.37)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-131 */
  it('should pass the 131 test - OAS-CALC-131', async () => {
    const desiredName = 'CALC-131' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 199.8 },
      { age: 70, amount: 212.37 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-132 */
  it('should pass the 132 test - OAS-CALC-132', async () => {
    const desiredName = 'CALC-132' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectGisEligible(res, 1290.54)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-133 */
  it('should pass the 133 test - OAS-CALC-133', async () => {
    const desiredName = 'CALC-133' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 769.86)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 48.82)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })
  /* CALC-134 */
  it('should pass the 134 test - OAS-CALC-134', async () => {
    const desiredName = 'CALC-134' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 199.8 },
      { age: 70, amount: 207.13 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
  })

  /* CALC-135 */
  it('should pass the 135 test - OAS-CALC-135', async () => {
    const desiredName = 'CALC-135' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 66, amount: 187.22 },
      { age: 67, amount: 199.8 },
      { age: 68, amount: 212.37 },
      { age: 69, amount: 224.95 },
      { age: 70, amount: 237.52 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 765.47)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 67, 174.65, 481.25, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 190.3, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 209.58, 446.32, 0, true)
  })
  /* CALC-136 */
  it('should pass the 136 test - OAS-CALC-136', async () => {
    const desiredName = 'CALC-136' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 66, amount: 187.22 },
      { age: 67, amount: 199.8 },
      { age: 68, amount: 212.37 },
      { age: 69, amount: 224.95 },
      { age: 70, amount: 237.52 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 67, 174.65, 273.25, 0)

    //partner results
    expectOasNotEligible(res, true)
    //expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
    expectAlwEligible(res, 0.0, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 209.58, 238.32, 0, true)
  })

  /* CALC-137 */
  it('should pass the 137 test - OAS-CALC-137', async () => {
    const desiredName = 'CALC-137' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 769.86)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 295.3)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 70.5, 769.86, 62.3, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 295.3, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 244.51, 516.39, 0, true)
  })
  /* CALC-138 */
  it('should pass the 138 test - OAS-CALC-138', async () => {
    const desiredName = 'CALC-138' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 799.2 },
      { age: 68, amount: 849.5 },
      { age: 69, amount: 899.8 },
      { age: 70, amount: 950.1 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 748.9)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 241.52)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 71, 748.9, 0.0, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 86.3, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 261.98, 289.92, 0, true)
  })

  /* CALC-139 */
  it('should pass the 139 test - OAS-CALC-139', async () => {
    const desiredName = 'CALC-139' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 779.22 },
      { age: 68, amount: 828.27 },
      { age: 69, amount: 877.31 },
      { age: 70, amount: 926.35 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 754.7)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 258.98)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 71.5, 754.7, 0.0, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 86.3, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 261.98, 289.92, 0, true)
  })
  /* CALC-140 */
  it('should pass the 140 test - OAS-CALC-140', async () => {
    const desiredName = 'CALC-140' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 779.22 },
      { age: 68, amount: 828.27 },
      { age: 69, amount: 877.31 },
      { age: 70, amount: 926.35 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 754.7)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 66.28)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 71.5, 754.7, 66.28, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 503.3, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 261.98, 693.44, 0, true)
  })
  /* CALC-141 */
  it('should pass the 141 test - OAS-CALC-141', async () => {
    const desiredName = 'CALC-141' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 199.8 },
      { age: 68, amount: 212.37 },
      { age: 69, amount: 224.95 },
      { age: 70, amount: 237.52 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 748.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 71, 192.12, 359.78, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 86.3, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 261.98, 289.92, 0, true)
  })
  /* CALC-142 */
  it('should pass the 142 test - OAS-CALC-142', async () => {
    const desiredName = 'CALC-142' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 259.74 },
      { age: 68, amount: 276.09 },
      { age: 69, amount: 292.44 },
      { age: 70, amount: 308.79 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 874.39)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 68, 244.51, 641.39, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 420.3, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 244.51, 641.39, 0, true)
  })
  /* CALC-143 */
  it('should pass the 143 test - OAS-CALC-143', async () => {
    const desiredName = 'CALC-143' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 67, amount: 259.74 },
      { age: 68, amount: 276.09 },
      { age: 69, amount: 292.44 },
      { age: 70, amount: 308.79 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 68, 244.51, 0.0, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 0.0, true)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 244.51, 0.0, 0, true)
  })
  /* CALC-144 */
  it('should pass the 144 test - OAS-CALC-144', async () => {
    const desiredName = 'CALC-144' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 261.98)
    expectGisEligible(res, 1044.71)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 71, 261.98, 919.71, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 931.69, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 209.58, 972.11, 0, true)
  })

  /* CALC-145 */
  it('should pass the 145 test - OAS-CALC-145', async () => {
    const desiredName = 'CALC-145' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 261.98)
    expectGisEligible(res, 1460.08)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit // To Check with Vero or Lorelei - test case it's 72 but in the code is 71
    expectFutureOasGisBenefitEligible(res, 72, 261.98, 919.71, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 66, 174.65, 1007.04, 0, true)
  })
  /* CALC-146 */
  it('should pass the 146 test - OAS-CALC-146', async () => {
    const desiredName = 'CALC-146' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 254.85 },
      { age: 69, amount: 269.94 },
      { age: 70, amount: 285.03 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 68, 244.51, 0.0, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwEligible(res, 0.0, true)

    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 65, 209.58, 0.0, 0, true)
  })
  /* CALC-147 */
  it('should pass the 147 test - OAS-CALC-147', async () => {
    const desiredName = 'CALC-147' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 254.85 },
      { age: 69, amount: 269.94 },
      { age: 70, amount: 285.03 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-148 */
  it('should pass the 148 test - OAS-CALC-148', async () => {
    const desiredName = 'CALC-148' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 254.85 },
      { age: 69, amount: 269.94 },
      { age: 70, amount: 285.03 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 0.0, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-149 */
  it('should pass the 149 test - OAS-CALC-149', async () => {
    const desiredName = 'CALC-149' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 254.85 },
      { age: 69, amount: 269.94 },
      { age: 70, amount: 285.03 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-150 */
  it('should pass the 150 test - OAS-CALC-150', async () => {
    const desiredName = 'CALC-150' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 254.85 },
      { age: 69, amount: 269.94 },
      { age: 70, amount: 285.03 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 516.39)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
    expectGisEligible(res, 586.25, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-151 */
  it('should pass the 151 test - OAS-CALC-151', async () => {
    const desiredName = 'CALC-151' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 254.85 },
      { age: 69, amount: 269.94 },
      { age: 70, amount: 285.03 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 990.91)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 0.0, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-152 */
  it('should pass the 152 test - OAS-CALC-152', async () => {
    const desiredName = 'CALC-152' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 68, amount: 254.85 },
      { age: 69, amount: 269.94 },
      { age: 70, amount: 285.03 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 516.39)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
    expectGisEligible(res, 586.25, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-153 */
  it('should pass the 153 test - OAS-CALC-153', async () => {
    const desiredName = 'CALC-153' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 950.1)
    expectGisEligible(res, 545.09)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46, true)
    expectGisEligible(res, 545.09, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-154 */
  it('should pass the 154 test - OAS-CALC-154', async () => {
    const desiredName = 'CALC-154' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 950.1)
    expectGisEligible(res, 1043.45)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )

    expectAlwTooOld(res, true)
  })
  /* CALC-155 */
  it('should pass the 155 test - OAS-CALC-155', async () => {
    const desiredName = 'CALC-155' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.FULL, 950.1)
    expectGisEligible(res, 545.09)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.FULL, 768.46, true)
    expectGisEligible(res, 545.09, true)
    expectAlwTooOld(res, true)
  })

  /* CALC-156 */
  it('should pass the 156 test - OAS-CALC-156', async () => {
    const desiredName = 'CALC-156' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 314.37)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 73, 314.37, 0.0, 0)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 64, 0.0, true)
    expectFutureOasGisBenefitEligible(res, 65, 192.12, 0.0, 1, true)
  })
  /* CALC-157 */
  it('should pass the 157 test - OAS-CALC-157', async () => {
    const desiredName = 'CALC-157' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 187.22 },
      { age: 70, amount: 199.8 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 1018.77)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 69, 174.65, 777.25, 0)
    expectFutureOasGisBenefitEligible(res, 74, 174.65, 544.25, 1)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwTooYoung(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 253.3, true)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 20.3, 1, true)
  })
  /* CALC-158 */
  it('should pass the 158 test - OAS-CALC-158', async () => {
    const desiredName = 'CALC-158' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 212.37 },
      { age: 70, amount: 215.52 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 209.58)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 983.84)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //Future Benefit
    expectFutureOasGisBenefitEligible(res, 69.5, 209.58, 742.32, 0)
    expectFutureOasGisBenefitEligible(res, 74.5, 209.58, 509.32, 1)

    //partner results
    expectOasNotEligible(res, true)
    expectGisNotEligible(res, ResultReason.OAS, true)
    expectAlwTooYoung(res, true)
    //Future Benefit
    expectFutureAwlBenefitEligible(res, 60, 253.3, true)
    expectFutureOasGisBenefitEligible(res, 65, 698.6, 20.3, 1, true)
  })
  /* CALC-159 */
  it('should pass the 159 test - OAS-CALC-159', async () => {
    const desiredName = 'CALC-159' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)
    const deferralTable = [
      { age: 69, amount: 199.8 },
      { age: 70, amount: 212.37 },
    ]
    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
    expectDeferralTable(res, deferralTable)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 261.98, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-160 */
  it('should pass the 160 test - OAS-CALC-160', async () => {
    const desiredName = 'CALC-160' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectGisEligible(res, 807.39)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
    expectGisEligible(res, 877.25, true)
    expectAlwTooOld(res, true)
    // expectAlwsMarital(res, true)
  })
  /* CALC-161 */
  it('should pass the 161 test - OAS-CALC-161', async () => {
    const desiredName = 'CALC-161' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-162 */
  it('should pass the 162 test - OAS-CALC-162', async () => {
    const desiredName = 'CALC-162' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectGisEligible(res, 73.91)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 0.0, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-163 */
  it('should pass the 163 test - OAS-CALC-163', async () => {
    const desiredName = 'CALC-163' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51)
    expectGisEligible(res, 0.0)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 0.0, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-164 */
  it('should pass the 164 test - OAS-CALC-164', async () => {
    const desiredName = 'CALC-164' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 209.58)
    expectGisEligible(res, 551.32)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
    expectGisEligible(res, 586.25, true)
    expectAlwTooOld(res, true)
  })
  /* CALC-165 */
  it('should pass the 165 test - OAS-CALC-165', async () => {
    const desiredName = 'CALC-165' // Replace with the desired name
    const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
    const res = await mockGetRequest(extractedPayload)

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65)
    expectGisEligible(res, 919.25)
    expectAlwTooOld(res)
    expectAlwsMarital(res)

    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
    expectGisEligible(res, 971.65, true)
    expectAlwTooOld(res, true)
  })
})
