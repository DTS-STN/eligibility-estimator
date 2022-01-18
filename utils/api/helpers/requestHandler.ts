import { getTranslations, Translations } from '../../../i18n/api'
import checkAfs from '../benefits/checkAfs'
import checkAllowance from '../benefits/checkAllowance'
import checkGis from '../benefits/checkGis'
import checkOas from '../benefits/checkOas'
import {
  FieldData,
  fieldDefinitions,
  FieldKey,
  FieldType,
} from '../definitions/fields'
import {
  BenefitResultsObject,
  ProcessedInput,
  RequestInput,
  SummaryObject,
} from '../definitions/types'
import {
  FieldHelper,
  LegalStatusHelper,
  LivingCountryHelper,
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from './fieldClasses'
import { SummaryBuilder } from './summaryUtils'

export class RequestHandler {
  readonly processedInput: ProcessedInput
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
      this.processedInput,
      this.requiredFields
    )
    this.fieldData = RequestHandler.getFieldData(
      this.requiredFields,
      this.processedInput._translations
    )
    this.benefitResults = RequestHandler.getBenefitResultObject(
      this.processedInput,
      this.missingFields
    )
    RequestHandler.translateResults(
      this.benefitResults,
      this.processedInput._translations
    )
    this.summary = SummaryBuilder.buildSummaryObject(
      this.processedInput,
      this.benefitResults,
      this.missingFields,
      this.processedInput._translations
    )
  }

  /**
   * Takes the sanitizedInput provided by Joi, and transforms it into a more convenient object to work with.
   * Adds FieldHelpers, normalizes income, adds translations.
   */
  static processSanitizedInput(sanitizedInput: RequestInput): ProcessedInput {
    const translations = getTranslations(sanitizedInput._language)

    return {
      ...sanitizedInput,
      // adds client and partner income into a single combined income
      income: sanitizedInput.partnerIncome
        ? sanitizedInput.income + sanitizedInput.partnerIncome
        : sanitizedInput.income,
      // if canadaWholeLife, assume yearsInCanadaSince18 is 40
      yearsInCanadaSince18: sanitizedInput.canadaWholeLife
        ? 40
        : sanitizedInput.yearsInCanadaSince18,
      livingCountry: new LivingCountryHelper(sanitizedInput.livingCountry),
      legalStatus: new LegalStatusHelper(sanitizedInput.legalStatus),
      maritalStatus: new MaritalStatusHelper(sanitizedInput.maritalStatus),
      partnerBenefitStatus: new PartnerBenefitStatusHelper(
        sanitizedInput.partnerBenefitStatus
      ),
      _translations: translations,
    }
  }

  /**
   * Accepts the ProcessedInput and builds a list of required fields based on that input.
   */
  static getRequiredFields(input: ProcessedInput): FieldKey[] {
    const requiredFields = [FieldKey.INCOME]
    if (input.income >= 129757) {
      // over highest income, therefore don't need anything else
      return requiredFields
    } else if (input.income < 129757) {
      // meets max income req, open up main form
      requiredFields.push(
        FieldKey.AGE,
        FieldKey.LIVING_COUNTRY,
        FieldKey.LEGAL_STATUS,
        FieldKey.MARITAL_STATUS,
        FieldKey.CANADA_WHOLE_LIFE
      )
    }
    if (input.legalStatus.other) {
      requiredFields.push(FieldKey.LEGAL_STATUS_OTHER)
    }
    if (input.canadaWholeLife === false) {
      requiredFields.push(FieldKey.YEARS_IN_CANADA_SINCE_18)
    }
    if (input.maritalStatus.partnered) {
      requiredFields.push(
        FieldKey.PARTNER_INCOME,
        FieldKey.PARTNER_BENEFIT_STATUS
      )
    }
    if (
      (input.livingCountry.canada && input.yearsInCanadaSince18 < 10) ||
      (input.livingCountry.noAgreement && input.yearsInCanadaSince18 < 20)
    ) {
      requiredFields.push(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    }
    requiredFields.sort(RequestHandler.sortFields)
    return requiredFields
  }

  /**
   * Compares the required fields with what has been provided, and builds a list of what is missing.
   */
  static getMissingFields(
    input: ProcessedInput,
    requiredFields: Array<FieldKey>
  ): FieldKey[] {
    const missingFields = []
    requiredFields.forEach((key) => {
      const value = input[key]
      if (
        value === undefined || // checks primitive properties
        (value instanceof FieldHelper && value.provided === false) // checks properties using FieldHelper
      ) {
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
    input: ProcessedInput,
    missingFields: Array<FieldKey>
  ): BenefitResultsObject | undefined {
    if (missingFields.length) {
      return {}
    }
    return {
      oas: checkOas(input),
      gis: checkGis(input),
      allowance: checkAllowance(input),
      afs: checkAfs(input),
    }
  }

  /**
   * Takes a BenefitResultsObject, and translates the detail property based on the provided translations.
   */
  static translateResults(
    results: BenefitResultsObject,
    translations: Translations
  ): void {
    Object.keys(results).forEach((key) => {
      let result = results[key]
      const eligibilityText = translations.result[result.eligibilityResult]
      result.detail = `${eligibilityText}\n${result.detail}`
    })
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
        const questionOptions = translations.questionOptions[fieldData.key]
        if (!questionOptions)
          throw new Error(`no questionOptions for key ${fieldData.key}`)
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
