// this is intended to be the main entrypoint of the benefit processor logic
import Joi from 'joi'
import { BenefitProcessor } from './benefitProcessor'
import { ResultKey } from './definitions/enums'
import { RequestSchema } from './definitions/schemas'
import {
  RequestInput,
  ResponseError,
  ResponseSuccess,
} from './definitions/types'

export function mainProcessor(query: {
  [key: string]: string | string[]
}): ResponseSuccess | ResponseError {
  try {
    console.log(`Processing: `, query)
    const requestInput: RequestInput = Joi.attempt(query, RequestSchema, {
      abortEarly: false,
    })
    const handler = new BenefitProcessor(requestInput)
    const results: ResponseSuccess = {
      results: handler.benefitResults,
      summary: handler.summary,
      visibleFields: handler.requiredFields,
      missingFields: handler.missingFields,
      fieldData: handler.fieldData,
    }
    console.log('Results: ', results)
    return results
  } catch (error) {
    console.log(error)
    return {
      error: ResultKey.INVALID,
      detail: error.details || String(error),
    }
  }
}
