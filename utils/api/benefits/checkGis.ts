import { ResultKey, ResultReason } from '../definitions/enums'
import {
  MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALLOWANCE,
  MAX_GIS_INCOME_PARTNER_OAS,
  MAX_GIS_INCOME_SINGLE,
} from '../definitions/legalValues'
import { BenefitResult, ProcessedInput } from '../definitions/types'
import {
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
} from '../helpers/fieldClasses'
import { OutputItemGis } from '../scrapers/_base'
import gisTables from '../scrapers/output'
import checkOas from './checkOas'

export default function checkGis(input: ProcessedInput): BenefitResult {
  // fetch OAS result
  const oasResult = checkOas(input)

  // helpers
  const meetsReqAge = input.age >= 65
  const meetsReqLiving = input.livingCountry.canada
  const oasResultIsPartial = oasResult.reason == ResultReason.PARTIAL_OAS
  const meetsReqOas =
    oasResult.eligibilityResult === ResultKey.ELIGIBLE ||
    oasResult.eligibilityResult === ResultKey.CONDITIONAL
  const meetsReqLegal = input.legalStatus.canadian
  const maxIncome = input.maritalStatus.partnered
    ? input.partnerBenefitStatus.anyOas
      ? MAX_GIS_INCOME_PARTNER_OAS
      : MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALLOWANCE
    : MAX_GIS_INCOME_SINGLE
  const meetsReqIncome = input.income < maxIncome

  // main checks
  if (meetsReqIncome && meetsReqLiving && meetsReqOas && meetsReqLegal) {
    if (meetsReqAge) {
      if (oasResult.eligibilityResult == ResultKey.CONDITIONAL) {
        return {
          eligibilityResult: ResultKey.CONDITIONAL,
          entitlementResult: 0,
          reason: ResultReason.OAS,
          detail: input._translations.detail.conditional,
        }
      } else {
        const entitlementResult = new GisEntitlement(
          input.income,
          oasResultIsPartial,
          input.maritalStatus,
          input.partnerBenefitStatus
        ).getEntitlement()
        const detail =
          entitlementResult == -1
            ? input._translations.detail.eligibleEntitlementUnavailable
            : input._translations.detail.eligible
        return {
          eligibilityResult: ResultKey.ELIGIBLE,
          entitlementResult,
          reason: ResultReason.NONE,
          detail,
        }
      }
    } else {
      return {
        eligibilityResult: ResultKey.INELIGIBLE,
        entitlementResult: 0,
        reason: ResultReason.AGE,
        detail: input._translations.detail.eligibleWhen65,
      }
    }
  } else if (!meetsReqLiving && input.livingCountry.provided) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.LIVING_COUNTRY,
      detail: input._translations.detail.mustBeInCanada,
    }
  } else if (oasResult.eligibilityResult == ResultKey.INELIGIBLE) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.OAS,
      detail: input._translations.detail.mustBeOasEligible,
    }
  } else if (!meetsReqIncome) {
    return {
      eligibilityResult: ResultKey.INELIGIBLE,
      entitlementResult: 0,
      reason: ResultReason.INCOME,
      detail: input._translations.detail.mustMeetIncomeReq,
    }
  } else if (!meetsReqLegal) {
    if (input.legalStatus.sponsored) {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: input._translations.detail.dependingOnLegalSponsored,
      }
    } else {
      return {
        eligibilityResult: ResultKey.CONDITIONAL,
        entitlementResult: 0,
        reason: ResultReason.LEGAL_STATUS,
        detail: input._translations.detail.dependingOnLegal,
      }
    }
  } else if (oasResult.eligibilityResult == ResultKey.MORE_INFO) {
    return {
      eligibilityResult: ResultKey.MORE_INFO,
      entitlementResult: 0,
      reason: ResultReason.MORE_INFO,
      detail: input._translations.detail.mustCompleteOasCheck,
    }
  }
}

class GisEntitlement {
  income: number
  oasResultIsPartial: boolean
  maritalStatus: MaritalStatusHelper
  partnerBenefitStatus: PartnerBenefitStatusHelper

  constructor(
    income: number,
    oasResultIsPartial: boolean,
    maritalStatus: MaritalStatusHelper,
    partnerBenefitStatus: PartnerBenefitStatusHelper
  ) {
    this.income = income
    this.oasResultIsPartial = oasResultIsPartial
    this.maritalStatus = maritalStatus
    this.partnerBenefitStatus = partnerBenefitStatus
  }

  getEntitlement(): number {
    if (this.oasResultIsPartial) return -1
    if (this.partnerBenefitStatus.partialOas) return -1
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
    if (this.maritalStatus.single) {
      // Table 1: If you are single, surviving spouse/common-law partner or divorced pensioners receiving a full Old Age Security pension
      return gisTables.single
    } else if (this.maritalStatus.partnered) {
      if (this.partnerBenefitStatus.fullOas) {
        // Table 2: If you are married or common-law partners, both receiving a full Old Age Security pension
        return gisTables.partneredAndOas
      } else if (this.partnerBenefitStatus.allowance) {
        // Table 4: If you are receiving a full Old Age Security pension and your spouse or common-law partner is aged 60 to 64
        return gisTables.partneredAllowance
      } else if (!this.partnerBenefitStatus.anyOas) {
        // Table 3: If you are receiving a full Old Age Security pension whose spouse or common-law partner does not receive an OAS pension
        return gisTables.partneredNoOas
      }
    }
  }
}
