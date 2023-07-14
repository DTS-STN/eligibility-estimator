import { consoleDev } from '../web/helpers/utils'
import { BenefitHandler } from './benefitHandler'
import { MaritalStatus, ResultKey } from './definitions/enums'
import { RequestSchema as schema } from './definitions/schemas'
import { ResponseError, ResponseSuccess } from './definitions/types'
import { buildQuery, getAgeArray, getEligibleBenefits } from './helpers/utils'

function getFutureResults(query, locale) {
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
    const age = Number(query.age)
    const partnerAge = Number(query.partnerAge)
    const ageFloored = Math.floor(age)
    const partnerAgeFloored = Math.floor(partnerAge)

    const ageFraction = [age - ageFloored, partnerAge - partnerAgeFloored]

    const ages = [ageFloored, partnerAgeFloored]
    if (ages.some((age) => isNaN(age))) return futureResultsObj
    const futureAges = getAgeArray(ages)

    if (futureAges.length !== 0) {
      const clientResults = []
      const partnerResults = []
      let benefitCounter = { oas: 0, gis: 0, alw: 0, alws: 0 }

      futureAges.forEach((ageSet) => {
        const [userAge, partnerAge] = ageSet
        const newQuery = buildQuery(query, ageSet, ageFraction)
        const { value } = schema.validate(newQuery, { abortEarly: false })
        const futureHandler = new BenefitHandler(value, true)

        const clientEligibleBenefits = getEligibleBenefits(
          futureHandler.benefitResults.client
        )

        if (clientEligibleBenefits) {
          Object.keys(clientEligibleBenefits).forEach((benefit) => {
            benefitCounter[benefit] += 1
          })
        }

        const partnerEligibleBenefits = getEligibleBenefits(
          futureHandler.benefitResults.partner
        )

        if (clientEligibleBenefits) {
          clientResults.push({ [userAge]: clientEligibleBenefits })
        }
        if (partnerEligibleBenefits) {
          partnerResults.push({ [partnerAge]: partnerEligibleBenefits })
        }
      })

      // TEMPORARY: For any benefit that appears twice in future estimates, add text to indicate that these results may be different in the future since BenefitCards component will only show one occurence of each benefit.
      Object.keys(benefitCounter).forEach((benefit) => {
        if (benefitCounter[benefit] > 1) {
          const val = Object.values(clientResults[0])[0]
          const mainText = val[benefit].cardDetail.mainText
          const textToAdd =
            locale === 'en'
              ? `This may change in the future based on your situation.`
              : `Ceci pourrait changer dans l'avenir selon votre situation.`

          val[benefit].cardDetail.mainText = textToAdd + '</br></br>' + mainText
        }
      })

      futureResultsObj = {
        client: clientResults.length !== 0 ? clientResults : null,
        partner: partnerResults.length !== 0 ? partnerResults : null,
      }
    }
  }

  return futureResultsObj
}

// this is intended to be the main entrypoint of the benefit processor logic
export default class MainHandler {
  readonly handler: BenefitHandler
  readonly futureHandler: BenefitHandler
  readonly locale: string
  readonly results: ResponseSuccess | ResponseError
  constructor(query: { [key: string]: string | string[] }) {
    const { error, value } = schema.validate(query, { abortEarly: false })

    // Provides results for current age
    this.handler = new BenefitHandler(value)

    // Future planning
    const futureResults = getFutureResults(query, value._language)

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

// value // when calculatng PRESENT
age: 65.17
income: 0
invSeparated: false
legalStatus: 'yes'
livedOnlyInCanada: true
livingCountry: 'CAN'
maritalStatus: 'partnered'
partnerAge: 70.5
partnerBenefitStatus: 'none'
partnerIncome: 4000
partnerLegalStatus: 'yes'
partnerLivedOnlyInCanada: true
partnerLivingCountry: 'CAN'
receiveOAS: false
_language: 'en'

// newValue // when calculating FUTURE
age: 65.17
income: 0
invSeparated: false
legalStatus: 'yes'
livedOnlyInCanada: true
livingCountry: 'CAN'
maritalStatus: 'partnered'
partnerAge: 70.5
partnerBenefitStatus: 'none'
partnerIncome: 4000
partnerLegalStatus: 'yes'
partnerLivedOnlyInCanada: true
partnerLivingCountry: 'CAN'
receiveOAS: false
_language: 'en'
