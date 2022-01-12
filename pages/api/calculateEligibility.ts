import Joi from 'joi'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTranslations } from '../../i18n/api'
import checkAfs from '../../utils/api/benefits/checkAfs'
import checkAllowance from '../../utils/api/benefits/checkAllowance'
import checkGis from '../../utils/api/benefits/checkGis'
import checkOas from '../../utils/api/benefits/checkOas'
import {
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
  ResultKey,
} from '../../utils/api/definitions/enums'
import { FieldData, FieldKey } from '../../utils/api/definitions/fields'
import { RequestSchema } from '../../utils/api/definitions/schemas'
import {
  BenefitResultObject,
  CalculationInput,
  ResponseError,
  ResponseSuccess,
  SummaryObject,
} from '../../utils/api/definitions/types'
import normalizeLivingCountry from '../../utils/api/helpers/countryUtils'
import {
  buildFieldData,
  buildVisibleFields,
} from '../../utils/api/helpers/fieldUtils'
import { ResultsProcessor } from '../../utils/api/helpers/resultsUtils'
import { SummaryBuilder } from '../../utils/api/helpers/summaryUtils'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSuccess | ResponseError>
) {
  try {
    console.log(`Processing request: `, req.query)

    // normalization
    // takes a country string, normalizes to Canada/Agreement/NoAgreement
    if (req.query.livingCountry) {
      req.query.livingCountry = normalizeLivingCountry(
        req.query.livingCountry as string
      )
    }
    // adds partner income to main income
    if (req.query.partnerIncome) {
      req.query.income = (
        parseInt(req.query.income as string) +
        parseInt(req.query.partnerIncome as string)
      ).toString()
    }

    // validation
    const params: CalculationInput = Joi.attempt(req.query, RequestSchema, {
      abortEarly: false,
    })
    console.log('Passed validation.')

    // pre-processing
    // add helper classes
    params._maritalStatus = new MaritalStatusHelper(params.maritalStatus)
    params._partnerBenefitStatus = new PartnerBenefitStatusHelper(
      params.partnerBenefitStatus
    )

    // processing
    const translations = getTranslations(params._language)
    const results: BenefitResultObject = {
      oas: checkOas(params, translations),
      gis: checkGis(params, translations),
      allowance: checkAllowance(params, translations),
      afs: checkAfs(params, translations),
    }
    console.log('Results: ', results)

    const visibleFields: Array<FieldKey> = buildVisibleFields([
      Object.keys(params),
      results.oas.missingFields,
      results.gis.missingFields,
      results.allowance.missingFields,
      results.afs.missingFields,
    ])
    const fieldData: Array<FieldData> = buildFieldData(
      visibleFields,
      translations
    )
    const summary: SummaryObject = SummaryBuilder.buildSummaryObject(
      results,
      translations
    )
    ResultsProcessor.processResultsObject(results, translations)

    // completion
    res.status(200).json({
      oas: results.oas,
      gis: results.gis,
      allowance: results.allowance,
      afs: results.afs,
      summary,
      visibleFields,
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
