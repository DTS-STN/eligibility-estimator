import Joi from 'joi'
import { numberToStringCurrency } from '../../../i18n/api'
import { ALL_COUNTRY_CODES } from '../helpers/countryUtils'
import { legalValues } from '../scrapers/output'
import {
  Language,
  LegalStatus,
  Locale,
  MaritalStatus,
  PartnerBenefitStatus,
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
    .ruleset.less(legalValues.MAX_OAS_INCOME)
    .message(
      `Your income must be less than ${numberToStringCurrency(
        legalValues.MAX_OAS_INCOME,
        Locale.EN,
        { rounding: 0 }
      )} to be eligible for any of the benefits covered by this tool.`
    ), // todo i18n,
  age: Joi.number().integer().min(18).max(150),
  maritalStatus: Joi.string().valid(...Object.values(MaritalStatus)),
  livingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  legalStatus: Joi.string().valid(...Object.values(LegalStatus)),
  canadaWholeLife: Joi.boolean(),
  yearsInCanadaSince18: Joi.number()
    .integer()
    .ruleset.max(Joi.ref('age', { adjust: (age) => age - 18 }))
    .message('Years in Canada should be no more than age minus 18'), // todo i18n
  everLivedSocialCountry: Joi.boolean(),
  partnerBenefitStatus: Joi.string().valid(
    ...Object.values(PartnerBenefitStatus)
  ),
  partnerIncome: Joi.number()
    .precision(2)
    .min(0)
    .ruleset.less(
      Joi.ref('income', {
        adjust: (income) => legalValues.MAX_OAS_INCOME - income,
      })
    )
    .message(
      `The sum of you and your partner's income income must be less than ${numberToStringCurrency(
        legalValues.MAX_OAS_INCOME,
        Locale.EN,
        { rounding: 0 }
      )} to be eligible for any of the benefits covered by this tool.`
    ), // todo i18n,
  partnerAge: Joi.number().integer().max(150),
  partnerLivingCountry: Joi.string().valid(...Object.values(ALL_COUNTRY_CODES)),
  partnerLegalStatus: Joi.string().valid(...Object.values(LegalStatus)),
  partnerCanadaWholeLife: Joi.boolean(),
  partnerYearsInCanadaSince18: Joi.number()
    .integer()
    .ruleset.max(Joi.ref('partnerAge', { adjust: (age) => age - 18 }))
    .message('Years in Canada should be no more than partnerAge minus 18'), // todo i18n
  partnerEverLivedSocialCountry: Joi.boolean(),
  _language: Joi.string()
    .valid(...Object.values(Language))
    .default(Language.EN),
})
