// noinspection DuplicatedCode

import fs from 'fs'
import Joi from 'joi'
import YAML from 'yaml'
import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import {
  fieldDefinitions,
  FieldKey,
} from '../../../utils/api/definitions/fields'
import {
  AfsSchema,
  AllowanceSchema,
  GisSchema,
  OasSchema,
} from '../../../utils/api/definitions/schemas'
import { ALL_COUNTRIES } from '../../../utils/api/helpers/countryUtils'
import { mockGetRequest, mockGetRequestError } from './factory'

describe('code checks', () => {
  it('produces a list of 196 countries', async () => {
    expect(ALL_COUNTRIES.length).toEqual(195)
    expect(ALL_COUNTRIES[0]).toEqual('Canada')
  })
  it('produces a list of fields with unique ordering', async () => {
    const ordersOrig = []
    for (const key in fieldDefinitions) {
      ordersOrig.push(fieldDefinitions[key].order)
    }
    const ordersUnique = [...new Set(ordersOrig)]
    expect(ordersUnique).toEqual(ordersOrig)
  })
})

describe('schema checks', () => {
  function getJoiKeys(schema: Joi.ObjectSchema) {
    // @ts-ignore
    const joiEntries = schema._ids._byKey.entries()
    const joiKeys = []
    for (const joiEntry of joiEntries) joiKeys.push(joiEntry[0])
    return joiKeys
  }

  it('OAS: matches between field definitions and schema', async () => {
    const joiKeys = getJoiKeys(OasSchema)
    const enumKeys = Object.values(FieldKey)
    expect(joiKeys).toEqual(enumKeys)
  })
  it('GIS: matches between field definitions and schema', async () => {
    const joiKeys = getJoiKeys(GisSchema)
    const enumKeys: string[] = Object.values(FieldKey)
    enumKeys.push('_oasEligible')
    expect(joiKeys).toEqual(enumKeys)
  })
  it('Allowance: matches between field definitions and schema', async () => {
    const joiKeys = getJoiKeys(AllowanceSchema)
    const enumKeys = Object.values(FieldKey)
    expect(joiKeys).toEqual(enumKeys)
  })
  it('AFS: matches between field definitions and schema', async () => {
    const joiKeys = getJoiKeys(AfsSchema)
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
  it('fails when not partnered and "partnerReceivingOas" true', async () => {
    let res = await mockGetRequestError({
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: true,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
  it('accepts when not partnered and "partnerReceivingOas" false', async () => {
    let res = await mockGetRequest({
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: false,
    })
    expect(res.status).toEqual(200)
  })
  it('accepts when partnered and "partnerReceivingOas" present', async () => {
    const res = await mockGetRequest({
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: true,
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.oas.missingFields).toEqual(['income'])
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.gis.missingFields).toEqual(['income'])
    expect(res.body.visibleFields).toEqual(['income'])
  })
  it('required fields when only income provided', async () => {
    const res = await mockGetRequest({ income: 10000 })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.oas.missingFields).toEqual([
      'age',
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.gis.missingFields).toEqual([
      'age',
      'livingCountry',
      'legalStatus',
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.oas.missingFields).toEqual([
      'maritalStatus',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.gis.missingFields).toEqual(['livingCountry', 'legalStatus'])
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.oas.missingFields).toEqual([
      'maritalStatus',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.gis.missingFields).toEqual(['legalStatus'])
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.oas.missingFields).toEqual([
      'maritalStatus',
      'yearsInCanadaSince18',
    ])
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.gis.missingFields).toBeUndefined()
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.oas.missingFields).toEqual(['maritalStatus'])
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.gis.missingFields).toBeUndefined()
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
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
    expect(res.body.oas.missingFields).toBeUndefined()
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.NONE)
    expect(res.body.gis.missingFields).toBeUndefined()
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.oas.missingFields).toEqual(['partnerIncome'])
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.gis.missingFields).toEqual([
      'partnerReceivingOas',
      'partnerIncome',
    ])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'partnerReceivingOas',
      'partnerIncome',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
  })
  it('required fields when only income/age/country/legal/years/marital=married/partnerOas provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: true,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.oas.missingFields).toEqual(['partnerIncome'])
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
    expect(res.body.gis.missingFields).toEqual(['partnerIncome'])
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'partnerReceivingOas',
      'partnerIncome',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
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
      partnerReceivingOas: true,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
    expect(res.body.oas.missingFields).toBeUndefined()
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.NONE)
    expect(res.body.gis.missingFields).toBeUndefined()
    expect(res.body.visibleFields).toEqual([
      'income',
      'age',
      'maritalStatus',
      'partnerReceivingOas',
      'partnerIncome',
      'livingCountry',
      'legalStatus',
      'yearsInCanadaSince18',
    ])
  })
})

describe('basic OAS scenarios', () => {
  it('returns "ineligible" when income over 129757', async () => {
    const res = await mockGetRequest({
      income: 129758,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.INCOME)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.LEGAL_STATUS)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "needs more info" when citizen and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
  })
  it('returns "needs more info" when living in No Agreement and under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.oas.reason).toEqual(ResultReason.MORE_INFO)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.AGE)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.AGE)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.AGE)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.AGE)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.entitlementResult).toEqual(317.63)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.entitlementResult).toEqual(619.38)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
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
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.entitlementResult).toEqual(635.26)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
  })
})

describe('basic GIS scenarios', () => {
  it('returns "needs more info" when missing marital status', async () => {
    const res = await mockGetRequest({
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "needs more info" when missing income', async () => {
    const res = await mockGetRequest({
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "needs more info" when partnered and "partnerReceivingOas" missing', async () => {
    let res = await mockGetRequest({
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: undefined,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "needs more info" when missing country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "ineligible" when income 1,000,000', async () => {
    const res = await mockGetRequest({
      income: 1000000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.OAS)
  })
  it('returns "needs more info" when missing country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "ineligible" when not living in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "conditionally eligible" when sponsored', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.gis.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "ineligible" when single and income over 19248', async () => {
    const res = await mockGetRequest({
      income: 19249,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "eligible" when single and income under 19248', async () => {
    const res = await mockGetRequest({
      income: 19247,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "ineligible" when married and no partner OAS and income over 46128', async () => {
    const res = await mockGetRequest({
      income: 46129,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: false,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "needs more info" when married and no partner OAS and income under 46128', async () => {
    const res = await mockGetRequest({
      income: 46127,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: false,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "eligible" when married and no partner OAS and income under 45128 and partner income 1000', async () => {
    const res = await mockGetRequest({
      income: 45127,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerReceivingOas: false,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "needs more info" when married and partner OAS and income over 25440', async () => {
    const res = await mockGetRequest({
      income: 25441,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: true,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "ineligible" when married and partner OAS and income over 25440 and partner income 0', async () => {
    const res = await mockGetRequest({
      income: 25441,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerReceivingOas: true,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "ineligible" when married and partner OAS and income over 24440 and partner income 1000', async () => {
    const res = await mockGetRequest({
      income: 24441,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerReceivingOas: true,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "needs more info" when married and partner OAS and income under 25440', async () => {
    const res = await mockGetRequest({
      income: 25439,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: true,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.gis.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "eligible" when married and partner OAS and income under 25440 and partner income 0', async () => {
    const res = await mockGetRequest({
      income: 25439,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerReceivingOas: true,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.NONE)
  })
})

describe('GIS entitlement scenarios', () => {
  it('returns "$0" when single and 1,000,000 income', async () => {
    const res = await mockGetRequest({
      income: 1000000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
      partnerIncome: 0,
      partnerReceivingOas: undefined,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.entitlementResult).toEqual(0)
  })
  it('returns "$385.86" when single and 10000 income', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
      partnerIncome: 0,
      partnerReceivingOas: undefined,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.entitlementResult).toEqual(385.86)
  })
  it('returns "$948.82" when single and 0 income', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
      partnerIncome: 0,
      partnerReceivingOas: undefined,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.entitlementResult).toEqual(948.82)
  })
  it('returns "$837.82" when married and 10000 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerReceivingOas: false,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.entitlementResult).toEqual(837.82)
  })
  it('returns "$948.82" when married and 0 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerReceivingOas: false,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.entitlementResult).toEqual(948.82)
  })
  it('returns "$806.82" when married and 10000 income + 1000 partner income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerReceivingOas: false,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.entitlementResult).toEqual(806.82)
  })
  it('returns "$300.51" when married and 10000 income + 1000 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 1000,
      partnerReceivingOas: true,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.entitlementResult).toEqual(300.51)
  })
  it('returns "$571.15" when married and 0 income + 0 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerReceivingOas: true,
    })
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.entitlementResult).toEqual(571.15)
  })
})

describe('basic Allowance scenarios', () => {
  it('returns "ineligible" when income over (or equal to) 35616', async () => {
    const res = await mockGetRequest({
      income: 35616,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "needs more info" when income under 35616', async () => {
    const res = await mockGetRequest({
      income: 35615,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.allowance.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "needs more info" when age 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.allowance.reason).toEqual(ResultReason.MORE_INFO)
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
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.AGE)
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
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.AGE)
  })
  it('returns "conditionally eligible" when not citizen', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.allowance.reason).toEqual(ResultReason.LEGAL_STATUS)
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
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when widowed', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.MARITAL)
  })
  it('returns "ineligible" when single', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: false,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.MARITAL)
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
      partnerReceivingOas: false,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.OAS)
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
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.NONE)
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
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.NONE)
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
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.allowance.reason).toEqual(ResultReason.YEARS_IN_CANADA)
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
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.NONE)
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
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when under 60, legal=other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.MARRIED,
      partnerIncome: 0,
      partnerReceivingOas: true,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.allowance.reason).toEqual(ResultReason.AGE)
  })
})

describe('Allowance entitlement scenarios', () => {
  it('returns "eligible for $325.51" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: true,
      partnerIncome: 0,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.allowance.entitlementResult).toEqual(325.51)
    expect(res.body.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $540.77" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: true,
      partnerIncome: 0,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.allowance.entitlementResult).toEqual(540.77)
    expect(res.body.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $1206.41" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: true,
      partnerIncome: 0,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 40,
    })
    expect(res.body.allowance.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.allowance.entitlementResult).toEqual(1206.41)
    expect(res.body.allowance.reason).toEqual(ResultReason.NONE)
  })
})

describe('basic Allowance for Survivor scenarios', () => {
  it('returns "ineligible" when income over (or equal to) 25920', async () => {
    const res = await mockGetRequest({
      income: 25920,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "needs more info" when income under 25920', async () => {
    const res = await mockGetRequest({
      income: 25919,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.afs.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "needs more info" when age 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.MORE_INFO)
    expect(res.body.afs.reason).toEqual(ResultReason.MORE_INFO)
  })
  it('returns "ineligible" when age over 64', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age under 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 59,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.AGE)
  })
  it('returns "conditionally eligible" when not citizen (other)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.afs.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "ineligible" when citizen and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when married', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.MARRIED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.MARITAL)
  })
  it('returns "eligible" when widowed', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible" when living in Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "conditionally eligible" when living in Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.afs.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "eligible" when living in No Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when under 60, legal=other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerIncome: 0,
      partnerReceivingOas: false,
    })
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.afs.reason).toEqual(ResultReason.AGE)
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
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.afs.entitlementResult).toEqual(246.89)
    expect(res.body.afs.reason).toEqual(ResultReason.NONE)
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
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.afs.entitlementResult).toEqual(667.15)
    expect(res.body.afs.reason).toEqual(ResultReason.NONE)
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
    expect(res.body.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.afs.entitlementResult).toEqual(1438.11)
    expect(res.body.afs.reason).toEqual(ResultReason.NONE)
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
      partnerReceivingOas: true,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.NONE)
  })
  it('Habon Aden: OAS conditionally eligible, GIS ineligible due to country', async () => {
    const res = await mockGetRequest({
      income: 28000,
      age: 66,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 18,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: undefined,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('Miriam Krayem: OAS eligible when 65, GIS ineligible due to income', async () => {
    const res = await mockGetRequest({
      income: 40000,
      age: 55,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 30,
      maritalStatus: MaritalStatus.DIVORCED,
      partnerReceivingOas: undefined,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.AGE)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.OAS)
  })
  it('Adam Smith: OAS eligible when 65, GIS ineligible due to income', async () => {
    const res = await mockGetRequest({
      income: 25000,
      age: 62,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.PERMANENT_RESIDENT,
      yearsInCanadaSince18: 15,
      maritalStatus: MaritalStatus.WIDOWED,
      partnerReceivingOas: undefined,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.AGE)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.OAS)
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
      partnerReceivingOas: undefined,
      everLivedSocialCountry: false,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.OAS)
  })
  it('returns "conditionally eligible" when living in Canada and 9 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: undefined,
      everLivedSocialCountry: true,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.gis.reason).toEqual(ResultReason.OAS)
  })
  it('returns "conditionally eligible" when living in Agreement and 9 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 9,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: undefined,
      everLivedSocialCountry: undefined,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "eligible" when living in Canada and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 10,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: undefined,
      everLivedSocialCountry: undefined,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "conditionally eligible" when not living in Canada and 19 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: undefined,
      everLivedSocialCountry: true,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.CONDITIONAL)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "ineligible due to years in Canada" when not living in Canada and 19 years in Canada and not lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 19,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: undefined,
      everLivedSocialCountry: false,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.YEARS_IN_CANADA)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "eligible" when not living in Canada and 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 15000,
      age: 65,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      yearsInCanadaSince18: 20,
      maritalStatus: MaritalStatus.SINGLE,
      partnerReceivingOas: undefined,
      everLivedSocialCountry: undefined,
    })
    expect(res.body.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.oas.reason).toEqual(ResultReason.NONE)
    expect(res.body.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
})
