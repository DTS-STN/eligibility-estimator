import { createArrayCsvStringifier } from 'csv-writer'
import Joi from 'joi'
import type { NextApiRequest, NextApiResponse } from 'next'
import { stripHtml } from 'string-strip-html'
import { numberToStringCurrency, Translations } from '../../i18n/api'
import { BenefitProcessor } from '../../utils/api/benefitProcessor'
import { ResultKey } from '../../utils/api/definitions/enums'
import {
  fieldDefinitions,
  FieldKey,
  FieldType,
} from '../../utils/api/definitions/fields'
import { RequestSchema } from '../../utils/api/definitions/schemas'
import {
  BenefitResult,
  RequestInput,
  ResponseError,
} from '../../utils/api/definitions/types'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | ResponseError>
) {
  try {
    console.log(`Processing CSV request: `, req.query)

    // validation
    const requestInput: RequestInput = Joi.attempt(req.query, RequestSchema, {
      abortEarly: false,
    })

    // processing
    const handler = new BenefitProcessor(requestInput)
    const records: string[][] = []
    const csvTranslations = handler.translations.csv
    records.push([csvTranslations.appName])

    records.push(
      [''],
      [csvTranslations.formResponses],
      [csvTranslations.question, csvTranslations.answer]
    )
    for (const field of handler.fieldData) {
      let question = stripHtml(field.label).result
      let response = handler.rawInput[field.key].toString()
      let responseHuman = humanizeResponse(
        response,
        field.key,
        handler.translations
      )
      records.push([question, responseHuman])
    }

    records.push(
      [''],
      [csvTranslations.estimationResults],
      [
        csvTranslations.benefit,
        csvTranslations.eligibility,
        csvTranslations.details,
        csvTranslations.entitlement,
      ]
    )
    for (const resultKey in handler.benefitResults) {
      const result: BenefitResult = handler.benefitResults[resultKey]
      const benefitName = handler.translations.benefit[resultKey]
      const [eligibility, detail] = stripHtml(
        result.eligibility.detail
      ).result.split('\n')
      const entitlement = numberToStringCurrency(
        result.entitlement.result,
        handler.translations._locale
      )
      records.push([benefitName, eligibility, detail, entitlement])
    }

    records.push(
      [''],
      [csvTranslations.links],
      [csvTranslations.description, csvTranslations.url]
    )
    for (const link of handler.summary.links) {
      records.push([link.text, link.url])
    }

    let output = createArrayCsvStringifier({}).stringifyRecords(records)
    res.setHeader('Content-Type', 'application/csv')
    res.setHeader('Content-Disposition', `attachment; filename=export.csv`)
    res.status(200).send(output)
  } catch (error) {
    res.status(400).json({
      error: ResultKey.INVALID,
      detail: error.details || String(error),
    })
    console.log(error)
    return
  }
}

function humanizeResponse(
  response: string,
  fieldKey: FieldKey,
  translations: Translations
): string {
  const questionType = fieldDefinitions[fieldKey].type
  switch (questionType) {
    case FieldType.BOOLEAN:
      return response.toLowerCase() === 'false'
        ? translations.no
        : translations.yes
    case FieldType.RADIO:
    case FieldType.DROPDOWN:
    case FieldType.DROPDOWN_SEARCHABLE:
      const questionOptions = translations.questionOptions[fieldKey]
      const foundOption = questionOptions.find(
        (option) => option.key === response
      )
      return foundOption.text
    case FieldType.CURRENCY:
      return numberToStringCurrency(Number(response), translations._locale)
    case FieldType.NUMBER:
    case FieldType.STRING:
      return response
  }
}
