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

import { mockGetRequest } from './factory'

describe('SAN-OAS-01', () => {
  /*
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

  it('pass the first sanity test', async () => {
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

    //console.log('sanity test res', JSON.stringify(res.body.results), '-----------------------------------------',  JSON.stringify(res.body.partnerResults))
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
})
