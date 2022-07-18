import Joi from 'joi'
import { ALL_COUNTRY_CODES } from '../helpers/countryUtils'
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
 * Note: Do not require fields here, do it in the BenefitHandler. This should gladly accept an empty object.
 */
export const RequestSchema = Joi.object({
  incomeAvailable: Joi.boolean(),
  income: Joi.number()
    .precision(2)
    .min(0)
    .message(ValidationErrors.incomeBelowZero)
    .less(legalValues.oas.incomeLimit)
    .message(ValidationErrors.incomeTooHigh),
  age: Joi.number()
    .min(18)
    .message(ValidationErrors.ageUnder18)
    .max(150)
    .message(ValidationErrors.ageOver150),
  oasDefer: Joi.boolean(),
  oasAge: Joi.number()
    .min(65)
    .message(ValidationErrors.oasAge65to70)
    .max(70)
    .message(ValidationErrors.oasAge65to70),
  maritalStatus: Joi.string()
    .valid(...Object.values(MaritalStatus))
    .messages({ 'any.invalid': ValidationErrors.maritalUnavailable }),
  livingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  legalStatus: Joi.string()
    .valid(...Object.values(LegalStatus))
    .invalid(LegalStatus.SPONSORED, LegalStatus.OTHER)
    .messages({ 'any.invalid': ValidationErrors.legalUnavailable }),
  livedOutsideCanada: Joi.boolean(),
  yearsInCanadaSince18: Joi.number()
    .integer()
    .max(Joi.ref('age', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.yearsInCanadaMinusAge),
  everLivedSocialCountry: Joi.boolean()
    // if they haven't lived in Canada long enough,
    .when('yearsInCanadaSince18', {
      not: Joi.number().min(
        Joi.ref('livingCountry', {
          adjust: (country) => (country === 'CAN' ? 10 : 20),
        })
      ),
      // then we'll stop them no matter what.
      // if they put true, they should contact Service Canada.
      // if they put false, we can confidently say they are not eligible for anything.
      then: Joi.boolean().when('.', {
        is: Joi.boolean().valid(true),
        then: Joi.forbidden().messages({
          'any.unknown': ValidationErrors.socialCountryUnavailable,
        }),
        otherwise: Joi.forbidden().messages({
          'any.unknown': ValidationErrors.yearsInCanadaNotEnough,
        }),
      }),
    }),
  partnerBenefitStatus: Joi.string().valid(
    ...Object.values(PartnerBenefitStatus)
  ),
  partnerIncomeAvailable: Joi.boolean(),
  partnerIncome: Joi.number()
    .precision(2)
    .min(0)
    .message(ValidationErrors.partnerIncomeBelowZero)
    .less(
      Joi.ref('income', {
        adjust: (income) => legalValues.oas.incomeLimit - income,
      })
    )
    .message(ValidationErrors.partnerIncomeTooHigh),
  partnerAge: Joi.number()
    .min(18)
    .message(ValidationErrors.partnerAgeUnder18)
    .max(150)
    .message(ValidationErrors.partnerAgeOver150),
  partnerLivingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  partnerLegalStatus: Joi.string()
    .valid(...Object.values(LegalStatus))
    .invalid(LegalStatus.SPONSORED, LegalStatus.OTHER)
    .messages({ 'any.invalid': ValidationErrors.legalUnavailable }),
  partnerLivedOutsideCanada: Joi.boolean(),
  partnerYearsInCanadaSince18: Joi.number()
    .integer()
    .max(Joi.ref('partnerAge', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.partnerYearsInCanadaMinusAge),
  partnerEverLivedSocialCountry: Joi.boolean(),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
})
