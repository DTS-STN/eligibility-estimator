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
  } from './expectUtils'
  
  describe('OasBenefit', () => {
    /* CALC-23 */
    it('should pass the 23 test - CALC-23', async () => {
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
})
