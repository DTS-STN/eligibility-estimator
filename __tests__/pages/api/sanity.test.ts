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
  expectAfsEligible,
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

  it('should pass the first sanity test - SAN-OAS-01', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 85000, // personal income
      age: 65,
      oasDefer: true,
      oasAge: 68,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.AGREEMENT, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 90000, // partner income
      partnerAge: 75,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOutsideCanada: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: true,
    })

    expect(res.status).toEqual(200)
    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('353.60')
    expect(res.body.results.oas.entitlement.clawback).toEqual(64.44)
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
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '629.38'
    )
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
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 90000, // partner income
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.AGREEMENT, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOutsideCanada: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: true,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('124.64')
    expect(res.body.results.oas.entitlement.clawback).toEqual(64.44)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    expect(res.body.results.gis.entitlement.result).toEqual(0)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '560.62'
    )
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
      oasAge: 67,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: false,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncomeAvailable: true,
      partnerIncome: 129757, // partner income
      partnerAge: 75,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOutsideCanada: true,
      partnerYearsInCanadaSince18: 35,
      partnerEverLivedSocialCountry: true,
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

    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.entitlement.result.toFixed(2)).toEqual(
      '37.88'
    )
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
      age: 68,
      oasDefer: true,
      oasAge: 70,
      maritalStatus: MaritalStatus.WIDOWED,
      invSeparated: undefined,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: false,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: false,
      ...partnerUndefined,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
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

    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.afs.entitlement.result).toEqual(0)
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
      income: 9636, // personal income
      age: 78,
      oasDefer: false,
      oasAge: undefined,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: undefined,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: true,
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
    expect(res.body.results.gis.entitlement.result.toFixed(2)).toEqual('810.74')

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.entitlement.result).toEqual(0)
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
      oasAge: 69,
      maritalStatus: MaritalStatus.SINGLE,
      invSeparated: undefined,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: false,
      yearsInCanadaSince18: undefined,
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

    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.entitlement.result).toEqual(0)
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

  it('should pass the sanity test - SAN-GIS-c2-01', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 4000, // personal income
      age: 68,
      oasDefer: true,
      oasAge: 68,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: true,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncomeAvailable: true,
      partnerIncome: 0, // partner income
      partnerAge: 78,
      partnerLivingCountry: LivingCountry.AGREEMENT, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOutsideCanada: true,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: true,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result.toFixed(2)).toEqual('209.02')
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result).toEqual(1335.63)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.entitlement.result).toEqual(0)
  })

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
      oasAge: undefined,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.AGREEMENT, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.OAS_GIS,
      partnerIncomeAvailable: true,
      partnerIncome: 4326, // partner income
      partnerAge: 68,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOutsideCanada: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: true,
    })

    console.log(res.body.partnerResults.oas)
    console.log(res.body.partnerResults.gis)
    console.log(res.body.partnerResults.alw)
    console.log(res.body.partnerResults.afs)

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

    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.entitlement.result).toEqual(0)

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

  it('should pass the sanity test - SAN-GIS-c2-03', async () => {
    const res = await mockGetRequest({
      incomeAvailable: true,
      income: 8326, // personal income
      age: 78,
      oasDefer: true,
      oasAge: 67,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      livingCountry: LivingCountry.CANADA, // country code
      legalStatus: LegalStatus.YES,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 30,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncomeAvailable: true,
      partnerIncome: 19226, // partner income
      partnerAge: 68,
      partnerLivingCountry: LivingCountry.CANADA, // country code
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOutsideCanada: true,
      partnerYearsInCanadaSince18: 20,
      partnerEverLivedSocialCountry: false,
    })

    //client results
    expect(res.body.results.oas.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.eligibility.reason).toEqual(
      ResultReason.AGE_70_AND_OVER
    )
    expect(res.body.results.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.results.oas.entitlement.result).toEqual(648.92)
    expect(res.body.results.oas.entitlement.clawback).toEqual(0)

    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.entitlement.result).toEqual(170.98)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)

    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
    expect(res.body.results.afs.entitlement.result).toEqual(0)

    //partner results
    expect(res.body.partnerResults.oas.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.oas.eligibility.reason).toEqual(
      ResultReason.AGE_65_TO_69
    )
    expect(res.body.partnerResults.oas.entitlement.type).toEqual(
      EntitlementResultType.PARTIAL
    )
    expect(res.body.partnerResults.oas.entitlement.result).toEqual(343.78)
    expect(res.body.partnerResults.oas.entitlement.clawback).toEqual(0)

    expect(res.body.partnerResults.gis.eligibility.result).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.partnerResults.gis.eligibility.reason).toEqual(
      ResultReason.NONE
    )
    expect(res.body.partnerResults.gis.entitlement.result).toEqual(342.87)

    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.alw.entitlement.result).toEqual(0)
  })
})
