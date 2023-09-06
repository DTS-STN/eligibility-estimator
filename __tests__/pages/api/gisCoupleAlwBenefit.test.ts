/* eslint-disable prettier/prettier */
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
import { expectOasEligible, expectGisEligible, expectAlwTooOld, expectAlwsMarital, expectOasNotEligible, expectAlwEligible, expectGisNotEligible, expectAlwsEligible } from './expectUtils'

import { mockGetRequest, mockGetRequestError } from './factory'

  //file for extracting test data
  const filePath = '__tests__/utils/ScenariosWith2023Q3RatesAndThresholds.xlsx'

  describe('gisCoupleALWBenefit', () => {
    /* CALC-71 */
    it('should pass 71 test - CALC-71', async () => {
      const desiredName = 'CALC-71' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 698.60)
      expectGisEligible(res, 628.09)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, true)
      expectAlwEligible(res, 1326.69, true)
      expectAlwsMarital(res, true)
    })

     /* CALC-72 */
     it('should pass 72 test - CALC-72', async () => {
      const desiredName = 'CALC-72' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
      expectOasEligible(res, EntitlementResultType.FULL, 782.43)
      expectGisEligible(res, 628.09)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, true)
      expectAlwEligible(res, 1077.69, true)
      expectAlwsMarital(res, true)
    })

     /* CALC-77 */
     it('should pass 77 test - CALC-77', async () => {
      const desiredName = 'CALC-77' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 952.89)
      expectGisEligible(res, 241.52)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, true)
      expectAlwEligible(res, 228.30, true)
      expectAlwsMarital(res, true)
    })

     /* CALC-79*/
     it('should pass 79 test - CALC-79', async () => {
      const desiredName = 'CALC-79' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
      expectOasEligible(res, EntitlementResultType.FULL, 883.73)
      expectGisEligible(res, 240.82)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, true)
      expectAlwEligible(res, 0.0, true)
      expectAlwsMarital(res, true)
    })

    
     /* CALC-80 */
     it('should pass 80 test - CALC-80', async () => {
      const desiredName = 'CALC-80' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expectOasEligible(res, EntitlementResultType.FULL, 1045.11)
      expectGisEligible(res, 59.82)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, true)
      expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.INCOME)
      expectAlwsMarital(res, true)
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

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, true)
      expectAlwEligible(res, 1326.69, true)
      expectAlwsMarital(res, true)
    })

     /* CALC-92 */
     it('should pass 92 test - CALC-92', async () => {
      const desiredName = 'CALC-92' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
      expectOasEligible(res, EntitlementResultType.PARTIAL, 293.42)
      expectGisEligible(res, 1397.08)
      expectAlwTooOld(res)
      expectAlwsMarital(res)

      //partner results
      expectOasNotEligible(res, true)
      expectGisNotEligible(res, true)
      expectAlwEligible(res, 1203.69, true)
      expectAlwsMarital(res, true)
  })
})