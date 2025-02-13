import { BenefitHandler } from './benefitHandler'
import { MaritalStatus, ResultKey } from './definitions/enums'
import { RequestSchema as schema } from './definitions/schemas'
import {
  buildQuery,
  getAgeArray,
  OasEligibility,
  AlwsEligibility,
} from './helpers/utils'

export class FutureHandler {
  currentHandler: BenefitHandler
  maritalStatus: string
  query: { [key: string]: string | string[] }
  newQuery: { [key: string]: string | string[] }
  locale: string
  futureResultsObj: any
  constructor(currentHandler, query, locale) {
    this.currentHandler = currentHandler
    this.maritalStatus = query.maritalStatus
    this.query = query
    this.newQuery = { ...query }
    this.locale = locale
    this.futureResultsObj = { client: null, partner: null }
  }

  get benefitResults() {
    if (this.maritalStatus === MaritalStatus.SINGLE) {
      this.futureResultsObj = this.getSingleResults()
    } else if (this.maritalStatus === MaritalStatus.WIDOWED) {
      this.futureResultsObj = this.getWidowedResults()
    } else if (this.maritalStatus === MaritalStatus.PARTNERED) {
      this.futureResultsObj = this.getPartneredResults()
    }

    return this.futureResultsObj
  }

  private getSingleResults() {
    let result = this.futureResultsObj
    const yearsInCanada = Number(this.query.yearsInCanadaSince18)
    const age = Number(this.query.age)
    // TODO: take into consideration whether in Canada or not? (could be 10 or 20)
    const residencyReq = 10
    let futureAge

    // No future benefits if 65 or over AND years in Canada already meets residency criteria
    // An exception to this is when being called from PSDBox component since pension start date is always in the future even if the client is currently eligible
    if (age >= 65 && yearsInCanada >= residencyReq && !this.query.psdAge)
      return result

    if (this.query.psdAge) {
      futureAge = this.query.psdAge
      const newResidence =
        Number(this.query.psdAge) -
        Number(this.query.age) +
        Number(this.query.yearsInCanadaSince18)
      this.newQuery['age'] = String(this.query.psdAge)
      this.newQuery['receiveOAS'] = 'false'

      if (
        this.query.livedOnlyInCanada === 'false' &&
        this.query.yearsInCanadaSince18
      ) {
        this.newQuery['yearsInCanadaSince18'] = String(newResidence)
      }
    } else {
      const eliObj = OasEligibility(
        age,
        yearsInCanada,
        this.query.livedOnlyInCanada === 'true',
        String(this.query.livingCountry)
      )

      futureAge = eliObj.ageOfEligibility

      this.newQuery['age'] = String(eliObj.ageOfEligibility)
      this.newQuery['receiveOAS'] = 'false'

      if (
        this.query.livedOnlyInCanada === 'false' &&
        this.query.yearsInCanadaSince18
      ) {
        this.newQuery['yearsInCanadaSince18'] = String(
          Math.min(40, eliObj.yearsOfResAtEligibility)
        )
      }
    }

    console.log('this.query IN FUTURE HANDLER', this.newQuery)

    const { value } = schema.validate(this.newQuery, { abortEarly: false })
    const handler = new BenefitHandler(
      value,
      true,
      +this.query.age,
      +this.query.yearsInCanadaSince18
    )

    const eligibleBenefits = this.getEligibleBenefits(
      handler.benefitResults.client
    )

    const clientResult = eligibleBenefits
      ? [{ [futureAge]: eligibleBenefits }]
      : null

    result = {
      ...this.futureResultsObj,
      client: clientResult,
    }

    return result
  }

  private getWidowedResults() {
    let result = this.futureResultsObj
    const age = Number(this.query.age)
    const yearsInCanada = Number(this.query.yearsInCanadaSince18)
    const residencyReq = 10
    const psdAge = this.query.psdAge

    console.log('age', age)
    console.log('yearsInCanada', yearsInCanada)
    console.log('psdAge', psdAge)

    // No future benefits if 65 or over AND years in Canada already meets residency criteria
    if (age >= 65 && yearsInCanada >= residencyReq && !this.query.psdAge)
      return result

    const eliObjOas = OasEligibility(
      age,
      yearsInCanada,
      this.query.livedOnlyInCanada === 'true',
      String(this.query.livingCountry)
    )

    const oasAge = psdAge ? psdAge : eliObjOas.ageOfEligibility

    const eliObjAlws = AlwsEligibility(Math.floor(age), yearsInCanada)
    const alwsAge = eliObjAlws.ageOfEligibility

    const futureAges = [alwsAge, oasAge].filter((age) => !!age)
    const clientResult =
      futureAges.length !== 0
        ? futureAges
            .map((age) => {
              this.newQuery['age'] = age

              if (age === oasAge) {
                this.newQuery['receiveOAS'] = 'false'
              }

              if (
                this.query.livedOnlyInCanada === 'false' &&
                this.query.yearsInCanadaSince18
              ) {
                this.newQuery['yearsInCanadaSince18'] = psdAge
                  ? String(
                      Number(this.query.psdAge) -
                        Number(this.query.age) +
                        Number(this.query.yearsInCanadaSince18)
                    )
                  : String(Math.min(40, eliObjOas.yearsOfResAtEligibility))
              }

              const { value } = schema.validate(this.newQuery, {
                abortEarly: false,
              })

              console.log(
                'this.newQuery passed to benefit handler',
                this.newQuery
              )
              const handler = new BenefitHandler(
                value,
                true,
                +this.query.age,
                +this.query.yearsInCanadaSince18
              )

              const eligibleBenefits = this.getEligibleBenefits(
                handler.benefitResults.client
              )

              return eligibleBenefits ? { [age]: eligibleBenefits } : null
            })
            .filter((result) => result !== null)
        : null

    return {
      ...this.futureResultsObj,
      client: clientResult,
    }
  }

  private getPartneredResults() {
    // input that comes in is
    // age: 65
    // res: 25
    // partnerAge: 61.33
    // partherRes: FULL
    // typically age sets will return [68.67, 65]. When the 68.67 OAS is calculated, the inputs are:

    const age = Number(this.query.age)
    const partnerAge = Number(this.query.partnerAge)

    const clientRes =
      Number(this.query.yearsInCanadaSince18) ||
      Number(this.query.yearsInCanadaSinceOAS)
    const partnerRes =
      Number(this.query.partnerYearsInCanadaSince18) ||
      Number(this.query.partnerYearsInCanadaSinceOAS)

    const partnerOnlyCanada = this.query.partnerLivedOnlyInCanada

    const clientDeferralMeta =
      this.currentHandler.benefitResults?.client?.oas?.entitlement?.deferral
    const partnerDeferralMeta =
      this.currentHandler.benefitResults?.partner?.oas?.entitlement?.deferral

    const partnerCurrentOasEligibility =
      this.currentHandler.benefitResults?.partner?.oas?.eligibility

    let partnerAlreadyOasEligible = false
    if (partnerCurrentOasEligibility) {
      partnerAlreadyOasEligible =
        partnerCurrentOasEligibility?.result === ResultKey.ELIGIBLE ||
        partnerCurrentOasEligibility?.result === ResultKey.INCOME_DEPENDENT
    }

    const currentOasEligibility =
      this.currentHandler.benefitResults.client.oas?.eligibility

    let clientAlreadyOasEligible = false
    if (currentOasEligibility) {
      clientAlreadyOasEligible =
        currentOasEligibility?.result === ResultKey.ELIGIBLE ||
        currentOasEligibility?.result === ResultKey.INCOME_DEPENDENT
    }

    const ages = [age, partnerAge]
    if (ages.some((age) => isNaN(age))) return this.futureResultsObj

    const agesInputObj = {
      client: {
        age,
        res: this.query.livedOnlyInCanada === 'true' ? 40 : clientRes,
      },
      partner: {
        age: partnerAge,
        res:
          partnerOnlyCanada === 'true' || partnerAge < 60
            ? 40
            : partnerRes || 0,
      },
    }

    const futureAges = getAgeArray(agesInputObj)

    // const psdAge = Number(this.query.psdAge)
    // const psdClientAge = psdAge
    // const yrsDiff = psdClientAge - age
    // const psdPartnerAge = partnerAge + yrsDiff

    console.log('futureAges', futureAges)
    let result = this.futureResultsObj
    if (futureAges.length !== 0) {
      const clientResults = []
      const partnerResults = []
      let benefitCounter = { oas: 0, gis: 0, alw: 0, alws: 0 }

      let clientLockResidence
      let partnerLockResidence

      futureAges.forEach((ageSet) => {
        console.log('ageSet', ageSet)
        const [userAge, partnerAge] = ageSet // 68/64.3 (original input query is still 65/61.33)

        const newQuery = buildQuery(
          this.query,
          ageSet,
          clientDeferralMeta,
          partnerDeferralMeta,
          clientAlreadyOasEligible,
          partnerAlreadyOasEligible,
          clientLockResidence,
          partnerLockResidence
        )

        const { value } = schema.validate(newQuery, { abortEarly: false })
        const handler = new BenefitHandler(
          value,
          true,
          +this.query.age,
          +this.query.yearsInCanadaSince18,
          false // this.compare boolean set to false means that we disregard the comparison between 'non-deferred' and 'deferred'. The non-deferred results are saved
        )

        // if (psdAge) {
        //   const yrsDiff = psdAge - age
        //   newQuery['yearsInCanadaSince18'] =
        //     +this.query.yearsInCanadaSince18 + yrsDiff
        // }

        const clientEligibleBenefits = this.getEligibleBenefits(
          handler.benefitResults.client
        )

        if (clientEligibleBenefits) {
          Object.keys(clientEligibleBenefits).forEach((benefit) => {
            benefitCounter[benefit] += 1
          })
        }

        const partnerEligibleBenefits = this.getEligibleBenefits(
          handler.benefitResults.partner
        )

        // Lock residence if this calculation produces an OAS/GIS result. We need to use the same number of years for subsequent OAS/GIS results if there are any
        if (clientEligibleBenefits) {
          const oasEligible =
            handler.benefitResults?.client?.oas?.eligibility?.result ===
              ResultKey.ELIGIBLE ||
            handler.benefitResults?.client?.oas?.eligibility?.result ===
              ResultKey.INCOME_DEPENDENT

          if (oasEligible) {
            clientLockResidence = this.query['yearsInCanadaSince18']
          }
        }

        if (partnerEligibleBenefits) {
          const oasEligible =
            handler.benefitResults?.partner?.oas?.eligibility?.result ===
              ResultKey.ELIGIBLE ||
            handler.benefitResults?.partner?.oas?.eligibility?.result ===
              ResultKey.INCOME_DEPENDENT

          if (oasEligible) {
            partnerLockResidence = this.query['partnerYearsInCanadaSince18']
          }
        }

        // Add future results if available
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

          if (val[benefit]?.cardDetail?.mainText !== undefined) {
            const mainText = val[benefit].cardDetail.mainText
            const textToAdd =
              this.locale === 'en'
                ? `This may change in the future based on your situation.`
                : `Ceci pourrait changer dans l'avenir selon votre situation.`

            val[benefit].cardDetail.mainText =
              textToAdd + '</br></br>' + mainText
          }
        }
      })

      result = {
        client: clientResults.length !== 0 ? clientResults : null,
        partner: partnerResults.length !== 0 ? partnerResults : null,
      }
    }
    console.log('result as returned in the FUTURE HANDLER', result)
    return result
  }

  private getEligibleBenefits(benefits) {
    const newObj = {}
    for (const key in benefits) {
      if (benefits[key].eligibility?.result === 'eligible') {
        newObj[key] = benefits[key]
      }
    }
    return Object.keys(newObj).length === 0 ? null : newObj
  }
}
