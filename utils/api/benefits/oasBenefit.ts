import { Translations } from '../../../i18n/api'
import {
  BenefitKey,
  EntitlementResultType,
  LivingCountry,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from '../definitions/enums'
import {
  CardCollapsedText,
  EligibilityResult,
  EntitlementResultOas,
  LinkWithAction,
  MetaDataObject,
  MonthsYears,
  ProcessedInput,
} from '../definitions/types'
import roundToTwo from '../helpers/roundToTwo'
import { getDeferralIncrease, OasEligibility } from '../helpers/utils'
import legalValues from '../scrapers/output'
import { BaseBenefit } from './_base'

export class OasBenefit extends BaseBenefit<EntitlementResultOas> {
  partner: Boolean
  future: Boolean
  deferral: boolean
  income: number
  inputAge: number // Age on the form. Needed as a reference when calculating eligibility for a different age ONLY for non-future benefits
  formAge: number
  formYearsInCanada: number
  userOas: OasBenefit
  formReceiving: boolean
  residency: number
  constructor(
    input: ProcessedInput,
    translations: Translations,
    userOas?: OasBenefit,
    partner?: Boolean,
    future?: Boolean,
    deferral: boolean = false,
    inputAge?: number,
    formAge?: number,
    formYearsInCanada?: number,
    formReceiving?: boolean
  ) {
    super(input, translations, BenefitKey.oas)
    this.partner = partner
    this.future = future
    this.deferral = deferral
    this.income = this.partner
      ? this.input.income.partner
      : this.input.income.client
    this.inputAge = inputAge
    this.formAge = formAge
    this.formYearsInCanada = formYearsInCanada
    this.userOas = userOas
    this.formReceiving = formReceiving
    this.residency =
      this.input.yearsInCanadaSince18 || this.input.yearsInCanadaSinceOAS
  }

  protected getEligibility(): EligibilityResult {
    // helpers
    const meetsReqAge = this.input.age >= 65

    // if income is not provided (only check client income), assume they meet the income requirement
    const skipReqIncome = this.income === undefined

    // income limit is higher at age 75
    const incomeLimit =
      this.input.age >= 75
        ? legalValues.oas.incomeLimit75
        : legalValues.oas.incomeLimit

    // Income is irrelevant therefore next will always be true
    const meetsReqIncome = skipReqIncome || this.income >= 0

    const requiredYearsInCanada = this.input.livingCountry.canada ? 10 : 20
    const meetsReqYears = this.residency >= requiredYearsInCanada
    const meetsReqLegal = this.input.legalStatus.canadian

    // main checks
    if (meetsReqIncome && meetsReqLegal && meetsReqYears) {
      if (meetsReqAge && skipReqIncome)
        return {
          result: ResultKey.INCOME_DEPENDENT,
          reason: ResultReason.LIVING_COUNTRY,
          detail: this.translations.detail.oas.eligibleIfIncomeIsLessThan,
          incomeMustBeLessThan: incomeLimit,
        }
      else if (meetsReqAge) {
        return {
          result: ResultKey.ELIGIBLE,
          reason:
            this.income > incomeLimit
              ? ResultReason.INCOME
              : this.input.age >= 65 && this.input.age < 70
              ? ResultReason.AGE_65_TO_69
              : ResultReason.AGE_70_AND_OVER,
          detail:
            this.income > incomeLimit
              ? this.future
                ? this.translations.detail.oas.futureEligibleIncomeTooHigh
                : this.translations.detail.oas.eligibleIncomeTooHigh
              : this.future
              ? this.translations.detail.futureEligible
              : this.translations.detail.eligible,
        }
      } else if (this.input.age >= 64 && this.input.age < 65) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG_64,
          detail: this.translations.detail.oas.eligibleWhenTurn65,
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.oas.eligibleWhenTurn65,
        }
      }
    } else if (!meetsReqIncome) {
      return {
        result: ResultKey.INELIGIBLE,
        reason: ResultReason.INCOME,
        detail: this.translations.detail.mustMeetIncomeReq,
      }
    } else if (!meetsReqYears) {
      if (
        this.input.livingCountry.agreement ||
        this.input.everLivedSocialCountry
      ) {
        if (meetsReqAge) {
          return {
            result: ResultKey.UNAVAILABLE,
            reason: ResultReason.YEARS_IN_CANADA,
            detail: this.translations.detail.dependingOnAgreement,
          }
        } else {
          return {
            result: ResultKey.INELIGIBLE,
            reason: ResultReason.AGE_YOUNG,
            detail: this.translations.detail.dependingOnAgreementWhen65,
          }
        }
      } else {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.YEARS_IN_CANADA,
          detail: this.translations.detail.mustMeetYearReq,
        }
      }
    } else if (!meetsReqLegal) {
      if (!meetsReqAge) {
        return {
          result: ResultKey.INELIGIBLE,
          reason: ResultReason.AGE_YOUNG,
          detail: this.translations.detail.dependingOnLegalWhen65,
        }
      } else {
        return {
          result: ResultKey.UNAVAILABLE,
          reason: ResultReason.LEGAL_STATUS,
          detail: this.translations.detail.dependingOnLegal,
        }
      }
    }
    throw new Error('entitlement logic failed to produce a result')
  }

  // the calculation piece is missing validation, instead, it directly
  // calculate with the legal value. Will revist this piece.
  protected getEntitlement(): EntitlementResultOas {
    const autoEnrollment = this.getAutoEnrollment()
    if (
      (this.eligibility.result !== ResultKey.ELIGIBLE &&
        this.eligibility.result !== ResultKey.INCOME_DEPENDENT) ||
      (this.eligibility.result === ResultKey.ELIGIBLE &&
        this.eligibility.reason === ResultReason.INCOME)
    )
      return {
        result: 0,
        result65To74: 0,
        resultAt75: 0,
        clawback: 0,
        deferral: {
          age: 65,
          years: 0,
          increase: 0,
          deferred: this.deferral || !!this.input.oasDeferDuration,
          length: this.input.oasDeferDuration,
          residency: this.residency,
        },
        type: EntitlementResultType.NONE,
        autoEnrollment,
      }

    // Monthly clawback amount
    const monthlyClawbackAmount = roundToTwo(this.clawbackAmount / 12)

    // monthly entitlement amount minus monthly clawback amount
    // const resultCurrent = this.currentEntitlementAmount - monthlyClawbackAmount  //Task 114098 original code
    // task 114098 do not substract the amount from the benefit amount
    const resultCurrent = this.currentEntitlementAmount //remove this line when a correct recovery process is in place.

    if (resultCurrent <= 0) {
      return {
        result: 0,
        result65To74: 0,
        resultAt75: 0,
        clawback: 0,
        deferral: {
          age: this.deferralYears + 65,
          years: this.deferralYears,
          increase: 0,
          deferred: this.deferral || !!this.input.oasDeferDuration,
          length: this.input.oasDeferDuration,
          residency: this.residency,
        },
        type: EntitlementResultType.NONE,
        autoEnrollment,
      }
    }

    const result65To74 = this.age65to74Amount
    const resultAt75 = this.age75EntitlementAmount
    const type =
      this.residency < 40
        ? EntitlementResultType.PARTIAL
        : EntitlementResultType.FULL

    if (type === EntitlementResultType.PARTIAL)
      this.eligibility.detail = this.future
        ? this.translations.detail.futureEligible
        : this.translations.detail.eligiblePartialOas

    return {
      result: resultCurrent,
      result65To74,
      resultAt75,
      clawback: monthlyClawbackAmount,
      deferral: {
        age: this.deferralYears + 65,
        years: this.deferralYears,
        increase: this.deferralIncrease,
        deferred: this.deferral || !!this.input.oasDeferDuration,
        length: this.input.oasDeferDuration,
        residency: this.residency,
      },
      type,
      autoEnrollment,
    }
  }

  /**
   * The "base" OAS amount, considering yearsInCanada, ignoring deferral.
   */
  private get baseAmount() {
    return Math.min(this.residency / 40, 1) * legalValues.oas.amount
  }

  /**
   * The number of years the client has chosen to defer their OAS pension.
   */
  private get deferralYears(): number {
    let oasAge = 65
    const durationStr = this.input.oasDeferDuration

    if (durationStr) {
      const duration: MonthsYears = JSON.parse(durationStr)
      const durationFloat = duration.years + duration.months / 12
      oasAge = 65 + durationFloat
    }

    return Math.max(0, oasAge - 65) // the number of years deferred (between zero and five)
  }

  /**
   * The dollar amount by which the OAS entitlement will increase due to deferral.
   */
  private get deferralIncrease() {
    return getDeferralIncrease(this.deferralYears * 12, this.baseAmount)
  }

  /**
   * The expected OAS amount at age 65, considering yearsInCanada and deferral.
   */
  private get age65EntitlementAmount(): number {
    const baseAmount = this.baseAmount // the base amount before deferral calculations
    const deferralIncrease = this.deferralIncrease
    const amountWithDeferralIncrease = baseAmount + deferralIncrease // the final amount

    return roundToTwo(amountWithDeferralIncrease)
  }

  /**
   * The base OAS amount from 65 to 74 used for GIS calculations.
   */
  private get age65to74Amount(): number {
    const baseAmount = this.baseAmount // the base amount before deferral calculations
    return baseAmount
  }

  /**
   * The expected OAS amount at age 75, considering yearsInCanada and deferral.
   *
   * Note that we do not simply take the amount75 from the JSON file because of
   * the above considerations, and this.age65EntitlementAmount handles these.
   */
  private get age75EntitlementAmount(): number {
    return roundToTwo(this.age65EntitlementAmount * 1.1)
  }

  /**
   * The expected OAS amount, taking into account the client's age.
   * At age 75, OAS increases by 10%.
   */
  private get currentEntitlementAmount(): number {
    const condition = this.partner
      ? this.input.age < 75
      : this.input.age < 75 && this.inputAge < 75
    if (condition) return this.age65EntitlementAmount
    else return this.age75EntitlementAmount
  }

  /**
   * The yearly amount of "clawback" aka "repayment tax" the client will have to repay.
   */
  private get clawbackAmount(): number {
    const OAS_RT_RATE = 0.15

    if (!this.income || this.income < legalValues.oas.clawbackIncomeLimit)
      return 0

    const incomeOverCutoff = this.income - legalValues.oas.clawbackIncomeLimit
    const repaymentAmount = incomeOverCutoff * OAS_RT_RATE
    const oasYearly = this.currentEntitlementAmount * 12
    const result = Math.min(oasYearly, repaymentAmount)
    return roundToTwo(result)
  }

  // Add logic here that will generate data for Table component and additional text
  // Translations delegated to BenefitCards component on FE
  protected getMetadata(): any {
    if (this.future) {
      return OasBenefit.buildMetadataObj(
        this.input.age,
        this.input.age,
        this.input,
        this.eligibility,
        this.entitlement,
        this.future,
        this.formYearsInCanada
      )
    } else {
      return {
        tableData: null,
        currentAge: null,
        monthsTo70: null,
        receiveOAS: false,
      }
    }
  }

  static buildMetadataObj(
    currentAge,
    baseAge,
    input,
    eligibility,
    entitlement,
    future,
    formYearsInCanada
  ): MetaDataObject {
    const eligible =
      eligibility.result === ResultKey.ELIGIBLE ||
      eligibility.result === ResultKey.INCOME_DEPENDENT

    //Check future first, if !future don't bother

    const filledYears =
      future && !input.livedOnlyInCanada
        ? +input.yearsInCanadaSince18 !== +formYearsInCanada
          ? input.yearsInCanadaSince18
          : null
        : null

    const meta: MetaDataObject = {
      tableData: null,
      currentAge: null,
      monthsTo70: null,
      residency: filledYears,
      receiveOAS: false,
    }

    if (currentAge) {
      const ageInRange = currentAge >= 65 && currentAge < 70
      const receivingOAS = input.receiveOAS
      const currentAgeWhole = Math.floor(currentAge)
      const baseAgeWhole = Math.floor(baseAge)
      const estimate = entitlement.result65To74

      // Based on requirement to not show deferral options in "Will be eligible card" when inbetween min/max income thresholds
      // const dontShowCondition = entitlement.clawback !== 0 && !future

      // Eligible for OAS pension,and are 65-69, who do not already receive
      if (eligible && ageInRange && !receivingOAS) {
        const monthsTo70 = Math.round((70 - currentAge) * 12)
        meta.monthsTo70 = monthsTo70
        meta.receiveOAS = receivingOAS

        // have an estimate > 0
        if (!(estimate <= 0)) {
          const tableData = [...Array(71 - baseAgeWhole).keys()]
            .map((i) => i + baseAgeWhole)
            .map((deferAge, i) => {
              let monthsUntilAge = Math.round((deferAge - baseAge) * 12)
              if (monthsUntilAge < 0) monthsUntilAge = 0

              const monthsToIncrease =
                deferAge === 70
                  ? monthsUntilAge % 12 === 0
                    ? i * 12
                    : (monthsUntilAge % 12) + (i - 1) * 12
                  : i * 12

              const amount =
                estimate + getDeferralIncrease(monthsToIncrease, estimate)

              return {
                age: deferAge,
                amount,
              }
            })
          const filteredTableData = tableData.filter(
            (row) => row.age > currentAge
          )
          meta.tableData = filteredTableData
          meta.currentAge = currentAgeWhole
        }

        return meta
      }

      return {
        tableData: null,
        currentAge: null,
        monthsTo70: null,
        residency: filledYears,
        receiveOAS: receivingOAS,
      }
    }
  }

  public updateCollapsedText(): CardCollapsedText[] {
    return this.getCardCollapsedText()
  }

  protected getCardCollapsedText(): CardCollapsedText[] {
    let cardCollapsedText = super.getCardCollapsedText()

    if (this.input.everLivedSocialCountry) {
      cardCollapsedText.push(
        this.partner
          ? this.translations.detailWithHeading.socialSecurityEligiblePartner
          : this.translations.detailWithHeading.socialSecurityEligible
      )
    }
    // if not eligible, don't bother with any of the below
    if (
      this.eligibility.result !== ResultKey.ELIGIBLE &&
      this.eligibility.result !== ResultKey.INCOME_DEPENDENT
    )
      return cardCollapsedText

    if (this.partner) {
      //EC15
      if (this.entitlement.result > 0) {
        if (
          this.input.partnerBenefitStatus.value === PartnerBenefitStatus.NONE
        ) {
          cardCollapsedText.push(
            this.translations.detailWithHeading.partnerEligibleButAnsweredNo
          )
        }
      }
      //Handle EC9 - EC14
      if (this.userOas) {
        if (
          this.eligibility.result === ResultKey.ELIGIBLE &&
          this.userOas.eligibility.result === ResultKey.ELIGIBLE
        ) {
          if (this.clawbackAmount > 0 && this.userOas.clawbackAmount > 0) {
            //EC13
            if (
              this.userOas.input.livingCountry.value !== LivingCountry.CANADA
            ) {
              cardCollapsedText.push(
                this.translations.detailWithHeading.nonResidentTaxBoth
              )
            }
            //EC14
            else {
              cardCollapsedText.push(
                this.translations.detailWithHeading.recoveryTaxBoth
              )
            }
          }
        }
        if (this.clawbackAmount > 0 && this.userOas.clawbackAmount <= 0) {
          //EC11
          if (this.input.livingCountry.value !== LivingCountry.CANADA) {
            cardCollapsedText.push(
              this.translations.detailWithHeading.nonResidentTaxPartner
            )
          }
          //EC12
          else {
            cardCollapsedText.push(
              this.translations.detailWithHeading.recoveryTaxPartner
            )
          }
        }
      }
    }

    if (!this.partner) {
      //RECOVER TAX MESSAGE - if partnered better to handle it in the partnered section to access both benefits
      if (this.clawbackAmount > 0) {
        //EC10
        if (this.input.livingCountry.value !== LivingCountry.CANADA) {
          cardCollapsedText.push(
            this.translations.detailWithHeading.nonResidentTax
          )
        }
        //EC09
        else {
          cardCollapsedText.push(
            this.translations.detailWithHeading.recoveryTax
          )
        }
      }

      const ageCalc = this.formAge
        ? Math.trunc(this.formAge)
        : Math.trunc(this.inputAge)

      if (
        this.entitlement.result == 0 &&
        ageCalc > 64 &&
        ageCalc < 70 &&
        !this.input.receiveOAS
      ) {
        cardCollapsedText.push(
          this.translations.detailWithHeading.deferralDelay
        )
      }

      //EC8
      if (ageCalc >= 70 && !this.formReceiving && this.entitlement.result > 0) {
        cardCollapsedText.push(
          this.translations.detailWithHeading.retroactivePayment
        )
      }
      //EC19 && EC20
      if (ageCalc >= 75 && this.entitlement.result > 0) {
        cardCollapsedText.push(
          this.translations.detailWithHeading.oasIncreaseAt75Applied
        )
      }

      if (ageCalc > 64 && ageCalc < 75 && this.entitlement.result > 0) {
        cardCollapsedText.push(
          this.translations.detailWithHeading.oasIncreaseAt75
        )
      }
    }

    return cardCollapsedText
  }

  protected getCardLinks(): LinkWithAction[] {
    const links: LinkWithAction[] = []
    if (
      this.eligibility.result === ResultKey.ELIGIBLE ||
      this.eligibility.result === ResultKey.INCOME_DEPENDENT ||
      this.eligibility.reason === ResultReason.AGE_YOUNG_64
    )
      this.formReceiving
        ? links.push(this.translations.links.SignInSC)
        : links.push(this.translations.links.apply[this.benefitKey])
    links.push(this.translations.links.overview[this.benefitKey])
    return links
  }
}
