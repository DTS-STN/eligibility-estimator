import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
  SummaryState,
} from '../../../utils/api/definitions/enums'
import legalValues from '../../../utils/api/scrapers/output'
import {
  age60NoDefer,
  age65NoDefer,
  canadian,
  expectAlwEligible,
  expectOasEligible,
  expectOasGisEligible,
  expectOasGisTooYoung,
  incomeZero,
  partnerIncomeZero,
} from './expectUtils'
import { mockGetRequest } from './factory'

describe('Help Me Find Out scenarios', () => {
  it(`works when client old, partner old (partner=noOas, therefore gis income limit ${legalValues.gis.spouseNoOasIncomeLimit}, gis table 3)`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.gis.spouseNoOasIncomeLimit,
      ...age65NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      ...partnerIncomeZero,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 0,
    }
    let res = await mockGetRequest(input)
    // expectOasEligible(res)
    expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
    res = await mockGetRequest({
      ...input,
      income: legalValues.gis.spouseNoOasIncomeLimit - 1,
    })
    // expectOasGisEligible(res)
    //expect(res.body.results.gis.entitlement.result).toEqual(0.72) // table 3
  })
  // it(`works when client old, partner old (partner=partialOas, therefore gis income limit ${legalValues.gis.spouseOasIncomeLimit}, gis table 2)`, async () => {
  //   const input = {
  //     incomeAvailable: true,
  //     income: legalValues.gis.spouseOasIncomeLimit,
  //     ...age65NoDefer,
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: false,
  //     ...canadian,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: undefined,
  //     everLivedSocialCountry: undefined,
  //     partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
  //     ...partnerIncomeZero,
  //     partnerAge: 65,
  //     partnerLivingCountry: LivingCountry.CANADA,
  //     partnerLegalStatus: LegalStatus.YES,
  //     partnerLivedOnlyInCanada: true,
  //     partnerYearsInCanadaSince18: 20,
  //   }
  //   let res = await mockGetRequest(input)
  //   expectOasEligible(res)
  //   expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
  //   res = await mockGetRequest({
  //     ...input,
  //     income: legalValues.gis.spouseOasIncomeLimit - 1,
  //   })
  //   expectOasGisEligible(res)
  //   //expect(res.body.results.gis.entitlement.result).toEqual(0.82) // table 2
  // })
  // it(`works when client old, partner old (partner=fullOas, therefore gis income limit ${legalValues.gis.spouseOasIncomeLimit}, gis table 2)`, async () => {
  //   const input = {
  //     incomeAvailable: true,
  //     income: legalValues.gis.spouseOasIncomeLimit,
  //     ...age65NoDefer,
  //     maritalStatus: MaritalStatus.PARTNERED,
  //     invSeparated: false,
  //     ...canadian,
  //     livedOnlyInCanada: false,
  //     yearsInCanadaSince18: undefined,
  //     everLivedSocialCountry: undefined,
  //     partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
  //     ...partnerIncomeZero,
  //     partnerAge: 65,
  //     partnerLivingCountry: LivingCountry.CANADA,
  //     partnerLegalStatus: LegalStatus.YES,
  //     partnerLivedOnlyInCanada: true,
  //     partnerYearsInCanadaSince18: 40,
  //   }
  //   let res = await mockGetRequest(input)
  //   expectOasEligible(res)
  //   expect(res.body.results.gis.eligibility.result).toEqual(ResultKey.ELIGIBLE)
  //   expect(res.body.results.gis.eligibility.reason).toEqual(ResultReason.INCOME)
  //   res = await mockGetRequest({
  //     ...input,
  //     income: legalValues.gis.spouseOasIncomeLimit - 1,
  //   })
  //   expectOasGisEligible(res)
  //   //expect(res.body.results.gis.entitlement.result).toEqual(0.82) // table 2
  // })
  it(`works when client old, partner young (partner=noAllowance, therefore gis table 3)`, async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.alw.alwIncomeLimit, // too high for allowance
      ...age65NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      ...partnerIncomeZero,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 40,
    }
    let res = await mockGetRequest(input)
    // expectOasGisEligible(res)

    //expect(res.body.results.gis.entitlement.result).toEqual(229.72) // table 3
  })
  it('works when client old, partner young (partner=allowance, therefore gis table 4)', async () => {
    const input = {
      incomeAvailable: true,
      income: legalValues.alw.alwIncomeLimit - 1, // okay for allowance
      ...age65NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      ...partnerIncomeZero,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 40,
    }
    let res = await mockGetRequest(input)
    // expectOasGisEligible(res)
    //expect(res.body.results.gis.entitlement.result).toEqual(229.9) // table 4
  })
  it('works when client young, partner young (no one gets anything)', async () => {
    const input = {
      ...incomeZero,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      ...partnerIncomeZero,
      partnerAge: 60,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 40,
    }
    let res = await mockGetRequest(input)
    expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_INELIGIBLE)
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
      ...incomeZero,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      ...partnerIncomeZero,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.CANADA,
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 40,
    }
    let res = await mockGetRequest(input)
    // expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_ELIGIBLE)
    expectOasGisTooYoung(res)
    //expectAlwEligible(res, 1266.36) // table 4
    expect(res.body.results.afs.eligibility.result).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.afs.eligibility.reason).toEqual(
      ResultReason.MARITAL
    )
  })
  it('works when client young, partner old (partner=noGis, therefore client alw ineligible)', async () => {
    const input = {
      ...incomeZero,
      ...age60NoDefer,
      maritalStatus: MaritalStatus.PARTNERED,
      invSeparated: false,
      ...canadian,
      livedOnlyInCanada: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.HELP_ME,
      ...partnerIncomeZero,
      partnerAge: 65,
      partnerLivingCountry: LivingCountry.NO_AGREEMENT, // gis ineligible
      partnerLegalStatus: LegalStatus.YES,
      partnerLivedOnlyInCanada: false,
      partnerYearsInCanadaSince18: 40,
    }
    let res = await mockGetRequest(input)
    expect(res.body.summary.state).toEqual(SummaryState.AVAILABLE_INELIGIBLE)
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
