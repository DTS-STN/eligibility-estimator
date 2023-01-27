import { getTranslations, Translations } from '../../i18n/api'
import { AfsBenefit } from './benefits/afsBenefit'
import { AlwBenefit } from './benefits/alwBenefit'
import { GisBenefit } from './benefits/gisBenefit'
import { OasBenefit } from './benefits/oasBenefit'
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
import { textReplacementRules } from './definitions/textReplacementRules'
import {
  BenefitResult,
  BenefitResultsObject,
  BenefitResultsObjectWithPartner,
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
import { SummaryHandler } from './summaryHandler'
import { EntitlementFormula } from './benefits/entitlementFormula'

export class BenefitHandler {
  private _translations: Translations
  private _input: ProcessedInputWithPartner
  private _missingFields: FieldKey[]
  private _requiredFields: FieldKey[]
  private _fieldData: FieldConfig[]
  private _benefitResults: BenefitResultsObject
  private _summary: SummaryObject

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

  get benefitResults(): BenefitResultsObject {
    if (this._benefitResults === undefined) {
      this._benefitResults = this.getBenefitResultObject()
      this.translateResults()
    }
    return this._benefitResults
  }

  get summary(): SummaryObject {
    if (this._summary === undefined) {
      console.log('this.benefitResults,', this.benefitResults)

      this._summary = SummaryHandler.buildSummaryObject(
        this.input,
        this.benefitResults,
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
      oasDefer: this.rawInput.oasDefer,
      oasAge: this.rawInput.oasDefer ? this.rawInput.oasAge : 65,
      maritalStatus: maritalStatusHelper,
      livingCountry: new LivingCountryHelper(this.rawInput.livingCountry),
      legalStatus: new LegalStatusHelper(this.rawInput.legalStatus),
      livedOutsideCanada: this.rawInput.livedOutsideCanada,
      // if not livedOutsideCanada, assume yearsInCanadaSince18 is 40
      yearsInCanadaSince18: !this.rawInput.livedOutsideCanada
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
      oasDefer: false, // pass dummy data because we will never use this anyway
      oasAge: 65, // pass dummy data because we will never use this anyway
      maritalStatus: maritalStatusHelper,
      livingCountry: new LivingCountryHelper(
        this.rawInput.partnerLivingCountry
      ),
      legalStatus: new LegalStatusHelper(this.rawInput.partnerLegalStatus),
      livedOutsideCanada: this.rawInput.partnerLivedOutsideCanada,
      yearsInCanadaSince18: !this.rawInput.partnerLivedOutsideCanada
        ? 40
        : this.rawInput.partnerYearsInCanadaSince18,
      everLivedSocialCountry: this.rawInput.partnerEverLivedSocialCountry,
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
      FieldKey.INCOME_AVAILABLE,
      FieldKey.AGE,
      FieldKey.OAS_DEFER,
      FieldKey.LIVING_COUNTRY,
      FieldKey.LEGAL_STATUS,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVED_OUTSIDE_CANADA,
    ]
    if (this.input.client.livedOutsideCanada) {
      requiredFields.push(FieldKey.YEARS_IN_CANADA_SINCE_18)
    }
    if (this.input.client.oasDefer) {
      requiredFields.push(FieldKey.OAS_AGE)
    }
    if (this.input.client.income.clientAvailable) {
      requiredFields.push(FieldKey.INCOME)
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

      requiredFields.push(FieldKey.PARTNER_BENEFIT_STATUS)
      // only ask for partner income if client income is available
      if (this.input.client.income.clientAvailable) {
        requiredFields.push(FieldKey.PARTNER_INCOME_AVAILABLE)
        if (this.input.client.income.partnerAvailable)
          requiredFields.push(FieldKey.PARTNER_INCOME)
      }

      if (this.input.client.invSeparated) {
      }

      if (
        (this.input.client.invSeparated && this.input.partner.age >= 60) ||
        (this.input.client.partnerBenefitStatus.helpMe &&
          this.input.partner.age >= 60)
      ) {
        requiredFields.push(FieldKey.PARTNER_LEGAL_STATUS)
      }
      if (
        this.input.partner.legalStatus.value &&
        this.input.partner.legalStatus.value !== LegalStatus.OTHER
      ) {
        requiredFields.push(
          FieldKey.PARTNER_LIVING_COUNTRY,
          FieldKey.PARTNER_LIVED_OUTSIDE_CANADA
        )
      }

      if (this.input.partner.livedOutsideCanada) {
        requiredFields.push(FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18)
      }
      if (
        (this.input.partner.livingCountry.canada &&
          this.input.partner.yearsInCanadaSince18 < 10) ||
        (!this.input.partner.livingCountry.canada &&
          this.input.partner.yearsInCanadaSince18 < 20)
      ) {
        requiredFields.push(FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY)
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
  private getBenefitResultObject(): BenefitResultsObject {
    if (this.missingFields.length) {
      return {}
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

    // Check OAS. Does both Eligibility and Entitlement, as there are no dependencies.
    const clientOas = new OasBenefit(this.input.client, this.translations)
    allResults.client.oas.eligibility = clientOas.eligibility
    allResults.client.oas.entitlement = clientOas.entitlement

    const partnerOas = new OasBenefit(this.input.partner, this.translations)
    allResults.partner.oas.eligibility = partnerOas.eligibility
    allResults.partner.oas.entitlement = partnerOas.entitlement

    // If the client needs help, check their partner's OAS.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      // const partnerOas = new OasBenefit(this.input.partner, this.translations)
      // allResults.partner.oas.eligibility = partnerOas.eligibility
      // allResults.partner.oas.entitlement = partnerOas.entitlement

      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's GIS
      this.input.client.partnerBenefitStatus.oasResultEntitlement =
        partnerOas.entitlement
      // Save the client result to the partner's partnerBenefitStatus field, which is not yet used for anything
      this.input.partner.partnerBenefitStatus.oasResultEntitlement =
        clientOas.entitlement
    }

    // All done with OAS, move onto GIS, but only do GIS eligibility for now.
    const clientGis = new GisBenefit(
      this.input.client,
      this.translations,
      allResults.client.oas
    )
    allResults.client.gis.eligibility = clientGis.eligibility
    allResults.client.gis.entitlement = clientGis.entitlement

    const partnerGis = new GisBenefit(
      this.input.partner,
      this.translations,
      allResults.partner.oas
    )
    allResults.partner.gis.eligibility = partnerGis.eligibility
    allResults.partner.gis.entitlement = partnerGis.entitlement

    // If the client needs help, check their partner's GIS eligibility.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerGis = new GisBenefit(
        this.input.partner,
        this.translations,
        allResults.partner.oas
      )
      allResults.partner.gis.eligibility = partnerGis.eligibility

      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's ALW
      this.input.client.partnerBenefitStatus.gisResultEligibility =
        partnerGis.eligibility
      // Save the client result to the partner's partnerBenefitStatus field, which is used for partner's ALW, and therefore client's GIS
      this.input.partner.partnerBenefitStatus.gisResultEligibility =
        clientGis.eligibility
    }

    // Moving onto ALW, again only doing eligibility.
    const clientAlw = new AlwBenefit(this.input.client, this.translations)
    allResults.client.alw.eligibility = clientAlw.eligibility
    allResults.client.alw.entitlement = clientAlw.entitlement

    // set partnerbenefitstatus for partner
    if (clientGis.eligibility.result === ResultKey.ELIGIBLE) {
      this.input.partner.partnerBenefitStatus = new PartnerBenefitStatusHelper(
        PartnerBenefitStatus.OAS_GIS
      )
    } else if (clientAlw.eligibility.result === ResultKey.ELIGIBLE) {
      this.input.partner.partnerBenefitStatus = new PartnerBenefitStatusHelper(
        PartnerBenefitStatus.ALW
      )
    } else if (clientOas.eligibility.result === ResultKey.ELIGIBLE) {
      this.input.partner.partnerBenefitStatus = new PartnerBenefitStatusHelper(
        PartnerBenefitStatus.OAS
      )
    }

    const partnerAlw = new AlwBenefit(this.input.partner, this.translations)

    allResults.partner.oas.eligibility = partnerOas.eligibility
    allResults.partner.oas.entitlement = partnerOas.entitlement

    // If the client needs help, check their partner's ALW eligibility.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerAlw = new AlwBenefit(this.input.partner, this.translations)
      allResults.partner.alw.eligibility = partnerAlw.eligibility

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

    // Now that the above dependencies are satisfied, we can do GIS entitlement.
    // deal with involuntary separated scenario

    if (this.input.client.invSeparated) {
      if (
        clientOas.entitlement.result > 0 &&
        partnerOas.entitlement.result > 0
      ) {
        console.log('--- both oas are greater than 0 --- start')

        // get OAS for applicant use table 1
        const partnerBenefitStatus = new PartnerBenefitStatusHelper(
          PartnerBenefitStatus.OAS
        )
        let maritalStatus = new MaritalStatusHelper(MaritalStatus.SINGLE)

        // applicant gis using table1
        const applicantGisResultT1 = new EntitlementFormula(
          this.input.client.income.client,
          maritalStatus,
          partnerBenefitStatus,
          this.input.client.age,
          allResults.client.oas
        ).getEntitlementAmount()

        console.log(
          'both Oas > 0 - applicantGisResultTable1',
          applicantGisResultT1
        )

        // partner gis using table1
        const partnerGisResultT1 = new EntitlementFormula(
          this.input.client.income.partner,
          maritalStatus,
          new PartnerBenefitStatusHelper(
            this.input.partner.partnerBenefitStatus.value
          ),
          this.input.partner.age,
          allResults.partner.oas
        ).getEntitlementAmount()

        console.log('both Oas > 0 - partnerGisResultTable1', partnerGisResultT1)

        maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)

        // applicant gis using table2
        const applicantGisResultT2 = new EntitlementFormula(
          this.input.client.income.relevant,
          maritalStatus,
          new PartnerBenefitStatusHelper(
            this.input.client.partnerBenefitStatus.value
          ),
          this.input.client.age,
          allResults.client.oas
        ).getEntitlementAmount()

        console.log('both Oas > 0 - applicantGisResultT2', applicantGisResultT2)

        // partner gis using table2
        const partnerGisResultT2 = new EntitlementFormula(
          this.input.client.income.relevant,
          maritalStatus,
          new PartnerBenefitStatusHelper(
            this.input.client.partnerBenefitStatus.value
          ),
          this.input.partner.age,
          allResults.client.oas
        ).getEntitlementAmount()

        console.log('both Oas > 0 - partnerGisResultT2', partnerGisResultT2)

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
          allResults.client.oas.entitlement.result + applicantGisResultT2

        // define Total_amt_CoupleB
        const totalAmountCoupleB =
          allResults.partner.oas.entitlement.result + partnerGisResultT2

        // define Total_amt_Couple (need to add gis enhancement? )
        const totalAmountCouple = totalAmountCoupleA + totalAmountCoupleB

        if (totalAmountSingle < totalAmountCouple) {
          console.log(
            'both Oas > 0 - totalAmountsingle < totalAmountCouple',
            'totalAmountSingle',
            totalAmountSingle,
            'totalAmountCouple',
            totalAmountCouple
          )

          allResults.client.gis.entitlement.result = totalAmountCouple
          allResults.client.gis.entitlement.type = EntitlementResultType.FULL
        } else {
          console.log(
            'both Oas > 0 - totalAmountsingle > totalAmountCouple',
            'totalAmountSingle',
            totalAmountSingle,
            'totalAmountCouple',
            totalAmountCouple
          )

          allResults.client.gis.entitlement.result = totalAmountSingle
          allResults.client.gis.entitlement.type = EntitlementResultType.FULL
        }
        console.log('--- both oas are greater than 0 --- end')
      } // if partner is eligible for alw
      else if (partnerAlw.eligibility.result === ResultKey.ELIGIBLE) {
        console.log('--- partner is eligible for alw --- start')
        const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)
        //calculate gis entitlement for applicant use table4
        const applicantGisResultT4 = new EntitlementFormula(
          this.input.client.income.relevant,
          maritalStatus,
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.ALW),
          this.input.client.age,
          allResults.client.oas
        ).getEntitlementAmount()

        const partnerAlwCalcCouple = new EntitlementFormula(
          this.input.partner.income.relevant,
          maritalStatus,
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.OAS_GIS),
          this.input.partner.age
        ).getEntitlementAmount()

        console.log(
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
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.NONE),
          this.input.client.age,
          allResults.client.oas
        ).getEntitlementAmount()

        const partnerAlwCalcSingle = new EntitlementFormula(
          this.input.partner.income.partner,
          maritalStatus,
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.OAS_GIS),
          this.input.partner.age
        ).getEntitlementAmount()

        console.log(
          'T1',
          applicantGisResultT1,
          'partnerAlwCalcSingle',
          partnerAlwCalcSingle
        )

        // define Total_amt_Single
        const totalAmountSingle = applicantGisResultT1 + partnerAlwCalcSingle

        console.log(
          'Case: partner is eligible for alw',
          'totalAmountSingle',
          totalAmountSingle,
          'totalAmtCouple',
          totalAmtCouple
        )

        if (totalAmountSingle < totalAmtCouple) {
          allResults.client.gis.entitlement.result = applicantGisResultT4
          allResults.client.gis.entitlement.type = EntitlementResultType.FULL
          // Display a note stating when PartnerB turns 65, to determine if it is still
          // advantageous to use the GIS Single Rate (Rate Table 1) instead of Rate Table 4
        } else {
          console.log()

          allResults.client.gis.entitlement.result = applicantGisResultT1
          allResults.client.gis.entitlement.type = EntitlementResultType.FULL
        }
        console.log('--- partner is eligible for alw --- end')
      } // if applicant is eligible for alw
      else if (clientAlw.eligibility.result === ResultKey.ELIGIBLE) {
        console.log(' --- applicant is eligible for alw --- start')

        const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)

        //calculate gis entitlement for applicant use table4
        const partnerGisResultT4 = new EntitlementFormula(
          this.input.partner.income.relevant,
          maritalStatus,
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.ALW),
          this.input.partner.age,
          allResults.partner.oas
        ).getEntitlementAmount()

        //calculate alw entitlement for application
        const applicantAlwCalcCouple = new EntitlementFormula(
          this.input.client.income.relevant,
          maritalStatus,
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.OAS_GIS),
          this.input.client.age
        ).getEntitlementAmount()

        //calculate alw entitlement for application
        const applicantAlwCalcSingle = new EntitlementFormula(
          this.input.client.income.client,
          maritalStatus,
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.OAS_GIS),
          this.input.client.age
        ).getEntitlementAmount()

        console.log(
          'applicantAlwCalc',
          applicantAlwCalcCouple,
          applicantAlwCalcSingle,
          clientAlw.entitlement.result
        )

        // define Total_amt_Couple
        const totalAmountCouple = partnerGisResultT4 + applicantAlwCalcCouple

        console.log(
          'partnerGisResultT4',
          partnerGisResultT4,
          'clientAlw.entitlement.result',
          clientAlw.entitlement.result
        )

        const partnerBenefitStatus = new PartnerBenefitStatusHelper(
          PartnerBenefitStatus.NONE
        )

        // calculate partner GIS using table 1
        const partnerGisResultT1 = new EntitlementFormula(
          this.input.partner.income.partner,
          new MaritalStatusHelper(MaritalStatus.SINGLE),
          partnerBenefitStatus,
          this.input.partner.age,
          allResults.partner.oas
        ).getEntitlementAmount()

        console.log('partnerGisResultT1', partnerGisResultT1)

        // define Total_amt_Single
        const totalAmtSingle = partnerGisResultT1 + clientAlw.entitlement.result

        console.log(
          'applicant is eligible for alw',
          'totalAmtSingle',
          totalAmtSingle,
          'totalAmountCouple',
          totalAmountCouple
        )

        if (totalAmtSingle < totalAmountCouple) {
          // return partnerGisResultT4
          allResults.partner.gis.entitlement.result = partnerGisResultT4
          allResults.client.gis.entitlement.type = EntitlementResultType.FULL
        } else {
          // Display the calculated GIS amounts for Singles - Rate Table 1
          // (GIS_amt_SingleB) for Partner B and ALW amount for PartnerA using PartnerA's income only
          allResults.client.alw.entitlement.result = applicantAlwCalcSingle
          allResults.client.alw.entitlement.type = EntitlementResultType.FULL
          allResults.partner.gis.entitlement.result = partnerGisResultT1
          allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
        }

        console.log(' --- applicant is eligible for alw --- end')
      } else if (
        clientOas.entitlement.result > 0 &&
        partnerOas.entitlement.result === 0
      ) {
        console.log(
          '--- both are not eligible for alw - applicant oas > 0 & partner oas =0 --- start'
        )

        let maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)
        const noOASString = JSON.stringify(allResults.client.oas)
        const noOAS = JSON.parse(noOASString)
        noOAS.entitlement.result = 0
        const applicantGisResultT3 = new EntitlementFormula(
          this.input.client.income.relevant,
          maritalStatus,
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.NONE),
          this.input.client.age,
          noOAS
        ).getEntitlementAmount()

        // get OAS for applicant use table 1
        const partnerBenefitStatus = new PartnerBenefitStatusHelper(
          PartnerBenefitStatus.NONE
        )
        maritalStatus = new MaritalStatusHelper(MaritalStatus.SINGLE)

        // applicant gis using table1
        const applicantGisResultT1 = new EntitlementFormula(
          this.input.client.income.client,
          maritalStatus,
          partnerBenefitStatus,
          this.input.client.age,
          allResults.client.oas
        ).getEntitlementAmount()

        console.log(
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
          // return clientGis.entitlement.result
          allResults.client.gis.entitlement.result = applicantGisResultT1
          allResults.client.gis.entitlement.type = EntitlementResultType.FULL
        }

        console.log(
          '--- both are not eligible for alw - applicant oas > 0 & partner oas =0 --- end'
        )
      } else if (
        clientOas.entitlement.result === 0 &&
        partnerOas.entitlement.result > 0
      ) {
        console.log(
          '--- both are not eligible for alw - applicant oas = 0 & partner oas > 0 --- start'
        )

        const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)
        const noOAS = allResults.client.oas
        noOAS.entitlement.result = 0
        const partnerGisResultT3 = new EntitlementFormula(
          this.input.partner.income.relevant,
          maritalStatus,
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.NONE),
          this.input.partner.age,
          noOAS
        ).getEntitlementAmount()

        const partnerGisResultT1 = new EntitlementFormula(
          this.input.client.income.partner,
          new MaritalStatusHelper(MaritalStatus.SINGLE),
          new PartnerBenefitStatusHelper(PartnerBenefitStatus.NONE),
          this.input.partner.age,
          allResults.partner.oas
        ).getEntitlementAmount()

        console.log(
          'clientOas = 0 and partnerOas > 0',
          'partnerGisTable1',
          partnerGisResultT1,
          'partnerGisResultT3',
          partnerGisResultT3
        )

        if (partnerGisResultT1 < partnerGisResultT3) {
          //return partnerGisResultT3
          allResults.partner.gis.entitlement.result = partnerGisResultT3
          allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
        } else {
          //return partnerGisResultT1
          allResults.partner.gis.entitlement.result = partnerGisResultT1
          allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
        }

        console.log(
          '--- both are not eligible for alw - applicant oas = 0 & partner oas > 0 --- start'
        )
      }

      // Finish with AFS entitlement.
      allResults.client.afs.entitlement = clientAfs.entitlement

      // Process all CardDetails
      allResults.client.oas.cardDetail = clientOas.cardDetail
      allResults.client.gis.cardDetail = clientGis.cardDetail
      allResults.client.alw.cardDetail = clientAlw.cardDetail
      allResults.client.afs.cardDetail = clientAfs.cardDetail
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

    // All done!
    return allResults.client
  }

  /**
   * Takes a BenefitResultsObject, and translates the detail property based on the provided translations.
   * If the entitlement result provides a NONE type, that will override the eligibility result.
   */
  private translateResults(): void {
    for (const key in this.benefitResults) {
      const result: BenefitResult = this.benefitResults[key]

      // if initially the eligibility was ELIGIBLE, yet the entitlement is determined to be NONE, override the eligibility.
      // this happens when high income results in no entitlement.
      // this If block was copied to _base and probably not required anymore.
      if (
        result.eligibility.result === ResultKey.ELIGIBLE &&
        result.entitlement.type === EntitlementResultType.NONE
      ) {
        result.eligibility.result = ResultKey.INELIGIBLE
        result.eligibility.reason = ResultReason.INCOME
        result.eligibility.detail = this.translations.detail.mustMeetIncomeReq
      }

      // process detail result
      result.eligibility.detail = BenefitHandler.capitalizeEachLine(
        this.replaceTextVariables(result.eligibility.detail, result)
      )

      // process card main text
      result.cardDetail.mainText = BenefitHandler.capitalizeEachLine(
        this.replaceTextVariables(result.cardDetail.mainText, result)
      )

      console.log('result.cardDetail', result.cardDetail)
      // process card collapsed content
      result.cardDetail.collapsedText = result.cardDetail.collapsedText.map(
        (collapsedText) => ({
          heading: this.replaceTextVariables(collapsedText.heading, result),
          text: this.replaceTextVariables(collapsedText.text, result),
        })
      )
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

    return ageYears + Number((ageMonths / 12).toFixed(1))
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
