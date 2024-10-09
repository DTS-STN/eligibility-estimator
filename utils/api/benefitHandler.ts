import { consoleDev } from '../web/helpers/utils'
import { AlwBenefit } from './benefits/alwBenefit'
import { AlwsBenefit } from './benefits/alwsBenefit'
import { GisBenefit } from './benefits/gisBenefit'
import { OasBenefit } from './benefits/oasBenefit'
import { BaseBenefit } from './benefits/_base'
import {
  BenefitKey,
  EntitlementResultType,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from './definitions/enums'
import {
  BenefitResult,
  BenefitResultsObjectWithPartner,
  EntitlementResultGeneric,
  ProcessedInputWithPartner,
  RequestInput,
  SummaryObject,
} from './definitions/types'
import { FieldsHandler } from './fieldsHandler'
import { evaluateOASInput, OasEligibility } from './helpers/utils'
import { InvSeparatedAllCases } from './invSeparated'
import legalValues from './scrapers/output'
import { SummaryHandler } from './summaryHandler'

export class BenefitHandler {
  private _benefitResults: BenefitResultsObjectWithPartner
  private _summary: SummaryObject
  private _partnerSummary: SummaryObject
  private input: ProcessedInputWithPartner
  fields: FieldsHandler
  future: Boolean
  compare: Boolean
  formAge: number
  formYearsInCanada: number

  constructor(
    readonly rawInput: Partial<RequestInput>,
    future?: Boolean,
    formAge?: number,
    formYearsInCanada?: number,
    compare: Boolean = true
  ) {
    this.fields = new FieldsHandler(rawInput)
    this.input = this.fields.input
    this.future = future
    this.compare = compare
    this.formAge = formAge
    this.formYearsInCanada = formYearsInCanada
  }

  get benefitResults(): BenefitResultsObjectWithPartner {
    if (this._benefitResults === undefined) {
      this._benefitResults = this.getBenefitResultObject()
      this.translateResults()
    }
    return this._benefitResults
  }

  get summary(): SummaryObject {
    if (this._summary === undefined) {
      this._summary = SummaryHandler.buildSummaryObject(
        this.input,
        this.benefitResults.client,
        Object.fromEntries(
          Object.entries(this.benefitResults.partner).filter(
            (e) => e[0] != 'alws'
          )
        ),
        this.fields.missingFields,
        this.fields.translations
      )
      this._summary.details = this.fields.replaceTextVariables(
        this,
        this._summary.details
      )
    }
    return this._summary
  }

  /**
   * Returns the BenefitResultObject based on the user's input.
   * If any fields are missing, return no results.
   */
  private getBenefitResultObject(): BenefitResultsObjectWithPartner {
    if (this.fields.missingFields.length) {
      return { client: {}, partner: {} }
    }

    function getBlankObject(benefitKey: BenefitKey) {
      return {
        benefitKey: benefitKey,
        eligibility: undefined,
        entitlement: undefined,
        cardDetail: undefined,
      }
    }

    const allResults: BenefitResultsObjectWithPartner = {
      client: {
        oas: getBlankObject(BenefitKey.oas),
        gis: getBlankObject(BenefitKey.gis),
        alw: getBlankObject(BenefitKey.alw),
        alws: getBlankObject(BenefitKey.alws),
      },
      partner: {
        oas: getBlankObject(BenefitKey.oas),
        gis: getBlankObject(BenefitKey.gis),
        alw: getBlankObject(BenefitKey.alw),
        alws: getBlankObject(BenefitKey.alws),
      },
    }

    const initialPartnerBenefitStatus =
      this.input.client.partnerBenefitStatus.value

    // saving the original input value for residence
    if (this.formYearsInCanada === undefined)
      this.formYearsInCanada = this.input.client.yearsInCanadaSince18

    console.log(
      '### curr resid=',
      this.input.client.yearsInCanadaSince18,
      'future',
      this.future,
      'form age',
      this.formAge,
      'form resid',
      this.formYearsInCanada,
      '###'
    )

    // Future handler takes care of cases when partner is not yet eligible by creating "age sets" of future eligible ages
    // If partner was already eligible in the past based on residency, we need to adjust the inputs
    if (!this.future) {
      const partnerEliObj = OasEligibility(
        this.input.partner.age,
        this.input.partner.yearsInCanadaSince18,
        this.input.partner.livedOnlyInCanada,
        this.rawInput.partnerLivingCountry
      )

      if (this.input.partner.age > partnerEliObj.ageOfEligibility) {
        if (this.input.partner.age < 75) {
          this.input.partner.age = partnerEliObj.ageOfEligibility
          this.input.partner.yearsInCanadaSince18 =
            partnerEliObj.yearsOfResAtEligibility
        }

        if (this.input.partner.age >= 75) {
          this.input.partner.yearsInCanadaSince18 =
            partnerEliObj.yearsOfResAtEligibility
        }
      }
    }

    // Check OAS. Does both Eligibility and Entitlement, as there are no dependencies.
    // Calculate OAS with and without deferral so we can compare totals and present more beneficial result

    if (this.input.client.receiveOAS && !this.input.client.livedOnlyInCanada) {
      const yearsInCanada =
        Number(this.input.client.yearsInCanadaSinceOAS) ||
        Number(this.input.client.yearsInCanadaSince18)
      const oasDefer =
        this.input.client.oasDeferDuration || '{"months":0,"years":0}'
      const deferralDuration = JSON.parse(oasDefer)
      const deferralYrs = deferralDuration.years
      const deferralMonths = deferralDuration.months

      this.input.client.yearsInCanadaSince18 = Math.floor(
        yearsInCanada - (deferralYrs + deferralMonths / 12)
      )
    }

    consoleDev(
      '>>> benefitHandler',
      this.input.client.startDateForOAS,
      'NewResidYrs',
      this.input.client.yearsInCanadaSince18,
      'oasDeferDuration',
      this.input.client.oasDeferDuration,
      'future',
      this.future
    )

    // If client selected a when to start OAS date then the client accumulates some extra months of residency
    //  if date to start is greater than 12 months
    //     full yrs are added to the residence
    //     partial months are added as a deferral months
    if (
      this.input.client.whenToStartOAS !== undefined &&
      !this.input.client.whenToStartOAS &&
      !this.future
    ) {
      let futureMonths = this.input.client.startDateForOAS * 12 * -1

      this.input.client.yearsInCanadaSince18 =
        this.input.client.yearsInCanadaSince18 +
        Math.floor(Math.round(futureMonths) / 12)

      this.input.client.oasDeferDuration = `{"months":${Math.round(
        futureMonths % 12
      )}, "years": 0}`

      consoleDev(
        '>>> MAX RESIDENCY startDateforOAS=',
        this.input.client.startDateForOAS,
        'months=',
        futureMonths,
        'form Resid',
        this.formYearsInCanada,
        'NewResidYrs',
        this.input.client.yearsInCanadaSince18,
        'oasDeferDuration',
        this.input.client.oasDeferDuration
      )
    }

    const clientOasNoDeferral = new OasBenefit(
      this.input.client,
      this.fields.translations,
      false,
      this.future,
      false,
      this.input.client.age,
      this.formAge,
      this.formYearsInCanada
    )

    // If the client needs help, check their partner's OAS.
    // no defer and defer options?
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerOasNoDeferral = new OasBenefit(
        this.input.partner,
        this.fields.translations,
        true
      )

      this.setValueForAllResults(
        allResults,
        'partner',
        'oas',
        partnerOasNoDeferral
      )
      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's GIS
      this.input.client.partnerBenefitStatus.oasResultEntitlement =
        partnerOasNoDeferral.entitlement
      // Save the client result to the partner's partnerBenefitStatus field, which is not yet used for anything
      this.input.partner.partnerBenefitStatus.oasResultEntitlement =
        clientOasNoDeferral.entitlement
    }

    //consoleDev('NO DEFERRAL', clientOasNoDeferral)
    consoleDev(
      'Client OAS amount NO deferral',
      clientOasNoDeferral.entitlement.result
    )

    // Previous calculations changes the value of yearsInCanadaSince18
    //  this restores the original value when needed
    if (
      this.input.client.whenToStartOAS !== undefined &&
      !this.input.client.whenToStartOAS
    ) {
      console.log('yearsInCanada before', this.input.client.yearsInCanadaSince18)
      this.input.client.yearsInCanadaSince18 = this.formYearsInCanada
      console.log('yearsInCanada after', this.input.client.yearsInCanadaSince18)
    }

    // Determines if it is possible to defer OAS and provides useful properties such as new inputs and deferral months to calculate the OAS deferred case
    const clientOasHelper = evaluateOASInput(this.input.client, this.formAge)

    consoleDev(
      '>>> MAX DEFERRAL startDateforOAS=',
      clientOasHelper.newInput.startDateForOAS,
      'age',
      clientOasHelper.newInput.age,
      'ResidYrs',
      clientOasHelper.newInput.yearsInCanadaSince18,
      'oasDeferDuration',
      clientOasHelper.newInput.oasDeferDuration
    )

    let clientOasWithDeferral
    if (clientOasHelper.canDefer) {
      // consoleDev(
      //   'Modified input to calculate OAS with deferral',
      //   clientOasHelper.newInput
      // )

      clientOasWithDeferral = new OasBenefit(
        clientOasHelper.newInput,
        this.fields.translations,
        false,
        this.future,
        true,
        this.input.client.age
      )

      //consoleDev('WITH DEFERRAL', clientOasWithDeferral)
      consoleDev(
        'Client OAS amount WITH deferral',
        clientOasWithDeferral.entitlement.result
      )
    }

    let clientGisNoDeferral = new GisBenefit(
      this.input.client,
      this.fields.translations,
      clientOasNoDeferral.info,
      false,
      this.future
    )

    consoleDev(
      'Client GIS amount NO deferral',
      clientGisNoDeferral.entitlement.result
    )

    let clientGisWithDeferral
    if (clientOasWithDeferral) {
      clientGisWithDeferral = new GisBenefit(
        clientOasHelper.newInput,
        this.fields.translations,
        clientOasWithDeferral.info,
        false,
        this.future,
        this.input.client
      )

      consoleDev(
        'Client GIS amount WITH deferral',
        clientGisWithDeferral.entitlement.result
      )
    }

    const noDeferTotal =
      clientOasNoDeferral.entitlement.result +
      clientGisNoDeferral.entitlement.result

    consoleDev('TOTAL - NO DEFERRAL', noDeferTotal)

    let deferTotal
    if (clientOasHelper.canDefer) {
      deferTotal =
        clientOasWithDeferral?.entitlement.result +
        clientGisWithDeferral?.entitlement.result

      consoleDev('TOTAL - WITH DEFERRAL', deferTotal)
    }

    // const deferralMoreBeneficial = deferTotal ? deferTotal > noDeferTotal : null

    const deferralMoreBeneficial = clientOasWithDeferral
      ? clientOasWithDeferral.entitlement.result >
        clientOasNoDeferral.entitlement.result
        ? true
        : false
      : false

    consoleDev(
      'CAN DEFER:',
      clientOasHelper.canDefer,
      'MORE BENEFICIAL:',
      deferralMoreBeneficial
    )

    const clientOas =
      deferralMoreBeneficial && this.compare
        ? clientOasWithDeferral
        : clientOasNoDeferral

    let clientGis =
      deferralMoreBeneficial && this.compare
        ? clientGisWithDeferral
        : clientGisNoDeferral

    // Add appropriate meta data info and table
    if (!this.future) {
      if (clientOasHelper.canDefer) {
        if (deferralMoreBeneficial) {
          clientOas.cardDetail.meta = OasBenefit.buildMetadataObj(
            this.input.client.age, // current age
            clientOasHelper.newInput.age, // base age - age when first eligible for OAS
            this.input.client,
            clientOasWithDeferral.eligibility, // 65to74 entitlement is equivalent to entitlement at age of eligibility with years of residency at age of eligibility and 0 months deferral
            clientOasWithDeferral.entitlement,
            this.future
          )
        } else {
          // Scenario when client age is same as eligibility age. They could choose not to receive OAS yet until later so we show the deferral table.
          if (clientOasHelper.justBecameEligible) {
            clientOas.cardDetail.meta = OasBenefit.buildMetadataObj(
              this.input.client.age,
              this.input.client.age,
              this.input.client,
              clientOasNoDeferral.eligibility,
              clientOasNoDeferral.entitlement,
              this.future
            )
          } else {
            clientOas.cardDetail.meta = OasBenefit.buildMetadataObj(
              this.input.client.age, // current age
              clientOasHelper.newInput.age, // base age - age when first eligible for OAS
              this.input.client,
              clientOasWithDeferral.eligibility, // 65to74 entitlement is equivalent to entitlement at age of eligibility with years of residency at age of eligibility and 0 months deferral
              clientOasWithDeferral.entitlement,
              this.future
            )
          }
        }
      } else {
        clientOas.cardDetail.meta = OasBenefit.buildMetadataObj(
          this.input.client.age, // current age
          this.input.client.age, // base age - age when first eligible for OAS
          this.input.client,
          clientOasNoDeferral.eligibility, // 65to74 entitlement is equivalent to entitlement at age of eligibility with years of residency at age of eligibility and 0 months deferral
          clientOasNoDeferral.entitlement,
          this.future
        )
      }
    }

    this.setValueForAllResults(allResults, 'client', 'oas', clientOas)
    this.setValueForAllResults(allResults, 'client', 'gis', clientGis)

    // If the client needs help, check their partner's OAS.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerOas = new OasBenefit(
        this.input.partner,
        this.fields.translations,
        true
      )
      this.setValueForAllResults(allResults, 'partner', 'oas', partnerOas)
      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's GIS
      this.input.client.partnerBenefitStatus.oasResultEntitlement =
        partnerOas.entitlement
      // Save the client result to the partner's partnerBenefitStatus field, which is not yet used for anything
      this.input.partner.partnerBenefitStatus.oasResultEntitlement =
        clientOas.entitlement
    }

    // If the client needs help, check their partner's GIS eligibility.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerGis = new GisBenefit(
        this.input.partner,
        this.fields.translations,
        allResults.partner.oas,
        true
      )
      this.setValueForAllResults(allResults, 'partner', 'gis', partnerGis)
      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's ALW
      this.input.client.partnerBenefitStatus.gisResultEligibility =
        partnerGis.eligibility
      // Save the client result to the partner's partnerBenefitStatus field, which is used for partner's ALW, and therefore client's GIS
      this.input.partner.partnerBenefitStatus.gisResultEligibility =
        clientGis.eligibility
    }

    // Moving onto ALW, again only doing eligibility.
    const clientAlw = new AlwBenefit(
      this.input.client,
      this.fields.translations,
      this.rawInput.partnerLivingCountry,
      false,
      false,
      this.future
    )
    this.setValueForAllResults(allResults, 'client', 'alw', clientAlw)

    // task #115349 overwrite eligibility when conditions are met.
    //              all the conditions below are just to make sure
    //              one and one case is overwritten
    if (
      this.input.client.age >= 60 &&
      this.input.client.age < 65 &&
      this.input.client.livedOnlyInCanada &&
      this.input.client.legalStatus.canadian &&
      this.input.client.yearsInCanadaSince18 >= 10 &&
      this.input.client.income.relevant <= legalValues.alw.alwIncomeLimit &&
      this.input.client.partnerBenefitStatus.value ===
        PartnerBenefitStatus.NONE &&
      allResults.partner.oas.entitlement !== undefined &&
      allResults.partner.gis.entitlement !== undefined &&
      allResults.client.alw.entitlement !== undefined
    ) {
      if (
        allResults.partner.oas.entitlement.result > 0 &&
        allResults.partner.gis.entitlement.result >= 0 &&
        allResults.client.alw.entitlement.result > 0
      ) {
        // overwrite eligibility
        allResults.client.alw.eligibility = {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.NONE,
          detail: this.fields.translations.detail.conditional,
        }
        // cardDetails and remove 'apply...' from the links
        allResults.client.alw.cardDetail.mainText =
          this.fields.translations.detail.alwEligibleButPartnerAlreadyIs
        allResults.client.alw.entitlement.result = 0
        allResults.client.alw.cardDetail.links.splice(0, 1)
      }
    }

    this.input.partner.partnerBenefitStatus =
      this.fields.getPartnerBenefitStatus(clientGis, clientAlw, clientOas)

    // If the client needs help, check their partner's ALW eligibility.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerAlw = new AlwBenefit(
        this.input.partner,
        this.fields.translations,
        this.rawInput.livingCountry,
        true
      )
      this.setValueForAllResults(allResults, 'partner', 'alw', partnerAlw)
      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's GIS
      this.input.client.partnerBenefitStatus.alwResultEligibility =
        partnerAlw.eligibility
      // Save the client result to the partner's partnerBenefitStatus field, which is not yet used for anything
      this.input.partner.partnerBenefitStatus.alwResultEligibility =
        clientAlw.eligibility
    }

    // Moving onto AFS, again only doing eligibility.
    const clientAlws = new AlwsBenefit(
      this.input.client,
      this.fields.translations,
      this.future
    )
    allResults.client.alws.eligibility = clientAlws.eligibility

    const partnerAlw = new AlwBenefit(
      this.input.partner,
      this.fields.translations,
      this.rawInput.livingCountry,
      true
    )
    this.setValueForAllResults(allResults, 'partner', 'alw', partnerAlw)

    // this line overrides the partner value that's defaults to oasGis regardless.
    this.input.partner.partnerBenefitStatus.value =
      this.input.client.partnerBenefitStatus.value

    const partnerOas = new OasBenefit(
      this.input.partner,
      this.fields.translations,
      true
    )
    this.setValueForAllResults(allResults, 'partner', 'oas', partnerOas)

    let partnerGis = new GisBenefit(
      this.input.partner,
      this.fields.translations,
      allResults.partner.oas,
      true
    )
    this.setValueForAllResults(allResults, 'partner', 'gis', partnerGis)

    this.input.client.partnerBenefitStatus =
      this.fields.getPartnerBenefitStatus(partnerGis, partnerAlw, partnerOas)

    if (this.input.client.partnerBenefitStatus.alw) {
      clientGis.eligibility.incomeMustBeLessThan =
        legalValues.gis.spouseAlwIncomeLimit

      clientGis = new GisBenefit(
        this.input.client,
        this.fields.translations,
        allResults.client.oas,
        false,
        this.future
      )
      this.setValueForAllResults(allResults, 'client', 'gis', clientGis)
    }

    // Now that the above dependencies are satisfied, we can do GIS entitlement.
    // deal with involuntary separated scenario
    if (
      this.input.client.invSeparated &&
      this.input.client.maritalStatus.partnered
    ) {
      //
      // All cases for InvSeparated moved to another file to made this one smaller

      InvSeparatedAllCases(
        clientOas,
        clientGis,
        clientAlw,
        clientAlws,
        partnerOas,
        partnerGis,
        partnerAlw,
        initialPartnerBenefitStatus,
        this.future,
        this.input,
        this.rawInput,
        allResults
      )
    } else {
      allResults.client.gis.entitlement = clientGis.entitlement

      // Continue with ALW entitlement.
      allResults.client.alw.entitlement = clientAlw.entitlement

      // Finish with AFS entitlement.
      allResults.client.alws.entitlement = clientAlws.entitlement

      // Process all CardDetails
      allResults.client.oas.cardDetail = clientOas.cardDetail
      allResults.client.gis.cardDetail = clientGis.cardDetail
      allResults.client.alw.cardDetail = clientAlw.cardDetail
      allResults.client.alws.cardDetail = clientAlws.cardDetail
    }

    // All done!
    return allResults
  }

  private setValueForAllResults(
    allResults: BenefitResultsObjectWithPartner,
    prop: string,
    benefitName: string,
    benefit: BaseBenefit<EntitlementResultGeneric>
  ): void {
    allResults[prop][benefitName].eligibility = benefit.eligibility
    allResults[prop][benefitName].entitlement = benefit.entitlement
    allResults[prop][benefitName].cardDetail = benefit.cardDetail
  }

  /**
   * Takes a BenefitResultsObjectWithPartner, and translates the detail property based on the provided translations.
   * If the entitlement result provides a NONE type, that will override the eligibility result.
   */
  private translateResults(): void {
    for (const individualBenefits in this.benefitResults) {
      let clawbackValue: number

      for (const key in this.benefitResults[individualBenefits]) {
        const result: BenefitResult =
          this.benefitResults[individualBenefits][key]

        if (!result || !result?.eligibility) continue
        // if initially the eligibility was ELIGIBLE, yet the entitlement is determined to be NONE, override the eligibility.
        // this happens when high income results in no entitlement.
        // this If block was copied to _base and probably not required anymore.
        if (
          result.eligibility.result === ResultKey.ELIGIBLE &&
          result.entitlement.type === EntitlementResultType.NONE
        ) {
          //result.eligibility.result = ResultKey.INELIGIBLE
          result.eligibility.reason = ResultReason.INCOME
          result.eligibility.detail =
            this.fields.translations.detail.mustMeetIncomeReq
        }

        // process detail result
        result.eligibility.detail = FieldsHandler.capitalizeEachLine(
          this.fields.replaceTextVariables(
            this,
            result.eligibility.detail,
            result
          )
        )

        // clawback is only valid for OAS
        // This adds the oasClawback text as requested.
        let newMainText = result.cardDetail.mainText

        // process card main text
        result.cardDetail.mainText = FieldsHandler.capitalizeEachLine(
          this.fields.replaceTextVariables(this, newMainText, result)
        )

        // process card collapsed content
        result.cardDetail.collapsedText = result.cardDetail.collapsedText.map(
          (collapsedText) => ({
            heading: this.fields.replaceTextVariables(
              this,
              collapsedText.heading,
              result
            ),
            text: this.fields.replaceTextVariables(
              this,
              collapsedText.text,
              result
            ),
          })
        )
      }
    }
  }
}
