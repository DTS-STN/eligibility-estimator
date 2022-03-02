import Joi from 'joi'
import { BenefitProcessor } from './benefitProcessor'
import { ResultKey } from './definitions/enums'
import { RequestSchema } from './definitions/schemas'
import {
  RequestInput,
  ResponseError,
  ResponseSuccess,
} from './definitions/types'

// this is intended to be the main entrypoint of the benefit processor logic
export default class MainProcessor {
  private readonly requestInput: RequestInput
  readonly handler: BenefitProcessor
  readonly results: ResponseSuccess | ResponseError
  constructor(query: { [key: string]: string | string[] }) {
    try {
      console.log(`Processing: `, query)
      this.requestInput = Joi.attempt(query, RequestSchema, {
        abortEarly: false,
      })
      this.handler = new BenefitProcessor(this.requestInput)
      this.results = {
        results: this.handler.benefitResults,
        summary: this.handler.summary,
        visibleFields: this.handler.requiredFields,
        missingFields: this.handler.missingFields,
        fieldData: this.handler.fieldData,
      }
      console.log('Results: ', this.results)
    } catch (error) {
      console.log(error)
      this.results = {
        error: ResultKey.INVALID,
        detail: error.details || String(error),
      }
    }
  }
}
