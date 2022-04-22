import Joi from 'joi'
import { Translations } from '../../../i18n/api'
import {
  IncomeHelper,
  LegalStatusHelper,
  LivingCountryHelper,
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from '../helpers/fieldClasses'
import {
  EntitlementResultType,
  EstimationSummaryState,
  Language,
  LegalStatus,
  LinkLocation,
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
  income: number // personal income
  age: number
  maritalStatus: MaritalStatus
  livingCountry: string // country code
  legalStatus: LegalStatus
  canadaWholeLife: boolean
  yearsInCanadaSince18: number
  everLivedSocialCountry: boolean
  partnerBenefitStatus: PartnerBenefitStatus
  partnerIncome: number // partner income
  partnerAge: number
  partnerLivingCountry: string // country code
  partnerLegalStatus: LegalStatus
  partnerCanadaWholeLife: boolean
  partnerYearsInCanadaSince18: number
  partnerEverLivedSocialCountry: boolean
  _language?: Language
}

/**
 * After Joi validation and additional pre-processing, this is the object passed around to provide app logic.
 */
export interface ProcessedInput {
  income: IncomeHelper
  age: number
  maritalStatus: MaritalStatusHelper
  livingCountry: LivingCountryHelper
  legalStatus: LegalStatusHelper
  canadaWholeLife: boolean
  yearsInCanadaSince18: number
  everLivedSocialCountry: boolean
  partnerBenefitStatus: PartnerBenefitStatusHelper
}

export interface ProcessedInputWithPartner {
  client: ProcessedInput
  partner: ProcessedInput
  _translations: Translations
}

export interface EligibilityResult {
  result: ResultKey
  reason: ResultReason
  detail: string
}

export interface EntitlementResult {
  result: number
  type: EntitlementResultType
}

export interface BenefitResult {
  eligibility: EligibilityResult
  entitlement: EntitlementResult
}

export interface BenefitResultsObject {
  oas?: BenefitResult
  gis?: BenefitResult
  alw?: BenefitResult
  afs?: BenefitResult
}

export interface BenefitResultsObjectWithPartner {
  client: BenefitResultsObject
  partner: BenefitResultsObject
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
  detail: Joi.ValidationError | Error
}

export interface Link {
  text: string
  url: string
  order: number
  location: LinkLocation
}

export interface SummaryObject {
  state: EstimationSummaryState
  title: string
  details: string
  links: Link[]
  entitlementSum: number
}
