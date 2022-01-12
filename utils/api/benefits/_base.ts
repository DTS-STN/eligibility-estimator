import { LegalStatus, LivingCountry } from '../definitions/enums'
import { FieldKey } from '../definitions/fields'
import { BenefitResultObject, CalculationInput } from '../definitions/types'
import { FieldHelper } from '../helpers/fieldClasses'
import { sortFields } from '../helpers/fieldUtils'
import checkAfs from './checkAfs'
import checkAllowance from './checkAllowance'
import checkGis from './checkGis'
import checkOas from './checkOas'

export class BenefitHandler {
  readonly missingFields: FieldKey[]
  readonly requiredFields: FieldKey[]

  constructor(private readonly input: CalculationInput) {
    this.requiredFields = this.getRequiredFields()
    this.missingFields = this.getMissingFields()
  }

  private getRequiredFields(): FieldKey[] {
    const requiredFields = [FieldKey.INCOME]
    if (this.input.income >= 129757) {
      // over highest income, therefore don't need anything else
      return requiredFields
    } else if (this.input.income < 129757) {
      // meets max income req, open up main form
      requiredFields.push(
        FieldKey.AGE,
        FieldKey.LIVING_COUNTRY,
        FieldKey.LEGAL_STATUS,
        FieldKey.MARITAL_STATUS,
        FieldKey.YEARS_IN_CANADA_SINCE_18
      )
    }
    if (this.input.legalStatus == LegalStatus.OTHER) {
      requiredFields.push(FieldKey.LEGAL_STATUS_OTHER)
    }
    if (this.input.maritalStatus.partnered) {
      requiredFields.push(
        FieldKey.PARTNER_INCOME,
        FieldKey.PARTNER_BENEFIT_STATUS
      )
    }
    if (
      (this.input.livingCountry === LivingCountry.CANADA &&
        this.input.yearsInCanadaSince18 < 10) ||
      (this.input.livingCountry === LivingCountry.NO_AGREEMENT &&
        this.input.yearsInCanadaSince18 < 20)
    ) {
      requiredFields.push(FieldKey.EVER_LIVED_SOCIAL_COUNTRY)
    }
    requiredFields.sort(sortFields)
    return requiredFields
  }

  private getMissingFields(): FieldKey[] {
    const missingFields = []
    this.requiredFields.forEach((key) => {
      const value = this.input[key]
      if (
        value === undefined || // checks primitive properties
        (value instanceof FieldHelper && value.provided === false) // checks properties using FieldHelper
      ) {
        missingFields.push(key)
      }
    })
    missingFields.sort(sortFields)
    return missingFields
  }

  getBenefitResultObject(): BenefitResultObject | undefined {
    if (this.missingFields.length) {
      // if there are missing fields, return no results
      return {}
    }
    // otherwise, continue as normal
    return {
      oas: checkOas(this.input),
      gis: checkGis(this.input),
      allowance: checkAllowance(this.input),
      afs: checkAfs(this.input),
    }
  }
}
