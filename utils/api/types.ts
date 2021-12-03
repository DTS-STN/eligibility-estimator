import Joi from 'joi'

export enum MaritalStatusOptions {
  SINGLE = 'Single',
  MARRIED = 'Married',
  COMMONLAW = 'Common-law',
  WIDOWED = 'Widowed',
  DIVORCED = 'Divorced',
  SEPERATED = 'Seperated',
}

export enum LegalStatusOptions {
  CANADIAN_CITIZEN = 'Canadian Citizen',
  PERMANENT_RESIDENT = 'Permanent Resident',
  STATUS_INDIAN = 'Status Indian',
  TEMPORARY_RESIDENT = 'Temporary Resident',
  NONE = 'None of the above',
}

export enum LivingCountryOptions {
  CANADA = 'Canada',
  AGREEMENT = 'Agreement',
  NO_AGREEMENT = 'No Agreement',
}

export enum ResultOptions {
  ELIGIBLE = `Eligible!`,
  INELIGIBLE = `Ineligible!`,
  CONDITIONAL = `Conditionally eligible...`,
  MORE_INFO = 'Need more information...',
  INVALID = 'Request is invalid!',
}

export enum ResultReasons {
  NONE = `You meet the criteria`,
  AGE = `Age does not meet requirement for this benefit`,
  YEARS_IN_CANADA = `Not enough years in Canada`,
  LIVING_COUNTRY = `Not living in Canada`,
  CITIZEN = `Not a Canadian citizen`,
  SOCIAL_AGREEMENT = 'Not in a country with a social agreement',
  MORE_INFO = 'Need more information...',
  OAS = 'Not eligible for OAS',
  INCOME = 'Income too high',
  MARITAL = 'Your marital status does not meet the requirement for this benefit',
  INVALID = `Entered data is invalid`,
}

// This is what the API expects to receive, with the below exceptions due to normalization:
// - livingCountry accepts a string
//
// Note: When updating this, don't forget to update OpenAPI!
// Note: Do not require fields here, do it in the benefit-specific schemas.
export const RequestSchema = Joi.object({
  income: Joi.number().integer(),
  age: Joi.number().integer().max(150),
  livingCountry: Joi.string().valid(...Object.values(LivingCountryOptions)),
  legalStatus: Joi.string().valid(...Object.values(LegalStatusOptions)),
  yearsInCanadaSince18: Joi.number()
    .integer()
    .ruleset.max(Joi.ref('age', { adjust: (age) => age - 18 }))
    .message('Years in Canada should be no more than age minus 18'),
  maritalStatus: Joi.string().valid(...Object.values(MaritalStatusOptions)),
  partnerReceivingOas: Joi.boolean(),
  everLivedSocialCountry: Joi.boolean(),
})

export const OasSchema = RequestSchema.concat(
  Joi.object({
    income: Joi.required(),
    age: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(129757),
      then: Joi.required(),
    }),
    livingCountry: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(129757),
      then: Joi.required(),
    }),
    legalStatus: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(129757),
      then: Joi.required(),
    }),
    yearsInCanadaSince18: Joi.when('legalStatus', {
      is: Joi.exist().valid(
        LegalStatusOptions.CANADIAN_CITIZEN,
        LegalStatusOptions.PERMANENT_RESIDENT,
        LegalStatusOptions.STATUS_INDIAN,
        LegalStatusOptions.TEMPORARY_RESIDENT
      ),
      then: Joi.required(),
    }),
    everLivedSocialCountry: Joi.when('livingCountry', {
      switch: [
        {
          is: Joi.string().exist().valid(LivingCountryOptions.CANADA),
          then: Joi.when('yearsInCanadaSince18', {
            is: Joi.number().exist().greater(0).less(10),
            then: Joi.required(),
          }),
        },
        {
          is: Joi.string().exist().valid('No Agreement'),
          then: Joi.when('yearsInCanadaSince18', {
            is: Joi.number().exist().greater(0).less(20),
            then: Joi.required(),
          }),
        },
      ],
    }),
  })
)

export const GisSchema = RequestSchema.concat(
  Joi.object({
    _oasEligible: Joi.string()
      .valid(...Object.values(ResultOptions))
      .required(),
    income: Joi.required(),
    livingCountry: Joi.when('income', {
      is: Joi.number().exist().max(43680),
      then: Joi.required(),
    }),
    maritalStatus: Joi.when('_oasEligible', {
      not: Joi.valid(ResultOptions.INELIGIBLE, ResultOptions.MORE_INFO),
      then: Joi.required(),
    }),
    partnerReceivingOas: Joi.boolean()
      .when('maritalStatus', {
        is: Joi.exist().valid(
          MaritalStatusOptions.MARRIED,
          MaritalStatusOptions.COMMONLAW
        ),
        then: Joi.required(),
        otherwise: Joi.boolean().falsy().valid(false),
      })
      .when('_oasEligible', {
        is: Joi.valid(ResultOptions.INELIGIBLE, ResultOptions.MORE_INFO),
        then: Joi.optional(),
      }),
  })
)

export const AllowanceSchema = RequestSchema.concat(
  Joi.object({
    income: Joi.required(),
    age: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(35616),
      then: Joi.required(),
    }),
    livingCountry: Joi.when('age', {
      is: Joi.number().exist().min(60).max(64),
      then: Joi.required(),
    }),
    legalStatus: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(35616),
      then: Joi.when('age', {
        is: Joi.number().exist().min(60).max(64),
        then: Joi.required(),
      }),
    }),
    yearsInCanadaSince18: Joi.when('legalStatus', {
      is: Joi.exist().valid(
        LegalStatusOptions.CANADIAN_CITIZEN,
        LegalStatusOptions.PERMANENT_RESIDENT,
        LegalStatusOptions.STATUS_INDIAN,
        LegalStatusOptions.TEMPORARY_RESIDENT
      ),
      then: Joi.required(),
    }),
    maritalStatus: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(35616),
      then: Joi.when('age', {
        is: Joi.number().exist().min(60).max(64),
        then: Joi.required(),
      }),
    }),
    partnerReceivingOas: Joi.when('maritalStatus', {
      is: Joi.exist().valid(
        MaritalStatusOptions.MARRIED,
        MaritalStatusOptions.COMMONLAW
      ),
      then: Joi.required(),
    }),
  })
)

export const AfsSchema = RequestSchema.concat(
  Joi.object({
    income: Joi.required(),
    age: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(25920),
      then: Joi.required(),
    }),
    livingCountry: Joi.when('age', {
      is: Joi.number().exist().min(60).max(64),
      then: Joi.required(),
    }),
    legalStatus: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(25920),
      then: Joi.when('age', {
        is: Joi.number().exist().min(60).max(64),
        then: Joi.required(),
      }),
    }),
    yearsInCanadaSince18: Joi.when('legalStatus', {
      is: Joi.exist().valid(
        LegalStatusOptions.CANADIAN_CITIZEN,
        LegalStatusOptions.PERMANENT_RESIDENT,
        LegalStatusOptions.STATUS_INDIAN,
        LegalStatusOptions.TEMPORARY_RESIDENT
      ),
      then: Joi.required(),
    }),
    maritalStatus: Joi.when('income', {
      is: Joi.number().exist().greater(0).less(25920),
      then: Joi.when('age', {
        is: Joi.number().exist().min(60).max(64),
        then: Joi.required(),
      }),
    }),
  })
)

export interface CalculationInput {
  age?: number
  livingCountry?: LivingCountryOptions
  legalStatus?: LegalStatusOptions
  yearsInCanadaSince18?: number
  maritalStatus?: MaritalStatusOptions
  partnerReceivingOas?: boolean
  income?: number
  everLivedSocialCountry?: boolean
  _oasEligible?: ResultOptions
}

export interface BenefitResult {
  result: ResultOptions
  reason: ResultReasons
  detail: String
  // TODO: use field names as type
  missingFields?: Array<String>
}

export interface ResponseSuccess {
  oas: BenefitResult
  gis: BenefitResult
  allowance: BenefitResult
  afs: BenefitResult
  allFields?: Array<String>
}

export interface ResponseError {
  error: string
  detail: any
}
