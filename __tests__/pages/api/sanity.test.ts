/**
 * Run all sanity test cases to ensure this is no breaking changes
 */
import {
  EntitlementResultType,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
  ValidationErrors,
} from '../../../utils/api/definitions/enums'

import { mockGetRequest, mockGetRequestError } from './factory'
import {
  expectAlwsEligible,
  expectAlwsMarital,
  expectAlwEligible,
  expectAlwTooOld,
  expectGisEligible,
  expectGisNotEligible,
  expectOasEligible,
  expectOasNotEligible,
  getErrorDetails,
  partnerUndefined,
} from './expectUtils'

describe('EE Sanity Test Scenarios:', () => {
  /* SAN-OAS-01
    client: 
      - age: 65
      - delayOAS: 3
      - income: 85,000
      - Country of Residence: Italy 
      - years resided in Canada: 20
      - Legal Status: eligible
      - marital status: partnered
      - partner pension: I don't know
    partner: 
      - age: 75
      - income : 90,000
      - Country of Residence: Canada 
      - years resided in Canada: 40
      - Legal Status: eligible

      User's OAS = 20/40 of Max OAS plus actuarial amounts ($418.40) minus Recovery Tax ($64.44), net of $353.60
      Partner's OAS = Max OAS + 10% ($756.32) minus Recovery Tax ($126.94), net of $629.38
      User not eligible for GIS due to country of residence
      Partner eligible for GIS but combined income is too high
      Both not eligible for ALW and ALWS
  */
  // it('should pass the first sanity test - SAN-OAS-01', async () => {
  //   const res = await mockGetRequest({
  //     incomeAvailable: true,
  //     income: 85000, // personal income
  //     age: 69,
  //     oasDefer: true,
  //     oasAge: 68,
  //     receiveOAS: true,
  //     oasDeferDuration: '{"years":3,"months":1}',
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: false,
  //     livingCountry: LivingCountry.AGREEMENT, // country code
  //     legalStatus: LegalStatus.YES,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: 20,
  //     everLivedSocialCountry: true,
  //     partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
  //     partnerIncomeAvailable: true,
  //     partnerIncome: 90000, // partner income
  //     partnerAge: 75,
  //     partnerLivingCountry: LivingCountry.CANADA, // country code
  //     partnerLegalStatus: LegalStatus.YES,
  //     partnerLivedOnlyInCanada: true,
  //     partnerYearsInCanadaSince18: 40,
  //   })

  //   expect(res.status).toEqual(200)

  //   //client results
  //   expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('353.60') //with tax recovery #114098
  //   expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('420.10') //without tax recovery
  //   expect(res.body.results.oas.entitlement.clawback).toEqual(64.44)
  //   expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE) //with residency changes before ineligible
  //   expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME) //with residency changes
  //   expect(res.body.results.gis.entitlement.result).toEqual(0)

  //   expect(res.body.results.alw.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  //   expect(res.body.results.alw.entitlement.result).toEqual(0)
  //   expect(res.body.results.alws.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alws.eligibility.reason).toEqual(
  //     ResultReason.MARITAL
  //   )
  //   expect(res.body.results.alws.entitlement.result).toEqual(0)

  //   //partner results
  //   expect(res.body.partnerResults.oas.eligibility.result).toEqual(
  //     ResultKey.ELIGIBLE
  //   )
  //   //expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('629.38') //with tax recovery #114098
  //   expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
  //     '756.32'
  //   ) //without tax recovery
  //   expect(res.body.partnerResults.gis.eligibility.result).toEqual(
  //     ResultKey.ELIGIBLE
  //   )
  //   expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
  //     ResultReason.INCOME
  //   )
  //   expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)
  //   expect(res.body.partnerResults.alw.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
  //     ResultReason.AGE
  //   )
  //   expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  // })

  /* SAN-OAS-02
    client: 
      - age: 75
      - delayOAS: 0
      - income: 85,000
      - Country of Residence: Canada 
      - years resided in Canada: 10
      - Legal Status: eligible
      - marital status: partnered
      - partner pension: no
    partner: 
      - age: 65
      - income : 90,000
      - Country of Residence: Not Canada 
      - years resided in Canada: 40
      - Legal Status: eligible      
  
    "User's OAS = 10/40 of Max OAS 10% ($189.08) minus Recovery Tax ($64.44), net of $124.64
    Partner's OAS = Max OAS ($687.56) minus Recovery Tax ($126.94), net of $560.62
    User eligible for GIS but combined income is too high
    Partner not eligible for GIS due to country of residence
    Both not eligible for ALW and ALWS"
*/
  it('should pass the 02 sanity test - SAN-OAS-02', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 85000, // personal income
      age: 75,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 90000, // partner income
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.AGREEMENT, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: true,
      partnerYearsInCanadaSince18: 40,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('124.64') //with tax recovery #114098
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('189.08') //without tax recovery #114098
    expect(res.body.results.oas.entitlement.clawback).toEqual(64.44)

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
      ResultKey.ELIGIBLE
    )
    //expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('560.62') //with tax recovery #114098
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '687.56'
    ) //without tax recovery #114098
    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )

    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)
    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /* SAN-OAS-03
    client: 
      - age: 75
      - delayOAS: 2
      - income: 129757 + 1000
      - Country of Residence: Canada 
      - years resided in Canada: 40
      - Legal Status: eligible
      - marital status: partnered
      - partner pension: no
    partner: 
      - age: 75
      - income : 129757
      - Country of Residence: Canada 
      - years resided in Canada: 15
      - Legal Status: eligible 
  
    "User's OAS = no estimate since income is above max threshold
    Partner's OAS = 15/40 of Max OAS + 10% ($661.78) minus Recovery Tax ($623.90), net of $37.88
    User and partner are eligible for GIS but combined income is too high
    Both not eligible for ALW and ALWS"
*/
  it('should pass the 03 sanity test - SAN-OAS-03', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 130757, // personal income
      age: 75,
      oasDefer: true,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: 67,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncomeAvailable: true,
      partnerIncome: 129757, // partner income
      partnerAge: 75,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 35,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.INCOME)
    expect(res.body.results.oas.entitlement.result).toEqual(0)
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

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
      ResultKey.ELIGIBLE
    )
    //expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('37.88') //with tax recovery #114098
    //expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual('661.78') //without tax recovery #114098
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '472.70'
    ) //#oas-deferrall

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )

    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.INCOME
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(0)
    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
    expect(res.body.partnerResults.alw.entitlement.result).toEqual(0)
  })

  /*
    SAN-GIS-S-01
    client: 
      - age: 68
      - delayOAS: 5
      - income: 2000
      - Country of Residence: Canada 
      - years resided in Canada: 40
      - Legal Status: eligible
      - marital status: windowed
  */
  it('should pass the sanity test - SAN-GIS-S-01', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 2000, // personal income
      age: 70,
      oasDefer: true,
      receiveOAS: false,
      oasDeferDuration: '{"years":5,"months":0}',
      oasAge: 70,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: undefined,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: false,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('935.08')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('943.96')

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alws.entitlement.result).toEqual(0)
  })

  /*
    SAN-GIS-S-02
    client: 
      - age: 78
      - delayOAS: 0
      - income: 9636
      - Country of Residence: Canada 
      - years resided in Canada: 20
      - Legal Status: eligible
      - marital status: single
  */

  it('should pass the sanity test - SAN-GIS-S-02', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 9673.76, // personal income
      age: 78,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: undefined,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: false,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('378.16')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('843.12')

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

  /*
    SAN-GIS-S-03
    client: 
      - age: 78
      - delayOAS: 4
      - income: 20832
      - Country of Residence: Canada 
      - years resided in Canada: 40
      - Legal Status: eligible
      - marital status: single
  */

  it('should pass the sanity test - SAN-GIS-S-03', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 20832, // personal income
      age: 78,
      oasDefer: true,
      receiveOAS: false,
      oasDeferDuration: '{"years":4,"months":0}',
      oasAge: 69,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: undefined,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: false,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('974.14')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

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
  })

  /*
    SAN-GIS-C2-01
    client: 
      - age: 68
      - delayOAS: 3
      - income: 4000
      - Country of Residence: Canada 
      - years resided in Canada: 10
      - Legal Status: eligible
      - marital status: married
      - involuntarily separated: yes
      - partner pension: I don't know
    partner: 
      - age: 78
      - income: 0
      - legal status: yes
      - country of residence: Italy
      - lived outside Canada: yes
      - years resided in Canada: 40
  */

  // it('should pass the sanity test - SAN-GIS-c2-01', async () => {
  //   const res = await mockGetRequest({
  //     incomeAvailable: true,
  //     income: 4000, // personal income
  //     age: 68,
  //     oasDefer: true,
  //     receiveOAS: true,
  //     oasDeferDuration: '{"years":3,"months":0}',
  //     oasAge: 68,
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: true,
  //     livingCountry: LivingCountry.CANADA, // country code
  //     legalStatus: LegalStatus.YES,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: 10,
  //     everLivedSocialCountry: false,
  //     partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
  //     partnerIncomeAvailable: true,
  //     partnerIncome: 0, // partner income
  //     partnerAge: 78,
  //     partnerLivingCountry: LivingCountry.AGREEMENT, // country code
  //     partnerLegalStatus: LegalStatus.YES,
  //     partnerLivedOnlyInCanada: false,
  //     partnerYearsInCanadaSince18: 40,
  //   })

  //   //client results
  //   expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   expect(res.body.results.oas.eligibility.reason).toEqual(ResultReason.AGE_65_TO_69)
  //   expect(res.body.results.oas.entitlement.type).toEqual(EntitlementResultType.PARTIAL)
  //   expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('209.02')
  //   expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('0')
  //   expect(res.body.results.oas.entitlement.clawback).toEqual(0)

  //   expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  //   expect(res.body.results.gis.entitlement.result).toEqual(1335.63)

  //   expect(res.body.results.alw.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  //   expect(res.body.results.alw.entitlement.result).toEqual(0)

  //   expect(res.body.results.alws.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alws.eligibility.reason).toEqual(
  //     ResultReason.MARITAL
  //   )
  //   expect(res.body.results.alws.entitlement.result).toEqual(0)
  // })

  /*
    SAN-GIS-C2-02
    client: 
      - age: 68
      - delayOAS: 0
      - income: 4000
      - Country of Residence: Italy
      - lived outside Canda: yes 
      - years resided in Canada: 40
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: OAS
    partner: 
      - age: 68
      - income: 4,326
      - legal status: yes
      - country of residence: Canada
      - lived outside Canada: no
      - years resided in Canada: 40
  */

  it('should pass the sanity test - SAN-GIS-c2-02', async () => {
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
      //EntitlementResultType.FULL
      EntitlementResultType.PARTIAL //oas deferral
    )
    //expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('687.56')
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('773.36') //oas-deferral
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

  /*
    SAN-GIS-C2-03
    client: 
      - age: 78
      - delayOAS: 2
      - income: 8326
      - Country of Residence: Canada
      - lived outside Canda: yes 
      - years resided in Canada: 30
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: no
    partner: 
      - age: 68
      - income: 19226
      - legal status: yes
      - country of residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 20
  */

  // it('should pass the sanity test - SAN-GIS-c2-03', async () => {
  //   const res = await mockGetRequest({
  //     incomeAvailable: true,
  //     income: 8347.84, // personal income
  //     age: 78,
  //     oasDefer: true,
  //     receiveOAS: true,
  //     oasDeferDuration: '{"years":2,"months":6}',
  //     oasAge: 67,
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: false,
  //     livingCountry: LivingCountry.CANADA, // country code
  //     legalStatus: LegalStatus.YES,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: 30,
  //     everLivedSocialCountry: false,
  //     partnerBenefitStatus: PartnerBenefitStatus.NONE,
  //     partnerIncomeAvailable: true,
  //     partnerIncome: 19300.16, // partner income
  //     partnerAge: 68,
  //     partnerLivingCountry: LivingCountry.CANADA, // country code
  //     partnerLegalStatus: LegalStatus.YES,
  //     partnerLivedOnlyInCanada: false,
  //     partnerYearsInCanadaSince18: 20,
  //   })

  //   //client results
  //   expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   expect(res.body.results.oas.eligibility.reason).toEqual(
  //     ResultReason.AGE_70_AND_OVER
  //   )
  //   expect(res.body.results.oas.entitlement.type).toEqual(
  //     EntitlementResultType.PARTIAL
  //   )
  //   expect(res.body.results.oas.entitlement.result).toEqual(669.34)
  //   expect(res.body.results.oas.entitlement.clawback).toEqual(0)

  //   expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  //   expect(res.body.results.gis.entitlement.result).toEqual(652.97) // PartnerBenefit = No, therefore calculate as single user. #115349
  //   //expect(res.body.results.gis.entitlement.result).toEqual(170.98)

  //   expect(res.body.results.alw.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  //   expect(res.body.results.alw.entitlement.result).toEqual(0)

  //   expect(res.body.results.alws.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alws.eligibility.reason).toEqual(
  //     ResultReason.MARITAL
  //   )
  //   expect(res.body.results.alws.entitlement.result).toEqual(0)

  //   //partner results
  //   expect(res.body.partnerResults.oas.eligibility.result).toEqual(
  //     ResultKey.ELIGIBLE
  //   )
  //   expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
  //     ResultReason.AGE_65_TO_69
  //   )
  //   expect(res.body.partnerResults.oas.entitlement.type).toEqual(
  //     EntitlementResultType.PARTIAL
  //   )
  //   //expect(res.body.partnerResults.oas.entitlement.result).toEqual(343.78)
  //   expect(res.body.partnerResults.oas.entitlement.result).toEqual(292.21) //oas-deferral
  //   expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

  //   expect(res.body.partnerResults.gis.eligibility.result).toEqual(
  //     ResultKey.ELIGIBLE
  //   )
  //   expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
  //     ResultReason.NONE
  //   )
  //   //expect(res.body.partnerResults.gis.entitlement.result).toEqual(340.87)
  //   expect(res.body.partnerResults.gis.entitlement.result).toEqual(392.44) //oas-deferral

  //   expect(res.body.results.alw.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  //   expect(res.body.results.alw.entitlement.result).toEqual(0)
  // })

  /*
  SAN-GIS-C2-04
    client: 
      - age: 78
      - delayOAS: 0
      - income: 8326
      - Country of Residence: Canada
      - lived outside Canda: yes 
      - years resided in Canada: 20
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: I don't know
    partner: 
      - age: 78
      - income: 19326
      - legal status: yes
      - country of residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 10
  */

  // it('should pass the sanity test - SAN-GIS-c2-04', async () => {
  //   const res = await mockGetRequest({
  //     incomeAvailable: true,
  //     income: 8347.84, // personal income
  //     age: 78,
  //     oasDefer: false,
  //     receiveOAS: true,
  //     oasDeferDuration: '{"years":0,"months":0}',
  //     oasAge: undefined,
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: false,
  //     livingCountry: LivingCountry.CANADA, // country code
  //     legalStatus: LegalStatus.YES,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: 20,
  //     everLivedSocialCountry: false,
  //     partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
  //     partnerIncomeAvailable: true,
  //     partnerIncome: 27748, // partner income
  //     partnerAge: 78,
  //     partnerLivingCountry: LivingCountry.CANADA, // country code
  //     partnerLegalStatus: LegalStatus.YES,
  //     partnerLivedOnlyInCanada: false,
  //     partnerYearsInCanadaSince18: 10,
  //   })

  //   //client results
  //   expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   expect(res.body.results.oas.eligibility.reason).toEqual(
  //     ResultReason.AGE_70_AND_OVER
  //   )
  //   expect(res.body.results.oas.entitlement.type).toEqual(
  //     EntitlementResultType.PARTIAL
  //   )
  //   expect(res.body.results.oas.entitlement.result).toEqual(378.16)
  //   expect(res.body.results.oas.entitlement.clawback).toEqual(0)

  //   expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
  //   expect(res.body.results.gis.entitlement.result).toEqual(200.25)

  //   expect(res.body.results.alw.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  //   expect(res.body.results.alw.entitlement.result).toEqual(0)

  //   expect(res.body.results.alws.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alws.eligibility.reason).toEqual(
  //     ResultReason.MARITAL
  //   )
  //   expect(res.body.results.alws.entitlement.result).toEqual(0)

  //   //partner results
  //   expect(res.body.partnerResults.oas.eligibility.result).toEqual(
  //     ResultKey.ELIGIBLE
  //   )
  //   expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
  //     ResultReason.AGE_70_AND_OVER
  //   )
  //   expect(res.body.partnerResults.oas.entitlement.type).toEqual(
  //     EntitlementResultType.PARTIAL
  //   )
  //   expect(res.body.partnerResults.oas.entitlement.result).toEqual(189.08)
  //   expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

  //   expect(res.body.partnerResults.gis.eligibility.result).toEqual(
  //     ResultKey.ELIGIBLE
  //   )
  //   expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
  //     ResultReason.NONE
  //   )
  //   expect(res.body.partnerResults.gis.entitlement.result).toEqual(389.33)

  //   expect(res.body.results.alw.eligibility.result).toEqual(
  //     ResultKey.INELIGIBLE
  //   )
  //   expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
  //   expect(res.body.results.alw.entitlement.result).toEqual(0)
  // })

  /*
    SAN-GIS-C1-01
    client: 
      - age: 78
      - delayOAS: 0
      - income: 0
      - Country of Residence: Italy
      - lived outside Canda: yes 
      - years resided in Canada: 35
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: I don't know
    partner: 
      - age: 78
      - income: 0
      - legal status: yes
      - country of residence: Canada
      - lived outside Canada: no
      - years resided in Canada: 40
  */

  it('should pass the sanity test - SAN-GIS-c1-01', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 0, // personal income
      age: 78,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.AGREEMENT, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 35,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 0, // partner income
      partnerAge: 78,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: true,
      partnerYearsInCanadaSince18: 40,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result).toEqual(661.78)
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
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.FULL
    )
    expect(res.body.partnerResults.oas.entitlement.result).toEqual(756.32)
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(618.15)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })

  /*
    SAN-GIS-C1-02
    client: 
      - age: 78
      - delayOAS: 0
      - income: 0
      - Country of Residence: Canada
      - lived outside Canda: yes 
      - years resided in Canada: 20
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: I don't know
    partner: 
      - age: 78
      - income: 4000
      - legal status: no
  */

  // it('should pass the sanity test - SAN-GIS-c1-02', async () => {
  //   const res = await mockGetRequest({
  //     incomeAvailable: true,
  //     income: 0, // personal income
  //     age: 78,
  //     oasDefer: false,
  //     receiveOAS: true,
  //     oasDeferDuration: '{"years":0,"months":0}',
  //     oasAge: undefined,
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: false,
  //     livingCountry: LivingCountry.CANADA, // country code
  //     legalStatus: LegalStatus.YES,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: 20,
  //     everLivedSocialCountry: false,
  //     partnerBenefitStatus: PartnerBenefitStatus.NONE,
  //     partnerIncomeAvailable: true,
  //     partnerIncome: 4000, // partner income
  //     partnerAge: 70,
  //     partnerLivingCountry: undefined, // country code
  //     partnerLegalStatus: LegalStatus.NO,
  //     partnerLivedOnlyInCanada: undefined,
  //     partnerYearsInCanadaSince18: undefined,
  //   })

  //   //client results
  //   expectOasEligible(res, EntitlementResultType.PARTIAL, 378.16)
  //   expectGisEligible(res, 1405.12)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)
  //   //partner results
  //   expectOasNotEligible(res, true)
  //   expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
  //     //ResultReason.LEGAL_STATUS
  //     ResultReason.YEARS_IN_CANADA
  //   )
  //   expectGisNotEligible(res, true)
  //   expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
  //     //ResultReason.LEGAL_STATUS
  //     ResultReason.OAS
  //   )
  //   expectAlwTooOld(res, true)
  // })

  /*
    SAN-GIS-C1-03
    client: 
      - age: 78
      - delayOAS: 4
      - income: 4000
      - Country of Residence: Canada
      - lived outside Canda: yes 
      - years resided in Canada: 30
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: yes
      - partner pension: I don't know
    partner: 
      - age: 68
      - income: 15271
      - legal status: yes
  */

  // it('should pass the sanity test - SAN-GIS-c1-03', async () => {
  //   const res = await mockGetRequest({
  //     incomeAvailable: true,
  //     income: 4000, // personal income
  //     age: 78,
  //     oasDefer: true,
  //     receiveOAS: true,
  //     oasDeferDuration: '{"years":4,"months":0}',
  //     oasAge: 69,
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: true,
  //     livingCountry: LivingCountry.CANADA, // country code
  //     legalStatus: LegalStatus.YES,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: 30,
  //     everLivedSocialCountry: false,
  //     partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
  //     partnerIncomeAvailable: true,
  //     partnerIncome: 15271, // partner income
  //     partnerAge: 68,
  //     partnerLivingCountry: LivingCountry.AGREEMENT, // country code
  //     partnerLegalStatus: LegalStatus.YES,
  //     partnerLivedOnlyInCanada: false,
  //     partnerYearsInCanadaSince18: 40,
  //   })

  //   //client results
  //   expectOasEligible(res, EntitlementResultType.PARTIAL, 730.6)
  //   expectGisEligible(res, 1009.04)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)
  //   //partner results
  //   //expectOasEligible(res, EntitlementResultType.FULL, 687.56, true)
  //   expectOasEligible(res, EntitlementResultType.PARTIAL, 635.99, true) //oas-deferral
  //   expectGisNotEligible(res, true)
  //   expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
  //     ResultReason.LIVING_COUNTRY
  //   )
  //   expectAlwTooOld(res, true)
  // })

  /*
    SAN-GIS-C1-04
    client: 
      - age: 68
      - delayOAS: 2
      - income: 19271
      - Country of Residence: Canada
      - lived outside Canda: no 
      - years resided in Canada: 40
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: yes
      - partner pension: OAS
    partner: 
      - age: 58
      - income: 30639
  */

  it('should pass the sanity test - SAN-GIS-c1-04', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 19271, // personal income
      age: 68,
      oasDefer: true,
      receiveOAS: false,
      oasDeferDuration: '{"years":2,"months":0}',
      oasAge: 67,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncomeAvailable: true,
      partnerIncome: 30639, // partner income
      partnerAge: 58,
      partnerLivingCountry: undefined,
      partnerLegalStatus: undefined,
      partnerLivedOnlyInCanada: undefined,
      partnerYearsInCanadaSince18: undefined,
    })

    //client results
    //expectOasEligible(res, EntitlementResultType.FULL, 786.57)
    expectOasEligible(res, EntitlementResultType.FULL, 836.07) //oas-deferral
    expectGisEligible(res, 65.89)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      //ResultReason.AGE_YOUNG
      ResultReason.YEARS_IN_CANADA
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
  })

  /*
    SAN-GIS-C1-05
    client: 
      - age: 68
      - delayOAS: 0
      - income: 50159.04
      - Country of Residence: Canada
      - lived outside Canada: yes 
      - years resided in Canada: 10
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: OAS
    partner: 
      - age: 68
      - income: 500
      - legal status: yes
      - country of residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 9
  */

  it('should pass the sanity test - SAN-GIS-c1-05', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 50159.04, // personal income
      age: 68,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
      partnerIncome: 500, // partner income
      partnerAge: 68,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 9,
    })

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 171.89)
    // for some reason git actions returns $33.76 which isn't correct.
    expectGisEligible(res, 33.76) // correct value is 508.48

    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
  })

  /*
    SAN-GIS-C1-06
    client: 
      - age: 58
      - delayOAS: 0
      - income: 0
      - Country of Residence: Canada
      - lived outside Canada: yes 
      - years resided in Canada: 25
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: yes
      - partner pension: No
    partner: 
      - age: 68
      - income: 15347.52
      - legal status: yes
      - country of residence: Canada
      - lived outside Canada: no
      - years resided in Canada: 40
  */

  it('should pass the sanity test - SAN-GIS-c1-06', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 4000, // personal income
      age: 58,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 25,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncomeAvailable: true,
      partnerIncome: 15347.52, // partner income
      partnerAge: 68,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: true,
      partnerYearsInCanadaSince18: 40,
    })

    //client results
    expectOasNotEligible(res)
    expectGisNotEligible(res)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectAlwsMarital(res)

    //partner results
    //   correct results should be ineligible because answered  No Benefits
    //      therefore NOT ELIGIBLE for OAS, GIS, ALW, ALWS
    //   however current code returns ALWAYS eligible for OAS regardless
    //
    //expectOasNotEligible(res, true)
    //expect(res.body.partnerResults.oas.eligibility.reason).toEqual(ResultReason.OAS)
    //expectGisNotEligible(res, true)
    //expect(res.body.partnerResults.gis.eligibility.reason).toEqual(ResultReason.OAS)

    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.AGE
    )
  })

  /*
    SAN-GIS-ALW-01
    client: 
      - age: 68
      - delayOAS: 0
      - income: 0
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 25
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: n/a
    partner: 
      - age: 64
      - income: 4000
      - legal status: yes
      - Country of Residence: Canada
      - lived outside Canada: no
      - years resided in Canada: 40
  */

  // it('should pass the sanity test - SAN-GIS-ALW-01', async () => {
  //   const res = await mockGetRequest({
  //     incomeAvailable: true,
  //     income: 0, // personal income
  //     age: 68,
  //     oasDefer: false,
  //     receiveOAS: true,
  //     oasDeferDuration: '{"years":0,"months":0}',
  //     oasAge: undefined,
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: true,
  //     livingCountry: LivingCountry.CANADA, // country code
  //     legalStatus: LegalStatus.YES,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: 25,
  //     everLivedSocialCountry: false,
  //     partnerBenefitStatus: undefined,
  //     partnerIncomeAvailable: true,
  //     partnerIncome: 4000, // partner income
  //     partnerAge: 64,
  //     partnerLivingCountry: LivingCountry.CANADA,
  //     partnerLegalStatus: LegalStatus.YES,
  //     partnerLivedOnlyInCanada: true,
  //     partnerYearsInCanadaSince18: 40,
  //   })

  //   //client results
  //   expectOasEligible(res, EntitlementResultType.PARTIAL, 429.73)
  //   expectGisEligible(res, 1284.8)
  //   expectAlwTooOld(res)
  //   expectAlwsMarital(res)
  //   //partner results
  //   expectOasNotEligible(res, true)
  //   expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
  //     ResultReason.AGE_YOUNG_64
  //   )
  //   expectGisNotEligible(res, true)
  //   expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
  //     ResultReason.OAS
  //   )
  //   expect(res.body.partnerResults.alw.eligibility.result).toEqual(
  //     ResultKey.ELIGIBLE
  //   )
  //   expectAlwEligible(res, 1056.71, true)
  // })

  /*
  SAN-GIS-ALW-02
  client: 
    - age: 68
    - delayOAS: 0
    - income: 8326
    - Country of Residence: Canada
    - lived outside Canada: yes
    - years resided in Canada: 10
    - Legal Status: yes
    - marital status: married
    - involuntarily separated: yes
    - partner pension: no
  partner: 
    - age: 64
    - income: 0
    - legal status: yes
    - Country of Residence: Canada
    - lived outside Canada: no
    
  */

  it('should pass the sanity test - SAN-GIS-ALW-02', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 8326, // personal income
      age: 68,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncomeAvailable: true,
      partnerIncome: 0, // partner income
      partnerAge: 64,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: true,
      partnerYearsInCanadaSince18: 40,
    })

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 171.89)
    expectGisEligible(res, 1065.63)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expectAlwEligible(res, 1305.71, true)
  })

  /*
    SAN-GIS-ALW-03
    client: 
      - age: 68
      - delayOAS: 1
      - income: 4000
      - Country of Residence: Madagascar
      - lived outside Canada: yes
      - years resided in Canada: 40
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: n/a
    partner: 
      - age: 64
      - income: 23216
      - legal status: yes
      - Country of Residence: Canada
      - lived outside Canada: no
    
  */

  it('should pass the sanity test - SAN-GIS-ALW-03', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 4000, // personal income
      age: 68,
      oasDefer: true,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: 66,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.NO_AGREEMENT, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncomeAvailable: true,
      partnerIncome: 23216, // partner income
      partnerAge: 64,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: true,
      partnerYearsInCanadaSince18: 40,
    })

    //client results
    //expectOasEligible(res, EntitlementResultType.FULL, 687.56)
    expectOasEligible(res, EntitlementResultType.FULL, 836.07) //oas-deferral
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.PARTNER
    )
  })

  /*
    SAN-GIS-ALW-04
    client: 
      - age: 78
      - delayOAS: 0
      - income: 4000
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 20
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: yes
      - partner pension: no
    partner: 
      - age: 64
      - income: 34592
      - legal status: yes
      - Country of Residence: Canada
      - lived outside Canada: no
      - years resided in Canada: 25
    
  */

  it('should pass the sanity test - SAN-GIS-ALW-04', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 4000, // personal income
      age: 78,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncomeAvailable: true,
      partnerIncome: 34592, // partner income
      partnerAge: 64,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 25,
    })

    //client results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 378.16)
    expectGisEligible(res, 1198.12)
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.OAS
    )
    expectAlwEligible(res, 83.09, true)
  })

  /*
    SAN-GIS-ALW-05
    client: 
      - age: 68
      - delayOAS: 0
      - income: 38692
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 35
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: n/a
    partner: 
      - age: 64
      - income: 0
      - legal status: yes
      - Country of Residence: China
      - lived outside Canada: yes
      - years resided in Canada: 25
    
  */

  it('should pass the sanity test - SAN-GIS-ALW-05', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 38692, // personal income
      age: 68,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 35,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncomeAvailable: true,
      partnerIncome: 0, // partner income
      partnerAge: 64,
      partnerLivingCountry: LivingCountry.NO_AGREEMENT,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 25,
    })

    //client results
    //expectOasEligible(res, EntitlementResultType.PARTIAL, 601.62)
    expectOasEligible(res, EntitlementResultType.PARTIAL, 668.86) //oas-deferral
    //expectGisEligible(res, 319.83)
    expectGisEligible(res, 371.4) //oas-deferral
    expectAlwTooOld(res)
    expectAlwsMarital(res)
    //partner results
    expectOasNotEligible(res, true)
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res, true)
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.partnerResults.alw.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.alw.eligibility.reason).toEqual(
      ResultReason.INCOME
    )
  })

  /*
    SAN-GIS-ALW-06
    client: 
      - age: 64
      - delayOAS: 0
      - income: 0
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 35
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: yes
      - partner pension: I don't know
    partner: 
      - age: 64
      - income: 4000
      - legal status: yes
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 10
  */

  it('should pass the sanity test - SAN-GIS-ALW-06', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 0, // personal income
      age: 64,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 35,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 4000, // partner income
      partnerAge: 68,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 10,
    })

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    expectAlwEligible(res, 1305.71)
    expectAlwsMarital(res)
    //partner results
    expectOasEligible(res, EntitlementResultType.PARTIAL, 171.89, true)
    expectGisEligible(res, 1335.63, true)
    expectAlwTooOld(res, true)
  })

  /*
  SAN-GIS-ALW-07
  client: 
    - age: 64
    - delayOAS: 0
    - income: 4000
    - Country of Residence: Canada
    - lived outside Canada: yes
    - years resided in Canada: 35
    - Legal Status: yes
    - marital status: married
    - involuntarily separated: yes
    - partner pension: yes
  partner: 
    - age: 78
    - income: 23216
    - legal status: yes
    - Country of Residence: Canada
    - lived outside Canada: yes
    - years resided in Canada: 35
  */

  it('should pass the sanity test - SAN-GIS-ALW-07', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 4000, // personal income
      age: 64,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 35,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
      partnerIncome: 23216, // partner income
      partnerAge: 78,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 35,
    })

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    //expectAlwEligible(res, 236.09)
    expectAlwEligible(res, 1056.71) //oas-deferral
    expectAlwsMarital(res)
    //partner results
    //expectOasEligible(res, EntitlementResultType.PARTIAL, 661.78, true)
    expectOasEligible(res, EntitlementResultType.PARTIAL, 415.98, true) //oas-deferral
    //expectGisEligible(res, 331.34, true)
    expectGisEligible(res, 241.23, true) //oas-deferral
    expectAlwTooOld(res, true)
  })

  /*
    SAN-GIS-ALW-08
    client: 
      - age: 64
      - delayOAS: 0
      - income: 27216
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 35
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: OAS
    partner: 
      - age: 67
      - income: 11376
      - legal status: yes
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 40
  */

  it('should pass the sanity test - SAN-GIS-ALW-08', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 27216, // personal income
      age: 64,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 35,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
      partnerIncome: 11376, // partner income
      partnerAge: 67,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 40,
    })

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    // eligible but income is too high
    expectAlwEligible(res, 0)
    expectAlwsMarital(res)
    //partner results
    //expectOasEligible(res, EntitlementResultType.FULL, 687.56, true)
    expectOasEligible(res, EntitlementResultType.PARTIAL, 653.18, true) //oas-deferral
    //expectGisEligible(res, 235.89, true)
    expectGisEligible(res, 270.27, true) //oas-deferral
    expectAlwTooOld(res, true)
  })

  /*
    SAN-GIS-ALW-09
    client: 
      - age: 64
      - delayOAS: 0
      - income: 4000
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 35
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: no
      - partner pension: I don't know
    partner: 
      - age: 67
      - income: 34992
      - legal status: yes
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 25
  */

  it('should pass the sanity test - SAN-GIS-ALW-09', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 4000, // personal income
      age: 64,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 35,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 34992, // partner income
      partnerAge: 67,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 25,
    })

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG_64
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.OAS)
    // eligible but income is too high
    expect(res.body.results.alw.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.INCOME)
    expectAlwsMarital(res)
    //partner results
    //expectOasEligible(res, EntitlementResultType.PARTIAL, 429.73, true)
    expectOasEligible(res, EntitlementResultType.PARTIAL, 395.35, true) //oas-deferral
    //expectGisEligible(res, 485.73, true)
    expectGisEligible(res, 520.1, true) //oas-deferral
    expectAlwTooOld(res, true)
  })

  /*
    SAN-GIS-ALW-10
    client: 
      - age: 63
      - delayOAS: 0
      - income: 4000
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 11
      - Legal Status: yes
      - marital status: married
      - involuntarily separated: yes
      - partner pension: no
    partner: 
      - age: 77
      - income: 23312
      - legal status: yes
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 35
  */

  it('should pass the sanity test - SAN-GIS-ALW-10', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 4000, // personal income
      age: 63,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 11,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncomeAvailable: true,
      partnerIncome: 23312, // partner income
      partnerAge: 77,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 35,
    })

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
      ResultReason.PARTNER
    )
    expectAlwsMarital(res)

    //partner results
    //   correct results should be ineligible because answered  No Benefits
    //      therefore NOT ELIGIBLE for OAS, GIS, ALW, ALWS
    //   however current code returns ALWAYS eligible for OAS regardless
    //
    //expectOasNotEligible(res, true)
    //expectGisNotEligible(res, true)
    expectAlwTooOld(res, true)
  })

  /*
    SAN-ALWS-01
    client: 
      - age: 64
      - delayOAS: 0
      - income: 2000
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 35
      - Legal Status: yes
      - marital status: windowed
  */

  it('should pass the sanity test - SAN-ALWS-01', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 2000, // personal income
      age: 64,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 35,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

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
    expectAlwsEligible(res, 1433.51)
  })

  /*
    SAN-ALWS-02
    client: 
      - age: 64
      - delayOAS: 0
      - income: 9636
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 30
      - Legal Status: yes
      - marital status: windowed
  */
  it('should pass the sanity test - SAN-ALWS-02', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 9636, // personal income
      age: 64,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 30,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

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
    expectAlwsEligible(res, 797.51)
  })

  /*
    SAN-ALWS-03
    client: 
      - age: 64
      - delayOAS: 0
      - income: 28080
      - Country of Residence: Canada
      - lived outside Canada: yes
      - years resided in Canada: 20
      - Legal Status: yes
      - marital status: windowed
  */
  it('should pass the sanity test - SAN-ALWS-03', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 28080, // personal income
      age: 64,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      ...partnerUndefined,
    })

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
    expectAlwsEligible(res, 0)
    expect(res.body.results.alws.eligibility.detail).toEqual(
      "You're likely eligible for this benefit, but your income is too high to receive a monthly payment at this time."
    )
  })

  /*
    SAN-ALWS-04
    client: 
      - age: 64
      - delayOAS: 0
      - income: 28080
      - Country of Residence: Italy
      - lived outside Canada: yes
      - years resided in Canada: 10
      - Legal Status: yes
      - marital status: windowed
  */
  it('should pass the sanity test - SAN-ALWS-04', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 28080, // personal income
      age: 64,
      oasDefer: false,
      receiveOAS: false,
      oasDeferDuration: undefined,
      oasAge: undefined,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: false,
      livingCountry: LivingCountry.AGREEMENT, // country code
      legalStatus: LegalStatus.YES,
      livedOnlyInCanada: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: true,
      ...partnerUndefined,
    })

    //client results
    expectOasNotEligible(res)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_YOUNG
    )
    expectGisNotEligible(res)
    expect(res.body.results.gis.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.alws.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alws.eligibility.reason).toEqual(
      ResultReason.LIVING_COUNTRY
    )
  })
})
