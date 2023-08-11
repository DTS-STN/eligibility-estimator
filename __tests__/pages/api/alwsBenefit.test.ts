import {
    LegalStatus,
    LivingCountry,
    MaritalStatus,
    ResultKey,
    ResultReason,
  } from '../../../utils/api/definitions/enums'
  
  import { mockGetRequest } from './factory'
  import {
    partnerUndefined,
    expectAlwsEligible,
    expectGisNotEligible,
    expectOasNotEligible,
  } from './expectUtils'
  
 describe('OasBenefit', () => {

    /* */
    it('should pass the sanity test - CALC-', async () => {
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

})