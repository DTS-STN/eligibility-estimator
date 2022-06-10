import fs from 'fs'
import Joi from 'joi'
import YAML from 'yaml'
import { getTranslations, Translations } from '../../../i18n/api'
import { BenefitHandler } from '../../../utils/api/benefitHandler'
import { countryList } from '../../../utils/api/definitions/countries'
import {
  Language,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from '../../../utils/api/definitions/enums'
import {
  FieldDataDropdown,
  FieldKey,
} from '../../../utils/api/definitions/fields'
import { RequestSchema } from '../../../utils/api/definitions/schemas'
import { OutputItem } from '../../../utils/api/scrapers/_baseTable'
import { scraperData } from '../../../utils/api/scrapers/output'
import { mockGetRequestError, mockPartialGetRequest } from './factory'

describe('code checks', () => {})

describe('translation checks', () => {
  it('matches between question translations and available questions', async () => {
    const translationsEn: Translations = getTranslations(Language.EN)
    const translationsFr: Translations = getTranslations(Language.FR)
    const translationKeysEn = Object.keys(translationsEn.question)
    const translationKeysFr = Object.keys(translationsFr.question)
    const enumKeys = Object.values(FieldKey)
    expect(translationKeysEn).toEqual(enumKeys)
    expect(translationKeysFr).toEqual(enumKeys)
  })
})

describe('country checks', () => {
  const COUNTRY_COUNT = 195
  const handlerEn = new BenefitHandler({ _language: Language.EN })
  handlerEn.requiredFields = [FieldKey.LIVING_COUNTRY]
  const fieldDataEn = handlerEn.fieldData as Array<FieldDataDropdown>
  const handlerFr = new BenefitHandler({ _language: Language.FR })
  handlerFr.requiredFields = [FieldKey.LIVING_COUNTRY]
  const fieldDataFr = handlerFr.fieldData as Array<FieldDataDropdown>
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

describe('scraper tests', () => {
  it("the scraped data's last entry is less than one", async () => {
    const toVerify: { data: OutputItem[]; key: string }[] = [
      { data: scraperData.tbl1_single, key: 'gis' },
      { data: scraperData.tbl2_partneredAndOas, key: 'gis' },
      { data: scraperData.tbl3_partneredNoOas, key: 'gis' },
      { data: scraperData.tbl4_partneredAlw, key: 'alw' },
      { data: scraperData.tbl5_partneredAfs, key: 'afs' },
    ]
    toVerify.forEach((value) => {
      const last = value.data[value.data.length - 1][value.key]
      expect(last).toBeLessThan(1)
    })
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
    const res = await mockPartialGetRequest({ age: 150 })
    expect(res.status).toEqual(200)
  })
  it('accepts valid Marital Status', async () => {
    const res = await mockPartialGetRequest({
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
    })
    expect(res.status).toEqual(200)
  })
  it('accepts valid Legal Status', async () => {
    const res = await mockPartialGetRequest({
      age: 65,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
    })
    expect(res.status).toEqual(200)
  })
  it('fails when years in Canada is greater than age minus 18', async () => {
    const res = await mockGetRequestError({
      age: 65,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 48,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
  it('accepts when years in Canada is equal to age minus 18', async () => {
    const res = await mockPartialGetRequest({
      age: 65,
      livedOutsideCanada: true,
      yearsInCanadaSince18: 47,
    })
    expect(res.status).toEqual(200)
  })
  it('fails when marital status is involuntarily separated', async () => {
    const res = await mockGetRequestError({
      maritalStatus: MaritalStatus.INV_SEPARATED,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
})
