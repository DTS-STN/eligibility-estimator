import type { NextApiRequest, NextApiResponse } from 'next'
import checkAfs from '../../utils/api/checkAfs'
import checkAllowance from '../../utils/api/checkAllowance'
import checkGis from '../../utils/api/checkGis'
import checkOas from '../../utils/api/checkOas'
import {
  RequestSchema,
  ResponseError,
  ResponseSuccess,
  ResultOptions,
} from '../../utils/api/types'

type formField = {
  fieldId: string
  fieldLabel: string
  fieldRequired: boolean
  fieldPlaceholder: string
  fieldType: 'text' | 'number' | 'email' | 'radio' | 'checkbox'
}

type allFieldProposal = {
  // ..other data ...
  fields: formField[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSuccess | ResponseError>
) {
  try {
    console.log(`Processing request: `, req.query)

    // validation
    let { error, value } = RequestSchema.validate(req.query, {
      abortEarly: false,
    })
    if (error) {
      throw error
    }
    console.log('Passed validation.')

    // processing
    const resultOas = checkOas(value)
    console.log('OAS Result: ', resultOas)

    const resultGis = checkGis(value, resultOas)
    console.log('GIS Result: ', resultGis)

    const resultAllowance = checkAllowance(value)
    console.log('Allowance Result: ', resultAllowance)

    const resultAfs = checkAfs(value)
    console.log('Allowance for Survivor Result: ', resultAfs)

    const allFields: Array<String> = [
      ...new Set([
        ...Object.keys(value),
        ...(resultOas.missingFields ? resultOas.missingFields : []),
        ...(resultGis.missingFields ? resultGis.missingFields : []),
        ...(resultAllowance.missingFields ? resultAllowance.missingFields : []),
        ...(resultAfs.missingFields ? resultAfs.missingFields : []),
      ]),
    ]
    console.log('All visible fields:', allFields)

    // completion
    res.status(200).json({
      oas: resultOas,
      gis: resultGis,
      allowance: resultAllowance,
      afs: resultAfs,
      allFields,
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
