import {
  EstimationSummaryState,
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
  legalStatusOther?: string
  yearsInCanadaSince18?: number
  maritalStatus?: MaritalStatus
  partnerIncome?: number
  partnerReceivingOas?: boolean
  everLivedSocialCountry?: boolean
  _oasEligible?: ResultKey
}

export interface BenefitResult {
  eligibilityResult: ResultKey
  entitlementResult: number
  reason: ResultReason
  detail: String
  missingFields?: Array<FieldKey>
}

export interface BenefitResultObject {
  oas: BenefitResult
  gis: BenefitResult
  allowance: BenefitResult
  afs: BenefitResult
}

export interface ResponseSuccess {
  oas: BenefitResult
  gis: BenefitResult
  allowance: BenefitResult
  afs: BenefitResult
  summary: SummaryObject
  visibleFields: Array<FieldKey>
  fieldData: Array<FieldData>
}

export interface ResponseError {
  error: string
  detail: any
}

export interface Link {
  url: string
  text: string
  order: number
}

export interface SummaryObject {
  state: EstimationSummaryState
  title: string
  details: string
  links: Link[]
}
