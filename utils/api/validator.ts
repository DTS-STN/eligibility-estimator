import { ObjectSchema } from 'joi'
import {
  BenefitResult,
  CalculationInput,
  ResultOptions,
  ResultReasons,
} from './types'

var util = require('util')

export function validateRequestForBenefit(
  schema: ObjectSchema<any>,
  params: CalculationInput
): { result: BenefitResult; value: CalculationInput } {
  const { error, value } = schema.validate(params, {
    abortEarly: false,
  })
  if (error) {
    // log all error detail
    console.log(util.inspect(error, { depth: Infinity }))

    // raise unhandled error if anything other than a required field issue
    const errors = [...new Set(error.details.map((x) => x.type))]
    console.log(errors)
    if (errors.length > 1 || errors[0] != 'any.required') throw error

    // gather all missing but required fields
    const missingFields = [...new Set(error.details.map((x) => `${x.path[0]}`))]
    console.log(missingFields)

    // return result containing all required fields
    return {
      result: {
        result: ResultOptions.MORE_INFO,
        reason: ResultReasons.MORE_INFO,
        detail: `Missing ${missingFields.length} required field${
          missingFields.length != 1 ? 's' : ''
        }.`,
        missingFields: missingFields,
      },
      value: null,
    }
  }

  // if no issues, return the validated object
  return { result: null, value: value }
}
