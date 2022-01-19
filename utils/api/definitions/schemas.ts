import Joi from 'joi'
import { Language } from '../../../i18n/api'
import { ALL_COUNTRY_CODES } from '../helpers/countryUtils'
import { LegalStatus, MaritalStatus, PartnerBenefitStatus } from './enums'

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
  income: Joi.number().integer().min(0),
  age: Joi.number().integer().max(150),
  maritalStatus: Joi.string().valid(...Object.values(MaritalStatus)),
  livingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  legalStatus: Joi.string().valid(...Object.values(LegalStatus)),
  legalStatusOther: Joi.string(),
  canadaWholeLife: Joi.boolean(),
  yearsInCanadaSince18: Joi.number()
    .integer()
    .ruleset.max(Joi.ref('age', { adjust: (age) => age - 18 }))
    .message('Years in Canada should be no more than age minus 18'), // todo i18n
  everLivedSocialCountry: Joi.boolean(),
  partnerBenefitStatus: Joi.string().valid(
    ...Object.values(PartnerBenefitStatus)
  ),
  partnerIncome: Joi.number().integer(),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
})
