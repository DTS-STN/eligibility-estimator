import Joi from 'joi'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResultKey } from '../../utils/api/definitions/enums'
import { RequestSchema } from '../../utils/api/definitions/schemas'
import {
  RequestInput,
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { RequestHandler } from '../../utils/api/helpers/requestHandler'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSuccess | ResponseError>
) {
  try {
    console.log(`Processing request: `, req.query)

    // validation
    const requestInput: RequestInput = Joi.attempt(req.query, RequestSchema, {
      abortEarly: false,
    })

    // processing
    const handler = new RequestHandler(requestInput)
    console.log('Results: ', handler.benefitResults)

    // completion
    res.status(200).json({
      results: handler.benefitResults,
      summary: handler.summary,
      visibleFields: handler.requiredFields,
      missingFields: handler.missingFields,
      fieldData: handler.fieldData,
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
