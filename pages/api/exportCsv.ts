import { createArrayCsvStringifier } from 'csv-writer'
import type { NextApiRequest, NextApiResponse } from 'next'
import { stripHtml } from 'string-strip-html'
import { numberToStringCurrency, Translations } from '../../i18n/api'
import { ResultKey } from '../../utils/api/definitions/enums'
import {
  FieldConfig,
  fieldDefinitions,
  FieldType,
} from '../../utils/api/definitions/fields'
import { BenefitResult, ResponseError } from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | ResponseError>
) {
  try {
    const handler = new MainHandler(req.query).handler
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
        field,
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
  field: FieldConfig,
  translations: Translations
): string {
  const questionType = fieldDefinitions[field.key].type
  switch (questionType) {
    case FieldType.BOOLEAN:
      return response.toLowerCase() === 'false'
        ? translations.no
        : translations.yes
    case FieldType.RADIO:
    case FieldType.DROPDOWN:
    case FieldType.DROPDOWN_SEARCHABLE:
      let questionOptions = translations.questionOptions[field.key]
      if (!questionOptions)
        questionOptions = translations.questionOptions[field.relatedKey]
      if (!questionOptions) return 'UNKNOWN'
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
