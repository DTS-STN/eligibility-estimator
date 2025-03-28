import { AlwBenefit } from './benefits/alwBenefit'
import { GisBenefit } from './benefits/gisBenefit'
import { OasBenefit } from './benefits/oasBenefit'
import { getTranslations, Translations } from '../../i18n/api'
import {
  Language,
  LegalStatus,
  PartnerBenefitStatus,
  ResultKey,
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
  ProcessedInput,
  ProcessedInputWithPartner,
  RequestInput,
} from './definitions/types'
import {
  IncomeHelper,
  LegalStatusHelper,
  LivingCountryHelper,
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from './helpers/fieldClasses'
import { BenefitHandler } from './benefitHandler'
import { calculate2013Age } from './helpers/utils'
import { RequestSchema as schema } from './definitions/schemas'

export class FieldsHandler {
  private _translations: Translations
  private _input: ProcessedInputWithPartner
  private _missingFields: FieldKey[]
  private _requiredFields: FieldKey[]
  private _fieldData: FieldConfig[]
  private rawInput: Partial<RequestInput>

  constructor(rawInput: Partial<RequestInput>) {
    this.rawInput = rawInput
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
      this._fieldData = FieldsHandler.getFieldData(
        this.requiredFields,
        this.translations
      )
    return this._fieldData
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
      this.rawInput.incomeWork,
      this.rawInput.partnerIncome,
      this.rawInput.partnerIncomeWork,
      maritalStatusHelper
    )
    const clientInput: ProcessedInput = {
      income: incomeHelper,
      age: this.rawInput.age,
      clientBirthDate: this.rawInput.clientBirthDate,
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
      clientBirthDate: this.rawInput.partnerBirthDate,
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
      yearsInCanadaSinceOAS: this.rawInput.partnerYearsInCanadaSinceOAS,
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
      FieldKey.INCOME_WORK,
      // FieldKey.OAS_DEFER,
      FieldKey.LIVING_COUNTRY,
      // FieldKey.LEGAL_STATUS,
      FieldKey.MARITAL_STATUS,
      FieldKey.LIVED_ONLY_IN_CANADA,
    ]

    // OAS deferral related fields
    const clientAge = this.input.client.age
    const ageJuly2013 = calculate2013Age(
      this.input.client.age,
      this.input.client.clientBirthDate
    )
    if (clientAge >= 65 && clientAge <= getMinBirthYear()) {
      requiredFields.push(FieldKey.ALREADY_RECEIVE_OAS)
    }

    if (this.input.client.receiveOAS && clientAge > 65 && ageJuly2013 <= 70) {
      requiredFields.push(FieldKey.OAS_DEFER_DURATION)
    }

    // default value = undefined
    if (
      this.input.client.livedOnlyInCanada === false ||
      !this.input.client.livingCountry.canada
    ) {
      if (this.input.client.receiveOAS === true) {
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
        this.input.client.yearsInCanadaSince18 < 20 &&
        !this.input.client.receiveOAS)
    ) {
      requiredFields.push(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    }

    if (
      this.input.client.yearsInCanadaSinceOAS !== undefined &&
      !this.input.client.receiveOAS &&
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
      requiredFields.push(FieldKey.PARTNER_INCOME_WORK)

      // if (this.input.partner.age >= 60) {
      //   requiredFields.push(FieldKey.PARTNER_LEGAL_STATUS)
      // }

      if (
        this.input.partner.legalStatus.value &&
        this.input.partner.legalStatus.value !== LegalStatus.NO
      ) {
        if (this.input.partner.livingCountry.canada) {
          requiredFields.push(FieldKey.PARTNER_LIVED_ONLY_IN_CANADA)
        }
        requiredFields.push(FieldKey.PARTNER_LIVING_COUNTRY)
      }

      // default value = undefined
      if (
        this.input.partner.livedOnlyInCanada === false ||
        this.input.partner.livingCountry.value === 'OTH'
      ) {
        if (
          this.input.client.partnerBenefitStatus.value ===
          PartnerBenefitStatus.OAS_GIS
        ) {
          requiredFields.push(FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_OAS)
        } else {
          requiredFields.push(FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18)
        }
      }

      /*
      Make changes to avoid contridictions when showing the Benefit Partner Question: 
        1. when partner is younger than 60, the partner will not be eligible for OAS, GIS, ALW.
        2. when partner is between 60 and 65, partner will not be eligible for OAS
        3. Only show it when: partner is older than 65 (and age is valid)
       */

      if (
        this.input.partner.age >= 65 &&
        !schema.extract('partnerAge').validate(this.input.partner.age)['error']
      ) {
        requiredFields.push(FieldKey.PARTNER_BENEFIT_STATUS)
      }
    }

    requiredFields.sort(FieldsHandler.sortFields)
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
    missingFields.sort(FieldsHandler.sortFields)
    return missingFields
  }

  getPartnerBenefitStatus(
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
   * Accepts a single string and replaces any {VARIABLES} with the appropriate value.
   * Optionally accepts a benefitResult, which will be used as context for certain replacement rules.
   */
  replaceTextVariables(
    benefitHandlerInstance,
    textToProcess: string,
    benefitResult?: BenefitResult
  ): string {
    if (textToProcess) {
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
          replacementRule(benefitHandlerInstance, benefitResult)
        )
      }
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
      field.label = handler.fields.replaceTextVariables(handler, field.label)
      field.helpText = handler.fields.replaceTextVariables(
        handler,
        field.helpText
      )
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
    if (s) {
      const lines: string[] = s.split('\n')
      return lines
        .reduce((result, line) => {
          return result + this.capitalizeFirstChar(line) + '\n'
        }, '')
        .trim()
    }
  }

  /**
   * Accepts a string, and capitalizes the first character.
   */
  static capitalizeFirstChar(s: string): string {
    return s[0].toUpperCase() + s.slice(1)
  }
}
