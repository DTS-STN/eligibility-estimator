/* eslint-disable prettier/prettier */
import {
  EntitlementResultType,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import { getTransformedPayloadByName } from '../../utils/excelReaderUtil'
import { 
  expectOasEligible, 
  expectGisEligible, 
  expectAlwTooOld, 
  expectAlwsMarital, 
  expectOasNotEligible, 
  expectAlwEligible, 
  expectGisNotEligible, 
  expectFutureOasGisBenefitEligible,
  expectDeferralTable,
  expectAllIneligible} from '../../utils/expectUtils'

import { mockGetRequest } from '../../utils/factory'

  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

  describe('gisCoupleALWBenefit', () => {
    
    /* CALC-71 */
    it('should pass 71 test - CALC-71', async () => {
      const desiredName = 'CALC-71' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 698.6)
      expectGisEligible(res, 628.09)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 71, 698.6, 628.09)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 1326.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 628.09, true)
    })

     /* CALC-72 */
     it('should pass 72 test - CALC-72', async () => {
      const desiredName = 'CALC-72' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
      expectOasEligible(res, EntitlementResultType.FULL, 743.31)
      expectGisEligible(res, 663.02)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 69, 743.31, 580.02)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 1077.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 545.09, true)
    })
     /* CALC-73 */
     it('should pass 73 test - CALC-73', async () => {
      const desiredName = 'CALC-73' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
      const deferralTable = [
        { age: 70, amount: 831.33 },
      ]
       //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 790.99)
      expectDeferralTable(res, deferralTable)
      expectGisEligible(res, 684.41)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      expectDeferralTable(res, deferralTable)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 71, 790.99, 539.41)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 857.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 452.09, true)
    })
    /* CALC-74 */
    it('should pass 74 test - CALC-74', async () => {
      const desiredName = 'CALC-74' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
      const deferralTable = [
        { age: 69, amount: 899.8 },
        { age: 70, amount: 950.1 },
      ]
      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 849.5)
      expectDeferralTable(res, deferralTable)
      expectGisEligible(res, 583.09)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 70, 849.5, 409.09)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 759.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 409.09, true)
    })
    /* CALC-75 */
    it('should pass 75 test - CALC-75', async () => {
      const desiredName = 'CALC-75' // Replace with the desired name
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
      expectOasEligible(res, EntitlementResultType.FULL, 719.56)
      expectDeferralTable(res, deferralTable)
      expectGisEligible(res, 582.30)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 719.56, 350.3)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 582.3, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 350.3, true)
    })
    /* CALC-76 */
    it('should pass 76 test - CALC-76', async () => {
      const desiredName = 'CALC-76' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 1045.11)
      expectGisEligible(res, 241.52)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 100, 1045.11, 8.30)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 241.3, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 8.3, true)
    })

     /* CALC-77 */
     it('should pass 77 test - CALC-77', async () => {
      const desiredName = 'CALC-77' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 857.6)
      expectGisEligible(res, 318.37)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 94, 857.6, 72.15)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 228.30, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, true)
    })
    /* CALC-78 */
    it('should pass 78 test - CALC-78', async () => {
      const desiredName = 'CALC-78' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 783.83)
      expectGisEligible(res, 433.63)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 79, 783.83, 0.0)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 24.3, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, true)
    })

     /* CALC-79*/
     it('should pass 79 test - CALC-79', async () => {
      const desiredName = 'CALC-79' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
      expectOasEligible(res, EntitlementResultType.FULL, 817.45)
      expectGisEligible(res, 298.45)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 79, 817.45, 0.0)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 0.0, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, true)
    })

    /* CALC-80 */
    it('should pass 80 test - CALC-80', async () => {
      const desiredName = 'CALC-80' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 914.47)
      expectGisEligible(res, 155.88)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 77, 914.47, 0.0)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 0.0, true)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.INCOME)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, true)
    })

    /* CALC-81*/
    it('should pass 81test - CALC-81', async () => {
      const desiredName = 'CALC-81' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 1326.69)
      expectAlwsMarital(res)
       //Future Benefit
       expectFutureOasGisBenefitEligible(res, 65, 698.6, 628.09)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
      expectGisEligible(res, 1204.43,true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)

    })
    /* CALC-82*/
    it('should pass 81test - CALC-82', async () => {
      const desiredName = 'CALC-82' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectAllIneligible(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)
      //partner results
      expectAllIneligible(res, true)
    })
    /* CALC-83 */
    it('should pass 83 test - CALC-83', async () => {
      const desiredName = 'CALC-83' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 857.69)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 71, 698.6, 452.09)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
      expectGisEligible(res, 1173.43, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 71, 192.12, 1028.43, true)
    })
    /* CALC-84 */
    it('should pass 84 test - CALC-84', async () => {
      const desiredName = 'CALC-84' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 756.69)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 409.09)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
      expectGisEligible(res, 1159.43, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 80, 192.12, 985.43, true)
    })
    /* CALC-85 */
    it('should pass 85 test - CALC-85', async () => {
      const desiredName = 'CALC-85' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
     //client results
     expectOasEligible(res)
     expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
     expectGisNotEligible(res, ResultReason.AGE_YOUNG)
     expectAlwEligible(res, 582.3)
     expectAlwsMarital(res)
     //Future Benefit
     expectFutureOasGisBenefitEligible(res, 65, 698.6, 350.3)

     //partner results
     expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
     expectGisEligible(res, 1158.64, true)
     expectAlwTooOld(res, true)
     expectAlwsMarital(res, true)
     //Future Benefit
     expectFutureOasGisBenefitEligible(res, 82, 192.12, 926.64, true)
    })
    /* CALC-86 */
    it('should pass 86 test - CALC-86', async () => {
      const desiredName = 'CALC-86' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
     //client results
     expectOasEligible(res)
     expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
     expectGisNotEligible(res, ResultReason.AGE_YOUNG)
     expectAlwEligible(res, 241.3)
     expectAlwsMarital(res)
     //Future Benefit
     expectFutureOasGisBenefitEligible(res, 65, 698.6, 8.3)

     //partner results
     expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12, true)
     expectGisEligible(res, 748.0, true)
     expectAlwTooOld(res, true)
     expectAlwsMarital(res, true)
     //Future Benefit
     expectFutureOasGisBenefitEligible(res, 74, 192.12, 514.78, true)
    })
    /* CALC-87 */
    it('should pass 87 test - CALC-87', async () => {
      const desiredName = 'CALC-87' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 228.3)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
      expectGisEligible(res, 765.47, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 74, 174.65, 519.25, true)
    })
    /* CALC-88 */
    it('should pass 88 test - CALC-88', async () => {
      const desiredName = 'CALC-88' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 24.3)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
      expectGisEligible(res, 765.47, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 75, 192.12, 367.64, true)
    })
    /* CALC-89 */
    it('should pass 89 test - CALC-89', async () => {
      const desiredName = 'CALC-89' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 0.0)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 174.65, true)
      expectGisEligible(res, 765.77, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 74, 174.65, 290.25, true)
    })
    /* CALC-90*/
    it('should pass 90 test - CALC-90', async () => {
      const desiredName = 'CALC-90' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 0.0)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 244.51, true)
      expectGisEligible(res, 513.91, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 244.51, 39.39, true)
    })

    /* CALC-91 */
     it('should pass 91 test - CALC-91', async () => {
      const desiredName = 'CALC-91' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 261.98)
      expectGisEligible(res, 1480.08)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 70, 261.98, 1480.07)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 1326.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45, true)

    })

     /* CALC-92 */
     it('should pass 92 test - CALC-92', async () => {
      const desiredName = 'CALC-92' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 254.29)
      expectGisEligible(res, 1432.0)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 72, 254.29, 1432.0)
     
      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 1200.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 960.45, true)

    })
    /* CALC-93 */
    it('should pass 93 test - CALC-93', async () => {
      const desiredName = 'CALC-93' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
      const deferralTable = [
        { age: 70, amount: 237.52},
      ]
      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 226)
      expectDeferralTable(res, deferralTable)
      expectGisEligible(res, 1360.40)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 70, 226.0, 1360.4)


      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 12137.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 898.45, true)
    })
    /* CALC-94 */
    it('should pass 94 test - CALC-94', async () => {
      const desiredName = 'CALC-94' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
      const deferralTable = [
        { age: 69, amount: 269.94},
        { age: 70, amount: 285.03},
      ]
      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 254.85)
      expectDeferralTable(res, deferralTable)
      expectGisEligible(res, 1050.47)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 1326.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45, true)
    })
    /* CALC-95 */
    it('should pass 95 test - CALC-95', async () => {
      const desiredName = 'CALC-95' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
      const deferralTable = [
        { age: 66, amount: 262.11 },
        { age: 67, amount: 279.72 },
        { age: 68, amount: 297.32 },
        { age: 69, amount: 314.93 },
        { age: 70, amount: 332.53 },
      ]
      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 251.85)
      expectDeferralTable(res, deferralTable)
      expectGisEligible(res, 1497.54)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 68, 251.85, 1497.54)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 582.3, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 416.85, true)
    })
    /* CALC-96 */
    it('should pass 96 test - CALC-96', async () => {
      const desiredName = 'CALC-96' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
      expectGisEligible(res, 310.16)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 79, 192, 310.16)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 1326.69, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45, true)
    })
    /* CALC-97 */
    it('should pass 97 test - CALC-97', async () => {
      const desiredName = 'CALC-97' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 262.04)
      expectGisEligible(res, 1600.58)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 228.3, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, true)
    })
    /* CALC-98 */
    it('should pass 98 test - CALC-98', async () => {
      const desiredName = 'CALC-98' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 192.12)
      expectGisEligible(res, 292.16)
      expectAlwTooOld(res)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 81, 192, 292.16)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 656.90, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 465.82, true)
    })
    /* CALC-99 */
    it('should pass 99 test - CALC-99', async () => {
      const desiredName = 'CALC-99' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 265.12)
      expectGisEligible(res, 1581.37)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 0.0, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0, true)
    })
    /* CALC-100 */
    it('should pass 100 test - CALC-100', async () => {
      const desiredName = 'CALC-100' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 261.28)
      expectGisEligible(res, 297.16)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res,ResultReason.AGE_YOUNG, true)
      expectAlwEligible(res, 399.3, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 48.82, true)
    })
    /* CALC-101 */
    it('should pass 101 test - CALC-101', async () => {
      const desiredName = 'CALC-101' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 1326.69)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 384.23, true)
      expectGisEligible(res, 1427.68, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 85, 174.65, 1427.68, true)
    })
    /* CALC-102 */
    it('should pass 102 test - CALC-102', async () => {
      const desiredName = 'CALC-102' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 1200.69)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 960.45)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 768.46, true)
      expectGisEligible(res, 960.45, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 101, 768.46, 960.45, true)
    })
    /* CALC-103 */
    it('should pass 103 test - CALC-103', async () => {
      const desiredName = 'CALC-103' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 1077.69)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 836.6)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 768.46, true)
      expectGisEligible(res, 898.45, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 79, 768.46, 898.45, true)
    })
    /* CALC-104 */
    it('should pass 104 test - CALC-104', async () => {
      const desiredName = 'CALC-104' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 759.69)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 561.45)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 557.13, true)
      expectGisEligible(res, 1254.78, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 81, 557.13, 1254.78, true)
    })
    /* CALC-105 */
    it('should pass 105 test - CALC-105', async () => {
      const desiredName = 'CALC-105' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 1326.69)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 537.92, true)
      expectGisEligible(res, 647.36, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 80, 537.92, 647.36, true)
    })
    /* CALC-106 */
    it('should pass 106 test - CALC-106', async () => {
      const desiredName = 'CALC-106' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 241.3)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 698.6, true)
      expectGisEligible(res, 1043.45, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 67, 698.60, 1043.45, true)
    })
    /* CALC-107 */
    it('should pass 107 test - CALC-107', async () => {
      const desiredName = 'CALC-107' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 228.3)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 681.14, true)
      expectGisEligible(res, 258.98, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 68, 681.14, 0.0, true)
    })
    /* CALC-108 */
    it('should pass 108 test - CALC-108', async () => {
      const desiredName = 'CALC-108' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 232.30)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 698.6, true)
      expectGisEligible(res, 465.82, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 79, 698.6, 465.82, true)
    })
    /* CALC-109 */
    it('should pass 109 test - CALC-109', async () => {
      const desiredName = 'CALC-109' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

     //client results
     expectOasEligible(res)
     expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
     expectGisNotEligible(res, ResultReason.AGE_YOUNG)
     expectAlwEligible(res, 0.0)
     expectAlwsMarital(res)
     //Future Benefit
     expectFutureOasGisBenefitEligible(res, 65, 698.6, 1043.45)

     //partner results
     expectOasEligible(res, EntitlementResultType.PARTIAL, 646.21, true)
     expectGisEligible(res, 293.21, true)
     expectAlwTooOld(res, true)
     expectAlwsMarital(res, true)
     //Future Benefit
     expectFutureOasGisBenefitEligible(res, 72, 646.21, 0.0, true)
    })
    /* CALC-110 */
    it('should pass 110 test - CALC-110', async () => {
      const desiredName = 'CALC-110' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)

      //client results
      expectOasEligible(res)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expectGisNotEligible(res, ResultReason.AGE_YOUNG)
      expectAlwEligible(res, 235.3)
      expectAlwsMarital(res)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 65, 698.6, 0.0)

      //partner results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 628.74, true)
      expectGisEligible(res, 118.68, true)
      expectAlwTooOld(res, true)
      expectAlwsMarital(res, true)
      //Future Benefit
      expectFutureOasGisBenefitEligible(res, 72, 628.74, 118.68, true)
    })

})