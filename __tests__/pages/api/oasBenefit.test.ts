import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest } from './factory'
import {
  partnerUndefined,
} from './expectUtils'

describe('OasBenefit', () => {

 /* CALC-01  */
  it('should pass the first test - OAS-CALC-01', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 2000, // personal income
      age: 66,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":1,"months":5}',
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 41,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS,
      partnerIncomeAvailable: true,
      partnerIncome: 1500, // partner income
      partnerAge: 70,
      partnerLivingCountry: LivingCountry.AGREEMENT, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 41,
    })

    expect(res.status).toEqual(200)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
   // expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('769.86') // we need to use the new levalValue "July to September 2023"

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
  
   // expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('960.45') 
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('698.60') // we need to use the new levalValue "July to September 2023"

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.LIVING_COUNTRY)
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual( ResultReason.AGE)
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

  })

  /* CALC-02  */
  it('should pass the second test - OAS-CALC-02', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 20000, // personal income
      age: 69,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":1,"months":8}',
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,

    })


    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('195.61') // we need to use the new levalValue "July to September 2023"

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //  expect(res.body.results.alw.entitlement.result.toFixed(2)).toEqual('572.77') //Received: "0.00"
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

  })

  /* CALC-03  */
  it('should pass the 03 test - OAS-CALC-03', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 21000, // personal income
      age: 68,
      oasDefer: false,
      oasAge: undefined,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 12,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

  
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('199.61') //received 209.58

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
  
   // expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('572.77') //received 495.84
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

   

  })
  /* CALC-04 */
  it('should pass the 04 test - OAS-CALC-04', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 16000, // personal income
      age: 85,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":3,"months":3}',
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS,
      partnerIncomeAvailable: true,
      partnerIncome: 4000, // partner income
      partnerAge: 80,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: true,
      partnerYearsInCanadaSince18: 40,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('948.28') // we need to use the new levalValue "July to September 2023"

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
  
    //expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('166.30') // we need to use the new levalValue "July to September 2023"
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('768.46') // we need to use the new levalValue "July to September 2023"

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.partnerResults.gis.entitlement.result.toFixed(2)).toEqual('166.30')// we need to use the new levalValue "July to September 2023"

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual( ResultReason.AGE)
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)


  })
  /* CALC-05  */
  it('should pass the 05 test - OAS-CALC-05', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 81761, // personal income
      age: 81,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":0,"months":0}',
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.AGREEMENT, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 0, // partner income
      partnerAge: 75,
      partnerLivingCountry: undefined, // country code
      partnerLegalStatus: LegalStatus.NO,
      partnerLivedOnlyInCanada: undefined,
      partnerYearsInCanadaSince18: undefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('384.23') // we need to use the new levalValue "July to September 2023"

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.INELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.LIVING_COUNTRY)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual( ResultReason.YEARS_IN_CANADA)
    expect(res.body.partnerResults.oas.entitlement.result).toEqual(0) 

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual( ResultReason.OAS)
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual( ResultReason.AGE)
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

  })
  /* CALC-06  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 92000, // personal income
      age: 75,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":0,"months":0}',
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('768.46') // we need to use the new levalValue "July to September 2023"

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)


  })
  /* CALC-07  */
  it('should pass the 07 test - OAS-CALC-07', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 62000, // personal income
      age: 87,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":5,"months":0}',
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 48000, // partner income
      partnerAge: 85,
      partnerLivingCountry: LivingCountry.AGREEMENT, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 35,
    })

    expect(res.status).toEqual(200)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('522.56') // we need to use the new levalValue "July to September 2023"

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
   // expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('672.41') // we need to use the new levalValue "July to September 2023"

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.LIVING_COUNTRY)
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual( ResultReason.AGE)
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

  })
  /* CALC-08  */
  it('should pass the 08 test - OAS-CALC-08', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 134626.01, // personal income
      age: 65,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":0,"months":0}',
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.OAS,
      partnerIncomeAvailable: true,
      partnerIncome: 1500, // partner income
      partnerAge: 70,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 10,
    })

    expect(res.status).toEqual(200)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('174.65') // we need to use the new levalValue "July to September 2023"

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual( ResultReason.AGE)
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

  })
  /* CALC-09  */
  it('should pass the 09 test - OAS-CALC-09', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 134626.01, // personal income
      age: 69,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":3,"months":11}',
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0) 
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)


  })
  /* CALC-10  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 134626.01, // personal income
      age: 72,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":0,"months":0}',
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })


    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)


  })
  /* CALC-11  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 137331.01, // personal income
      age: 85,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":4,"months":3}',
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.AGREEMENT, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 35,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.INELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.LIVING_COUNTRY)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)


  })
  /* CALC-12  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 150000.00, // personal income
      age: 71,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":5,"months":0}',
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)


  })
  /* CALC-13  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 137331.01, // personal income
      age: 76,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":3,"months":3}',
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

  
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0) 
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)


  })
  /* CALC-14  */
  it('should pass the 14 test - OAS-CALC-14', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 137331.01, // personal income
      age: 90,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":0,"months":0}',
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 0, // partner income
      partnerAge: 91,
      partnerLivingCountry: LivingCountry.AGREEMENT, // country code
      partnerLegalStatus: LegalStatus.NO,
      partnerLivedOnlyInCanada: undefined,
      partnerYearsInCanadaSince18: undefined,
    })

 
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0) 
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)


    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.UNAVAILABLE)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.LIVING_COUNTRY)
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.LIVING_COUNTRY)
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual( ResultReason.AGE)
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)

  })
  /* CALC-15  */
  it('should pass the 06 test - OAS-CALC-06', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 137331.01, // personal income
      age: 88,
      oasDefer: true,
      oasAge: 65,
      receiveOAS: true,
      oasDeferDuration: '{"years":0,"months":0}',
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: true,
      livingCountry: LivingCountry.AGREEMENT, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 39,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.INELIGIBLE)
    expect(res.body.results.gis.entitlement.result).toEqual(0)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.LIVING_COUNTRY)
    
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)


  })
  /* CALC-16 */
  it('should pass the 16 test - OAS-CALC-16', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 0, // personal income
      age: 65,
      oasDefer: false,
      oasAge: 65,
      receiveOAS: false,
      oasDeferDuration: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 41,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 0, // partner income
      partnerAge: 64,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: true,
      partnerYearsInCanadaSince18: undefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('698.60') // we need to use the new levalValue "July to September 2023"

    expect(res.body.results.gis.eligibility.result).toEqual( ResultKey.ELIGIBLE)
   // expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('1043.45') //// we need to use the new levalValue "July to September 2023"
   
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.MARITAL)
    expect(res.body.results.alws.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.AGE_YOUNG_64)
    expect(res.body.partnerResults.oas.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
   // expect(res.body.partnerResults.alw.entitlement.result).toEqual(1326.69)// we need to use the new levalValue "July to September 2023"

  })
})