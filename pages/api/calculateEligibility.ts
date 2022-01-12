import Joi from 'joi'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTranslations } from '../../i18n/api'
import { BenefitHandler } from '../../utils/api/benefits/_base'
import { ResultKey } from '../../utils/api/definitions/enums'
import { FieldData } from '../../utils/api/definitions/fields'
import { RequestSchema } from '../../utils/api/definitions/schemas'
import {
  BenefitResultObject,
  CalculationInput,
  RequestInput,
  ResponseError,
  ResponseSuccess,
  SummaryObject,
} from '../../utils/api/definitions/types'
import normalizeLivingCountry from '../../utils/api/helpers/countryUtils'
import {
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from '../../utils/api/helpers/fieldClasses'
import { buildFieldData } from '../../utils/api/helpers/fieldUtils'
import { ResultsProcessor } from '../../utils/api/helpers/resultsUtils'
import { SummaryBuilder } from '../../utils/api/helpers/summaryUtils'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSuccess | ResponseError>
) {
  try {
    console.log(`Processing request: `, req.query)

    // validation
    const params: RequestInput = Joi.attempt(req.query, RequestSchema, {
      abortEarly: false,
    })

    // pre-processing (adding helpers and normalization)
    const translations = getTranslations(params._language)
    const processed: CalculationInput = {
      ...params,
      income: params.partnerIncome
        ? params.income + params.partnerIncome
        : params.income,
      livingCountry: normalizeLivingCountry(params.livingCountry),
      maritalStatus: new MaritalStatusHelper(params.maritalStatus),
      partnerBenefitStatus: new PartnerBenefitStatusHelper(
        params.partnerBenefitStatus
      ),
      _translations: translations,
    }

    // processing
    const handler = new BenefitHandler(processed)
    const results: BenefitResultObject = handler.getBenefitResultObject()
    console.log('Results: ', results)

    const fieldData: Array<FieldData> = buildFieldData(
      handler.requiredFields,
      translations
    )
    const summary: SummaryObject = SummaryBuilder.buildSummaryObject(
      results,
      handler.missingFields,
      translations
    )
    ResultsProcessor.processResultsObject(results, translations)

    // completion
    res.status(200).json({
      results,
      summary,
      visibleFields: handler.requiredFields,
      missingFields: handler.missingFields,
      fieldData,
    })
  } catch (error) {
    res.status(400).json({
      error: ResultKey.INVALID,
      detail: error.details || String(error),
    })
    console.log(error)
    return
  }
}
