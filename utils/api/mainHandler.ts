import { consoleDev } from '../web/helpers/utils'
import { BenefitHandler } from './benefitHandler'
import { MaritalStatus, ResultKey } from './definitions/enums'
import { RequestSchema as schema } from './definitions/schemas'
import { ResponseError, ResponseSuccess } from './definitions/types'
import { buildQuery, getAgeArray, getEligibleBenefits } from './helpers/utils'

function getFutureResults(query) {
  let futureResultsObj = { client: null, partner: null }

  // SINGLE
  if (query.maritalStatus === MaritalStatus.SINGLE) {
    if (Number(query.age) < 65) {
      const newQuery = { ...query }
      newQuery['age'] = '65'
      newQuery['receiveOAS'] = 'false'

      if (query.livedOnlyInCanada === 'false' && query.yearsInCanadaSince18) {
        newQuery['yearsInCanadaSince18'] = String(
          Math.min(
            40,
            65 -
              Math.floor(Number(query.age)) +
              Number(query.yearsInCanadaSince18)
          )
        )
      }

      const { value } = schema.validate(newQuery, { abortEarly: false })
      const futureHandler = new BenefitHandler(value, true)

      const eligibleBenefits = getEligibleBenefits(
        futureHandler.benefitResults.client
      )

      const clientResult = [{ 65: eligibleBenefits }]

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

            if (age === 65) {
              newQuery['receiveOAS'] = 'false'
            }

            if (
              query.livedOnlyInCanada === 'false' &&
              query.yearsInCanadaSince18
            ) {
              newQuery['yearsInCanadaSince18'] = String(
                Math.min(
                  40,
                  65 -
                    Math.floor(Number(query.age)) +
                    Number(query.yearsInCanadaSince18)
                )
              )
            }

            const { value } = schema.validate(newQuery, { abortEarly: false })
            const futureHandler = new BenefitHandler(value, true)

            const eligibleBenefits = getEligibleBenefits(
              futureHandler.benefitResults.client
            )

            return { [age]: eligibleBenefits }
          })
        : null

    futureResultsObj = {
      ...futureResultsObj,
      client: clientResult,
    }
  }

  // PARTNERED
  if (query.maritalStatus === MaritalStatus.PARTNERED) {
    const ages = [
      Math.floor(Number(query.age)),
      Math.floor(Number(query.partnerAge)),
    ]
    if (ages.some((age) => isNaN(age))) return futureResultsObj
    const futureAges = getAgeArray(ages)

    if (futureAges.length !== 0) {
      console.log('FUTURE AGES ARE', futureAges)
      console.log('SOLUTION GOES HERE!')

      const clientResults = []
      const partnerResults = []
      futureAges.forEach((ageSet) => {
        console.log('ageSet', ageSet)
        const [userAge, partnerAge] = ageSet

        const newQuery = buildQuery(query, ageSet)
        console.log('ageSet', ageSet)
        console.log('newQuery', newQuery)
        // const { value } = schema.validate(newQuery, { abortEarly: false })
        // const futureHandler = new BenefitHandler(value, true)

        // // [{benefitKey: oas, ....}, {}]
        // const clientEligibleBenefits = getEligibleBenefits(
        //   futureHandler.benefitResults.client
        // )
        // const partnerEligibleBenefits = getEligibleBenefits(
        //   futureHandler.benefitResults.partner
        // )

        // clientResults.push({ [userAge]: clientEligibleBenefits })
        // partnerResults.push({ [partnerAge]: partnerEligibleBenefits })
      })

      futureResultsObj = {
        client: clientResults,
        partner: partnerResults,
      }
    }
  }

  console.log('futureResultsObj', futureResultsObj)
  return futureResultsObj
}

// this is intended to be the main entrypoint of the benefit processor logic
export default class MainHandler {
  readonly handler: BenefitHandler
  readonly futureHandler: BenefitHandler
  readonly results: ResponseSuccess | ResponseError
  constructor(query: { [key: string]: string | string[] }) {
    const { error, value } = schema.validate(query, { abortEarly: false })

    // Provides results for current age
    this.handler = new BenefitHandler(value)

    // Future planning
    const futureResults = getFutureResults(query)

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
