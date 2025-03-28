import { BenefitHandler } from './benefitHandler'
import { MaritalStatus, ResultKey } from './definitions/enums'
import { RequestSchema as schema } from './definitions/schemas'
import {
  buildQuery,
  getAgeArray,
  OasEligibility,
  AlwsEligibility,
  getEligibleBenefits,
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
    const livedOnlyInCanada = this.query.livedOnlyInCanada === 'true'
    const yearsInCanada = livedOnlyInCanada
      ? 40
      : Number(this.query.yearsInCanadaSince18)
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
        livedOnlyInCanada,
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

    const { value } = schema.validate(this.newQuery, { abortEarly: false })
    const handler = new BenefitHandler(
      value,
      true,
      +this.query.age,
      +this.query.yearsInCanadaSince18
    )

    const eligibleBenefits = getEligibleBenefits(handler.benefitResults.client)

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
    const livedOnlyInCanada = this.query.livedOnlyInCanada === 'true'
    const yearsInCanada = livedOnlyInCanada
      ? 40
      : Number(this.query.yearsInCanadaSince18)
    const residencyReq = 10
    const psdAge = this.query.psdAge

    // No future benefits if 65 or over AND years in Canada already meets residency criteria
    if (age >= 65 && yearsInCanada >= residencyReq && !this.query.psdAge)
      return result

    const eliObjOas = OasEligibility(
      age,
      yearsInCanada,
      livedOnlyInCanada,
      String(this.query.livingCountry)
    )

    const oasAge = psdAge ? psdAge : eliObjOas.ageOfEligibility

    const eliObjAlws = AlwsEligibility(age, yearsInCanada)
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

              const handler = new BenefitHandler(
                value,
                true,
                +this.query.age,
                +this.query.yearsInCanadaSince18
              )

              const eligibleBenefits = getEligibleBenefits(
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
    const orgAgeSets = this.query.agesArray
    const orgClientAge = Number(this.query.age)
    const orgPartnerAge = Number(this.query.partnerAge)
    const clientOnlyCanada = this.query.livedOnlyInCanada === 'true'
    const partnerOnlyCanada = this.query.partnerLivedOnlyInCanada === 'true'

    const clientRes = clientOnlyCanada
      ? 40
      : Number(this.query.yearsInCanadaSince18) ||
        Number(this.query.yearsInCanadaSinceOAS)
    const partnerRes = partnerOnlyCanada
      ? 40
      : Number(this.query.partnerYearsInCanadaSince18) ||
        Number(this.query.partnerYearsInCanadaSinceOAS)

    const clientOasEliObj = OasEligibility(
      orgClientAge,
      clientRes,
      clientOnlyCanada,
      String(this.query.livingCountry)
    )

    const partnerEliObj = OasEligibility(
      orgPartnerAge,
      partnerRes,
      partnerOnlyCanada,
      String(this.query.partnerLivingCountry)
    )

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

    const ages = [orgClientAge, orgPartnerAge]
    if (ages.some((age) => isNaN(age))) return this.futureResultsObj

    const agesInputObj = {
      client: {
        age: orgClientAge,
        res: clientRes,
      },
      partner: {
        age: orgPartnerAge,
        res: partnerRes,
      },
    }

    console.log('orgAgeSets', orgAgeSets)
    const futureAges = [...getAgeArray(agesInputObj), ...(orgAgeSets || [])]
      .sort((a, b) => a[0] - b[0])
      .filter(
        (set, index, arr) =>
          index === arr.findIndex((otherSet) => otherSet[0] === set[0])
      )
    console.log('futureAges', futureAges)
    const psdAge = Number(this.query.psdAge)

    let result = this.futureResultsObj
    if (futureAges.length !== 0) {
      const clientResults = []
      const partnerResults = []
      let benefitCounter = { oas: 0, gis: 0, alw: 0, alws: 0 }

      let clientLockResidence
      let partnerLockResidence

      futureAges.forEach((ageSet) => {
        const [userAge, partnerAge] = ageSet

        const newQuery = buildQuery(
          psdAge ? this.query.orgInput : this.query,
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
          psdAge ? +this.query.orgInput['age'] : +this.query.age,
          +this.query.yearsInCanadaSince18,
          false // this.compare boolean set to false means that we disregard the comparison between 'non-deferred' and 'deferred'. The non-deferred results are saved
        )

        let clientEligibleBenefits = getEligibleBenefits(
          handler.benefitResults.client
        )

        if (clientEligibleBenefits) {
          Object.keys(clientEligibleBenefits).forEach((benefit) => {
            benefitCounter[benefit] += 1
          })
        }

        let partnerEligibleBenefits = getEligibleBenefits(
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
            clientLockResidence = psdAge
              ? this.query['yearsInCanadaSince18']
              : newQuery['yearsInCanadaSince18']
          }
        }

        if (partnerEligibleBenefits) {
          const oasEligible =
            handler.benefitResults?.partner?.oas?.eligibility?.result ===
              ResultKey.ELIGIBLE ||
            handler.benefitResults?.partner?.oas?.eligibility?.result ===
              ResultKey.INCOME_DEPENDENT

          if (oasEligible) {
            partnerLockResidence = psdAge
              ? this.query['partnerYearsInCanadaSince18']
              : newQuery['partnerYearsInCanadaSince18']
          }
        }

        if (orgClientAge >= orgPartnerAge) {
          if (
            !partnerEligibleBenefits &&
            userAge != clientOasEliObj.ageOfEligibility &&
            !this.query.psdAge
          ) {
            clientEligibleBenefits = null
          }
        } else {
          if (
            !clientEligibleBenefits &&
            partnerAge != partnerEliObj.ageOfEligibility &&
            !this.query.psdAge
          ) {
            partnerEligibleBenefits = null
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
        if (benefitCounter[benefit] > 1 && clientResults.length > 0) {
          const val = Object.values(clientResults[0])[0] || 0

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

    return result
  }
}
