import { Language } from '../../../i18n/api'
import {
  EstimationSummaryState,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  MaritalStatusHelper,
  PartnerBenefitStatus,
  PartnerBenefitStatusHelper,
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
  partnerBenefitStatus?: PartnerBenefitStatus
  everLivedSocialCountry?: boolean
  _language?: Language
  _oasEligible?: ResultKey // added by GIS check
  _maritalStatus?: MaritalStatusHelper // added by pre-processing
  _partnerBenefitStatus?: PartnerBenefitStatusHelper // added by pre-processing
}

export interface BenefitResult {
  eligibilityResult: ResultKey
  entitlementResult: number // -1 here means unavailable
  reason: ResultReason
  detail: string
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
