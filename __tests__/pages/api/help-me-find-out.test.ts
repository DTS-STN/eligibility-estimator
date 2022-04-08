import {
  EstimationSummaryState,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import { legalValues } from '../../../utils/api/scrapers/output'
import {
  expectAlwEligible,
  expectOasEligible,
  expectOasGisEligible,
  expectOasGisTooYoung,
} from './expectUtils'
import { mockGetRequest } from './factory'

describe('Help Me Find Out scenarios', () => {
  it(`works when client old, partner old (partner=noOas, therefore gis income limit ${legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW}, gis table 3)`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 0,
      partnerEverLivedSocialCountry: false,
    }
    let res = await mockGetRequest(input)
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW - 1,
    })
    expectOasGisEligible(res)
    expect(res.body.results.gis.entitlement.result).toEqual(0.79) // table 3
  })
  it(`works when client old, partner old (partner=partialOas, therefore gis income limit ${legalValues.MAX_GIS_INCOME_PARTNER_OAS}, gis table 2)`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 20,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS - 1,
    })
    expectOasGisEligible(res)
    expect(res.body.results.gis.entitlement.result).toEqual(0.68) // table 2
  })
  it(`works when client old, partner old (partner=fullOas, therefore gis income limit ${legalValues.MAX_GIS_INCOME_PARTNER_OAS}, gis table 2)`, async () => {
    const input = {
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.MAX_GIS_INCOME_PARTNER_OAS - 1,
    })
    expectOasGisEligible(res)
    expect(res.body.results.gis.entitlement.result).toEqual(0.68) // table 2
  })
  it(`works when client old, partner young (partner=noAllowance, therefore gis table 3)`, async () => {
    const input = {
      income: legalValues.MAX_ALW_INCOME, // too high for allowance
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expectOasGisEligible(res)

    expect(res.body.results.gis.entitlement.result).toEqual(223.79) // table 3
  })
  it('works when client old, partner young (partner=allowance, therefore gis table 4)', async () => {
    const input = {
      income: legalValues.MAX_ALW_INCOME - 1, // okay for allowance
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expectOasGisEligible(res)
    expect(res.body.results.gis.entitlement.result).toEqual(224.11) // table 4
  })
  it('works when client young, partner young (no one gets anything)', async () => {
    const input = {
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_INELIGIBLE
    )
    expectOasGisTooYoung(res)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.PARTNER
    )
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
  it('works when client young, partner old (partner=gis, therefore client alw eligible)', async () => {
    const input = {
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
    expectOasGisTooYoung(res)
    expectAlwEligible(res, 1231.87) // table 4
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
  it('works when client young, partner old (partner=noGis, therefore client alw ineligible)', async () => {
    const input = {
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      ...canadian,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      partnerIncome: 0,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.NO_AGREEMENT, // gis ineligible
      partnerLegalStatus: LegalStatus.CANADIAN_CITIZEN,
      partnerCanadaWholeLife: false,
      partnerYearsInCanadaSince18: 40,
      partnerEverLivedSocialCountry: undefined,
    }
    let res = await mockGetRequest(input)
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_INELIGIBLE
    )
    expectOasGisTooYoung(res)
    expect(res.body.results.alw.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.alw.eligibility.reason).toEqual(
      ResultReason.PARTNER
    )
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
})
