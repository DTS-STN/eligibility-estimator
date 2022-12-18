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
  BenefitKey,
  EntitlementResultType,
  Language,
  LegalStatus,
  LinkIcon,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
  SummaryState,
} from './enums'
import { FieldConfig, FieldKey } from './fields'

/**
 * What the API expects to receive. This is passed to Joi for validation.
 */
export interface RequestInput {
  incomeAvailable: boolean
  income: number // personal income
  age: number
  oasDefer: boolean
  oasAge: number
  maritalStatus: MaritalStatus
  invSeparated: boolean
  livingCountry: string // country code
  legalStatus: LegalStatus
  livedOutsideCanada: boolean
  yearsInCanadaSince18: number
  everLivedSocialCountry: boolean
  partnerBenefitStatus: PartnerBenefitStatus
  partnerIncomeAvailable: boolean
  partnerIncome: number // partner income
  partnerAge: number
  partnerLivingCountry: string // country code
  partnerLegalStatus: LegalStatus
  partnerLivedOutsideCanada: boolean
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
  oasDefer: boolean
  oasAge: number
  maritalStatus: MaritalStatusHelper
  livingCountry: LivingCountryHelper
  legalStatus: LegalStatusHelper
  livedOutsideCanada: boolean
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
  incomeMustBeLessThan?: number // for use when income is not provided
}

export interface EntitlementResultGeneric {
  result: number // when type is unavailable, result should be -1
  type: EntitlementResultType
  autoEnrollment: boolean
}

export interface EntitlementResultOas extends EntitlementResultGeneric {
  result65To74: number
  resultAt75: number
  clawback: number
  deferral: { age: number; years: number; increase: number }
}

export type EntitlementResult = EntitlementResultGeneric | EntitlementResultOas

/**
 * This is text within the cards, that will expand when clicked.
 */
export interface CardCollapsedText {
  heading: string
  text: string
}

/**
 * This is the object containing everything the UI needs to know to display the benefit result card.
 */
export interface CardDetail {
  mainText: string
  collapsedText: CardCollapsedText[]
  links: Link[]
}

export interface BenefitResult<
  T extends EntitlementResult = EntitlementResult
> {
  benefitKey: BenefitKey
  eligibility: EligibilityResult
  entitlement: T
  cardDetail: CardDetail
}

export interface BenefitResultsObject {
  oas?: BenefitResult<EntitlementResultOas>
  gis?: BenefitResult<EntitlementResultGeneric>
  alw?: BenefitResult<EntitlementResultGeneric>
  afs?: BenefitResult<EntitlementResultGeneric>
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
  fieldData: Array<FieldConfig>
}

export interface ResponseError {
  visibleFields: Array<FieldKey>
  error: string
  detail: Joi.ValidationError | Error
}

export interface Link {
  text: string
  url: string
  order: number
  icon?: LinkIcon
}

export interface SummaryObject {
  state: SummaryState
  title: string
  details: string
  links: Link[]
  entitlementSum: number
}
