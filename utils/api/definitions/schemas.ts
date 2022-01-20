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
  income: Joi.number().precision(2).min(0),
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
  partnerIncome: Joi.number().precision(2),
  partnerAge: Joi.number().integer().max(150),
  partnerLivingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  partnerLegalStatus: Joi.string().valid(...Object.values(LegalStatus)),
  partnerCanadaWholeLife: Joi.boolean(),
  partnerYearsInCanadaSince18: Joi.number()
    .integer()
    .ruleset.max(Joi.ref('partnerAge', { adjust: (age) => age - 18 }))
    .message('Years in Canada should be no more than partnerAge minus 18'),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
})
