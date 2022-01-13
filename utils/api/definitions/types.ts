import { Language, Translations } from '../../../i18n/api'
import {
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from '../helpers/fieldClasses'
import {
  EstimationSummaryState,
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from './enums'
import { FieldData, FieldKey } from './fields'

/**
 * What the API expects to receive. This is passed to Joi for validation.
 */
export interface RequestInput {
  income?: number // personal income
  age?: number
  livingCountry?: string // country code
  legalStatus?: LegalStatus
  legalStatusOther?: string
  yearsInCanadaSince18?: number
  maritalStatus?: MaritalStatus
  partnerIncome?: number // partner income
  partnerBenefitStatus?: PartnerBenefitStatus
  everLivedSocialCountry?: boolean
  _language?: Language
}

/**
 * After Joi validation and additional pre-processing, this is the object passed around to provide app logic.
 */
export interface ProcessedInput {
  income?: number // sum of personal and partner
  age?: number
  livingCountry?: LivingCountry
  legalStatus?: LegalStatus
  legalStatusOther?: string
  yearsInCanadaSince18?: number
  maritalStatus: MaritalStatusHelper
  partnerBenefitStatus: PartnerBenefitStatusHelper
  everLivedSocialCountry?: boolean
  _translations: Translations
  _oasEligible?: ResultKey // added by GIS check
}

export interface BenefitResult {
  eligibilityResult: ResultKey
  entitlementResult: number // -1 here means unavailable
  reason: ResultReason
  detail: string
}

export interface BenefitResultsObject {
  oas?: BenefitResult
  gis?: BenefitResult
  allowance?: BenefitResult
  afs?: BenefitResult
}

export interface ResponseSuccess {
  results: BenefitResultsObject
  summary: SummaryObject
  visibleFields: Array<FieldKey>
  missingFields: Array<FieldKey>
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
