import Joi from 'joi'
import { AGREEMENT_COUNTRIES, ALL_COUNTRY_CODES } from '../helpers/countryUtils'
import legalValues from '../scrapers/output'
import {
  Language,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ValidationErrors,
} from './enums'
import { MonthsYears } from './types'

/**
 * This is what the API expects to receive, with the below exceptions due to normalization:
 * - livingCountry accepts a string
 * - partnerIncome will be added to income if it is present
 *
 * When updating this, ensure you update:
 * - openapi.yaml
 * - insomnia.yaml (optional as it is infrequently used)
 * - fields.ts
 * - types.ts
 * - index.test.ts
 *
 */

export const getMinBirthYear = () => {
  const wholeYear = new Date().getFullYear() - 1900
  const partialYear = (new Date().getMonth() / 12).toFixed(1)
  return wholeYear + parseFloat(partialYear)
}
// Validate if the age is not under 18
// and the birth year is between 1800 and the current year
const customAgeValidation = (value, helpers) => {
  const currentYear = new Date().getFullYear()
  const age = value
  const birthYear = currentYear - age

  if (birthYear < 1899 || birthYear > currentYear) {
    return helpers.message(ValidationErrors.invalidAge)
  } else if (age < 18) {
    return helpers.message(ValidationErrors.ageUnder18)
  }

  return value
}
export const RequestSchema = Joi.object({
  incomeAvailable: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.provideIncomeEmpty }),
  income: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.incomeEmpty })
    .precision(2)
    .min(0)
    .message(ValidationErrors.incomeBelowZero),
  // .less(
  //   Joi.ref('age', {
  //     adjust: (age) =>
  //       age >= 75
  //         ? legalValues.oas.incomeLimit75
  //         : legalValues.oas.incomeLimit,
  //   })
  // )
  // .message(ValidationErrors.incomeTooHigh),
  incomeWork: Joi.number()
    .default(0)
    .required()
    .messages({ 'any.required': ValidationErrors.incomeWorkEmpty })
    .precision(2)
    .min(0)
    .message(ValidationErrors.incomeBelowZero),
  age: Joi.number()
    .required()
    .messages({
      'any.required': ValidationErrors.invalidAge,
      'number.base': ValidationErrors.invalidAge,
    })
    .custom(customAgeValidation, 'Custom Validation'),
  receiveOAS: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.receiveOASEmpty }),
  whenToStartOAS: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.whenToStartOAS }),
  startDateForOAS: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.startDateForOAS })
    .custom((value, helpers) => {
      const { age } = helpers.state.ancestors[0]

      if (value === 0) {
        return helpers.message({
          custom: ValidationErrors.startDateForOAS,
        })
      }

      // hack. control returns a negative value for dates in the future
      const startDate: number = value > 0 ? value : value * -1

      if (startDate + age < 65.08) {
        return helpers.message({
          custom: ValidationErrors.startDateForOAS,
        })
      }
      return value
    }, 'custom validation for the "yearsInCanadaSince18" question'),
  oasDeferDuration: Joi.string(),
  oasDefer: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.oasDeferEmpty }),
  oasAge: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.oasAge65to70 })
    .min(65)
    .message(ValidationErrors.oasAge65to70)
    .max(70)
    .message(ValidationErrors.oasAge65to70),
  maritalStatus: Joi.string()
    .required()
    .messages({ 'any.required': ValidationErrors.maritalStatusEmpty })
    .valid(...Object.values(MaritalStatus))
    .messages({ 'any.invalid': ValidationErrors.maritalUnavailable }),
  invSeparated: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.invSeparatedEmpty }),
  livingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  legalStatus: Joi.string()
    .required()
    .messages({ 'any.required': ValidationErrors.legalStatusNotSelected })
    .valid(...Object.values(LegalStatus))
    .invalid(LegalStatus.NO)
    .messages({ 'any.invalid': ValidationErrors.legalUnavailable }),
  livedOnlyInCanada: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.onlyInCanadaEmpty }),
  yearsInCanadaSince18: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.yearsInCanadaMinusAge })
    .custom((value, helpers) => {
      const { age, yearsInCanadaSince18, livingCountry, receiveOAS } =
        helpers.state.ancestors[0]

      if (value === 0) {
        return helpers.message({
          custom: ValidationErrors.yearsInCanadaMinusAge,
        })
      }

      if (livingCountry === LivingCountry.CANADA) {
        if (age > 0 && yearsInCanadaSince18 !== undefined) {
          if (age - 18 < yearsInCanadaSince18) {
            return helpers.message({
              custom: ValidationErrors.yearsInCanadaMinusAge,
            })
          }
        }
      } else {
        if (age > 0 && yearsInCanadaSince18 !== undefined) {
          if (yearsInCanadaSince18 >= 20) {
            if (age - 18 < yearsInCanadaSince18) {
              return helpers.message({
                custom: ValidationErrors.yearsInCanadaMinusAge,
              })
            }
          }
        }
      }
      return value
    }, 'custom validation for the "yearsInCanadaSince18" question'),
  yearsInCanadaSinceOAS: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.yearsInCanadaMinusAge })
    .custom((value, helpers) => {
      const { age, oasDeferDuration, livingCountry, yearsInCanadaSinceOAS } =
        helpers.state.ancestors[0]

      if (value === 0) {
        return helpers.message({
          custom: ValidationErrors.yearsInCanadaMinusAge,
        })
      }

      const duration: MonthsYears =
        oasDeferDuration !== undefined
          ? JSON.parse(oasDeferDuration)
          : { years: 0, months: 0 }

      const durationFloat = duration.years + duration.months / 12

      if (livingCountry === LivingCountry.CANADA) {
        if (
          durationFloat !== undefined &&
          yearsInCanadaSinceOAS !== undefined
        ) {
          if (yearsInCanadaSinceOAS - durationFloat < 10) {
            return helpers.message({
              custom: ValidationErrors.yearsInCanadaMinusDeferred,
            })
          } else {
            if (age > 0 && yearsInCanadaSinceOAS !== undefined) {
              if (age - 18 < yearsInCanadaSinceOAS) {
                return helpers.message({
                  custom: ValidationErrors.yearsInCanadaMinusAge,
                })
              }
            }
          }
        }
      } else {
        if (
          durationFloat !== undefined &&
          yearsInCanadaSinceOAS !== undefined
        ) {
          if (yearsInCanadaSinceOAS - durationFloat < 20) {
            return helpers.message({
              custom: ValidationErrors.yearsNotInCanadaMinusDeferred,
            })
          } else {
            if (age > 0 && yearsInCanadaSinceOAS !== undefined) {
              if (age - 18 < yearsInCanadaSinceOAS) {
                return helpers.message({
                  custom: ValidationErrors.yearsInCanadaMinusAge,
                })
              }
            }
          }
        }
      }
      return value
    }, 'custom validation for the "yearsInCanadaSinceOAS" question'),
  everLivedSocialCountry: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.socialCountryEmpty })
    .custom((value, helpers) => {
      const { livingCountry, yearsInCanadaSince18 } = helpers.state.ancestors[0]
      if (livingCountry === 'CAN' && yearsInCanadaSince18 !== undefined) {
        // if (yearsInCanadaSince18 < 10) {
        //   return helpers.message({
        //     custom: value
        //       ? ValidationErrors.socialCountryUnavailable10
        //       : ValidationErrors.yearsInCanadaNotEnough10,
        //   })
        // }
      } else {
        if (yearsInCanadaSince18 < 20) {
          return helpers.message({
            custom: value
              ? ValidationErrors.socialCountryUnavailable20
              : ValidationErrors.yearsInCanadaNotEnough20,
          })
        }
      }
      const { yearsInCanadaSinceOAS } = helpers.state.ancestors[0]
      if (livingCountry === 'CAN' && yearsInCanadaSinceOAS !== undefined) {
        if (yearsInCanadaSinceOAS < 10) {
          return helpers.message({
            custom: value
              ? ValidationErrors.socialCountryUnavailable10
              : ValidationErrors.yearsInCanadaNotEnough10,
          })
        }
      } else {
        if (yearsInCanadaSinceOAS < 20) {
          return helpers.message({
            custom: value
              ? ValidationErrors.socialCountryUnavailable20
              : ValidationErrors.yearsInCanadaNotEnough20,
          })
        }
      }
      return value
    }, 'custom validation for the "everLivedSocialCountry" question'),
  partnerBenefitStatus: Joi.string()
    .required()
    .messages({ 'any.required': ValidationErrors.partnerBenefitStatusEmpty })
    .valid(...Object.values(PartnerBenefitStatus)),
  partnerIncomeAvailable: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.providePartnerIncomeEmpty }),
  partnerIncome: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.partnerIncomeEmpty })
    .precision(2)
    .min(0)
    .message(ValidationErrors.partnerIncomeBelowZero),
  // .less(
  //   Joi.ref('income', {
  //     adjust: (income) => legalValues.oas.incomeLimit - income,
  //   })
  // )
  // .message(ValidationErrors.partnerIncomeTooHigh),
  partnerIncomeWork: Joi.number()
    .default(0)
    .required()
    .messages({ 'any.required': ValidationErrors.partnerIncomeWorkEmpty })
    .precision(2)
    .min(0)
    .message(ValidationErrors.incomeBelowZero),
  //.max(Joi.ref('partnerIncome'))
  //.message(ValidationErrors.partnerIncomeWorkGreaterThanNetIncome),
  partnerAge: Joi.number()
    .required()
    .messages({
      'any.required': ValidationErrors.invalidAge,
      'number.base': ValidationErrors.invalidAge,
    })
    .custom(customAgeValidation, 'Custom Validation'),
  partnerLivingCountry: Joi.string()
    .required()
    .valid(...Object.values(ALL_COUNTRY_CODES)),
  partnerLegalStatus: Joi.string()
    .required()
    .messages({
      'any.required': ValidationErrors.partnerLegalStatusNotSelected,
    })
    .valid(...Object.values(LegalStatus)),
  partnerLivedOnlyInCanada: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.partnerOnlyInCanadaEmpty }),
  partnerYearsInCanadaSince18: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.partnerYearsSince18Empty })
    .integer()
    .max(Joi.ref('partnerAge', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.partnerYearsSince18Empty),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
})
