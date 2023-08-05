import { consoleDev } from '../web/helpers/utils'
import { BenefitHandler } from './benefitHandler'
import { ResultKey } from './definitions/enums'
import { RequestSchema as schema } from './definitions/schemas'
import { ResponseError, ResponseSuccess } from './definitions/types'
import { FutureHandler } from './futureHandler'

// this is intended to be the main entrypoint of the benefit processor logic
export default class MainHandler {
  readonly handler: BenefitHandler
  readonly futureHandler: FutureHandler
  readonly locale: string
  readonly results: ResponseSuccess | ResponseError
  constructor(query: { [key: string]: string | string[] }) {
    const { error, value } = schema.validate(query, { abortEarly: false })

    // Provides results for current age
    this.handler = new BenefitHandler(value)

    // Future planning
    this.futureHandler = new FutureHandler(query, this.locale)

    const resultObj: any = {
      visibleFields: this.handler.requiredFields,
      results: this.handler.benefitResults.client,
      futureClientResults: this.futureHandler.benefitResults.client,
      partnerResults: this.handler.benefitResults.partner,
      futurePartnerResults: this.futureHandler.benefitResults.partner,
      summary: this.handler.summary,
      missingFields: this.handler.missingFields,
      fieldData: this.handler.fieldData,
    }

    if (error) {
      resultObj.error = ResultKey.INVALID
      resultObj.detail = error
    }

    consoleDev('result object', resultObj)
    this.results = resultObj
  }
}
