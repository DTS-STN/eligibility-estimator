import {
  getTranslations,
  numberToStringCurrency,
  Translations,
} from '../../../i18n/api'
import { AfsBenefit } from '../benefits/afsBenefit'
import { AlwBenefit } from '../benefits/alwBenefit'
import { GisBenefit } from '../benefits/gisBenefit'
import { OasBenefit } from '../benefits/oasBenefit'
import {
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  FieldData,
  fieldDefinitions,
  FieldKey,
  FieldType,
} from '../definitions/fields'
import {
  BenefitResult,
  BenefitResultsObject,
  BenefitResultsObjectWithPartner,
  ProcessedInput,
  ProcessedInputWithPartner,
  RequestInput,
  SummaryObject,
} from '../definitions/types'
import { legalValues } from '../scrapers/output'
import {
  IncomeHelper,
  LegalStatusHelper,
  LivingCountryHelper,
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from './fieldClasses'
import { SummaryBuilder } from './summaryUtils'

export class RequestHandler {
  private _translations: Translations
  private _input: ProcessedInputWithPartner
  private _missingFields: FieldKey[]
  private _requiredFields: FieldKey[]
  private _fieldData: FieldData[]
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

  get fieldData(): FieldData[] {
    if (this._fieldData === undefined) {
      this._fieldData = this.getFieldData()
      for (const key in this._fieldData) {
        const field: FieldData = this._fieldData[key]
        field.label = this.replaceTextVariables(field.label)
      }
    }
    return this._fieldData
  }

  get benefitResults(): BenefitResultsObject {
    if (this._benefitResults === undefined) {
      this._benefitResults = this.getBenefitResultObject()
      this.translateResults()
      for (const key in this._benefitResults) {
        const result: BenefitResult = this._benefitResults[key]
        result.eligibility.detail = this.replaceTextVariables(
          result.eligibility.detail
        )
      }
    }
    return this._benefitResults
  }

  get summary(): SummaryObject {
    if (this._summary === undefined) {
      this._summary = SummaryBuilder.buildSummaryObject(
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
      this.rawInput.income,
      this.rawInput.partnerIncome,
      maritalStatusHelper
    )
    const clientInput: ProcessedInput = {
      income: incomeHelper,
      age: this.rawInput.age,
      maritalStatus: maritalStatusHelper,
      livingCountry: new LivingCountryHelper(this.rawInput.livingCountry),
      legalStatus: new LegalStatusHelper(this.rawInput.legalStatus),
      canadaWholeLife: this.rawInput.canadaWholeLife,
      // if canadaWholeLife, assume yearsInCanadaSince18 is 40
      yearsInCanadaSince18: this.rawInput.canadaWholeLife
        ? 40
        : this.rawInput.yearsInCanadaSince18,
      everLivedSocialCountry: this.rawInput.everLivedSocialCountry,
      partnerBenefitStatus: new PartnerBenefitStatusHelper(
        this.rawInput.partnerBenefitStatus
      ),
    }
    const partnerInput: ProcessedInput = {
      income: incomeHelper,
      age: this.rawInput.partnerAge,
      maritalStatus: maritalStatusHelper,
      livingCountry: new LivingCountryHelper(
        this.rawInput.partnerLivingCountry
      ),
      legalStatus: new LegalStatusHelper(this.rawInput.partnerLegalStatus),
      canadaWholeLife: this.rawInput.partnerCanadaWholeLife,
      yearsInCanadaSince18: this.rawInput.partnerCanadaWholeLife
        ? 40
        : this.rawInput.partnerYearsInCanadaSince18,
      everLivedSocialCountry: this.rawInput.partnerEverLivedSocialCountry,
      partnerBenefitStatus: new PartnerBenefitStatusHelper(
        PartnerBenefitStatus.HELP_ME
      ),
    }
    return {
      client: clientInput,
      partner: partnerInput,
      _translations: this.translations,
    }
  }

  /**
   * Accepts the ProcessedInput and builds a list of required fields based on that input.
   */
  private getRequiredFields(): FieldKey[] {
    const requiredFields = [FieldKey.INCOME]
    if (this.input.client.income.client >= legalValues.MAX_OAS_INCOME) {
      // over highest income, therefore don't need anything else
      return requiredFields
    } else if (this.input.client.income.client < legalValues.MAX_OAS_INCOME) {
      // meets max income req, open up main form
      requiredFields.push(
        FieldKey.AGE,
        FieldKey.LIVING_COUNTRY,
        FieldKey.LEGAL_STATUS,
        FieldKey.MARITAL_STATUS,
        FieldKey.CANADA_WHOLE_LIFE
      )
    }
    if (this.input.client.legalStatus.other) {
      requiredFields.push(FieldKey.LEGAL_STATUS_OTHER)
    }
    if (this.input.client.canadaWholeLife === false) {
      requiredFields.push(FieldKey.YEARS_IN_CANADA_SINCE_18)
    }
    if (
      (this.input.client.livingCountry.canada &&
        this.input.client.yearsInCanadaSince18 < 10) ||
      (this.input.client.livingCountry.noAgreement &&
        this.input.client.yearsInCanadaSince18 < 20)
    ) {
      requiredFields.push(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    }
    if (this.input.client.maritalStatus.partnered) {
      requiredFields.push(
        FieldKey.PARTNER_INCOME,
        FieldKey.PARTNER_BENEFIT_STATUS
      )
      if (this.input.client.partnerBenefitStatus.helpMe) {
        requiredFields.push(
          FieldKey.PARTNER_AGE,
          FieldKey.PARTNER_LEGAL_STATUS,
          FieldKey.PARTNER_LIVING_COUNTRY,
          FieldKey.PARTNER_CANADA_WHOLE_LIFE
        )
      }
      if (this.input.partner.canadaWholeLife === false) {
        requiredFields.push(FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18)
      }
      if (
        (this.input.partner.livingCountry.canada &&
          this.input.partner.yearsInCanadaSince18 < 10) ||
        (this.input.partner.livingCountry.noAgreement &&
          this.input.partner.yearsInCanadaSince18 < 20)
      ) {
        requiredFields.push(FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY)
      }
    }

    requiredFields.sort(RequestHandler.sortFields)
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
    missingFields.sort(RequestHandler.sortFields)
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

    const allResults: BenefitResultsObjectWithPartner = {
      client: {
        oas: { eligibility: undefined, entitlement: undefined },
        gis: { eligibility: undefined, entitlement: undefined },
        alw: { eligibility: undefined, entitlement: undefined },
        afs: { eligibility: undefined, entitlement: undefined },
      },
      partner: {
        oas: { eligibility: undefined, entitlement: undefined },
        gis: { eligibility: undefined, entitlement: undefined },
        alw: { eligibility: undefined, entitlement: undefined },
        afs: { eligibility: undefined, entitlement: undefined },
      },
    }

    // Check OAS. Does both Eligibility and Entitlement, as there are no dependencies.
    const clientOas = new OasBenefit(this.input.client, this.translations)
    allResults.client.oas.eligibility = clientOas.eligibility
    allResults.client.oas.entitlement = clientOas.entitlement

    // If the client needs help, check their partner's OAS.
    if (this.input.client.partnerBenefitStatus.helpMe) {
      const partnerOas = new OasBenefit(this.input.partner, this.translations)
      allResults.partner.oas.eligibility = partnerOas.eligibility
      allResults.partner.oas.entitlement = partnerOas.entitlement

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
    allResults.client.gis.entitlement = clientGis.entitlement

    // Continue with ALW entitlement.
    allResults.client.alw.entitlement = clientAlw.entitlement

    // Finish with AFS entitlement.
    allResults.client.afs.entitlement = clientAfs.entitlement

    // All done!
    return allResults.client
  }

  /**
   * Takes a BenefitResultsObject, and translates the detail property based on the provided translations.
   * If the entitlement result provides a detailOverride, that will take precedence over the eligibility result's detail.
   */
  private translateResults(): void {
    for (const key in this.benefitResults) {
      const result: BenefitResult = this.benefitResults[key]
      const eligibilityText =
        this.translations.result[result.eligibility.result] // ex. "eligible" or "not eligible"

      // uses the detail text from the eligibility result, or the entitlement result's override if provided
      const detailText = result.eligibility.detail // ex. "likely eligible for this benefit"
      const detailOverrideText = result.entitlement.detailOverride // ex. "likely eligible, but partial oas"
      delete result.entitlement.detailOverride // so this is not passed into the response
      const usedDetailText = detailOverrideText ?? detailText

      // if client is ineligible, the table will be populated with a link to view more reasons
      const ineligibilityText =
        result.eligibility.result === ResultKey.INELIGIBLE &&
        result.eligibility.reason !== ResultReason.AGE_YOUNG // do not add additional reasons when they will be eligible in the future
          ? ` ${this.translations.detail.additionalReasons}`
          : ''

      // replaces LINK_MORE_REASONS with LINK_MORE_REASONS_OAS, which is then replaced with a link during replaceAllTextVariables()
      const ineligibilityTextWithBenefit = ineligibilityText.replace(
        '{LINK_MORE_REASONS}',
        `{LINK_MORE_REASONS_${key.toUpperCase()}}`
      )

      result.eligibility.detail = `${eligibilityText}\n${usedDetailText}${ineligibilityTextWithBenefit}`
    }
  }

  /**
   * Accepts a single string and replaces any {VARIABLES} with the appropriate value.
   */
  private replaceTextVariables(textToProcess: string): string {
    textToProcess = textToProcess
      .replace(
        '{ENTITLEMENT_AMOUNT}',
        `<strong className="font-bold">${numberToStringCurrency(
          this.summary.entitlementSum,
          this.translations._locale
        )}</strong>`
      )
      .replace(
        '{MAX_OAS_INCOME}',
        `<strong className="font-bold">${numberToStringCurrency(
          legalValues.MAX_OAS_INCOME,
          this.translations._locale,
          { rounding: 0 }
        )}</strong>`
      )
      .replace(
        '{LINK_SERVICE_CANADA}',
        `<a href="${this.translations.links.SC.url}" target="_blank">${this.translations.links.SC.text}</a>`
      )
      .replace(
        '{LINK_SOCIAL_AGREEMENT}',
        `<a href="${this.translations.links.socialAgreement.url}" target="_blank">${this.translations.links.socialAgreement.text}</a>`
      )
      .replace(
        '{LINK_OAS_DEFER}',
        `<a href="${this.translations.links.oasDeferClickHere.url}" target="_blank">${this.translations.links.oasDeferClickHere.text}</a>`
      )
      .replace(
        '{LINK_MORE_REASONS_OAS}',
        `<a href="${this.translations.links.oasReasons.url}" target="_blank">${this.translations.links.oasReasons.text}</a>`
      )
      .replace(
        '{LINK_MORE_REASONS_GIS}',
        `<a href="${this.translations.links.gisReasons.url}" target="_blank">${this.translations.links.gisReasons.text}</a>`
      )
      .replace(
        '{LINK_MORE_REASONS_ALW}',
        `<a href="${this.translations.links.alwReasons.url}" target="_blank">${this.translations.links.alwReasons.text}</a>`
      )
      .replace(
        '{LINK_MORE_REASONS_AFS}',
        `<a href="${this.translations.links.afsReasons.url}" target="_blank">${this.translations.links.afsReasons.text}</a>`
      )
    return textToProcess
  }

  /**
   * Accepts a list of requiredFields, transforms that into a full list of field configurations for the frontend to use.
   */
  private getFieldData(): FieldData[] {
    // takes list of keys, builds list of definitions
    const fieldDataList = this.requiredFields.map((x) => fieldDefinitions[x])

    // applies translations
    fieldDataList.map((fieldData) => {
      // translate category
      const category = this.translations.category[fieldData.category.key]
      if (!category)
        throw new Error(`no category for key ${fieldData.category}`)
      fieldData.category.text = category

      // translate label/question
      const label = this.translations.question[fieldData.key]
      if (!label) throw new Error(`no question for key ${fieldData.key}`)
      fieldData.label = label

      // translate values/questionOptions
      if (
        fieldData.type === FieldType.DROPDOWN ||
        fieldData.type === FieldType.DROPDOWN_SEARCHABLE ||
        fieldData.type === FieldType.RADIO
      ) {
        // looks up using the main key first
        let questionOptions = this.translations.questionOptions[fieldData.key]
        if (!questionOptions)
          // if that fails, uses the relatedKey instead
          questionOptions =
            this.translations.questionOptions[fieldData.relatedKey]
        if (!questionOptions)
          throw new Error(
            `no questionOptions for key ${fieldData.key} or relatedKey ${fieldData.relatedKey}`
          )
        fieldData.values = questionOptions
      }

      return fieldData
    })

    return fieldDataList
  }

  /**
   * Sorts fields by the order specified in fieldDefinitions.
   */
  static sortFields(a: string, b: string): number {
    return fieldDefinitions[a].order - fieldDefinitions[b].order
  }
}
