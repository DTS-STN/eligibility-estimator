import { Translations } from '../../../i18n/api'
import {
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW,
  MAX_GIS_INCOME_PARTNER_OAS,
  MAX_GIS_INCOME_SINGLE,
} from '../definitions/legalValues'
import {
  BenefitResult,
  EligibilityResult,
  EntitlementResult,
  ProcessedInput,
} from '../definitions/types'
import { OutputItemGis } from '../scrapers/_base'
import gisTables from '../scrapers/output'
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
      this.oasResult.eligibility.result === ResultKey.CONDITIONAL
    const meetsReqLegal = this.input.legalStatus.canadian
    /*
     Please note that the logic below is currently imperfect. Specifically, when partnerBenefitStatus == partialOas,
     we do not know the correct income limit. As a compromise, we are going with the higher limit,
     which may result in us returning "eligible" when in fact they are not.
    */
    const maxIncome = this.input.maritalStatus.partnered
      ? this.input.partnerBenefitStatus.fullOas
        ? MAX_GIS_INCOME_PARTNER_OAS
        : MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW
      : MAX_GIS_INCOME_SINGLE
    console.log('using max income ', maxIncome)
    const meetsReqIncome = this.income < maxIncome

    // main checks
    if (meetsReqIncome && meetsReqLiving && meetsReqOas && meetsReqLegal) {
      if (meetsReqAge) {
        if (this.oasResult.eligibility.result == ResultKey.CONDITIONAL) {
          return {
            result: ResultKey.CONDITIONAL,
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
          reason: ResultReason.AGE,
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
          result: ResultKey.CONDITIONAL,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegalSponsored,
        }
      } else {
        return {
          result: ResultKey.CONDITIONAL,
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
  }

  protected getEntitlement(): EntitlementResult {
    if (this.eligibility.result !== ResultKey.ELIGIBLE)
      return { result: 0, type: EntitlementResultType.NONE }

    const result = this.getEntitlementAmount()
    const type =
      result === -1
        ? EntitlementResultType.UNAVAILABLE
        : EntitlementResultType.FULL

    return { result, type }
  }

  private getEntitlementAmount(): number {
    if (
      this.oasResult.entitlement.type === EntitlementResultType.PARTIAL ||
      this.input.partnerBenefitStatus.partialOas
    )
      return -1
    const gisEntitlementItem = this.getTableItem()
    return gisEntitlementItem ? gisEntitlementItem.gis : 0
  }

  private getTableItem(): OutputItemGis | undefined {
    const array: OutputItemGis[] = this.getTable()
    return array.find((x) => {
      if (x.range.low <= this.income && this.income <= x.range.high) return x
    })
  }

  private getTable(): OutputItemGis[] {
    if (this.input.maritalStatus.single) {
      // Table 1: If you are single, surviving spouse/common-law partner or divorced pensioners receiving a full Old Age Security pension
      return gisTables.single
    } else if (this.input.maritalStatus.partnered) {
      if (this.input.partnerBenefitStatus.fullOas) {
        // Table 2: If you are married or common-law partners, both receiving a full Old Age Security pension
        return gisTables.partneredAndOas
      } else if (this.input.partnerBenefitStatus.alw) {
        // Table 4: If you are receiving a full Old Age Security pension and your spouse or common-law partner is aged 60 to 64
        return gisTables.partneredAlw
      } else {
        // Table 3: If you are receiving a full Old Age Security pension whose spouse or common-law partner does not receive an OAS pension
        // this is used when partner is not getting allowance or any OAS
        return gisTables.partneredNoOas
      }
    }
  }
}
