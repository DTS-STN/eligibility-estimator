import { Translations } from '../../../i18n/api'
import {
  EntitlementResultType,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  BenefitResult,
  EligibilityResult,
  EntitlementResultGeneric,
  EntitlementResultOas,
  ProcessedInput,
} from '../definitions/types'
import legalValues from '../scrapers/output'
import { BaseBenefit } from './_base'
import { EntitlementFormula } from './entitlementFormula'

export class GisBenefit extends BaseBenefit<EntitlementResultGeneric> {
  constructor(
    input: ProcessedInput,
    translations: Translations,
    private oasResult: BenefitResult<EntitlementResultOas>
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
     This comment may be out of date, and replaced by the comment below (meetsReqIncome).
     Since I'm not certain if it's still relevant, I'll keep it here.

     Please note that the logic below is currently imperfect.
     Specifically, when partnerBenefitStatus == partialOas, we do not know the correct income limit.
    */
    const maxIncome = this.input.maritalStatus.single
      ? legalValues.gis.singleIncomeLimit
      : this.input.partnerBenefitStatus.anyOas
      ? legalValues.gis.spouseOasIncomeLimit
      : this.input.partnerBenefitStatus.alw
      ? legalValues.gis.spouseAlwIncomeLimit
      : legalValues.gis.spouseNoOasIncomeLimit

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

  protected getEntitlement(): EntitlementResultGeneric {
    if (this.eligibility.result !== ResultKey.ELIGIBLE)
      return { result: 0, type: EntitlementResultType.NONE }

    const formulaResult = new EntitlementFormula(
      this.income,
      this.input.maritalStatus,
      this.input.partnerBenefitStatus,
      this.input.age,
      this.oasResult
    ).getEntitlementAmount()

    let type: EntitlementResultType
    if (formulaResult === -1) type = EntitlementResultType.UNAVAILABLE
    else if (formulaResult === 0) type = EntitlementResultType.NONE
    else type = EntitlementResultType.FULL

    if (type === EntitlementResultType.UNAVAILABLE)
      this.eligibility.detail =
        this.translations.detail.eligibleEntitlementUnavailable

    return { result: formulaResult, type }
  }
}
