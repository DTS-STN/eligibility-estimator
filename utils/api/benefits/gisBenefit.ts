import { Translations } from '../../../i18n/api'
import {
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  BenefitResult,
  EligibilityResult,
  EntitlementResult,
  ProcessedInput,
} from '../definitions/types'
import roundToTwo from '../helpers/roundToTwo'
import { OutputItemGis } from '../scrapers/_baseTable'
import { legalValues, scraperData } from '../scrapers/output'
import { BaseBenefit } from './_base'

export class GisBenefit extends BaseBenefit {
  constructor(
    input: ProcessedInput,
    translations: Translations,
    private oasResult: BenefitResult
  ) {
    super(input, translations)
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqAge = this.input.age >= 65
    const meetsReqLiving = this.input.livingCountry.canada
    const meetsReqOas =
      this.oasResult.eligibility.result === ResultKey.ELIGIBLE ||
      this.oasResult.eligibility.result === ResultKey.UNAVAILABLE
    const meetsReqLegal = this.input.legalStatus.canadian
    /*
     Please note that the logic below is currently imperfect. Specifically, when partnerBenefitStatus == partialOas,
     we do not know the correct income limit. As a compromise, we are going with the higher limit,
     which may result in us returning "eligible" when in fact they are not.
    */
    const maxIncome = this.input.maritalStatus.partnered
      ? this.input.partnerBenefitStatus.anyOas
        ? legalValues.MAX_GIS_INCOME_PARTNER_OAS
        : legalValues.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW
      : legalValues.MAX_GIS_INCOME_SINGLE
    const meetsReqIncome =
      this.income < maxIncome ||
      /*
       This exception is pretty weird, but necessary to work around the fact that a client can be entitled to GIS
       while being above the GIS income limit. This scenario can happen when the client gets Partial OAS, as
       GIS "top-up" will come into effect. Later, in RequestHandler.translateResults(), we will correct for
       this if the client is indeed above the true (undocumented) max income.
      */
      this.oasResult.entitlement.type === EntitlementResultType.PARTIAL

    // main checks
    if (meetsReqIncome && meetsReqLiving && meetsReqOas && meetsReqLegal) {
      if (meetsReqAge) {
        if (this.oasResult.eligibility.result == ResultKey.UNAVAILABLE) {
          return {
            result: ResultKey.UNAVAILABLE,
            reason: ResultReason.OAS,
            detail: this.translations.detail.conditional,
          }
        } else {
          return {
            result: ResultKey.ELIGIBLE,
            reason: ResultReason.NONE,
            detail: this.translations.detail.eligible,
          }
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.eligibleWhen65,
        }
      }
    } else if (!meetsReqLiving && this.input.livingCountry.provided) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.LIVING_COUNTRY,
        detail: this.translations.detail.mustBeInCanada,
      }
    } else if (this.oasResult.eligibility.result == ResultKey.INELIGIBLE) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.OAS,
        detail: this.translations.detail.mustBeOasEligible,
      }
    } else if (!meetsReqIncome) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.INCOME,
        detail: this.translations.detail.mustMeetIncomeReq,
      }
    } else if (!meetsReqLegal) {
      if (this.input.legalStatus.sponsored) {
        return {
          result: ResultKey.UNAVAILABLE,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegalSponsored,
        }
      } else {
        return {
          result: ResultKey.UNAVAILABLE,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegal,
        }
      }
    } else if (this.oasResult.eligibility.result == ResultKey.MORE_INFO) {
      return {
        result: ResultKey.MORE_INFO,
        reason: ResultReason.MORE_INFO,
        detail: this.translations.detail.mustCompleteOasCheck,
      }
    }
    throw new Error('entitlement logic failed to produce a result')
  }

  protected getEntitlement(): EntitlementResult {
    if (this.eligibility.result !== ResultKey.ELIGIBLE)
      return { result: 0, type: EntitlementResultType.NONE }

    const result = roundToTwo(this.getEntitlementAmount())

    let type: EntitlementResultType
    if (result === -1) type = EntitlementResultType.UNAVAILABLE
    else if (result === 0) type = EntitlementResultType.NONE
    else type = EntitlementResultType.FULL

    const detailOverride =
      type === EntitlementResultType.UNAVAILABLE
        ? this.translations.detail.eligibleEntitlementUnavailable
        : undefined

    return { result, type, detailOverride }
  }

  private getEntitlementAmount(): number {
    const gisEntitlementItem = this.getTableItem()
    const gisEntitlementItemLast = this.getLastTableItem()
    // if (this.input.partnerBenefitStatus.partialOas) {
    //   // unavailable
    //   return -1
    // }
    if (this.oasResult.entitlement.type === EntitlementResultType.FULL) {
      // standard
      return gisEntitlementItem ? gisEntitlementItem.gis : 0
    }
    if (this.oasResult.entitlement.type === EntitlementResultType.PARTIAL) {
      const lastIncome = gisEntitlementItemLast.range.high
      const oasEntitlement = this.oasResult.entitlement.result
      let result, combinedOasGis
      if (this.income <= lastIncome) {
        // partial oas when income below max
        combinedOasGis = gisEntitlementItem.combinedOasGis
      } else {
        // partial oas when income above max
        const lastInterval = gisEntitlementItemLast.range.interval
        const lastCombinedOasGis = gisEntitlementItemLast.combinedOasGis
        const numIntervalsOverLast = Math.ceil(
          (this.income - lastIncome) / lastInterval
        )
        combinedOasGis = lastCombinedOasGis - numIntervalsOverLast
      }
      result = combinedOasGis - oasEntitlement
      return Math.max(0, result)
    }
    if (
      this.oasResult.entitlement.type === EntitlementResultType.UNAVAILABLE ||
      this.oasResult.entitlement.type === EntitlementResultType.NONE
    ) {
      throw new Error('unsupported')
    }
  }

  private getTableItem(): OutputItemGis | undefined {
    const array: OutputItemGis[] = this.getTable()
    return array.find((x) => {
      if (x.range.low <= this.income && this.income <= x.range.high) return x
    })
  }

  private getLastTableItem(): OutputItemGis | undefined {
    const array: OutputItemGis[] = this.getTable()
    return array[array.length - 1]
  }

  private getTable(): OutputItemGis[] {
    if (this.input.maritalStatus.single) {
      // Table 1: If you are single, surviving spouse/common-law partner or divorced pensioners receiving a full Old Age Security pension
      return scraperData.tbl1_single
    } else if (this.input.maritalStatus.partnered) {
      if (this.input.partnerBenefitStatus.anyOas) {
        // Table 2: If you are married or common-law partners, both receiving a full Old Age Security pension
        return scraperData.tbl2_partneredAndOas
      } else if (this.input.partnerBenefitStatus.alw) {
        // Table 4: If you are receiving a full Old Age Security pension and your spouse or common-law partner is aged 60 to 64
        return scraperData.tbl4_partneredAlw
      } else {
        // Table 3: If you are receiving a full Old Age Security pension whose spouse or common-law partner does not receive an OAS pension
        // this is used when partner is not getting allowance or any OAS
        return scraperData.tbl3_partneredNoOas
      }
    }
  }
}
