import Joi from 'joi'
import { AGREEMENT_COUNTRIES, ALL_COUNTRY_CODES } from '../helpers/countryUtils'
import legalValues from '../scrapers/output'
import {
  Language,
  LegalStatus,
  MaritalStatus,
  PartnerBenefitStatus,
  ValidationErrors,
} from './enums'

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

const getMinBirthYear = () => {
  const wholeYear = new Date().getFullYear() - 1900
  const partialYear = (new Date().getMonth() / 12).toFixed(1)
  return wholeYear + parseFloat(partialYear)
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
  age: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.invalidAge })
    .min(18)
    .message(ValidationErrors.invalidAge)
    .max(getMinBirthYear())
    .message(ValidationErrors.invalidAge),
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
  livedOutsideCanada: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.outsideCanadaEmpty }),
  yearsInCanadaSince18: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.yearsSince18Empty })
    .integer()
    .max(Joi.ref('age', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.yearsInCanadaMinusAge),
  everLivedSocialCountry: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.socialCountryEmpty })
    .custom((value, helpers) => {
      const { livingCountry, yearsInCanadaSince18 } = helpers.state.ancestors[0]
      if (livingCountry === 'CAN') {
        if (yearsInCanadaSince18 < 10) {
          return helpers.message({
            custom: value
              ? ValidationErrors.socialCountryUnavailable10
              : ValidationErrors.yearsInCanadaNotEnough10,
          })
        }
      } else {
        if (yearsInCanadaSince18 < 20) {
          return helpers.message({
            custom: value
              ? ValidationErrors.socialCountryUnavailable20
              : ValidationErrors.yearsInCanadaNotEnough20,
          })
        }
      }
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
  partnerAge: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.invalidAge })
    .min(18)
    .message(ValidationErrors.invalidAge)
    .max(getMinBirthYear())
    .message(ValidationErrors.invalidAge),
  partnerLivingCountry: Joi.string()
    .required()
    .valid(...Object.values(ALL_COUNTRY_CODES)),
  partnerLegalStatus: Joi.string()
    .required()
    .messages({
      'any.required': ValidationErrors.partnerLegalStatusNotSelected,
    })
    .valid(...Object.values(LegalStatus)),
  partnerLivedOutsideCanada: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.partnerOutsideCanadaEmpty }),
  partnerYearsInCanadaSince18: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.partnerYearsSince18Empty })
    .integer()
    .max(Joi.ref('partnerAge', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.partnerYearsInCanadaMinusAge),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
})
