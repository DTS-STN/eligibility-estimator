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
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.gis.entitlement.result).toEqual(628.09)
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
    })

     /* CALC-72 */
     it('should pass 72 test - CALC-72', async () => {
      const desiredName = 'CALC-72' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('782.43')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.results.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.results.alw.entitlement.result).toEqual(0)
    })

     /* CALC-73 */
     it('should pass 73 test - CALC-73', async () => {
      const desiredName = 'CALC-73' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('597.09')
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
    })

     /* CALC-74 */
     it('should pass 74 test - CALC-74', async () => {
      const desiredName = 'CALC-74' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('583.09')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('759.69')
    })

     /* CALC-75 */
     it('should pass 75 test - CALC-75', async () => {
      const desiredName = 'CALC-75' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('582.30')
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
    })

     /* CALC-76 */
     it('should pass 76 test - CALC-76', async () => {
      const desiredName = 'CALC-76' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('241.52')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('241.30')
    })

     /* CALC-77 */
     it('should pass 77 test - CALC-77', async () => {
      const desiredName = 'CALC-77' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('952.89')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('241.52')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
    })

     /* CALC-78 */
     it('should pass 78 test - CALC-78', async () => {
      const desiredName = 'CALC-78' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('241.52')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('24.30')
    })

     /* CALC-79*/
     it('should pass 79 test - CALC-79', async () => {
      const desiredName = 'CALC-79' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('883.73')
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('240.82')
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('0.00')
    })

     /* CALC-80 */
     it('should pass 80 test - CALC-80', async () => {
      const desiredName = 'CALC-80' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('1045.11')
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('59.82')
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-81 */
     it('should pass 81 test - CALC-81', async () => {
      const desiredName = 'CALC-81' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
      expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
      expect(res.body.results.oas.entitlement.result).toEqual(0)
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.results.gis.entitlement.result).toEqual(0)
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
      expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('288.18')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1523.74')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-82 */
     it('should pass 82 test - CALC-82', async () => {
      const desiredName = 'CALC-82' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('288.18')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1523.74')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-83 */
     it('should pass 83 test - CALC-83', async () => {
      const desiredName = 'CALC-83' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64 )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('860.69')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('288.18')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1077.38')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-84 */
     it('should pass 84 test - CALC-84', async () => {
      const desiredName = 'CALC-84' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
      expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
      expect(res.body.results.oas.entitlement.result).toEqual(0)
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.results.gis.entitlement.result).toEqual(0)
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('759.69')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
      expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('288.18')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1063.38')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-85 */
     it('should pass 85 test - CALC-85', async () => {
      const desiredName = 'CALC-85' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
      expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
      expect(res.body.results.oas.entitlement.result).toEqual(0)
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.results.gis.entitlement.result).toEqual(0)
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('584.90')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
      expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('288.18')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1062.59')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-86 */
     it('should pass 86 test - CALC-86', async () => {
      const desiredName = 'CALC-86' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
      expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
      expect(res.body.results.oas.entitlement.result).toEqual(0)
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.results.gis.entitlement.result).toEqual(0)
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('241.30')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)
      expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('261.98')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('678.15')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-87 */
     it('should pass 87 test - CALC-87', async () => {
      const desiredName = 'CALC-87' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
      expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
      expect(res.body.results.oas.entitlement.result).toEqual(0)
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.results.gis.entitlement.result).toEqual(0)
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
      expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('261.98')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('906.45')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-88 */
     it('should pass 88 test - CALC-88', async () => {
      const desiredName = 'CALC-88' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
     //client results
     expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
     expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64 )
     expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
     expect(res.body.results.oas.entitlement.result).toEqual(0)
 
     expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
     expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
     expect(res.body.results.gis.entitlement.result).toEqual(0)
 
     expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
     expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.PARTNER)
     expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
 
     expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
     expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
     expect(res.body.results.alws.entitlement.result).toEqual(0)
 
     //partner results
     expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
     expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
     expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
     expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('261.98')
     expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
     expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
     expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('702.45')
     expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
     expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
     expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-89 */
     it('should pass 89 test - CALC-89', async () => {
      const desiredName = 'CALC-89' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64 )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('261.98')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('677.45')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-90 */
     it('should pass 90 test - CALC-90', async () => {
      const desiredName = 'CALC-90' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64 )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.PARTNER)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('261.98')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('496.45')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

     /* CALC-91 */
     it('should pass 91 test - CALC-91', async () => {
      const desiredName = 'CALC-91' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('261.98')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('1480.08')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('1326.69')
    })

     /* CALC-92 */
     it('should pass 92 test - CALC-92', async () => {
      const desiredName = 'CALC-92' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('293.42')
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('1397.08')
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('1203.69')
    })

     /* CALC-93 */
     it('should pass 93 test - CALC-93', async () => {
      const desiredName = 'CALC-93' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('261.98')
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('1273.08')
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('1140.69')
    })

     /* CALC-94 */
    it('should pass 94 test - CALC-94', async () => {
      const desiredName = 'CALC-94' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('261.98')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('998.08')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('1326.69')
    })

     /* CALC-95 */
     it('should pass 95 test - CALC-95', async () => {
      const desiredName = 'CALC-95' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('261.98')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('1480.08')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('584.90')
    })
     /* CALC-96 */
     it('should pass 96 test - CALC-96', async () => {
      const desiredName = 'CALC-96' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('288.18')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('214.11')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('1326.69')
    })
     /* CALC-97 */
     it('should pass 97 test - CALC-97', async () => {
      const desiredName = 'CALC-97' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('357.34')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('1523.74')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('228.30')
    })
     /* CALC-98 */
     it('should pass 98 test - CALC-98', async () => {
      const desiredName = 'CALC-98' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('288.18')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('196.11')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('656.90')
    })
     /* CALC-99 */
     it('should pass 99 test - CALC-99', async () => {
      const desiredName = 'CALC-99' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('331.41')
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('1523.74')
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('0.00')
    })
     /* CALC-100 */
     it('should pass 100 test - CALC-100', async () => {
      const desiredName = 'CALC-100' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('391.92')
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('201.11')
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.INCOME)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('0.00')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.alw.entitlement.result.toFixed(2)).toEqual('399.30')
    })
     /* CALC-101 */
     it('should pass 101 test - CALC-101', async () => {
      const desiredName = 'CALC-101' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64 )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.PARTNER)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('768.46')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1043.45')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })
     /* CALC-102 */
     it('should pass 102 test - CALC-102', async () => {
      const desiredName = 'CALC-102' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('768.46')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1043.45')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })
     /* CALC-103 */
     it('should pass 103 test - CALC-103', async () => {
      const desiredName = 'CALC-103' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('1077.69')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('768.46')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('898.45')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })
     /* CALC-104 */
     it('should pass 104 test - CALC-104', async () => {
      const desiredName = 'CALC-104' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('759.69')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('768.46')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1043.45')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

    /* CALC-105 */
    it('should pass 105 test - CALC-105', async () => {
      const desiredName = 'CALC-105' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('1326.69')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_70_AND_OVER)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('768.46')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('416.82')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })
     /* CALC-106 */
     it('should pass 106 test - CALC-106', async () => {
      const desiredName = 'CALC-106' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('241.30')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('698.60')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('1043.45')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })
     /* CALC-107 */
     it('should pass 107 test - CALC-107', async () => {
      const desiredName = 'CALC-107' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
       expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('698.60')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('469.82')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })
     /* CALC-108 */
     it('should pass 108 test - CALC-108', async () => {
      const desiredName = 'CALC-108' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
       //client results
       expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64 )
       expect(res.body.results.oas.entitlement.result).toEqual(0)
   
       expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS )
       expect(res.body.results.gis.entitlement.result).toEqual(0)
   
       expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.PARTNER)
       expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
   
       expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
       expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
       expect(res.body.results.alws.entitlement.result).toEqual(0)
   
       //partner results
       expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)
       expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
       expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('698.60')
       expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
       expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
       expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('465.82')
       expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
       expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
       expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })
     /* CALC-109 */
     it('should pass 109 test - CALC-109', async () => {
      const desiredName = 'CALC-109' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
      expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
      expect(res.body.results.oas.entitlement.result).toEqual(0)
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.results.gis.entitlement.result).toEqual(0)
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('0.00')
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)
      expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('698.60')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('240.82')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })
     /* CALC-110 */
     it('should pass 110 test - CALC-110', async () => {
      const desiredName = 'CALC-110' // Replace with the desired name
      const extractedPayload = getTransformedPayloadByName(filePath, desiredName)
      const res = await mockGetRequest(extractedPayload)
  
      //client results
      expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG )
      expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.NONE)
      expect(res.body.results.oas.entitlement.result).toEqual(0)
  
      expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
      expect(res.body.results.gis.entitlement.result).toEqual(0)
  
      expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.PARTNER)
      expect(res.body.results.alw.entitlement.result).toEqual(0)
  
      expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
      expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
      expect(res.body.results.alws.entitlement.result).toEqual(0)
  
      //partner results
      expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)
      expect(res.body.partnerResults.oas.entitlement.type).toEqual(EntitlementResultType.FULL)
      expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('698.60')
      expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
      expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.NONE)
      expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('59.82')
      expect(res.body.partnerResults.alw.eligibility.result).toEqual( ResultKey.INELIGIBLE)
      expect(res.body.partnerResults.alw.eligibility.reason).toEqual(ResultReason.AGE)
      expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
    })

})