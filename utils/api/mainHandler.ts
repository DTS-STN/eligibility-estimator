import Joi from 'joi'
import { BenefitHandler } from './benefitHandler'
import { ResultKey } from './definitions/enums'
import { RequestSchema } from './definitions/schemas'
import {
  RequestInput,
  ResponseError,
  ResponseSuccess,
} from './definitions/types'

// this is intended to be the main entrypoint of the benefit processor logic
export default class MainHandler {
  private readonly requestInput: RequestInput
  readonly handler: BenefitHandler
  readonly results: ResponseSuccess | ResponseError
  constructor(query: { [key: string]: string | string[] }) {
    try {
      console.log(`Processing: `, query)
      this.requestInput = Joi.attempt(query, RequestSchema, {
        abortEarly: false,
      })

      this.handler = new BenefitHandler(this.requestInput)
      this.results = {
        results: this.handler.benefitResults,
        summary: this.handler.summary,
        visibleFields: this.handler.requiredFields,
        missingFields: this.handler.missingFields,
        fieldData: this.handler.fieldData,
      }
    } catch (error) {
      this.results = {
        error: ResultKey.INVALID,
        detail: error,
      }
    }
  }
}
