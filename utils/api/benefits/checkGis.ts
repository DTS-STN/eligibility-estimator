import { Translations } from '../../../i18n/api'
import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import { GisSchema } from '../definitions/schemas'
import { BenefitResult, CalculationInput } from '../definitions/types'
import { validateRequestForBenefit } from '../helpers/validator'
import { OutputItemGis } from '../scrapers/_base'
import gisTables from '../scrapers/output'
import checkOas from './checkOas'

export default function checkGis(
  params: CalculationInput,
  translations: Translations
): BenefitResult {
  // include OAS result
  const oasResult = checkOas(params, translations)
  const paramsWithOas = { ...params, _oasEligible: oasResult.eligibilityResult }

  // validation
  const { result, value } = validateRequestForBenefit(GisSchema, paramsWithOas)
  // if the validation was able to return an error result, return it
  if (result) return result

  // helpers
  const meetsReqAge = value.age >= 65
  const meetsReqLiving = value.livingCountry === LivingCountry.CANADA
  const meetsReqOas =
    oasResult.eligibilityResult === ResultKey.ELIGIBLE ||
    oasResult.eligibilityResult === ResultKey.CONDITIONAL
  const meetsReqLegal =
    value.legalStatus === LegalStatus.CANADIAN_CITIZEN ||
    value.legalStatus === LegalStatus.PERMANENT_RESIDENT ||
    value.legalStatus === LegalStatus.INDIAN_STATUS
  const partnered =
    value.maritalStatus == MaritalStatus.MARRIED ||
    value.maritalStatus == MaritalStatus.COMMON_LAW
  const maxIncome = partnered
    ? value.partnerReceivingOas
      ? 25440
      : 46128
    : 19248
  const meetsReqIncome = value.income <= maxIncome

  // main checks
  if (meetsReqIncome && meetsReqLiving && meetsReqOas && meetsReqLegal) {
    if (meetsReqAge) {
      if (oasResult.eligibilityResult == ResultKey.CONDITIONAL) {
        return {
          eligibilityResult: ResultKey.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReason.OAS,
          detail: translations.detail.conditional,
        }
      } else {
        const entitlementResult = new GisEntitlement(
          value.income,
          value.maritalStatus,
          value.partnerReceivingOas
        ).getEntitlement()
        return {
          eligibilityResult: ResultKey.ELIGIBLE,
          entitlementResult,
          reason: ResultReason.NONE,
          detail: translations.detail.eligible,
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: translations.detail.eligibleWhen65,
      }
    }
  } else if (!meetsReqLiving && value.livingCountry !== undefined) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.LIVING_COUNTRY,
      detail: translations.detail.mustBeInCanada,
    }
  } else if (oasResult.eligibilityResult == ResultKey.INELIGIBLE) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.OAS,
      detail: translations.detail.mustBeOasEligible,
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: translations.detail.mustMeetIncomeReq,
    }
  } else if (!meetsReqLegal) {
    if (value.legalStatus === LegalStatus.SPONSORED) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: translations.detail.dependingOnLegalSponsored,
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: translations.detail.dependingOnLegal,
      }
    }
  } else if (oasResult.eligibilityResult == ResultKey.MORE_INFO) {
    return {
      eligibilityResult: ResultKey.MORE_INFO,
      entitlementResult: 0,
      reason: ResultReason.MORE_INFO,
      detail: translations.detail.mustCompleteOasCheck,
    }
  }
}

class GisEntitlement {
  income: number
  maritalStatus: MaritalStatus
  partnerReceivingOas: boolean

  constructor(
    income: number,
    maritalStatus: MaritalStatus,
    partnerReceivingOas: boolean
  ) {
    this.income = income
    this.maritalStatus = maritalStatus
    this.partnerReceivingOas = partnerReceivingOas
  }

  getEntitlement(): number {
    const gisEntitlementItem = this.getTableItem()
    return gisEntitlementItem ? gisEntitlementItem.gis : 0
  }

  getTableItem(): OutputItemGis | undefined {
    const array: OutputItemGis[] = this.getTable()
    return array.find((x) => {
      if (x.range.low <= this.income && this.income <= x.range.high) return x
    })
  }

  getTable(): OutputItemGis[] {
    if (
      this.maritalStatus === MaritalStatus.SINGLE ||
      this.maritalStatus === MaritalStatus.WIDOWED ||
      this.maritalStatus === MaritalStatus.DIVORCED ||
      this.maritalStatus === MaritalStatus.SEPARATED
    ) {
      // Table 1: If you are single, surviving spouse/common-law partner or divorced pensioners receiving a full Old Age Security pension
      return gisTables.single
    } else if (
      this.maritalStatus === MaritalStatus.MARRIED ||
      this.maritalStatus === MaritalStatus.COMMON_LAW
    ) {
      if (this.partnerReceivingOas) {
        // Table 2: If you are married or common-law partners, both receiving a full Old Age Security pension
        return gisTables.partneredAndOas
      } else if (!this.partnerReceivingOas) {
        // Table 3: If you are receiving a full Old Age Security pension whose spouse or common-law partner does not receive an OAS pension
        return gisTables.partneredNoOas
      }
      // Table 4: If you are receiving a full Old Age Security pension and your spouse or common-law partner is aged 60 to 64
    }
  }
}
