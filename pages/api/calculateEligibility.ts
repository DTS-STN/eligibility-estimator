import Joi from 'joi'
import type { NextApiRequest, NextApiResponse } from 'next'
import checkAfs from '../../utils/api/benefits/checkAfs'
import checkAllowance from '../../utils/api/benefits/checkAllowance'
import checkGis from '../../utils/api/benefits/checkGis'
import checkOas from '../../utils/api/benefits/checkOas'
import { ResultKey } from '../../utils/api/definitions/enums'
import { FieldData, FieldKey } from '../../utils/api/definitions/fields'
import { RequestSchema } from '../../utils/api/definitions/schemas'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import normalizeLivingCountry from '../../utils/api/helpers/countryUtils'
import {
  buildFieldData,
  buildVisibleFields,
} from '../../utils/api/helpers/fieldUtils'

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
    const params = Joi.attempt(req.query, RequestSchema, {
      abortEarly: false,
    })
    console.log('Passed validation.')

    // processing
    const resultOas = checkOas(params)
    console.log('OAS Result: ', resultOas)

    const resultGis = checkGis(params, resultOas)
    console.log('GIS Result: ', resultGis)

    const resultAllowance = checkAllowance(params)
    console.log('Allowance Result: ', resultAllowance)

    const resultAfs = checkAfs(params)
    console.log('Allowance for Survivor Result: ', resultAfs)

    const visibleFields: Array<FieldKey> = buildVisibleFields([
      Object.keys(params) as Array<FieldKey>,
      resultOas.missingFields,
      resultGis.missingFields,
      resultAllowance.missingFields,
      resultAfs.missingFields,
    ])

    const fieldData: Array<FieldData> = buildFieldData(visibleFields)

    // completion
    res.status(200).json({
      oas: resultOas,
      gis: resultGis,
      allowance: resultAllowance,
      afs: resultAfs,
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
