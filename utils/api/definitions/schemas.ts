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

export const RequestSchema = Joi.object({
  incomeAvailable: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.optionNotSelected }),
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
    .max(new Date().getFullYear() - 1900)
    .message(ValidationErrors.invalidAge),
  oasDefer: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.optionNotSelected }),
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
    .messages({ 'any.required': ValidationErrors.optionNotSelected }),
  livingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  legalStatus: Joi.string()
    .required()
    .messages({ 'any.required': ValidationErrors.legalStatusNotSelected })
    .valid(...Object.values(LegalStatus))
    .invalid(LegalStatus.OTHER)
    .messages({ 'any.invalid': ValidationErrors.legalUnavailable }),
  livedOutsideCanada: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.optionNotSelected }),
  yearsInCanadaSince18: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.yearsSince18Empty })
    .integer()
    .max(Joi.ref('age', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.yearsInCanadaMinusAge),
  everLivedSocialCountry: Joi.boolean()
    .required()
    // if they haven't lived in Canada long enough,
    .when('livingCountry', {
      is: Joi.string().valid('CAN'),
      then: Joi.when('yearsInCanadaSince18', {
        is: Joi.number().less(10),
        then: Joi.boolean().when('.', {
          is: Joi.boolean().valid(true),
          then: Joi.forbidden().messages({
            'any.unknown': ValidationErrors.socialCountryUnavailable10,
          }),
          otherwise: Joi.forbidden().messages({
            'any.unknown': ValidationErrors.yearsInCanadaNotEnough10,
          }),
        }),
      }),
      otherwise: Joi.when('yearsInCanadaSince18', {
        is: Joi.number().less(20),
        then: Joi.boolean().when('.', {
          is: Joi.boolean().valid(true),
          then: Joi.forbidden().messages({
            'any.unknown': ValidationErrors.socialCountryUnavailable20,
          }),
          otherwise: Joi.forbidden().messages({
            'any.unknown': ValidationErrors.yearsInCanadaNotEnough20,
          }),
        }),
      }),
    }),
  partnerBenefitStatus: Joi.string()
    .required()
    .messages({ 'any.required': ValidationErrors.optionNotSelected })
    .valid(...Object.values(PartnerBenefitStatus)),
  partnerIncomeAvailable: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.optionNotSelected }),
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
    .max(new Date().getFullYear() - 1900)
    .message(ValidationErrors.invalidAge),
  partnerLivingCountry: Joi.string()
    .required()
    .valid(...Object.values(ALL_COUNTRY_CODES)),
  partnerLegalStatus: Joi.string()
    .required()
    .messages({ 'any.required': ValidationErrors.legalStatusNotSelected })
    .valid(...Object.values(LegalStatus)),
  partnerLivedOutsideCanada: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.optionNotSelected }),
  partnerYearsInCanadaSince18: Joi.number()
    .required()
    .messages({ 'any.required': ValidationErrors.partnerYearsSince18Empty })
    .integer()
    .max(Joi.ref('partnerAge', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.partnerYearsInCanadaMinusAge),
  partnerEverLivedSocialCountry: Joi.boolean()
    .required()
    .messages({ 'any.required': ValidationErrors.optionNotSelected }),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
})
