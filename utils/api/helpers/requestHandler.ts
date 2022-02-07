import {
  getTranslations,
  numberToStringCurrency,
  Translations,
} from '../../../i18n/api'
import { AfsBenefit } from '../benefits/afsBenefit'
import { AlwBenefit } from '../benefits/alwBenefit'
import { GisBenefit } from '../benefits/gisBenefit'
import { OasBenefit } from '../benefits/oasBenefit'
import { PartnerBenefitStatus } from '../definitions/enums'
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
  readonly processedInput: ProcessedInputWithPartner
  readonly missingFields: FieldKey[]
  readonly requiredFields: FieldKey[]
  readonly fieldData: FieldData[]
  readonly benefitResults: BenefitResultsObject
  readonly summary: SummaryObject

  constructor(private readonly requestInput: RequestInput) {
    this.processedInput = RequestHandler.processSanitizedInput(
      this.requestInput
    )
    this.requiredFields = RequestHandler.getRequiredFields(this.processedInput)
    this.missingFields = RequestHandler.getMissingFields(
      this.requestInput,
      this.requiredFields
    )
    this.fieldData = RequestHandler.getFieldData(
      this.requiredFields,
      this.processedInput._translations
    )
    this.benefitResults = RequestHandler.getBenefitResultObject(
      this.processedInput,
      this.processedInput._translations,
      this.missingFields
    )
    RequestHandler.translateResults(
      this.benefitResults,
      this.processedInput._translations
    )
    this.summary = SummaryBuilder.buildSummaryObject(
      this.processedInput.client,
      this.benefitResults,
      this.missingFields,
      this.processedInput._translations
    )
    RequestHandler.replaceAllTextVariables(
      this.benefitResults,
      this.summary,
      this.fieldData,
      this.processedInput._translations
    )
  }

  /**
   * Takes the sanitizedInput provided by Joi, and transforms it into a more convenient object to work with.
   * Adds FieldHelpers, normalizes income, adds translations.
   */
  static processSanitizedInput(
    sanitizedInput: RequestInput
  ): ProcessedInputWithPartner {
    const translations = getTranslations(sanitizedInput._language)

    // shared between partners
    const maritalStatusHelper = new MaritalStatusHelper(
      sanitizedInput.maritalStatus
    )
    // shared between partners
    const incomeHelper = new IncomeHelper(
      sanitizedInput.income,
      sanitizedInput.partnerIncome,
      maritalStatusHelper
    )
    const clientInput: ProcessedInput = {
      income: incomeHelper,
      age: sanitizedInput.age,
      maritalStatus: maritalStatusHelper,
      livingCountry: new LivingCountryHelper(sanitizedInput.livingCountry),
      legalStatus: new LegalStatusHelper(sanitizedInput.legalStatus),
      canadaWholeLife: sanitizedInput.canadaWholeLife,
      // if canadaWholeLife, assume yearsInCanadaSince18 is 40
      yearsInCanadaSince18: sanitizedInput.canadaWholeLife
        ? 40
        : sanitizedInput.yearsInCanadaSince18,
      everLivedSocialCountry: sanitizedInput.everLivedSocialCountry,
      partnerBenefitStatus: new PartnerBenefitStatusHelper(
        sanitizedInput.partnerBenefitStatus
      ),
    }
    const partnerInput: ProcessedInput = {
      income: incomeHelper,
      age: sanitizedInput.partnerAge,
      maritalStatus: maritalStatusHelper,
      livingCountry: new LivingCountryHelper(
        sanitizedInput.partnerLivingCountry
      ),
      legalStatus: new LegalStatusHelper(sanitizedInput.partnerLegalStatus),
      canadaWholeLife: sanitizedInput.partnerCanadaWholeLife,
      yearsInCanadaSince18: sanitizedInput.partnerCanadaWholeLife
        ? 40
        : sanitizedInput.partnerYearsInCanadaSince18,
      everLivedSocialCountry: sanitizedInput.partnerEverLivedSocialCountry,
      partnerBenefitStatus: new PartnerBenefitStatusHelper(
        PartnerBenefitStatus.HELP_ME
      ),
    }
    return {
      client: clientInput,
      partner: partnerInput,
      _translations: translations,
    }
  }

  /**
   * Accepts the ProcessedInput and builds a list of required fields based on that input.
   */
  static getRequiredFields(input: ProcessedInputWithPartner): FieldKey[] {
    const requiredFields = [FieldKey.INCOME]
    if (input.client.income.client >= legalValues.MAX_OAS_INCOME) {
      // over highest income, therefore don't need anything else
      return requiredFields
    } else if (input.client.income.client < legalValues.MAX_OAS_INCOME) {
      // meets max income req, open up main form
      requiredFields.push(
        FieldKey.AGE,
        FieldKey.LIVING_COUNTRY,
        FieldKey.LEGAL_STATUS,
        FieldKey.MARITAL_STATUS,
        FieldKey.CANADA_WHOLE_LIFE
      )
    }
    if (input.client.legalStatus.other) {
      requiredFields.push(FieldKey.LEGAL_STATUS_OTHER)
    }
    if (input.client.canadaWholeLife === false) {
      requiredFields.push(FieldKey.YEARS_IN_CANADA_SINCE_18)
    }
    if (
      (input.client.livingCountry.canada &&
        input.client.yearsInCanadaSince18 < 10) ||
      (input.client.livingCountry.noAgreement &&
        input.client.yearsInCanadaSince18 < 20)
    ) {
      requiredFields.push(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    }

    if (input.client.maritalStatus.partnered) {
      requiredFields.push(
        FieldKey.PARTNER_INCOME,
        FieldKey.PARTNER_BENEFIT_STATUS
      )
      if (input.client.partnerBenefitStatus.helpMe) {
        requiredFields.push(
          FieldKey.PARTNER_AGE,
          FieldKey.PARTNER_LEGAL_STATUS,
          FieldKey.PARTNER_LIVING_COUNTRY,
          FieldKey.PARTNER_CANADA_WHOLE_LIFE
        )
      }
      if (input.partner.canadaWholeLife === false) {
        requiredFields.push(FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18)
      }
      if (
        (input.partner.livingCountry.canada &&
          input.partner.yearsInCanadaSince18 < 10) ||
        (input.partner.livingCountry.noAgreement &&
          input.partner.yearsInCanadaSince18 < 20)
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
  static getMissingFields(
    input: RequestInput,
    requiredFields: Array<FieldKey>
  ): FieldKey[] {
    const missingFields = []
    requiredFields.forEach((key) => {
      const value = input[key]
      if (value === undefined) {
        missingFields.push(key)
      }
    })
    missingFields.sort(RequestHandler.sortFields)
    return missingFields
  }

  /**
   * Returns the BenefitResultObject based on the user's input.
   * If any fields are missing, return no results.
   */
  static getBenefitResultObject(
    input: ProcessedInputWithPartner,
    translations: Translations,
    missingFields: Array<FieldKey>
  ): BenefitResultsObject {
    if (missingFields.length) {
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
    const clientOas = new OasBenefit(input.client, translations)
    allResults.client.oas.eligibility = clientOas.eligibility
    allResults.client.oas.entitlement = clientOas.entitlement

    // If the client needs help, check their partner's OAS.
    if (input.client.partnerBenefitStatus.helpMe) {
      const partnerOas = new OasBenefit(input.partner, translations)
      allResults.partner.oas.eligibility = partnerOas.eligibility
      allResults.partner.oas.entitlement = partnerOas.entitlement

      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's GIS
      input.client.partnerBenefitStatus.oasResultEntitlement =
        partnerOas.entitlement
      // Save the client result to the partner's partnerBenefitStatus field, which is not yet used for anything
      input.partner.partnerBenefitStatus.oasResultEntitlement =
        clientOas.entitlement
    }

    // All done with OAS, move onto GIS, but only do GIS eligibility for now.
    const clientGis = new GisBenefit(
      input.client,
      translations,
      allResults.client.oas
    )
    allResults.client.gis.eligibility = clientGis.eligibility

    // If the client needs help, check their partner's GIS eligibility.
    if (input.client.partnerBenefitStatus.helpMe) {
      const partnerGis = new GisBenefit(
        input.partner,
        translations,
        allResults.partner.oas
      )
      allResults.partner.gis.eligibility = partnerGis.eligibility

      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's ALW
      input.client.partnerBenefitStatus.gisResultEligibility =
        partnerGis.eligibility
      // Save the client result to the partner's partnerBenefitStatus field, which is used for partner's ALW, and therefore client's GIS
      input.partner.partnerBenefitStatus.gisResultEligibility =
        clientGis.eligibility
    }

    // Moving onto ALW, again only doing eligibility.
    const clientAlw = new AlwBenefit(input.client, translations)
    allResults.client.alw.eligibility = clientAlw.eligibility

    // If the client needs help, check their partner's ALW eligibility.
    if (input.client.partnerBenefitStatus.helpMe) {
      const partnerAlw = new AlwBenefit(input.partner, translations)
      allResults.partner.alw.eligibility = partnerAlw.eligibility

      // Save the partner result to the client's partnerBenefitStatus field, which is used for client's GIS
      input.client.partnerBenefitStatus.alwResultEligibility =
        partnerAlw.eligibility
      // Save the client result to the partner's partnerBenefitStatus field, which is not yet used for anything
      input.partner.partnerBenefitStatus.alwResultEligibility =
        clientAlw.eligibility
    }

    // Moving onto AFS, again only doing eligibility.
    const clientAfs = new AfsBenefit(input.client, translations)
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
  static translateResults(
    results: BenefitResultsObject,
    translations: Translations
  ): void {
    for (const key in results) {
      const result: BenefitResult = results[key]
      const eligibilityText = translations.result[result.eligibility.result] // ex. "eligible" or "not eligible"
      const detailText = result.eligibility.detail // ex. "likely eligible for this benefit"
      const detailOverrideText = result.entitlement.detailOverride // ex. "likely eligible, but partial oas"
      const usedDetailText = detailOverrideText
        ? detailOverrideText
        : detailText
      result.eligibility.detail = `${eligibilityText}\n${usedDetailText}`
      delete result.entitlement.detailOverride // so this is not passed into the response
    }
  }

  /**
   * Processes all text generated thus far, and replaces any {VARIABLES} with the appropriate value.
   */
  private static replaceAllTextVariables(
    benefitResults: BenefitResultsObject,
    summary: SummaryObject,
    fieldData: FieldData[],
    translations: Translations
  ) {
    for (const key in benefitResults) {
      const result: BenefitResult = benefitResults[key]
      result.eligibility.detail = RequestHandler.replaceTextVariables(
        result.eligibility.detail,
        summary,
        translations
      )
    }
    for (const key in fieldData) {
      const result: FieldData = fieldData[key]
      result.label = RequestHandler.replaceTextVariables(
        result.label,
        summary,
        translations
      )
    }
    summary.details = RequestHandler.replaceTextVariables(
      summary.details,
      summary,
      translations
    )
  }

  /**
   * Utility function for the above, will accept a single string and replace any {VARIABLES} with the appropriate value.
   */
  private static replaceTextVariables(
    textToProcess: string,
    summary: SummaryObject,
    translations: Translations
  ): string {
    textToProcess = textToProcess
      .replace(
        '{ENTITLEMENT_AMOUNT}',
        numberToStringCurrency(summary.entitlementSum, translations._locale)
      )
      .replace(
        '{MAX_OAS_INCOME}',
        numberToStringCurrency(
          legalValues.MAX_OAS_INCOME,
          translations._locale,
          { rounding: 0 }
        )
      )
      .replace(
        '{LINK_SERVICE_CANADA}',
        `<a href="${translations.links.SC.url}" target="_blank">${translations.links.SC.text}</a>`
      )
      .replace(
        '{LINK_SOCIAL_AGREEMENT}',
        `<a href="${translations.links.socialAgreement.url}" target="_blank">${translations.links.socialAgreement.text}</a>`
      )
    return textToProcess
  }

  /**
   * Accepts a list of requiredFields, transforms that into a full list of field configurations for the frontend to use.
   */
  static getFieldData(
    requiredFields: Array<FieldKey>,
    translations: Translations
  ): FieldData[] {
    // takes list of keys, builds list of definitions
    const fieldDataList = requiredFields.map((x) => fieldDefinitions[x])

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
