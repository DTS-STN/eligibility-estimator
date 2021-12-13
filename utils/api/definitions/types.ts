import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from './enums'
import { FieldData, FieldKey } from './fields'

export interface CalculationInput {
  income?: number
  age?: number
  livingCountry?: LivingCountry
  legalStatus?: LegalStatus
  yearsInCanadaSince18?: number
  maritalStatus?: MaritalStatus
  partnerIncome?: number
  partnerReceivingOas?: boolean
  everLivedSocialCountry?: boolean
  _oasEligible?: ResultKey
}

export interface BenefitResult {
  eligibilityResult: ResultKey
  entitlementResult: Number
  reason: ResultReason
  detail: String
  missingFields?: Array<FieldKey>
}

export interface ResponseSuccess {
  oas: BenefitResult
  gis: BenefitResult
  allowance: BenefitResult
  afs: BenefitResult
  visibleFields: Array<FieldKey>
  fieldData: Array<FieldData>
}

export interface ResponseError {
  error: string
  detail: any
}
