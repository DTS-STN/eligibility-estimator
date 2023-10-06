import { getTranslations, Translations } from '../../i18n/api'
import { consoleDev } from '../web/helpers/utils'
import { AlwsBenefit } from './benefits/alwsBenefit'
import { AlwBenefit } from './benefits/alwBenefit'
import { GisBenefit } from './benefits/gisBenefit'
import { OasBenefit } from './benefits/oasBenefit'
import { BaseBenefit } from './benefits/_base'
import { InvSeparatedAllCases } from './invSeparated'
import {
  BenefitKey,
  EntitlementResultType,
  Language,
  LegalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from './definitions/enums'
import {
  FieldConfig,
  fieldDefinitions,
  FieldKey,
  FieldType,
} from './definitions/fields'
import { getMinBirthYear } from './definitions/schemas'
import { textReplacementRules } from './definitions/textReplacementRules'
import {
  BenefitResult,
  BenefitResultsObjectWithPartner,
  EntitlementResultGeneric,
  ProcessedInput,
  ProcessedInputWithPartner,
  RequestInput,
  SummaryObject,
} from './definitions/types'
import {
  IncomeHelper,
  LegalStatusHelper,
  LivingCountryHelper,
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from './helpers/fieldClasses'
import legalValues from './scrapers/output'
import { SummaryHandler } from './summaryHandler'
import { evaluateOASInput, OasEligibility } from './helpers/utils'

export class BenefitHandler {
  private _translations: Translations
  private _input: ProcessedInputWithPartner
  private _missingFields: FieldKey[]
  private _requiredFields: FieldKey[]
  private _fieldData: FieldConfig[]
  private _benefitResults: BenefitResultsObjectWithPartner
  private _summary: SummaryObject
  private _partnerSummary: SummaryObject
  future: Boolean
  compare: Boolean

  constructor(
    readonly rawInput: Partial<RequestInput>,
    future?: Boolean,
    compare: Boolean = true
  ) {
    this.future = future
    this.compare = compare
  }

  get translations(): Translations {
    if (this._translations === undefined)
      this._translations = getTranslations(this.rawInput._language)
    return this._translations
  }

  get input(): ProcessedInputWithPartner {
    if (this._input === undefined) this._input = this.getProcessedInput()
    return this._input
  }

  get missingFields(): FieldKey[] {
    if (this._missingFields === undefined)
      this._missingFields = this.getMissingFields()
    return this._missingFields
  }

  get requiredFields(): FieldKey[] {
    if (this._requiredFields === undefined)
      this._requiredFields = this.getRequiredFields()
    return this._requiredFields
  }

  // used only for testing purposes
  set requiredFields(value: FieldKey[]) {
    this._requiredFields = value
  }

  get fieldData(): FieldConfig[] {
    if (this._fieldData === undefined)
      this._fieldData = BenefitHandler.getFieldData(
        this.requiredFields,
        this.translations
      )
    return this._fieldData
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
        this.missingFields,
        this.translations
      )
      this._summary.details = this.replaceTextVariables(this._summary.details)
    }
    return this._summary
  }

  /**
   * Takes the rawInput provided by Joi, and transforms it into a more convenient object to work with.
   * Adds FieldHelpers, normalizes income, adds translations.
   */
  private getProcessedInput(): ProcessedInputWithPartner {
    // shared between partners
    const maritalStatusHelper = new MaritalStatusHelper(
      this.rawInput.maritalStatus
    )

    // shared between partners
    const incomeHelper = new IncomeHelper(
      this.rawInput.incomeAvailable,
      this.rawInput.partnerIncomeAvailable,
      this.rawInput.income,
      this.rawInput.partnerIncome,
      maritalStatusHelper
    )
    const clientInput: ProcessedInput = {
      income: incomeHelper,
      age: this.rawInput.age,
      receiveOAS: this.rawInput.receiveOAS,
      oasDeferDuration:
        this.rawInput.oasDeferDuration ||
        JSON.stringify({ months: 0, years: 0 }),
      oasDefer: this.rawInput.oasDefer,
      oasAge: this.rawInput.oasDefer ? this.rawInput.oasAge : 65,
      maritalStatus: maritalStatusHelper,
      livingCountry: new LivingCountryHelper(this.rawInput.livingCountry),
      legalStatus: new LegalStatusHelper(this.rawInput.legalStatus),
      livedOnlyInCanada: this.rawInput.livedOnlyInCanada,
      // if livedOnlyInCanada, assume yearsInCanadaSince18 is 40
      yearsInCanadaSince18: this.rawInput.livedOnlyInCanada
        ? 40
        : this.rawInput.yearsInCanadaSince18,
      yearsInCanadaSinceOAS: this.rawInput.yearsInCanadaSinceOAS,
      everLivedSocialCountry: this.rawInput.everLivedSocialCountry,
      invSeparated: this.rawInput.invSeparated,
      partnerBenefitStatus: new PartnerBenefitStatusHelper(
        this.rawInput.partnerBenefitStatus
      ),
    }

    const partnerInput: ProcessedInput = {
      income: incomeHelper,
      age: this.rawInput.partnerAge,
      receiveOAS: false, // dummy data
      oasDeferDuration: JSON.stringify({ months: 0, years: 0 }), // dummy data
      oasDefer: false, // pass dummy data because we will never use this anyway
      oasAge: 65, // pass dummy data because we will never use this anyway
      maritalStatus: maritalStatusHelper,
      livingCountry: new LivingCountryHelper(
        this.rawInput.partnerLivingCountry
      ),
      legalStatus: new LegalStatusHelper(this.rawInput.partnerLegalStatus),
      livedOnlyInCanada: this.rawInput.partnerLivedOnlyInCanada,
      yearsInCanadaSince18: this.rawInput.partnerLivedOnlyInCanada //assume 40 when live only in Canada
        ? 40
        : this.rawInput.partnerYearsInCanadaSince18,
      everLivedSocialCountry: false, // required by ProcessedInput
      partnerBenefitStatus: new PartnerBenefitStatusHelper(
        PartnerBenefitStatus.HELP_ME
      ),
      invSeparated: this.rawInput.invSeparated,
    }

    return {
      client: clientInput,
      partner: partnerInput,
      _translations: this.translations,
    }
  }

  /**
   * Accepts the ProcessedInput and builds a list of required fields based on that input.
   * Ordering is not important here.
   */
  private getRequiredFields(): FieldKey[] {
    const requiredFields = [
      // FieldKey.INCOME_AVAILABLE,
      FieldKey.AGE,
      FieldKey.INCOME,
      // FieldKey.OAS_DEFER,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVED_ONLY_IN_CANADA,
    ]

    // OAS deferral related fields
    const clientAge = this.input.client.age
    if (clientAge >= 65 && clientAge <= getMinBirthYear()) {
      requiredFields.push(FieldKey.ALREADY_RECEIVE_OAS)
    }

    if (this.input.client.receiveOAS && clientAge > 65) {
      requiredFields.push(FieldKey.OAS_DEFER_DURATION)
    }

    // default value = undefined
    if (this.input.client.livedOnlyInCanada === false) {
      if (this.input.client.receiveOAS == true) {
        requiredFields.push(FieldKey.YEARS_IN_CANADA_SINCE_OAS)
      } else {
        requiredFields.push(FieldKey.YEARS_IN_CANADA_SINCE_18)
      }
    }

    if (this.input.client.oasDefer) {
      requiredFields.push(FieldKey.OAS_AGE)
    }

    if (
      (this.input.client.livingCountry.canada &&
        this.input.client.yearsInCanadaSince18 < 10) ||
      (!this.input.client.livingCountry.canada &&
        this.input.client.yearsInCanadaSince18 < 20)
    ) {
      requiredFields.push(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    }

    if (
      this.input.client.yearsInCanadaSinceOAS !== undefined &&
      ((this.input.client.livingCountry.canada &&
        this.input.client.yearsInCanadaSinceOAS < 10) ||
        (!this.input.client.livingCountry.canada &&
          this.input.client.yearsInCanadaSinceOAS < 20))
    ) {
      requiredFields.push(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    }

    if (this.input.client.maritalStatus.partnered) {
      //logic is missing, need to be implemented
      requiredFields.push(FieldKey.INV_SEPARATED)
      requiredFields.push(FieldKey.PARTNER_AGE)
      requiredFields.push(FieldKey.PARTNER_INCOME)

      if (this.input.partner.age >= 60) {
        requiredFields.push(FieldKey.PARTNER_LEGAL_STATUS)
      }

      if (
        this.input.partner.legalStatus.value &&
        this.input.partner.legalStatus.value !== LegalStatus.NO
      ) {
        requiredFields.push(
          FieldKey.PARTNER_LIVING_COUNTRY,
          FieldKey.PARTNER_LIVED_ONLY_IN_CANADA
        )
      }

      // default value = undefined
      if (this.input.partner.livedOnlyInCanada === false) {
        requiredFields.push(FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18)
      }

      /*
      Make changes to avoid contridictions when showing the Benefit Partner Question: 
        1. when partner is younger than 60, the partner will not be eligible for OAS, GIS, ALW.
        2. when partner is between 60 and 65, partner will not be eligible for OAS
        3. Only show it when: partner is older than 65 and LegalStatus is canadian AND
            currently lives in Canada and has lived for 10+ years  OR 
            currently lives outside Canada and has lived for 20+ years in Canada
       */
      if (
        this.input.partner.age >= 65 &&
        this.input.partner.legalStatus.canadian &&
        this.input.partner.livedOnlyInCanada !== undefined &&
        ((this.input.partner.livingCountry.canada &&
          this.input.partner.yearsInCanadaSince18 >= 10) ||
          (!this.input.partner.livingCountry.canada &&
            this.input.partner.yearsInCanadaSince18 >= 20))
      ) {
        requiredFields.push(FieldKey.PARTNER_BENEFIT_STATUS)
      }
    }

    requiredFields.sort(BenefitHandler.sortFields)
    return requiredFields
  }

  /**
   * Compares the required fields with what has been provided, and builds a list of what is missing.
   */
  private getMissingFields(): FieldKey[] {
    const missingFields = []
    this.requiredFields.forEach((key) => {
      if (this.rawInput[key] === undefined) missingFields.push(key)
    })
    missingFields.sort(BenefitHandler.sortFields)
    return missingFields
  }

  /**
   * Returns the BenefitResultObject based on the user's input.
   * If any fields are missing, return no results.
   */
  private getBenefitResultObject(): BenefitResultsObjectWithPartner {
    if (this.missingFields.length) {
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

    const clientOasNoDeferral = new OasBenefit(
      this.input.client,
      this.translations,
      false,
      this.future,
      false,
      this.input.client.age
    )
    // If the client needs help, check their partner's OAS.
    // no defer and defer options?
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerOasNoDeferral = new OasBenefit(
        this.input.partner,
        this.translations,
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

    consoleDev(
      'Client OAS amount NO deferral',
      clientOasNoDeferral.entitlement.result
    )

    // Determines if it is possible to defer OAS and provides useful properties such as new inputs and deferral months to calculate the OAS deferred case
    const clientOasHelper = evaluateOASInput(this.input.client)

    let clientOasWithDeferral
    if (clientOasHelper.canDefer) {
      consoleDev(
        'Modified input to calculate OAS with deferral',
        clientOasHelper.newInput
      )
      clientOasWithDeferral = new OasBenefit(
        clientOasHelper.newInput,
        this.translations,
        false,
        this.future,
        true,
        this.input.client.age
      )

      consoleDev('WITH DEFERRAL', clientOasWithDeferral)
      consoleDev(
        'Client OAS amount WITH deferral',
        clientOasWithDeferral.entitlement.result
      )
    }

    let clientGisNoDeferral = new GisBenefit(
      this.input.client,
      this.translations,
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
        this.translations,
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

    const deferralMoreBeneficial = deferTotal ? deferTotal > noDeferTotal : null

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
        this.translations,
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
        this.translations,
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
      this.translations,
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
          detail: this.translations.detail.conditional,
        }
        // cardDetails and remove 'apply...' from the links
        allResults.client.alw.cardDetail.mainText =
          this.translations.detail.alwEligibleButPartnerAlreadyIs
        allResults.client.alw.entitlement.result = 0
        allResults.client.alw.cardDetail.links.splice(0, 1)
      }
    }

    this.input.partner.partnerBenefitStatus = this.getPartnerBenefitStatus(
      clientGis,
      clientAlw,
      clientOas
    )

    // If the client needs help, check their partner's ALW eligibility.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerAlw = new AlwBenefit(
        this.input.partner,
        this.translations,
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
      this.translations,
      this.future
    )
    allResults.client.alws.eligibility = clientAlws.eligibility

    const partnerAlw = new AlwBenefit(
      this.input.partner,
      this.translations,
      true
    )
    this.setValueForAllResults(allResults, 'partner', 'alw', partnerAlw)

    // this line overrides the partner value that's defaults to oasGis regardless.
    this.input.partner.partnerBenefitStatus.value =
      this.input.client.partnerBenefitStatus.value

    const partnerOas = new OasBenefit(
      this.input.partner,
      this.translations,
      true
    )
    this.setValueForAllResults(allResults, 'partner', 'oas', partnerOas)

    let partnerGis = new GisBenefit(
      this.input.partner,
      this.translations,
      allResults.partner.oas,
      true
    )
    this.setValueForAllResults(allResults, 'partner', 'gis', partnerGis)

    this.input.client.partnerBenefitStatus = this.getPartnerBenefitStatus(
      partnerGis,
      partnerAlw,
      partnerOas
    )

    if (this.input.client.partnerBenefitStatus.alw) {
      clientGis.eligibility.incomeMustBeLessThan =
        legalValues.gis.spouseAlwIncomeLimit

      clientGis = new GisBenefit(
        this.input.client,
        this.translations,
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

  private getPartnerBenefitStatus(
    gisObject: GisBenefit,
    alwObject: AlwBenefit,
    oasObject: OasBenefit
  ): PartnerBenefitStatusHelper {
    const eligibleArray = [ResultKey.ELIGIBLE, ResultKey.INCOME_DEPENDENT]

    // set partnerbenefitstatus for partner
    if (eligibleArray.includes(gisObject.eligibility.result)) {
      return new PartnerBenefitStatusHelper(PartnerBenefitStatus.OAS_GIS)
    } else if (eligibleArray.includes(alwObject.eligibility.result)) {
      return new PartnerBenefitStatusHelper(PartnerBenefitStatus.ALW)
    } else if (eligibleArray.includes(oasObject.eligibility.result)) {
      return new PartnerBenefitStatusHelper(PartnerBenefitStatus.OAS)
    } else {
      return new PartnerBenefitStatusHelper(PartnerBenefitStatus.NONE)
    }
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
          result.eligibility.detail = this.translations.detail.mustMeetIncomeReq
        }

        // process detail result
        result.eligibility.detail = BenefitHandler.capitalizeEachLine(
          this.replaceTextVariables(result.eligibility.detail, result)
        )

        // clawback is only valid for OAS
        // This adds the oasClawback text as requested.
        let newMainText = result.cardDetail.mainText

        // process card main text
        result.cardDetail.mainText = BenefitHandler.capitalizeEachLine(
          this.replaceTextVariables(newMainText, result)
        )

        // process card collapsed content
        result.cardDetail.collapsedText = result.cardDetail.collapsedText.map(
          (collapsedText) => ({
            heading: this.replaceTextVariables(collapsedText.heading, result),
            text: this.replaceTextVariables(collapsedText.text, result),
          })
        )
      }
    }
  }

  /**
   * Accepts a single string and replaces any {VARIABLES} with the appropriate value.
   * Optionally accepts a benefitResult, which will be used as context for certain replacement rules.
   */
  replaceTextVariables(
    textToProcess: string,
    benefitResult?: BenefitResult
  ): string {
    const re: RegExp = new RegExp(/{(\w*?)}/g)
    const matches: IterableIterator<RegExpMatchArray> =
      textToProcess.matchAll(re)
    for (const match of matches) {
      const key: string = match[1]
      const replacementRule = textReplacementRules[key]
      if (!replacementRule)
        throw new Error(`no text replacement rule for ${key}`)
      textToProcess = textToProcess.replace(
        `{${key}}`,
        replacementRule(this, benefitResult)
      )
    }
    return textToProcess
  }

  /**
   * Accepts a list of FieldKeys, transforms that into a full list of field configurations for the frontend to use.
   */
  static getFieldData(
    fields: FieldKey[],
    translations: Translations
  ): FieldConfig[] {
    // takes list of keys, builds list of definitions
    const fieldDataList = fields
      .sort(this.sortFields)
      .map((x) => fieldDefinitions[x])
    // applies translations
    fieldDataList.map((fieldData) => {
      // translate category
      const category = translations.category[fieldData.category.key]
      if (!category)
        throw new Error(`no category for key ${fieldData.category}`)
      fieldData.category.text = category

      // translate label/question
      const label = translations.question[fieldData.key]
      if (!label) throw new Error(`no question for key ${fieldData.key}`)
      fieldData.label = label

      // translate question help text
      const helpText = translations.questionHelp[fieldData.key]
      fieldData.helpText = helpText || ''

      // translate values/questionOptions
      if (
        fieldData.type === FieldType.DROPDOWN ||
        fieldData.type === FieldType.DROPDOWN_SEARCHABLE ||
        fieldData.type === FieldType.RADIO
      ) {
        // looks up using the main key first
        let questionOptions = translations.questionOptions[fieldData.key]
        if (!questionOptions)
          // if that fails, uses the relatedKey instead
          questionOptions = translations.questionOptions[fieldData.relatedKey]
        if (!questionOptions)
          throw new Error(
            `no questionOptions for key ${fieldData.key} or relatedKey ${fieldData.relatedKey}`
          )

        fieldData.values =
          // sometimes we use booleans as keys, this normalizes all these into strings
          questionOptions.map((option) => ({
            ...option,
            key: String(option.key),
          }))
      }

      return fieldData
    })

    // replace the text variables for Label and HelpText
    for (const key in fieldDataList) {
      const field: FieldConfig = fieldDataList[key]
      const handler = new BenefitHandler({ _language: translations._language })
      field.label = handler.replaceTextVariables(field.label)
      field.helpText = handler.replaceTextVariables(field.helpText)
    }

    return fieldDataList
  }

  /**
   * Returns the field data for all fields.
   * This is so that the UI can be aware of everything right away, rather than waiting for inputs to know the upcoming fields.
   */
  static getAllFieldData(language: Language): FieldConfig[] {
    return this.getFieldData(Object.values(FieldKey), getTranslations(language))
  }

  /**
   * Sorts fields by the order specified in fieldDefinitions.
   */
  static sortFields(a: string, b: string): number {
    const keyList = Object.keys(fieldDefinitions)
    const indexA = keyList.findIndex((value) => value === a)
    const indexB = keyList.findIndex((value) => value === b)
    return indexA - indexB
  }

  /**
   * Accepts a string, generally containing newlines (\n), and capitalizes the first character of each line.
   */
  static capitalizeEachLine(s: string): string {
    const lines: string[] = s.split('\n')
    return lines
      .reduce((result, line) => {
        return result + this.capitalizeFirstChar(line) + '\n'
      }, '')
      .trim()
  }

  /**
   * Accepts a string, and capitalizes the first character.
   */
  static capitalizeFirstChar(s: string): string {
    return s[0].toUpperCase() + s.slice(1)
  }
}
