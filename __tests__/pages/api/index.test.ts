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
import { RequestHandler } from '../../../utils/api/helpers/requestHandler'
import { OutputItem } from '../../../utils/api/scrapers/_base'
import scraperData from '../../../utils/api/scrapers/output'
import {
  mockGetRequest,
  mockGetRequestError,
  mockPartialGetRequest,
} from './factory'

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
  const fieldList: Array<FieldKey> = [FieldKey.LIVING_COUNTRY]
  const translationsEn: Translations = getTranslations(Language.EN)
  const fieldDataEn = RequestHandler.getFieldData(
    fieldList,
    translationsEn
  ) as Array<FieldDataDropdown>
  const translationsFr: Translations = getTranslations(Language.FR)
  const fieldDataFr = RequestHandler.getFieldData(
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

describe('scraper tests', () => {
  it("the scraped data's last entry is less than one", async () => {
    const toVerify: { data: OutputItem[]; key: string }[] = [
      { data: scraperData.single, key: 'gis' },
      { data: scraperData.partneredAndOas, key: 'gis' },
      { data: scraperData.partneredNoOas, key: 'gis' },
      { data: scraperData.partneredAllowance, key: 'allowance' },
      { data: scraperData.partneredSurvivor, key: 'afs' },
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
      canadaWholeLife: false,
      yearsInCanadaSince18: 48,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
  it('accepts when years in Canada is equal to age minus 18', async () => {
    const res = await mockPartialGetRequest({
      age: 65,
      canadaWholeLife: false,
      yearsInCanadaSince18: 47,
    })
    expect(res.status).toEqual(200)
  })
  it('fails when not partnered and "partnerBenefitStatus" FULL_OAS_GIS', async () => {
    let res = await mockGetRequestError({
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
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
    const res = await mockPartialGetRequest({
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
  it('fails when lifeCanada=true and "yearsInCanadaSince18" provided', async () => {
    let res = await mockGetRequestError({
      income: 10000,
      age: 65,
      canadaWholeLife: true,
      yearsInCanadaSince18: 20,
    })
    expect(res.status).toEqual(400)
    expect(res.body.error).toEqual(ResultKey.INVALID)
  })
})

describe('field requirement analysis', () => {
  it('requires only income when nothing provided', async () => {
    const res = await mockGetRequest({
      income: undefined,
      age: undefined,
      maritalStatus: undefined,
      livingCountry: undefined,
      legalStatus: undefined,
      legalStatusOther: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.INCOME])
    expect(res.body.visibleFields).toEqual([FieldKey.INCOME])
  })
  it('requires fields when only income provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: undefined,
      maritalStatus: undefined,
      livingCountry: undefined,
      legalStatus: undefined,
      legalStatusOther: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
    ])
  })
  it('requires fields when only income/age provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: undefined,
      livingCountry: undefined,
      legalStatus: undefined,
      legalStatusOther: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
    ])
  })
  it('requires fields when only income/age/marital provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: undefined,
      legalStatus: undefined,
      legalStatusOther: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
  it('requires fields when only income/age/marital/country provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: undefined,
      legalStatusOther: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
  it('requires fields when only income/age/marital/country/legal provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: undefined,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
  it('requires fields when only income/age/marital/country/legal/lifeCanada provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
  it('requires fields when only income/age/marital/country/legal/lifeCanada/years provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
  it('requires fields when only income/age/marital/country/legal/lifeCanada/years/socialCountry provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: true,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
  it('requires fields when only income/age/marital/country/legal/lifeCanada/years/socialCountry/partnerBenefits provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.PARTNER_INCOME])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
  it('requires no fields when all provided', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: true,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 10000,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
    expect(res.body.missingFields).toEqual([])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
})

describe('field requirements analysis: conditional fields', () => {
  it('requires "yearsInCanadaSince18" when lifeCanada=false', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.YEARS_IN_CANADA_SINCE_18])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
    ])
  })
  it('requires "everLivedSocialCountry" when citizen and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 5,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.EVER_LIVED_SOCIAL_COUNTRY])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.YEARS_IN_CANADA_SINCE_18,
      FieldKey.EVER_LIVED_SOCIAL_COUNTRY,
    ])
  })
  it('requires "legalStatusOther" when legal=other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([FieldKey.LEGAL_STATUS_OTHER])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.LEGAL_STATUS_OTHER,
      FieldKey.CANADA_WHOLE_LIFE,
    ])
  })
  it('requires partner questions when marital=married', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.MORE_INFO)
    expect(res.body.missingFields).toEqual([
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
    expect(res.body.visibleFields).toEqual([
      FieldKey.INCOME,
      FieldKey.AGE,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.CANADA_WHOLE_LIFE,
      FieldKey.PARTNER_BENEFIT_STATUS,
      FieldKey.PARTNER_INCOME,
    ])
  })
})

describe('summary object checks', () => {
  it('returns "available eligible"', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 10000,
    })
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_ELIGIBLE
    )
  })
  it('returns "available ineligible"', async () => {
    const res = await mockGetRequest({
      income: 1000000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 10000,
    })
    expect(res.body.summary.state).toEqual(
      EstimationSummaryState.AVAILABLE_INELIGIBLE
    )
  })
  it('returns "unavailable"', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 10000,
    })
    expect(res.body.summary.state).toEqual(EstimationSummaryState.UNAVAILABLE)
  })
})

describe('basic OAS scenarios', () => {
  it('returns "ineligible" when income equal to 133141', async () => {
    const res = await mockPartialGetRequest({
      income: 133141,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "conditionally eligible" when not citizen (other provided)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.oas.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "conditionally eligible" when citizen and under 10 years in Canada and lived in social country', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: true,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
  })
  it('returns "needs more info" when living in No Agreement and under 20 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: undefined,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: true,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 39,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.entitlementResult).toEqual(642.25)
    expect(res.body.results.oas.reason).toEqual(ResultReason.NONE)
  })
})

describe('basic GIS scenarios', () => {
  it('returns "ineligible" when income 1,000,000', async () => {
    const res = await mockPartialGetRequest({
      maritalStatus: MaritalStatus.MARRIED,
      income: 1000000,
      age: 65,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.OAS)
  })
  it('returns "ineligible" when not living in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
  it('returns "conditionally eligible" when sponsored', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.SPONSORED,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(
      ResultKey.CONDITIONAL
    )
    expect(res.body.results.gis.reason).toEqual(ResultReason.LEGAL_STATUS)
  })
  it('returns "ineligible" when single and income equal to 19464', async () => {
    const res = await mockGetRequest({
      income: 19464,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "eligible" when single and income under 19248', async () => {
    const res = await mockGetRequest({
      income: 19247,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "ineligible" when married and no partner OAS and income equal to 46656', async () => {
    const res = await mockGetRequest({
      income: 46656,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "eligible" when married and no partner OAS and income under 45656 and partner income 1000', async () => {
    const res = await mockGetRequest({
      income: 45655,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 1000,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "ineligible" when married and partner OAS and income equal to 25728 and partner income 0', async () => {
    const res = await mockGetRequest({
      income: 25728,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "ineligible" when married and partner OAS and income equal to 24728 and partner income 1000', async () => {
    const res = await mockGetRequest({
      income: 24728,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 1000,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "eligible" when married and partner OAS and income under 25440 and partner income 0', async () => {
    const res = await mockGetRequest({
      income: 25439,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible" when married and partner partial OAS and income under 46656 and partner income 0', async () => {
    const res = await mockGetRequest({
      income: 46655,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      yearsInCanadaSince18: 40,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.PARTIAL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(0)
  })
  it('returns "-1" when single and 10000 income, only 20 years in Canada (Partial OAS)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(-1)
  })
  it('returns "$394.68" when single and 10000 income', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(394.68)
  })
  it('returns "$959.26" when single and 0 income', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(959.26)
  })
  it('returns "$850.26" when married and 10000 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(850.26)
  })
  it('returns "$959.26" when married and 0 income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(959.26)
  })
  it('returns "$819.26" when married and 10000 income + 1000 partner income and no partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 1000,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(819.26)
  })
  it('returns "$306.33" when married and 10000 income + 1000 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 1000,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(306.33)
  })
  it('returns "$521.33" when married and 10000 income + 1000 partner income and partner Allowance', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.ALLOWANCE,
      partnerIncome: 1000,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(521.33)
  })
  it('returns "$577.43" when married and 0 income + 0 partner income and partner OAS', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(577.43)
  })
  it('returns "$577.43" when married and 0 income + 0 partner income and partner Allowance', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.ALLOWANCE,
      partnerIncome: 0,
    })
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.gis.entitlementResult).toEqual(577.43)
  })
})

describe('basic Allowance scenarios', () => {
  it('returns "ineligible" when income equal to 36048', async () => {
    const res = await mockGetRequest({
      income: 36048,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "ineligible due to age" when age 65 and high income', async () => {
    const res = await mockPartialGetRequest({
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.NONE,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.INELIGIBLE
    )
    expect(res.body.results.allowance.reason).toEqual(ResultReason.AGE)
  })
})

describe('Allowance entitlement scenarios', () => {
  it('returns "eligible for $334.33" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.entitlementResult).toEqual(334.33)
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $553.58" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.entitlementResult).toEqual(553.58)
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $1219.68" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
    })
    expect(res.body.results.allowance.eligibilityResult).toEqual(
      ResultKey.ELIGIBLE
    )
    expect(res.body.results.allowance.entitlementResult).toEqual(1219.68)
    expect(res.body.results.allowance.reason).toEqual(ResultReason.NONE)
  })
})

describe('basic Allowance for Survivor scenarios', () => {
  it('returns "ineligible" when income equal to 26256', async () => {
    const res = await mockGetRequest({
      income: 26256,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.INCOME)
  })
  it('returns "ineligible due to age" when age 65 and high income', async () => {
    const res = await mockPartialGetRequest({
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
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.AGE)
  })
  it('returns "ineligible" when age under 60', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 59,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.AGE)
  })
  it('returns "conditionally eligible" when not citizen (other)', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when married', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
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
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible" when living in Agreement and 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "conditionally eligible" when living in Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "ineligible" when living in No Agreement and under 10 years in Canada', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.YEARS_IN_CANADA)
  })
  it('returns "ineligible" when under 60, legal=other', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 55,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.OTHER,
      legalStatusOther: 'some legal status',
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.afs.reason).toEqual(ResultReason.AGE)
  })
})

describe('AFS entitlement scenarios', () => {
  it('returns "eligible for $260.10" when 40 years in Canada and income=20000', async () => {
    const res = await mockGetRequest({
      income: 20000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.entitlementResult).toEqual(260.1)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $681.35" when 40 years in Canada and income=10000', async () => {
    const res = await mockGetRequest({
      income: 10000,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.entitlementResult).toEqual(681.35)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
  it('returns "eligible for $1453.93" when 40 years in Canada and income=0', async () => {
    const res = await mockGetRequest({
      income: 0,
      age: 60,
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.afs.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.afs.entitlementResult).toEqual(1453.93)
    expect(res.body.results.afs.reason).toEqual(ResultReason.NONE)
  })
})

describe('thorough personas', () => {
  it('Tanu Singh: OAS eligible, GIS eligible', async () => {
    const res = await mockGetRequest({
      income: 17000,
      age: 65,
      maritalStatus: MaritalStatus.MARRIED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: true,
      yearsInCanadaSince18: undefined,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: PartnerBenefitStatus.FULL_OAS_GIS,
      partnerIncome: 0,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 18,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.DIVORCED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 30,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.WIDOWED,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.PERMANENT_RESIDENT,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 15,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: true,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 9,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.CANADA,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 10,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: true,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 19,
      everLivedSocialCountry: false,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
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
      maritalStatus: MaritalStatus.SINGLE,
      livingCountry: LivingCountry.NO_AGREEMENT,
      legalStatus: LegalStatus.CANADIAN_CITIZEN,
      legalStatusOther: undefined,
      canadaWholeLife: false,
      yearsInCanadaSince18: 20,
      everLivedSocialCountry: undefined,
      partnerBenefitStatus: undefined,
      partnerIncome: undefined,
    })
    expect(res.body.results.oas.eligibilityResult).toEqual(ResultKey.ELIGIBLE)
    expect(res.body.results.oas.reason).toEqual(ResultReason.PARTIAL_OAS)
    expect(res.body.results.gis.eligibilityResult).toEqual(ResultKey.INELIGIBLE)
    expect(res.body.results.gis.reason).toEqual(ResultReason.LIVING_COUNTRY)
  })
})
