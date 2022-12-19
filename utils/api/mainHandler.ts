import { BenefitHandler } from './benefitHandler'
import { ResultKey } from './definitions/enums'
import { RequestSchema as schema } from './definitions/schemas'
import { ResponseError, ResponseSuccess } from './definitions/types'

// this is intended to be the main entrypoint of the benefit processor logic
export default class MainHandler {
  readonly handler: BenefitHandler
  readonly results: ResponseSuccess | ResponseError
  constructor(query: { [key: string]: string | string[] }) {
    const { error, value } = schema.validate(query, { abortEarly: false })
    this.handler = new BenefitHandler(value)

    const resultObj: any = {
      visibleFields: this.handler.requiredFields,
    }

    if (error) {
      resultObj.error = ResultKey.INVALID
      resultObj.detail = error
    } else {
      resultObj.results = this.handler.benefitResults
      resultObj.summary = this.handler.summary
      resultObj.missingFields = this.handler.missingFields
      resultObj.fieldData = this.handler.fieldData
    }

    this.results = resultObj
  }
}
