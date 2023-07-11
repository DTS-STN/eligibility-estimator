import { consoleDev } from '../web/helpers/utils'
import { BenefitHandler } from './benefitHandler'
import { MaritalStatus, ResultKey } from './definitions/enums'
import { RequestSchema as schema } from './definitions/schemas'
import { ResponseError, ResponseSuccess } from './definitions/types'

function getFutureResults(query) {
  let futureResultsObj = { client: null, partner: null }

  // SINGLE
  if (query.maritalStatus === MaritalStatus.SINGLE) {
    if (Number(query.age) < 65) {
      const newQuery = { ...query }
      newQuery['age'] = '65'
      newQuery['receiveOAS'] = 'false'

      const { value } = schema.validate(newQuery, { abortEarly: false })
      const futureHandler = new BenefitHandler(value)

      const clientResult = [{ 65: futureHandler.benefitResults.client }]

      futureResultsObj = {
        ...futureResultsObj,
        client: clientResult,
      }
    }
  }

  // WIDOWED
  if (query.maritalStatus === MaritalStatus.WIDOWED) {
    const age = Number(query.age)
    let futureAges = []
    if (age < 60) {
      futureAges = [60, 65]
    } else if (age >= 60 && age < 65) {
      futureAges = [65]
    }

    const clientResult =
      futureAges.length !== 0
        ? futureAges.map((age) => {
            const newQuery = { ...query }
            newQuery['age'] = age

            const { value } = schema.validate(newQuery, { abortEarly: false })
            const futureHandler = new BenefitHandler(value)

            return { [age]: futureHandler.benefitResults.client }
          })
        : null

    futureResultsObj = {
      ...futureResultsObj,
      client: clientResult,
    }
  }

  return futureResultsObj
}

// this is intended to be the main entrypoint of the benefit processor logic
export default class MainHandler {
  readonly handler: BenefitHandler
  readonly futureHandler: BenefitHandler
  readonly results: ResponseSuccess | ResponseError
  constructor(query: { [key: string]: string | string[] }) {
    const { error, value } = schema.validate(query, { abortEarly: false })
    console.log('query', query)

    // Provides results for current age
    this.handler = new BenefitHandler(value)

    // Future planning
    const futureResults = getFutureResults(query)

    console.log('futureResults', futureResults)

    const resultObj: any = {
      visibleFields: this.handler.requiredFields,
      results: this.handler.benefitResults.client,
      futureClientResults: futureResults.client,
      partnerResults: this.handler.benefitResults.partner,
      futurePartnerResults: futureResults.partner,
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
