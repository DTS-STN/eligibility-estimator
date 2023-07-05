import { getTranslations, Translations } from '../../i18n/api'
import { consoleDev } from '../web/helpers/utils'
import { AfsBenefit } from './benefits/afsBenefit'
import { AlwBenefit } from './benefits/alwBenefit'
import { EntitlementFormula } from './benefits/entitlementFormula'
import { GisBenefit } from './benefits/gisBenefit'
import { OasBenefit } from './benefits/oasBenefit'
import { BaseBenefit } from './benefits/_base'
import {
  BenefitKey,
  EntitlementResultType,
  Language,
  LegalStatus,
  MaritalStatus,
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

export class BenefitHandler {
  private _translations: Translations
  private _input: ProcessedInputWithPartner
  private _missingFields: FieldKey[]
  private _requiredFields: FieldKey[]
  private _fieldData: FieldConfig[]
  private _benefitResults: BenefitResultsObjectWithPartner
  private _summary: SummaryObject
  private _partnerSummary: SummaryObject

  constructor(readonly rawInput: Partial<RequestInput>) {}

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
            (e) => e[0] != 'afs'
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
      oasDeferDuration: this.rawInput.oasDeferDuration,
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
      requiredFields.push(FieldKey.YEARS_IN_CANADA_SINCE_18)
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
        afs: getBlankObject(BenefitKey.afs),
      },
      partner: {
        oas: getBlankObject(BenefitKey.oas),
        gis: getBlankObject(BenefitKey.gis),
        alw: getBlankObject(BenefitKey.alw),
        afs: getBlankObject(BenefitKey.afs),
      },
    }

    const initialPartnerBenefitStatus =
      this.input.client.partnerBenefitStatus.value

    // Check OAS. Does both Eligibility and Entitlement, as there are no dependencies.
    const clientOas = new OasBenefit(this.input.client, this.translations)
    this.setValueForAllResults(allResults, 'client', 'oas', clientOas)

    // If the client needs help, check their partner's OAS.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerOas = new OasBenefit(this.input.partner, this.translations)
      this.setValueForAllResults(allResults, 'partner', 'oas', partnerOas)
      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's GIS
      this.input.client.partnerBenefitStatus.oasResultEntitlement =
        partnerOas.entitlement
      // Save the client result to the partner's partnerBenefitStatus field, which is not yet used for anything
      this.input.partner.partnerBenefitStatus.oasResultEntitlement =
        clientOas.entitlement
    }

    // All done with OAS, move onto GIS, but only do GIS eligibility for now.
    let clientGis = new GisBenefit(
      this.input.client,
      this.translations,
      allResults.client.oas
    )

    this.setValueForAllResults(allResults, 'client', 'gis', clientGis)

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
    const clientAlw = new AlwBenefit(this.input.client, this.translations)
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
    const clientAfs = new AfsBenefit(this.input.client, this.translations)
    allResults.client.afs.eligibility = clientAfs.eligibility

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
        allResults.client.oas
      )
      this.setValueForAllResults(allResults, 'client', 'gis', clientGis)
    }

    // Now that the above dependencies are satisfied, we can do GIS entitlement.
    // deal with involuntary separated scenario
    if (
      this.input.client.invSeparated &&
      this.input.client.maritalStatus.partnered
    ) {
      const isIncomeProvided =
        this.input.client.income.provided && this.input.partner.income.provided

      if (isIncomeProvided) {
        if (
          clientOas.entitlement.result > 0 &&
          partnerOas.entitlement.result > 0
        ) {
          consoleDev('--- both oas are greater than 0 --- start')

          let maritalStatus = new MaritalStatusHelper(MaritalStatus.SINGLE)

          // applicant gis using table1
          const applicantGisResultT1 = new EntitlementFormula(
            this.input.client.income.client,
            maritalStatus,
            this.input.client.partnerBenefitStatus,
            this.input.client.age,
            allResults.client.oas
          ).getEntitlementAmount()

          consoleDev(
            'both Oas > 0 - applicantGisResultTable1',
            applicantGisResultT1
          )

          // partner gis using table1
          const partnerGisResultT1 = new EntitlementFormula(
            this.input.client.income.partner,
            maritalStatus,
            this.input.partner.partnerBenefitStatus,
            this.input.partner.age,
            allResults.partner.oas
          ).getEntitlementAmount()

          consoleDev(
            'both Oas > 0 - partnerGisResultTable1',
            partnerGisResultT1
          )

          //
          // applicant gis using partner Benefit Status. No = uses table 3, anything else uses Table 2.

          maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)

          let benefitStatus = new PartnerBenefitStatusHelper(
            this.rawInput.partnerBenefitStatus === PartnerBenefitStatus.NONE
              ? PartnerBenefitStatus.NONE
              : PartnerBenefitStatus.OAS_GIS
          )

          const applicantGisStatusBased = new EntitlementFormula(
            this.input.client.income.relevant,
            maritalStatus,
            benefitStatus,
            this.input.client.age,
            allResults.client.oas
          ).getEntitlementAmount()

          consoleDev(
            'both Oas > 0 - applicantGisStatusBased',
            applicantGisStatusBased
          )

          // partner gis using table2
          const partnerGisResultT2 = new EntitlementFormula(
            this.input.client.income.relevant,
            maritalStatus,
            this.input.partner.partnerBenefitStatus,
            this.input.partner.age,
            allResults.partner.oas
          ).getEntitlementAmount()

          consoleDev('both Oas > 0 - partnerGisResultT2', partnerGisResultT2)

          // define total_amt_singleA
          const totalAmountSingleApplicant =
            allResults.client.oas.entitlement.result + applicantGisResultT1

          // define total_amt_singleB
          const totalAmountSinglePartner =
            allResults.partner.oas.entitlement.result + partnerGisResultT1

          // define Total_amt_single
          const totalAmountSingle =
            totalAmountSingleApplicant + totalAmountSinglePartner

          // define Total_amt_CoupleA
          const totalAmountCoupleA =
            allResults.client.oas.entitlement.result + applicantGisStatusBased

          // define Total_amt_CoupleB
          const totalAmountCoupleB =
            allResults.partner.oas.entitlement.result + partnerGisResultT2

          // define Total_amt_Couple (need to add gis enhancement? )
          const totalAmountCouple = totalAmountCoupleA + totalAmountCoupleB

          //          Total Amount Couple > Total Amount Single
          //
          const useT1versusT3 = applicantGisResultT1 > applicantGisStatusBased

          if (totalAmountSingle < totalAmountCouple) {
            consoleDev(
              'both Oas > 0 - totalAmountsingle < totalAmountCouple',
              'totalAmountSingle',
              totalAmountSingle,
              'totalAmountCouple',
              totalAmountCouple
            )
            allResults.client.gis.entitlement.result = applicantGisStatusBased
            allResults.client.gis.entitlement.type = EntitlementResultType.FULL

            allResults.partner.gis.entitlement.result = partnerGisResultT2
            allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
          } else {
            //          Total Amount Single > Total Amount Couple
            consoleDev(
              'both Oas > 0 - totalAmountsingle > totalAmountCouple',
              'totalAmountSingle',
              totalAmountSingle,
              'totalAmountCouple',
              totalAmountCouple
            )

            consoleDev('useT1versusT3: ', useT1versusT3)
            const clientSingleInput = this.getSingleClientInput(useT1versusT3)

            clientGis = new GisBenefit(
              clientSingleInput,
              this.translations,
              allResults.client.oas
            )

            if (useT1versusT3) {
              clientGis.cardDetail.collapsedText.push(
                this.translations.detailWithHeading
                  .calculatedBasedOnIndividualIncome
              )
            }

            const partnerSingleInput = this.getSinglePartnerInput()

            partnerGis = new GisBenefit(
              partnerSingleInput,
              this.translations,
              allResults.partner.oas,
              true
            )

            this.setValueForAllResults(allResults, 'client', 'gis', clientGis)
            this.setValueForAllResults(allResults, 'partner', 'gis', partnerGis)
          }
          consoleDev('--- both oas are greater than 0 --- end')
        } // if partner is eligible for alw
        else if (partnerAlw.eligibility.result === ResultKey.ELIGIBLE) {
          consoleDev('--- partner is eligible for alw --- start')

          const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)
          //calculate gis entitlement for applicant use table4
          const applicantGisResultT4 = new EntitlementFormula(
            this.input.client.income.relevant,
            maritalStatus,
            this.input.client.partnerBenefitStatus,
            this.input.client.age,
            allResults.client.oas
          ).getEntitlementAmount()

          const partnerAlwCalcCouple = new EntitlementFormula(
            this.input.partner.income.relevant,
            maritalStatus,
            this.input.partner.partnerBenefitStatus,
            this.input.partner.age
          ).getEntitlementAmount()

          consoleDev(
            'T4',
            applicantGisResultT4,
            'partnerAlwCalcCouple',
            partnerAlwCalcCouple
          )

          // define Total_amt_Couple
          const totalAmtCouple = applicantGisResultT4 + partnerAlwCalcCouple

          const mStatus = new MaritalStatusHelper(MaritalStatus.SINGLE)

          // applicant gis using table1
          const applicantGisResultT1 = new EntitlementFormula(
            this.input.client.income.client,
            mStatus,
            this.input.client.partnerBenefitStatus,
            this.input.client.age,
            allResults.client.oas
          ).getEntitlementAmount()

          const partnerAlwCalcSingle = new EntitlementFormula(
            this.input.partner.income.partner,
            maritalStatus,
            this.input.partner.partnerBenefitStatus,
            this.input.partner.age,
            allResults.partner.oas
          ).getEntitlementAmount()

          consoleDev(
            'T1',
            applicantGisResultT1,
            'partnerAlwCalcSingle',
            partnerAlwCalcSingle
          )

          // define Total_amt_Single
          const totalAmountSingle = applicantGisResultT1 + partnerAlwCalcSingle

          consoleDev(
            'Case: partner is eligible for alw',
            'totalAmountSingle',
            totalAmountSingle,
            'totalAmtCouple',
            totalAmtCouple
          )

          this.setValueForAllResults(allResults, 'partner', 'alw', partnerAlw)

          let isApplicantGisAvailable = true
          // true when Receiving or I don't know.
          let receivingOas =
            this.input.client.partnerBenefitStatus.value ===
            PartnerBenefitStatus.NONE

          if (totalAmountSingle > totalAmtCouple) {
            const clientSingleInput = this.getSingleClientInput(true)

            clientGis = new GisBenefit(
              clientSingleInput,
              this.translations,
              allResults.client.oas
            )

            if (clientGis.entitlement.result === 0) {
              isApplicantGisAvailable = false

              if (partnerAlwCalcSingle > 0) {
                partnerAlw.cardDetail.collapsedText.push(
                  this.translations.detailWithHeading.partnerEligible
                )
              }
            } else {
              allResults.client.gis.cardDetail.collapsedText.push(
                this.translations.detailWithHeading
                  .calculatedBasedOnIndividualIncome
              )
              allResults.client.gis.eligibility = clientGis.eligibility
              allResults.client.gis.entitlement.result = applicantGisResultT1
              allResults.client.gis.entitlement.type =
                EntitlementResultType.FULL
              allResults.client.gis.eligibility.detail,
                (allResults.client.gis.cardDetail.mainText = `${this.translations.detail.eligible} ${this.translations.detail.expectToReceive}`)

              allResults.partner.alw.cardDetail = partnerAlw.cardDetail
              allResults.partner.alw.entitlement.result = partnerAlwCalcSingle

              if (partnerAlwCalcSingle > 0) {
                allResults.partner.alw.cardDetail.collapsedText.push(
                  this.translations.detailWithHeading
                    .calculatedBasedOnIndividualIncome
                )

                partnerAlw.cardDetail.collapsedText.push(
                  this.translations.detailWithHeading.partnerEligible
                )
              }
            }
          }

          if (totalAmountSingle <= totalAmtCouple || !isApplicantGisAvailable) {
            const clientGisCouple = new GisBenefit(
              this.input.client,
              this.translations,
              allResults.client.oas
            )

            this.setValueForAllResults(
              allResults,
              'client',
              'gis',
              clientGisCouple
            )

            allResults.partner.alw.entitlement.result = partnerAlwCalcCouple

            // Display a note stating when PartnerB turns 65, to determine if it is still
            // advantageous to use the GIS Single Rate (Rate Table 1) instead of Rate Table 4
          } //else {
          isApplicantGisAvailable = true

          consoleDev('--- partner is eligible for alw --- end')
        } // if applicant is eligible for alw
        else if (clientAlw.eligibility.result === ResultKey.ELIGIBLE) {
          consoleDev(' --- applicant is eligible for alw --- start')

          const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)

          //calculate gis entitlement for applicant use table4
          const partnerGisResultT4 = new EntitlementFormula(
            this.input.partner.income.relevant,
            maritalStatus,
            this.input.partner.partnerBenefitStatus,
            this.input.partner.age,
            allResults.partner.oas
          ).getEntitlementAmount()

          //calculate alw entitlement for application
          const applicantAlwCalcCouple = new EntitlementFormula(
            this.input.client.income.relevant,
            maritalStatus,
            this.input.client.partnerBenefitStatus,
            this.input.client.age
          ).getEntitlementAmount()

          //calculate alw entitlement for application
          const applicantAlwCalcSingle = new EntitlementFormula(
            this.input.client.income.client,
            maritalStatus,
            this.input.client.partnerBenefitStatus,
            //new PartnerBenefitStatusHelper(PartnerBenefitStatus.OAS_GIS),
            this.input.client.age
          ).getEntitlementAmount()

          consoleDev(
            'applicantAlwCalc',
            applicantAlwCalcCouple,
            applicantAlwCalcSingle,
            clientAlw.entitlement.result
          )

          // define Total_amt_Couple
          const totalAmountCouple = partnerGisResultT4 + applicantAlwCalcCouple

          consoleDev(
            'partnerGisResultT4',
            partnerGisResultT4,
            'clientAlw.entitlement.result',
            clientAlw.entitlement.result
          )

          // calculate partner GIS using table 1
          const partnerGisResultT1 = new EntitlementFormula(
            this.input.partner.income.partner,
            new MaritalStatusHelper(MaritalStatus.SINGLE),
            this.input.partner.partnerBenefitStatus,
            this.input.partner.age,
            allResults.partner.oas
          ).getEntitlementAmount()

          consoleDev('partnerGisResultT1', partnerGisResultT1)

          // define Total_amt_Single
          const totalAmountSingle = partnerGisResultT1 + applicantAlwCalcSingle

          consoleDev(
            'applicant is eligible for alw',
            'totalAmtSingle',
            totalAmountSingle,
            'totalAmountCouple',
            totalAmountCouple
          )

          let isPartnerGisAvailable = true
          if (totalAmountSingle > totalAmountCouple) {
            const partnerSingleInput = this.getSinglePartnerInput()

            partnerGis = new GisBenefit(
              partnerSingleInput,
              this.translations,
              allResults.partner.oas,
              true
            )

            // #115349 no allowance because partnerBenefits = No
            if (
              partnerGis.entitlement.result === 0 ||
              initialPartnerBenefitStatus === PartnerBenefitStatus.NONE
            ) {
              isPartnerGisAvailable = false
            } else {
              allResults.partner.gis.eligibility = partnerGis.eligibility
              allResults.partner.gis.entitlement = partnerGis.entitlement

              if (
                allResults.partner.gis.entitlement.result > 0 &&
                allResults.client.gis.entitlement.result <= 0
              )
                allResults.partner.gis.cardDetail.collapsedText.push(
                  this.translations.detailWithHeading
                    .calculatedBasedOnIndividualIncome
                )

              if (
                !allResults.partner.gis.cardDetail.collapsedText.includes(
                  this.translations.detailWithHeading.partnerEligible
                )
              )
                allResults.partner.gis.cardDetail.collapsedText.unshift(
                  this.translations.detailWithHeading.partnerEligible
                )

              // If client is eligible for ALW, need to recalculate estimate based on individual income
              if (clientAlw.eligibility.result === 'eligible') {
                if (
                  this.input.client.income.client >=
                  legalValues.alw.alwIncomeLimit
                ) {
                  const tempClientAlw = new AlwBenefit(
                    this.input.client,
                    this.translations,
                    false,
                    false
                  )
                  this.setValueForAllResults(
                    allResults,
                    'client',
                    'alw',
                    tempClientAlw
                  )

                  // overwrite eligibility and cardDetails for correct text in card
                  allResults.client.alw.eligibility = {
                    result: ResultKey.ELIGIBLE,
                    reason: ResultReason.NONE,
                    detail: this.translations.detail.alwEligibleIncomeTooHigh,
                  }
                } else {
                  const tempClientAlw = new AlwBenefit(
                    this.input.client,
                    this.translations,
                    false,
                    true
                  )
                  this.setValueForAllResults(
                    allResults,
                    'client',
                    'alw',
                    tempClientAlw
                  )

                  // overwrite eligibility and cardDetails for correct text in card
                  allResults.client.alw.eligibility = {
                    result: ResultKey.ELIGIBLE,
                    reason: ResultReason.NONE,
                    detail: this.translations.detail.eligible,
                  }

                  // cardDetails
                  allResults.client.alw.eligibility.detail,
                    (allResults.client.alw.cardDetail.mainText = `${this.translations.detail.eligible} ${this.translations.detail.expectToReceive}`)

                  allResults.client.alw.cardDetail.collapsedText.push(
                    this.translations.detailWithHeading
                      .calculatedBasedOnIndividualIncome
                  )
                }
              }

              if (
                this.input.partner.invSeparated &&
                allResults.partner.gis.entitlement.result > 0 &&
                clientAlw.entitlement.result > 0
              ) {
                allResults.partner.alw.cardDetail.collapsedText.push(
                  this.translations.detailWithHeading
                    .calculatedBasedOnIndividualIncome
                )

                allResults.client.alw.entitlement.result =
                  applicantAlwCalcSingle
              }
            }
          }

          if (
            totalAmountSingle <= totalAmountCouple ||
            !isPartnerGisAvailable
          ) {
            // return partnerGisResultT4 only partnerBenefits = No
            if (initialPartnerBenefitStatus !== PartnerBenefitStatus.NONE) {
              allResults.partner.gis.entitlement.result = partnerGisResultT4
              allResults.partner.gis.entitlement.type =
                EntitlementResultType.FULL
              allResults.client.alw.entitlement.result = applicantAlwCalcCouple
            } else {
              allResults.client.alw.eligibility.result = ResultKey.INELIGIBLE
              allResults.client.alw.eligibility.reason = ResultReason.PARTNER
              allResults.client.alw.eligibility.detail =
                this.translations.detail.alwNotEligible
              allResults.client.alw.entitlement.result = 0
              allResults.client.alw.entitlement.type =
                EntitlementResultType.NONE
              allResults.client.alw.cardDetail.mainText =
                this.translations.detail.alwEligibleButPartnerAlreadyIs
              allResults.client.alw.cardDetail.links.splice(0, 1)
            }
          }
          isPartnerGisAvailable = true

          consoleDev(' --- applicant is eligible for alw --- end')
        } else if (
          clientOas.entitlement.result > 0 &&
          partnerOas.entitlement.result === 0
        ) {
          consoleDev(
            '--- both are not eligible for alw - applicant oas > 0 & partner oas =0 --- start'
          )

          let maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)
          const noOASString = JSON.stringify(allResults.client.oas)
          const noOAS = JSON.parse(noOASString)
          noOAS.entitlement.result = 0

          const applicantGisResultT3 = new EntitlementFormula(
            this.input.client.income.relevant,
            maritalStatus,
            this.input.client.partnerBenefitStatus,
            this.input.client.age,
            noOAS
          ).getEntitlementAmount()

          // get OAS for applicant use table 1
          maritalStatus = new MaritalStatusHelper(MaritalStatus.SINGLE)

          // applicant gis using table1
          const applicantGisResultT1 = new EntitlementFormula(
            this.input.client.income.client,
            maritalStatus,
            this.input.client.partnerBenefitStatus,
            this.input.client.age,
            allResults.client.oas
          ).getEntitlementAmount()

          consoleDev(
            'clientOas > 0 and partnerOas = 0',
            allResults.client.oas,
            'applicantGisTable1',
            applicantGisResultT1,
            'applicantGisResultT3',
            applicantGisResultT3
          )

          if (applicantGisResultT1 < applicantGisResultT3) {
            allResults.client.gis.entitlement.result = applicantGisResultT3
            allResults.client.gis.entitlement.type = EntitlementResultType.FULL
          } else {
            allResults.client.gis.entitlement.result = applicantGisResultT1
            allResults.client.gis.entitlement.type = EntitlementResultType.FULL
          }

          // the push below prob can be moved to the else condition above but no time to test all scenarios
          if (
            (allResults.client.gis.eligibility.reason === ResultReason.NONE ||
              allResults.client.gis.eligibility.reason ===
                ResultReason.INCOME) &&
            clientGis.entitlement.result > 0 &&
            (this.rawInput.partnerLegalStatus === LegalStatus.YES ||
              this.rawInput.partnerLegalStatus === undefined)
          ) {
            allResults.client.gis.cardDetail.collapsedText.push(
              this.translations.detailWithHeading
                .calculatedBasedOnIndividualIncome
            )
          }

          if (
            allResults.client.gis.eligibility.reason === ResultReason.INCOME &&
            clientGis.entitlement.result > 0
          ) {
            allResults.client.gis.eligibility.detail,
              (allResults.client.gis.cardDetail.mainText = `${this.translations.detail.eligible} ${this.translations.detail.expectToReceive}`)
          }

          consoleDev(
            '--- both are not eligible for alw - applicant oas > 0 & partner oas =0 --- end'
          )
        } else if (
          clientOas.entitlement.result === 0 &&
          partnerOas.entitlement.result > 0
        ) {
          consoleDev(
            '--- both are not eligible for alw - applicant oas = 0 & partner oas > 0 --- start'
          )

          const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)

          // T3 was originally coded with the client.oas and entitlement=0
          //  but it returned an incorrect GIS amount and OAS=0
          const noOAS = allResults.partner.oas

          const partnerGisResultT3 = new EntitlementFormula(
            this.input.partner.income.relevant,
            maritalStatus,
            this.input.partner.partnerBenefitStatus,
            this.input.partner.age,
            noOAS
          ).getEntitlementAmount()

          const partnerGisResultT1 = new EntitlementFormula(
            this.input.client.income.partner,
            new MaritalStatusHelper(MaritalStatus.SINGLE),
            this.input.partner.partnerBenefitStatus,
            this.input.partner.age,
            allResults.partner.oas
          ).getEntitlementAmount()

          consoleDev(
            'clientOas = 0 and partnerOas > 0',
            'partnerGisTable1',
            partnerGisResultT1,
            'partnerGisResultT3',
            partnerGisResultT3,
            initialPartnerBenefitStatus
          )

          if (partnerGisResultT1 < partnerGisResultT3) {
            allResults.partner.gis.entitlement.result = partnerGisResultT3
            allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
          } else {
            allResults.partner.gis.entitlement.result = partnerGisResultT1
            allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
            partnerGis.cardDetail.collapsedText.push(
              this.translations.detailWithHeading.partnerEligible
            )
          }

          // add the amount calculated to the card.
          if (
            allResults.partner.gis.entitlement.result > 0 &&
            initialPartnerBenefitStatus !== PartnerBenefitStatus.NONE
          ) {
            if (allResults.client.gis.entitlement.result <= 0) {
              allResults.partner.gis.cardDetail.collapsedText.push(
                this.translations.detailWithHeading
                  .calculatedBasedOnIndividualIncome
              )
            }
          }

          consoleDev(
            '--- both are not eligible for alw - applicant oas = 0 & partner oas > 0 --- end'
          )
        }
      }

      // Finish with AFS entitlement.
      allResults.client.afs.entitlement = clientAfs.entitlement
      allResults.client.afs.cardDetail = clientAfs.cardDetail

      // Process all CardDetails
      allResults.client.oas.cardDetail =
        undefined === allResults.client.oas.cardDetail
          ? clientOas.cardDetail
          : allResults.client.oas.cardDetail

      allResults.client.gis.cardDetail =
        undefined === allResults.client.gis.cardDetail
          ? clientGis.cardDetail
          : allResults.client.gis.cardDetail

      allResults.client.alw.cardDetail =
        undefined === allResults.client.alw.cardDetail
          ? clientAlw.cardDetail
          : allResults.client.alw.cardDetail
    } else {
      allResults.client.gis.entitlement = clientGis.entitlement

      // Continue with ALW entitlement.
      allResults.client.alw.entitlement = clientAlw.entitlement

      // Finish with AFS entitlement.
      allResults.client.afs.entitlement = clientAfs.entitlement

      // Process all CardDetails
      allResults.client.oas.cardDetail = clientOas.cardDetail
      allResults.client.gis.cardDetail = clientGis.cardDetail
      allResults.client.alw.cardDetail = clientAlw.cardDetail
      allResults.client.afs.cardDetail = clientAfs.cardDetail
    }

    consoleDev('allResults', allResults)

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

  private getSingleClientInput(useTable1: boolean): ProcessedInput {
    //
    // if useTable1 then force Table 1 over Table 3
    //
    const incomeHelper = new IncomeHelper(
      this.rawInput.incomeAvailable,
      false,
      useTable1 ? this.rawInput.income : this.input.client.income.relevant,
      0,
      useTable1
        ? new MaritalStatusHelper(MaritalStatus.SINGLE)
        : new MaritalStatusHelper(MaritalStatus.PARTNERED)
    )

    const clientSingleInput: ProcessedInput = {
      income: incomeHelper,
      age: this.rawInput.age,
      receiveOAS: this.rawInput.receiveOAS,
      oasDeferDuration: this.rawInput.oasDeferDuration,
      oasDefer: this.rawInput.oasDefer,
      oasAge: this.rawInput.oasDefer ? this.rawInput.oasAge : 65,
      maritalStatus: useTable1
        ? new MaritalStatusHelper(MaritalStatus.SINGLE)
        : new MaritalStatusHelper(MaritalStatus.PARTNERED),
      livingCountry: new LivingCountryHelper(this.rawInput.livingCountry),
      legalStatus: new LegalStatusHelper(this.rawInput.legalStatus),
      livedOnlyInCanada: this.rawInput.livedOnlyInCanada,
      // if not livedOnlyInCanada, assume yearsInCanadaSince18 is 40
      yearsInCanadaSince18: this.rawInput.livedOnlyInCanada
        ? 40
        : this.rawInput.yearsInCanadaSince18,
      everLivedSocialCountry: this.rawInput.everLivedSocialCountry,
      invSeparated: this.rawInput.invSeparated,
      partnerBenefitStatus: useTable1
        ? new PartnerBenefitStatusHelper(this.rawInput.partnerBenefitStatus)
        : new PartnerBenefitStatusHelper(PartnerBenefitStatus.NONE),
    }

    return clientSingleInput
  }

  private getSinglePartnerInput(): ProcessedInput {
    const incomeHelper = new IncomeHelper(
      true,
      false,
      this.rawInput.partnerIncome,
      0,
      new MaritalStatusHelper(MaritalStatus.SINGLE)
    )

    const partnerInput: ProcessedInput = {
      income: incomeHelper,
      age: this.rawInput.partnerAge,
      receiveOAS: this.rawInput.receiveOAS,
      oasDefer: false, // pass dummy data because we will never use this anyway
      oasDeferDuration: JSON.stringify({ months: 0, years: 0 }),
      oasAge: 65, // pass dummy data because we will never use this anyway
      maritalStatus: new MaritalStatusHelper(MaritalStatus.SINGLE),
      livingCountry: new LivingCountryHelper(
        this.rawInput.partnerLivingCountry
      ),
      legalStatus: new LegalStatusHelper(this.rawInput.partnerLegalStatus),
      livedOnlyInCanada: this.rawInput.partnerLivedOnlyInCanada,
      yearsInCanadaSince18: this.rawInput.partnerLivedOnlyInCanada
        ? 40
        : this.rawInput.partnerYearsInCanadaSince18,
      everLivedSocialCountry: false, //required by ProcessedInput
      partnerBenefitStatus: this.input.partner.partnerBenefitStatus,
      invSeparated: this.rawInput.invSeparated,
    }

    return partnerInput
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

        if (
          key === 'oas' &&
          this.benefitResults[individualBenefits][key].eligibility.reason !==
            ResultReason.INCOME
        ) {
          clawbackValue =
            this.benefitResults[individualBenefits][key].entitlement.clawback

          if (this.input.client.livingCountry.canada) {
            newMainText =
              clawbackValue > 0 && result.cardDetail.mainText
                ? result.cardDetail.mainText +
                  `<div class="mt-8">${this.translations.detail.oasClawbackInCanada}</div>`
                : result.cardDetail.mainText
          } else {
            newMainText =
              clawbackValue > 0 && result.cardDetail.mainText
                ? result.cardDetail.mainText +
                  `<div class="mt-8">${this.translations.detail.oasClawbackNotInCanada}</div>`
                : result.cardDetail.mainText
          }
        }

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
   * Accepts a numerical month+year, and returns the number of years since then.
   * This can and will return a decimal value, such as "65.5"!
   */
  static calculateAge(birthMonth: number, birthYear: number): number {
    if (!birthMonth || !birthYear) return 0

    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()

    let ageMonths: number
    let ageYears = currentYear - birthYear

    if (currentMonth >= birthMonth) {
      ageMonths = currentMonth - birthMonth
    } else {
      ageYears -= 1
      ageMonths = 12 + (currentMonth - birthMonth)
    }

    return ageYears + Number((ageMonths / 12).toFixed(2))
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
