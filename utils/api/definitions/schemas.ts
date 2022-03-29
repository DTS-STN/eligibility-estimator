import Joi from 'joi'
import { ALL_COUNTRY_CODES } from '../helpers/countryUtils'
import { legalValues } from '../scrapers/output'
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
 * Note: Do not require fields here, do it in the benefit-specific schemas.
 */
export const RequestSchema = Joi.object({
  income: Joi.number()
    .precision(2)
    .min(0)
    .message(ValidationErrors.incomeBelowZero)
    .less(legalValues.MAX_OAS_INCOME)
    .message(ValidationErrors.incomeTooHigh),
  age: Joi.number()
    .integer()
    .min(18)
    .message(ValidationErrors.ageUnder18)
    .max(150)
    .message(ValidationErrors.ageOver150),
  maritalStatus: Joi.string().valid(...Object.values(MaritalStatus)),
  livingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  legalStatus: Joi.string().valid(...Object.values(LegalStatus)),
  canadaWholeLife: Joi.boolean(),
  yearsInCanadaSince18: Joi.number()
    .integer()
    .max(Joi.ref('age', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.yearsInCanadaMinusAge),
  everLivedSocialCountry: Joi.boolean(),
  partnerBenefitStatus: Joi.string().valid(
    ...Object.values(PartnerBenefitStatus)
  ),
  partnerIncome: Joi.number()
    .precision(2)
    .min(0)
    .message(ValidationErrors.partnerIncomeBelowZero)
    .less(
      Joi.ref('income', {
        adjust: (income) => legalValues.MAX_OAS_INCOME - income,
      })
    )
    .message(ValidationErrors.partnerIncomeTooHigh),
  partnerAge: Joi.number()
    .integer()
    .min(18)
    .message(ValidationErrors.partnerAgeUnder18)
    .max(150)
    .message(ValidationErrors.partnerAgeOver150),
  partnerLivingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  partnerLegalStatus: Joi.string().valid(...Object.values(LegalStatus)),
  partnerCanadaWholeLife: Joi.boolean(),
  partnerYearsInCanadaSince18: Joi.number()
    .integer()
    .max(Joi.ref('partnerAge', { adjust: (age) => age - 18 }))
    .message(ValidationErrors.partnerYearsInCanadaMinusAge),
  partnerEverLivedSocialCountry: Joi.boolean(),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
})
