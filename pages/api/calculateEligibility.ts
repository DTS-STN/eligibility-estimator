import Joi from 'joi'
import type { NextApiRequest, NextApiResponse } from 'next'
import checkAfs from '../../utils/api/checkAfs'
import checkAllowance from '../../utils/api/checkAllowance'
import checkGis from '../../utils/api/checkGis'
import checkOas from '../../utils/api/checkOas'
import {
  buildFieldData,
  buildVisibleFields,
  FieldData,
} from '../../utils/api/fieldDefinitions'
import normalizeLivingCountry from '../../utils/api/socialAgreement'
import {
  Fields,
  RequestSchema,
  ResponseError,
  ResponseSuccess,
  ResultOptions,
} from '../../utils/api/types'

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

    const visibleFields = buildVisibleFields([
      Object.keys(params) as Array<Fields>,
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
      error: ResultOptions.INVALID,
      detail: error.details || String(error),
    })
    console.log(error)
    return
  }
}
