import {
    EntitlementResultType,
    LegalStatus,
    LivingCountry,
    MaritalStatus,
    PartnerBenefitStatus,
    ResultKey,
    ResultReason,
  } from '../../../utils/api/definitions/enums'
  
  import { mockGetRequest, mockGetRequestError } from './factory'
  
    
  
    describe('AlwBenefit', () => {
      
      it('should pass 72 test - CALC-72', async () => {
        const res = await mockGetRequest({
          incomeAvailable: true,
          income: 4000, // personal income
          age: 68,
          oasDefer: false,
          receiveOAS: false,
          oasDeferDuration: undefined,
          oasAge: undefined,
          maritalStatus: MaritalStatus.PARTNERED,
          invSeparated: false,
          livingCountry: LivingCountry.AGREEMENT, // country code
          legalStatus: LegalStatus.YES,
          livedOnlyInCanada: false,
          yearsInCanadaSince18: 40,
          everLivedSocialCountry: false,
          partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
          partnerIncomeAvailable: true,
          partnerIncome: 4326, // partner income
          partnerAge: 68,
          partnerLivingCountry: LivingCountry.CANADA, // country code
          partnerLegalStatus: LegalStatus.YES,
          partnerLivedOnlyInCanada: true,
          partnerYearsInCanadaSince18: 40,
        })
    
        //client results
        expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
        expect(res.body.results.oas.eligibility.reason).toEqual(
          ResultReason.AGE_65_TO_69
        )
        expect(res.body.results.oas.entitlement.type).toEqual(
          EntitlementResultType.FULL
        )
        expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('687.56')
        expect(res.body.results.oas.entitlement.clawback).toEqual(0)
    
        expect(res.body.results.gis.eligibility.result).toEqual(
          ResultKey.INELIGIBLE
        )
        expect(res.body.results.gis.eligibility.reason).toEqual(
          ResultReason.LIVING_COUNTRY
        )
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
          ResultKey.ELIGIBLE
        )
        expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
          ResultReason.AGE_65_TO_69
        )
        expect(res.body.partnerResults.oas.entitlement.type).toEqual(
          EntitlementResultType.FULL
        )
        expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
          '687.56'
        )
        expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)
    
        expect(res.body.partnerResults.gis.eligibility.result).toEqual(
          ResultKey.ELIGIBLE
        )
        expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
          ResultReason.NONE
        )
        expect(res.body.partnerResults.gis.entitlement.result).toEqual(400.15)
    
        expect(res.body.results.alw.eligibility.result).toEqual(
          ResultKey.INELIGIBLE
        )
        expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
        expect(res.body.results.alw.entitlement.result).toEqual(0)
      })
    
  
  })