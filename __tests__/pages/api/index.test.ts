// noinspection DuplicatedCode

import fs from 'fs'
import Joi from 'joi'
import YAML from 'yaml'
import { getTranslations, Language, Translations } from '../../../i18n/api'
import { countryList } from '../../../utils/api/definitions/countries'
import {
  EstimationSummaryState,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import {
  FieldDataDropdown,
  fieldDefinitions,
  FieldKey,
} from '../../../utils/api/definitions/fields'
import { RequestSchema } from '../../../utils/api/definitions/schemas'
import { buildFieldData } from '../../../utils/api/helpers/fieldUtils'
import { mockGetRequest, mockGetRequestError } from './factory'

describe('code checks', () => {
  it('produces a list of fields with unique ordering', async () => {
    const ordersOrig = []
    for (const key in fieldDefinitions) {
      ordersOrig.push(fieldDefinitions[key].order)
    }
    const ordersUnique = [...new Set(ordersOrig)]
    expect(ordersUnique).toEqual(ordersOrig)
  })
})

describe('country checks', () => {
  const COUNTRY_COUNT = 195
  const fieldList: Array<FieldKey> = [FieldKey.LIVING_COUNTRY]
  const translationsEn: Translations = getTranslations(Language.EN)
  const fieldDataEn = buildFieldData(
    fieldList,
    translationsEn
  ) as Array<FieldDataDropdown>
  const translationsFr: Translations = getTranslations(Language.FR)
  const fieldDataFr = buildFieldData(
    fieldList,
    translationsFr
  ) as Array<FieldDataDropdown>
  it(`produces a list of ${COUNTRY_COUNT} countries (EN and FR)`, async () => {
    expect(fieldDataEn[0].values.length).toEqual(COUNTRY_COUNT)
    expect(fieldDataFr[0].values.length).toEqual(COUNTRY_COUNT)
  })
  it(`produces a list of countries with Canada first and AFG second (EN and FR)`, async () => {
    expect(fieldDataEn[0].values[0].key).toEqual('CAN') // ensure Canada is first in the list
    expect(fieldDataEn[0].values[1].key).toEqual('AFG') // ensure Agreement is not in the list (AFG should be next)
    expect(fieldDataFr[0].values[0].key).toEqual('CAN')
    expect(fieldDataFr[0].values[1].key).toEqual('AFG')
  })
  it(`includes Agreement in "agreement countries" list`, async () => {
    expect(countryList[0].code).toEqual('CAN') // ensure Canada is first in the list
    expect(countryList[1].code).toEqual('AGREEMENT') // ensure Agreement is second in the list
  })
})

describe('schema checks', () => {
  function getJoiKeys(schema: Joi.ObjectSchema) {
    // @ts-ignore
    const joiEntries = schema._ids._byKey.entries()
    const joiKeys = []
    for (const joiEntry of joiEntries) {
      if (joiEntry[0][0] === '_') continue // ignore system fields
      joiKeys.push(joiEntry[0])
    }
    return joiKeys
  }

  it('matches between field definitions and schema', async () => {
    const joiKeys = getJoiKeys(RequestSchema)
    const enumKeys = Object.values(FieldKey)
    expect(joiKeys).toEqual(enumKeys)
  })
})

describe('openapi checks', () => {
  const file = fs.readFileSync('./public/openapi.yaml', 'utf-8')
  const openapi = YAML.parse(file)
  it('matches LegalStatus enum', async () => {
    expect(openapi.components.parameters.legalStatus.schema.enum).toEqual(
      Object.values(LegalStatus)
    )
  })
  it('matches MaritalStatus enum', async () => {
    expect(openapi.components.parameters.maritalStatus.schema.enum).toEqual(
      Object.values(MaritalStatus)
    )
  })
  it('matches Country enum', async () => {
    expect(openapi.components.parameters.livingCountry.schema.enum).toEqual(
      Object.values(LivingCountry)
    )
  })
  it('matches FieldKey enum', async () => {
    expect(openapi.components.schemas.FieldKey.items.enum).toEqual(
      Object.values(FieldKey)
    )
  })
  it('matches ResultKey enum', async () => {
    expect(openapi.components.schemas.ResultKey.enum).toEqual(
      Object.values(ResultKey)
    )
  })
  it('matches ResultReason enum', async () => {
    expect(openapi.components.schemas.ResultReason.enum).toEqual(
      Object.values(ResultReason)
    )
  })
  it('matches parameters', async () => {
    const openApiParams = Object.keys(openapi.components.parameters)
    const enumKeys = Object.values(FieldKey)
    expect(openApiParams).toEqual(Object.values(enumKeys))
    const openApiPathParams =
      openapi.paths['/calculateEligibility'].get.parameters
    const openApiPathParamsStripped = openApiPathParams.map((x) =>
      x['$ref'].replace('#/components/parameters/', '')
    )
    expect(openApiPathParamsStripped).toEqual(Object.values(enumKeys))
  })
})

describe('sanity checks', () => {
  it('fails on income with letters', async () => {
    const res = await mockGetRequestError({
      income: 'abc' as unknown as number,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
  it('fails on age over 150', async () => {
    const res = await mockGetRequestError({ age: 151 })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
  it('accepts age equal to 150', async () => {
    const res = await mockGetRequest({ age: 150 })
    expect(res.status).toEqual(200)
  })
  it('accepts valid Marital Status', async () => {
    const res = await mockGetRequest({
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.status).toEqual(200)
  })
  it('accepts valid Legal Status', async () => {
    const res = await mockGetRequest({
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
    })
    expect(res.status).toEqual(200)
  })
  it('fails when years in Canada is greater than age minus 18', async () => {
    const res = await mockGetRequestError({
      age: 65,
      yearsInCanadaSince18: 48,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
  it('accepts when years in Canada is equal to age minus 18', async () => {
    const res = await mockGetRequest({
      age: 65,
      yearsInCanadaSince18: 47,
    })
    expect(res.status).toEqual(200)
  })
  it('fails when not partnered and "partnerBenefitStatus" FULL_OAS_GIS', async () => {
    let res = await mockGetRequestError({
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,

      income: 0,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.error).toEqual(ResultKey.INVALID)
    expect(res.status).toEqual(400)
  })
  it('fails when not partnered and "partnerBenefitStatus" NONE', async () => {
    let res = await mockGetRequestError({
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
    })
    expect(res.body.error).toEqual(ResultKey.INVALID)
    expect(res.status).toEqual(400)
  })
  it('accepts when partnered and "partnerReceivingOas" present', async () => {
    const res = await mockGetRequest({
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.status).toEqual(200)
  })
  it('fails when not partnered and "partnerIncome" provided', async () => {
    let res = await mockGetRequestError({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      partnerIncome: 10000,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
  it('accepts not partnered and "partnerIncome" provided', async () => {
    let res = await mockGetRequestError({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 10000,
    })
    expect(res.status).toEqual(200)
  })
})

describe('field requirement analysis', () => {
  it('requires 1 OAS and 1 GIS fields when nothing provided', async () => {
    const res = await mockGetRequest({})
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual(['income'])
    expect(res.body.visibleFields).toEqual(['income'])
  })
  it('required fields when only income provided', async () => {
    const res = await mockGetRequest({ income: 10000 })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
  })
  it('required fields when only income/age provided', async () => {
    const res = await mockGetRequest({ income: 10000, age: 65 })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
  })
  it('required fields when only income/age/country provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      'maritalStatus',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
  })
  it('required fields when only income/age/country/legal provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      'maritalStatus',
      'yearsInCanadaSince18',
    ])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
  })
  it('required fields when only income/age/country/legal/years provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual(['maritalStatus'])

    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
  })
  it('required no fields when only income/age/country/legal/years/marital=single provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
    expect(res.body.missingFields).toEqual([])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
  })
  it('required fields when only income/age/country/legal/years/marital=married provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      'partnerBenefitStatus',
      'partnerIncome',
    ])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
      'partnerBenefitStatus',
      'partnerIncome',
    ])
  })
  it('required fields when only income/age/country/legal/years/marital=married/partnerOas provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual(['partnerIncome'])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
      'partnerBenefitStatus',
      'partnerIncome',
    ])
  })
  it('required no fields when all provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 10000,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
    expect(res.body.missingFields).toEqual([])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
      'partnerBenefitStatus',
      'partnerIncome',
    ])
  })
})

describe('summary object checks', () => {
  it('returns "available eligible"', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 10000,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
  })
  it('returns "available ineligible"', async () => {
    const res = await mockGetRequest({
      income: 1000000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 10000,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_INELIGIBLE
    )
  })
  it('returns "unavailable"', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 10000,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
  })
  it('returns "more info"', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 10000,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
})

describe('basic OAS scenarios', () => {
  it('returns "ineligible" when income over 129757', async () => {
    const res = await mockGetRequest({
      income: 129758,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "more info" when not citizen (other not provided)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "conditionally eligible" when not citizen (other provided)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      yearsInCanadaSince18: 20,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "conditionally eligible" when sponsored', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "needs more info" when citizen and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "conditionally eligible" when citizen and under 10 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: true,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when citizen and under 10 years in Canada and not lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "eligible" when citizen and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
  })
  it('returns "eligible" when living in Agreement and 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
  })
  it('returns "conditionally eligible" when living in Agreement and under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "eligible" when living in No Agreement and 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
  })
  it('returns "needs more info" when living in No Agreement and under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "ineligible" when living in No Agreement and under 20 years in Canada and not lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible due to age" when 64 and 9 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 64,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: true,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.AGE)
  })
  it('returns "conditionally eligible" when living in No Agreement and under 20 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "eligible when 65" when age 55 and citizen and 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age 55 and legal=sponsored and 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age 55 and legal=other and 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      yearsInCanadaSince18: 20,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.AGE)
  })
})

describe('OAS entitlement scenarios', () => {
  it('returns "eligible for $317.63" when 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlementResult).toEqual(321.13)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
  })
  it('returns "eligible for $619.38" when 39 years in Canada (rounding test)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 39,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlementResult).toEqual(626.19)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
  })
  it('returns "eligible for $635.26" when 40 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlementResult).toEqual(642.25)
    expect(res.body.results.oas.reason).toEqual(ResultReason.NONE)
  })
})

describe('basic GIS scenarios', () => {
  it('returns "needs more info" when missing marital status', async () => {
    const res = await mockGetRequest({
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "needs more info" when missing income', async () => {
    const res = await mockGetRequest({
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "needs more info" when partnered and "partnerReceivingOas" missing', async () => {
    let res = await mockGetRequest({
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "needs more info" when missing country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "ineligible" when income 1,000,000', async () => {
    const res = await mockGetRequest({
      income: 1000000,
      age: 65,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.OAS)
  })
  it('returns "ineligible" when not living in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "conditionally eligible" when sponsored', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.gis.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "ineligible" when single and income over 19248', async () => {
    const res = await mockGetRequest({
      income: 19249,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "eligible" when single and income under 19248', async () => {
    const res = await mockGetRequest({
      income: 19247,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "ineligible" when married and no partner OAS and income over 46128', async () => {
    const res = await mockGetRequest({
      income: 46129,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "needs more info" when married and no partner OAS and income under 46128', async () => {
    const res = await mockGetRequest({
      income: 46127,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "eligible" when married and no partner OAS and income under 45128 and partner income 1000', async () => {
    const res = await mockGetRequest({
      income: 45127,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "needs more info" when married and partner OAS and income over 25440', async () => {
    const res = await mockGetRequest({
      income: 25441,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "ineligible" when married and partner OAS and income over 25440 and partner income 0', async () => {
    const res = await mockGetRequest({
      income: 25441,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "ineligible" when married and partner OAS and income over 24440 and partner income 1000', async () => {
    const res = await mockGetRequest({
      income: 24441,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "needs more info" when married and partner OAS and income under 25440', async () => {
    const res = await mockGetRequest({
      income: 25439,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "eligible" when married and partner OAS and income under 25440 and partner income 0', async () => {
    const res = await mockGetRequest({
      income: 25439,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.NONE)
  })
})

describe('GIS entitlement scenarios', () => {
  it('returns "$0" when single and 1,000,000 income', async () => {
    const res = await mockGetRequest({
      income: 1000000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.SINGLE,
      partnerIncome: undefined,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(0)
  })
  it('returns "-1" when single and 10000 income, only 20 years in Canada (Partial OAS)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
      partnerIncome: undefined,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(-1)
  })
  it('returns "$385.86" when single and 10000 income', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.SINGLE,
      partnerIncome: undefined,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(385.86)
  })
  it('returns "$948.82" when single and 0 income', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.SINGLE,
      partnerIncome: undefined,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(948.82)
  })
  it('returns "$837.82" when married and 10000 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(837.82)
  })
  it('returns "$948.82" when married and 0 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(948.82)
  })
  it('returns "$806.82" when married and 10000 income + 1000 partner income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(806.82)
  })
  it('returns "$300.51" when married and 10000 income + 1000 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(300.51)
  })
  it('returns "$512.51" when married and 10000 income + 1000 partner income and partner Allowance', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerBenefitStatus: PartnerBenefitStatus.ALLOWANCE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(512.51)
  })
  it('returns "$571.15" when married and 0 income + 0 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(571.15)
  })
  it('returns "$571.15" when married and 0 income + 0 partner income and partner Allowance', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.ALLOWANCE,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(571.15)
  })
})

describe('basic Allowance scenarios', () => {
  it('returns "ineligible" when income over (or equal to) 35616', async () => {
    const res = await mockGetRequest({
      income: 35616,

      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "needs more info" when income under 35616', async () => {
    const res = await mockGetRequest({
      income: 35615,

      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "needs more info" when age 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "ineligible due to age" when age 65 and high income', async () => {
    const res = await mockGetRequest({
      income: 1000000,
      age: 65,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age over 64', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age under 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 59,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.AGE)
  })
  it('returns "conditionally eligible" when not citizen', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "ineligible" when citizen and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
  })
  it('returns "ineligible" when widowed', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.MARITAL)
  })
  it('returns "ineligible" when single', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.MARITAL)
  })
  it('returns "ineligible" when partner not receiving OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.OAS)
  })
  it('returns "eligible" when citizen and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible" when living in Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "conditionally eligible" when living in Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.allowance.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
  })
  it('returns "eligible" when living in No Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(
      ResultReason.YEARS_IN_CANADA
    )
  })
  it('returns "ineligible" when under 60, legal=other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.AGE)
  })
})

describe('Allowance entitlement scenarios', () => {
  it('returns "eligible for $325.51" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.entitlementResult).toEqual(325.51)
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $540.77" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.entitlementResult).toEqual(540.77)
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $1206.41" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.entitlementResult).toEqual(1206.41)
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
})

describe('basic Allowance for Survivor scenarios', () => {
  it('returns "ineligible" when income over (or equal to) 25920', async () => {
    const res = await mockGetRequest({
      income: 25920,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
      maritalStatus: MaritalStatus.WIDOWED,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "needs more info" when income under 25920', async () => {
    const res = await mockGetRequest({
      income: 25919,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "needs more info" when age 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
  })
  it('returns "ineligible due to age" when age 65 and high income', async () => {
    const res = await mockGetRequest({
      income: 1000000,
      age: 65,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age over 64', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age under 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 59,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.AGE)
  })
  it('returns "conditionally eligible" when not citizen (other)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.afs.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "ineligible" when citizen and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when married', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.MARRIED,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.MARITAL)
  })
  it('returns "eligible" when widowed', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible" when living in Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "conditionally eligible" when living in Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.afs.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "eligible" when living in No Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerIncome: undefined,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when under 60, legal=other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerIncome: undefined,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.AGE)
  })
})

describe('AFS entitlement scenarios', () => {
  it('returns "eligible for $246.89" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.entitlementResult).toEqual(246.89)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $667.15" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.entitlementResult).toEqual(667.15)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $1438.11" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.entitlementResult).toEqual(1438.11)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
})

describe('thorough personas', () => {
  it('Tanu Singh: OAS eligible, GIS eligible', async () => {
    const res = await mockGetRequest({
      income: 17000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 47,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.NONE)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.NONE)
  })
  it('Habon Aden: OAS conditionally eligible, GIS ineligible due to country', async () => {
    const res = await mockGetRequest({
      income: 28000,
      age: 66,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 18,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('Miriam Krayem: OAS eligible when 65, GIS ineligible due to income', async () => {
    const res = await mockGetRequest({
      income: 40000,
      age: 55,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 30,
      maritalStatus: MaritalStatus.DIVORCED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.OAS)
  })
  it('Adam Smith: OAS eligible when 65, GIS ineligible due to income', async () => {
    const res = await mockGetRequest({
      income: 25000,
      age: 62,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.PERMANENT_RESIDENT,
      yearsInCanadaSince18: 15,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerBenefitStatus: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.AGE)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.OAS)
  })
})

describe('thorough extras', () => {
  it('returns "ineligible due to years in Canada" when living in Canada and 9 years in Canada and never lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.OAS)
  })
  it('returns "conditionally eligible" when living in Canada and 9 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: true,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.results.gis.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.gis.reason).toEqual(ResultReason.OAS)
  })
  it('returns "conditionally eligible" when living in Agreement and 9 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "eligible" when living in Canada and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "conditionally eligible" when not living in Canada and 19 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: true,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "ineligible due to years in Canada" when not living in Canada and 19 years in Canada and not lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: false,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "eligible" when not living in Canada and 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 15000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: undefined,
      everLivedSocialCountry: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
})
