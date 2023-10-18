import { consoleDev } from '../web/helpers/utils'
import { getTranslations, Translations } from '../../i18n/api'
import { AlwsBenefit } from './benefits/alwsBenefit'
import { AlwBenefit } from './benefits/alwBenefit'
import { EntitlementFormula } from './benefits/entitlementFormula'
import { GisBenefit } from './benefits/gisBenefit'
import { OasBenefit } from './benefits/oasBenefit'
import { BaseBenefit } from './benefits/_base'
import {
  EntitlementResultType,
  LegalStatus,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  ResultReason,
} from './definitions/enums'
import {
  BenefitResultsObjectWithPartner,
  EntitlementResultGeneric,
  ProcessedInput,
  RequestInput,
  ProcessedInputWithPartner,
} from './definitions/types'
import {
  MaritalStatusHelper,
  PartnerBenefitStatusHelper,
  LegalStatusHelper,
  LivingCountryHelper,
  IncomeHelper,
} from './helpers/fieldClasses'
import legalValues from './scrapers/output'

//
// This File is just to unload this big chunk of code
//
//  For All cases below the procedure is the same
//    Calculates Client benefits by itself
//    Calculates Partner benefits by itself
//    Compares amounts returned to identified which one is more $$$ convinient for the client.
//

export function InvSeparatedAllCases(
  clientOas: OasBenefit,
  clientGis: GisBenefit,
  clientAlw: AlwBenefit,
  clientAlws: AlwsBenefit,
  partnerOas: OasBenefit,
  partnerGis: GisBenefit,
  partnerAlw: AlwBenefit,
  initialPartnerBenefitStatus: PartnerBenefitStatus,
  future: Boolean,
  input: ProcessedInputWithPartner,
  rawInput: Partial<RequestInput>,
  allResults: BenefitResultsObjectWithPartner
) {
  //
  const isIncomeProvided =
    input.client.income.provided && input.partner.income.provided

  const translations: Translations = getTranslations(rawInput._language)

  if (isIncomeProvided) {
    // *************************************
    //  Case #1
    // *************************************

    if (clientOas.entitlement.result > 0 && partnerOas.entitlement.result > 0) {
      consoleDev('--- Case #1 both oas are greater than 0 --- start')

      let maritalStatus = new MaritalStatusHelper(MaritalStatus.SINGLE)

      // applicant gis using table1
      const applicantGisResultT1 = new EntitlementFormula(
        input.client.income.client,
        maritalStatus,
        input.client.partnerBenefitStatus,
        input.client.age,
        allResults.client.oas
      ).getEntitlementAmount()

      consoleDev(
        'both Oas > 0 - applicantGisResultTable1',
        applicantGisResultT1
      )

      // partner gis using table1
      const partnerGisResultT1 = new EntitlementFormula(
        input.client.income.partner,
        maritalStatus,
        input.partner.partnerBenefitStatus,
        input.partner.age,
        allResults.partner.oas
      ).getEntitlementAmount()

      consoleDev('both Oas > 0 - partnerGisResultTable1', partnerGisResultT1)

      maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)

      // Partner benefit status determines if RT2 or RT3 is used
      let benefitStatus = new PartnerBenefitStatusHelper(
        rawInput.partnerBenefitStatus === PartnerBenefitStatus.NONE
          ? PartnerBenefitStatus.NONE
          : PartnerBenefitStatus.OAS_GIS
      )

      // benefitStatus NONE means 1 pensioner, other no benfefit -> RT3
      // benefitStatus OAS_GIS means both are receiving OAS/GIS -> RT2
      const applicantGisT2_T3 = new EntitlementFormula(
        input.client.income.relevant,
        maritalStatus,
        benefitStatus,
        input.client.age,
        allResults.client.oas
      ).getEntitlementAmount()

      consoleDev('both Oas > 0 - applicantGisT2_T3', applicantGisT2_T3)

      // partner gis using table2
      const partnerGisResultT2 = new EntitlementFormula(
        input.client.income.relevant,
        maritalStatus,
        benefitStatus,
        input.partner.age,
        allResults.partner.oas
      ).getEntitlementAmount()

      consoleDev('both Oas > 0 - partnerGisResultT2', partnerGisResultT2)

      // define total_amt_singleA
      const totalAmountSingleApplicant =
        allResults.client.oas.entitlement.result + applicantGisResultT1

      // define total_amt_singleB
      const totalAmountSinglePartner =
        allResults.partner.oas.entitlement.result + partnerGisResultT1

      // define Total_amt_single
      const totalAmountSingle =
        totalAmountSingleApplicant + totalAmountSinglePartner

      // define Total_amt_CoupleA
      const totalAmountCoupleA =
        allResults.client.oas.entitlement.result + applicantGisT2_T3

      // define Total_amt_CoupleB
      const totalAmountCoupleB =
        allResults.partner.oas.entitlement.result + partnerGisResultT2

      // define Total_amt_Couple (need to add gis enhancement? )
      const totalAmountCouple = totalAmountCoupleA + totalAmountCoupleB

      // T3 only relevant in scenarios when 1 partner receives GIS and other, not receiving any benefit
      const useT1versusT2_T3 =
        applicantGisResultT1 + partnerGisResultT1 >
        applicantGisT2_T3 + partnerGisResultT2

      if (totalAmountSingle < totalAmountCouple) {
        //          Total Amount Couple > Total Amount Single

        consoleDev(
          'both Oas > 0 - totalAmountsingle < totalAmountCouple',
          'totalAmountSingle',
          totalAmountSingle,
          'totalAmountCouple',
          totalAmountCouple
        )
        allResults.client.gis.entitlement.result = applicantGisT2_T3
        allResults.client.gis.entitlement.type = EntitlementResultType.FULL

        allResults.partner.gis.entitlement.result = partnerGisResultT2
        allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
      } else {
        //          Total Amount Single > Total Amount Couple
        consoleDev(
          'both Oas > 0 - totalAmountsingle > totalAmountCouple',
          'totalAmountSingle',
          totalAmountSingle,
          'totalAmountCouple',
          totalAmountCouple
        )

        consoleDev('useT1versusT2_T3: ', useT1versusT2_T3)
        const clientSingleInput = getSingleClientInput(
          input,
          rawInput,
          useT1versusT2_T3
        )

        clientGis = new GisBenefit(
          clientSingleInput,
          translations,
          allResults.client.oas,
          false,
          future
        )

        if (useT1versusT2_T3) {
          clientGis.cardDetail.collapsedText.push(
            translations.detailWithHeading.calculatedBasedOnIndividualIncome
          )
        }

        const partnerSingleInput = getSinglePartnerInput(input, rawInput)

        partnerGis = new GisBenefit(
          partnerSingleInput,
          translations,
          allResults.partner.oas,
          true
        )

        setValueForAllResults(allResults, 'client', 'gis', clientGis)
        setValueForAllResults(allResults, 'partner', 'gis', partnerGis)
      }
      consoleDev('--- both oas are greater than 0 --- end')
    }
    // ********************************************
    //   Case # 2
    // ********************************************
    else if (partnerAlw.eligibility.result === ResultKey.ELIGIBLE) {
      //
      consoleDev('--- Case #2 - partner is eligible for alw --- start')

      const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)
      //calculate gis entitlement for applicant use table4
      const applicantGisResultT4 = new EntitlementFormula(
        input.client.income.relevant,
        maritalStatus,
        input.client.partnerBenefitStatus,
        input.client.age,
        allResults.client.oas
      ).getEntitlementAmount()

      const partnerAlwCalcCouple = new EntitlementFormula(
        input.partner.income.relevant,
        maritalStatus,
        input.partner.partnerBenefitStatus,
        input.partner.age
      ).getEntitlementAmount()

      consoleDev(
        'T4',
        applicantGisResultT4,
        'partnerAlwCalcCouple',
        partnerAlwCalcCouple
      )

      // define Total_amt_Couple
      const totalAmtCouple = applicantGisResultT4 + partnerAlwCalcCouple

      const mStatus = new MaritalStatusHelper(MaritalStatus.SINGLE)

      // applicant gis using table1
      const applicantGisResultT1 = new EntitlementFormula(
        input.client.income.client,
        mStatus,
        input.client.partnerBenefitStatus,
        input.client.age,
        allResults.client.oas
      ).getEntitlementAmount()

      const partnerAlwCalcSingle = new EntitlementFormula(
        input.partner.income.partner,
        maritalStatus,
        input.partner.partnerBenefitStatus,
        input.partner.age,
        allResults.partner.oas
      ).getEntitlementAmount()

      consoleDev(
        'T1',
        applicantGisResultT1,
        'partnerAlwCalcSingle',
        partnerAlwCalcSingle
      )

      // define Total_amt_Single
      const totalAmountSingle = applicantGisResultT1 + partnerAlwCalcSingle

      consoleDev(
        'Case: partner is eligible for alw',
        'totalAmountSingle',
        totalAmountSingle,
        'totalAmtCouple',
        totalAmtCouple
      )

      setValueForAllResults(allResults, 'partner', 'alw', partnerAlw)

      let isApplicantGisAvailable = true
      // true when Receiving or I don't know.
      let receivingOas =
        input.client.partnerBenefitStatus.value === PartnerBenefitStatus.NONE

      if (totalAmountSingle > totalAmtCouple) {
        const clientSingleInput = getSingleClientInput(input, rawInput, true)

        clientGis = new GisBenefit(
          clientSingleInput,
          translations,
          allResults.client.oas,
          false,
          future
        )

        if (clientGis.entitlement.result === 0) {
          isApplicantGisAvailable = false

          if (partnerAlwCalcSingle > 0) {
            partnerAlw.cardDetail.collapsedText.push(
              translations.detailWithHeading.partnerEligible
            )
          }
        } else {
          allResults.client.gis.cardDetail.collapsedText.push(
            translations.detailWithHeading.calculatedBasedOnIndividualIncome
          )
          allResults.client.gis.eligibility = clientGis.eligibility
          allResults.client.gis.entitlement.result = applicantGisResultT1
          allResults.client.gis.entitlement.type = EntitlementResultType.FULL
          allResults.client.gis.eligibility.detail,
            (allResults.client.gis.cardDetail.mainText = future
              ? `${translations.detail.futureEligible} ${translations.detail.futureExpectToReceive}`
              : `${translations.detail.eligible} ${translations.detail.expectToReceive}`)

          allResults.partner.alw.cardDetail = partnerAlw.cardDetail
          allResults.partner.alw.entitlement.result = partnerAlwCalcSingle

          if (partnerAlwCalcSingle > 0) {
            allResults.partner.alw.cardDetail.collapsedText.push(
              translations.detailWithHeading.calculatedBasedOnIndividualIncome
            )

            partnerAlw.cardDetail.collapsedText.push(
              translations.detailWithHeading.partnerEligible
            )
          }
        }
      }

      if (totalAmountSingle <= totalAmtCouple || !isApplicantGisAvailable) {
        const clientGisCouple = new GisBenefit(
          input.client,
          translations,
          allResults.client.oas,
          false,
          future
        )

        setValueForAllResults(allResults, 'client', 'gis', clientGisCouple)

        allResults.partner.alw.entitlement.result = partnerAlwCalcCouple

        //
        // Display a note stating when PartnerB turns 65, to determine if it is still
        // advantageous to use the GIS Single Rate (Rate Table 1) instead of Rate Table 4
        //
      }
      // else {
      //
      isApplicantGisAvailable = true

      consoleDev('--- partner is eligible for alw --- end')
    }
    // ************************************************
    //   Case # 3
    // ************************************************
    else if (clientAlw.eligibility.result === ResultKey.ELIGIBLE) {
      //
      consoleDev(' --- Case #3 - applicant is eligible for alw --- start')

      const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)

      //calculate gis entitlement for applicant use table4
      const partnerGisResultT4 = new EntitlementFormula(
        input.partner.income.relevant,
        maritalStatus,
        input.partner.partnerBenefitStatus,
        input.partner.age,
        allResults.partner.oas
      ).getEntitlementAmount()

      //calculate alw entitlement for application
      const applicantAlwCalcCouple = new EntitlementFormula(
        input.client.income.relevant,
        maritalStatus,
        input.client.partnerBenefitStatus,
        input.client.age
      ).getEntitlementAmount()

      //calculate alw entitlement for application
      const applicantAlwCalcSingle = new EntitlementFormula(
        input.client.income.client,
        maritalStatus,
        input.client.partnerBenefitStatus,
        //new PartnerBenefitStatusHelper(PartnerBenefitStatus.OAS_GIS),
        input.client.age
      ).getEntitlementAmount()

      consoleDev(
        'applicantAlwCalc',
        applicantAlwCalcCouple,
        applicantAlwCalcSingle,
        clientAlw.entitlement.result
      )

      // define Total_amt_Couple
      const totalAmountCouple = partnerGisResultT4 + applicantAlwCalcCouple

      consoleDev(
        'partnerGisResultT4',
        partnerGisResultT4,
        'clientAlw.entitlement.result',
        clientAlw.entitlement.result
      )

      // calculate partner GIS using table 1
      const partnerGisResultT1 = new EntitlementFormula(
        input.partner.income.partner,
        new MaritalStatusHelper(MaritalStatus.SINGLE),
        input.partner.partnerBenefitStatus,
        input.partner.age,
        allResults.partner.oas
      ).getEntitlementAmount()

      consoleDev('partnerGisResultT1', partnerGisResultT1)

      // define Total_amt_Single
      const totalAmountSingle = partnerGisResultT1 + applicantAlwCalcSingle

      consoleDev(
        'applicant is eligible for alw',
        'totalAmtSingle',
        totalAmountSingle,
        'totalAmountCouple',
        totalAmountCouple
      )

      let isPartnerGisAvailable = true
      if (totalAmountSingle > totalAmountCouple) {
        const partnerSingleInput = getSinglePartnerInput(input, rawInput)

        partnerGis = new GisBenefit(
          partnerSingleInput,
          translations,
          allResults.partner.oas,
          true
        )

        // #115349 no allowance because partnerBenefits = No
        if (
          partnerGis.entitlement.result === 0 ||
          initialPartnerBenefitStatus === PartnerBenefitStatus.NONE
        ) {
          isPartnerGisAvailable = false
        } else {
          allResults.partner.gis.eligibility = partnerGis.eligibility
          allResults.partner.gis.entitlement = partnerGis.entitlement

          if (
            allResults.partner.gis.entitlement.result > 0 &&
            allResults.client.gis.entitlement.result <= 0
          ) {
            // TODO
            // allResults.partner.gis.cardDetail.collapsedText.push(
            //   translations.detailWithHeading
            //     .calculatedBasedOnIndividualIncome
            // )
          }
          if (
            !allResults.partner.gis.cardDetail.collapsedText.includes(
              translations.detailWithHeading.partnerEligible
            )
          )
            allResults.partner.gis.cardDetail.collapsedText.unshift(
              translations.detailWithHeading.partnerEligible
            )

          // If client is eligible for ALW, need to recalculate estimate based on individual income
          if (clientAlw.eligibility.result === 'eligible') {
            if (input.client.income.client >= legalValues.alw.alwIncomeLimit) {
              const tempClientAlw = new AlwBenefit(
                input.client,
                translations,
                rawInput.partnerLivingCountry,
                false,
                false,
                future
              )
              setValueForAllResults(allResults, 'client', 'alw', tempClientAlw)

              // overwrite eligibility and cardDetails for correct text in card
              allResults.client.alw.eligibility = {
                result: ResultKey.ELIGIBLE,
                reason: ResultReason.NONE,
                detail: translations.detail.alwEligibleIncomeTooHigh,
              }
            } else {
              const tempClientAlw = new AlwBenefit(
                input.client,
                translations,
                rawInput.partnerLivingCountry,
                false,
                true,
                future
              )
              setValueForAllResults(allResults, 'client', 'alw', tempClientAlw)

              // overwrite eligibility and cardDetails for correct text in card
              allResults.client.alw.eligibility = {
                result: ResultKey.ELIGIBLE,
                reason: ResultReason.NONE,
                detail: translations.detail.eligible,
              }

              // cardDetails
              allResults.client.alw.eligibility.detail,
                (allResults.client.alw.cardDetail.mainText = future
                  ? `${translations.detail.futureEligible60} ${translations.detail.futureExpectToReceive}`
                  : `${translations.detail.eligible} ${translations.detail.expectToReceive}`)

              allResults.client.alw.cardDetail.collapsedText.push(
                translations.detailWithHeading.calculatedBasedOnIndividualIncome
              )
            }
          }

          if (
            input.partner.invSeparated &&
            allResults.partner.gis.entitlement.result > 0 &&
            clientAlw.entitlement.result > 0
          ) {
            allResults.partner.alw.cardDetail.collapsedText.push(
              translations.detailWithHeading.calculatedBasedOnIndividualIncome
            )

            allResults.client.alw.entitlement.result = applicantAlwCalcSingle
          }
        }
      }

      if (totalAmountSingle <= totalAmountCouple || !isPartnerGisAvailable) {
        // return partnerGisResultT4 only partnerBenefits = No
        if (initialPartnerBenefitStatus !== PartnerBenefitStatus.NONE) {
          allResults.partner.gis.entitlement.result = partnerGisResultT4
          allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
          allResults.client.alw.entitlement.result = applicantAlwCalcCouple
        } else {
          allResults.client.alw.eligibility.result = ResultKey.INELIGIBLE
          allResults.client.alw.eligibility.reason = ResultReason.PARTNER
          allResults.client.alw.eligibility.detail =
            translations.detail.alwNotEligible
          allResults.client.alw.entitlement.result = 0
          allResults.client.alw.entitlement.type = EntitlementResultType.NONE
          allResults.client.alw.cardDetail.mainText =
            translations.detail.alwEligibleButPartnerAlreadyIs
          allResults.client.alw.cardDetail.links.splice(0, 1)
        }
      }
      isPartnerGisAvailable = true

      consoleDev(' --- applicant is eligible for alw --- end')
    }
    // *************************************
    //   Case #4
    // *************************************
    else if (
      clientOas.entitlement.result > 0 &&
      partnerOas.entitlement.result === 0
    ) {
      //
      consoleDev(
        '--- Case #4 - both are not eligible for alw - applicant oas > 0 & partner oas =0 --- start'
      )

      let maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)
      const noOASString = JSON.stringify(allResults.client.oas)
      const noOAS = JSON.parse(noOASString)
      noOAS.entitlement.result = 0

      const applicantGisResultT3 = new EntitlementFormula(
        input.client.income.relevant,
        maritalStatus,
        input.client.partnerBenefitStatus,
        input.client.age,
        noOAS
      ).getEntitlementAmount()

      // get OAS for applicant use table 1
      maritalStatus = new MaritalStatusHelper(MaritalStatus.SINGLE)

      // applicant gis using table1
      const applicantGisResultT1 = new EntitlementFormula(
        input.client.income.client,
        maritalStatus,
        input.client.partnerBenefitStatus,
        input.client.age,
        allResults.client.oas
      ).getEntitlementAmount()

      consoleDev(
        'clientOas > 0 and partnerOas = 0',
        allResults.client.oas,
        'applicantGisTable1',
        applicantGisResultT1,
        'applicantGisResultT3',
        applicantGisResultT3
      )
      if (applicantGisResultT1 < applicantGisResultT3) {
        allResults.client.gis.entitlement.result = applicantGisResultT3
        allResults.client.gis.entitlement.type = EntitlementResultType.FULL
      } else {
        allResults.client.gis.entitlement.result = applicantGisResultT1
        allResults.client.gis.entitlement.type = EntitlementResultType.FULL
      }
      //since the collapsed texts gets called at object instantiation, we have to update it manually with
      //the entitlement result once it's calculated
      clientGis.cardDetail.collapsedText = clientGis.updateCollapsedText()

      // the push below prob can be moved to the else condition above but no time to test all scenarios
      if (
        (allResults.client.gis.eligibility.reason === ResultReason.NONE ||
          allResults.client.gis.eligibility.reason === ResultReason.INCOME) &&
        clientGis.entitlement.result > 0 &&
        (rawInput.partnerLegalStatus === LegalStatus.YES ||
          rawInput.partnerLegalStatus === undefined)
      ) {
        allResults.client.gis.cardDetail.collapsedText.push(
          translations.detailWithHeading.calculatedBasedOnIndividualIncome
        )
      }

      if (
        allResults.client.gis.eligibility.reason === ResultReason.INCOME &&
        clientGis.entitlement.result > 0
      ) {
        allResults.client.gis.eligibility.detail,
          (allResults.client.gis.cardDetail.mainText = future
            ? `${translations.detail.futureEligible} ${translations.detail.futureExpectToReceive}`
            : `${translations.detail.eligible} ${translations.detail.expectToReceive}`)
      }

      consoleDev(
        '--- both are not eligible for alw - applicant oas > 0 & partner oas =0 --- end'
      )
    }
    // *************************************
    //   Case #5
    // *************************************
    else if (
      clientOas.entitlement.result === 0 &&
      partnerOas.entitlement.result > 0
    ) {
      //
      consoleDev(
        '--- Case #5 - both are not eligible for alw - applicant oas = 0 & partner oas > 0 --- start'
      )

      const maritalStatus = new MaritalStatusHelper(MaritalStatus.PARTNERED)

      // T3 was originally coded with the client.oas and entitlement=0
      //  but it returned an incorrect GIS amount and OAS=0
      const noOAS = allResults.partner.oas

      const partnerGisResultT3 = new EntitlementFormula(
        input.partner.income.relevant,
        maritalStatus,
        input.partner.partnerBenefitStatus,
        input.partner.age,
        noOAS
      ).getEntitlementAmount()

      const partnerGisResultT1 = new EntitlementFormula(
        input.client.income.partner,
        new MaritalStatusHelper(MaritalStatus.SINGLE),
        input.partner.partnerBenefitStatus,
        input.partner.age,
        allResults.partner.oas
      ).getEntitlementAmount()

      consoleDev(
        'clientOas = 0 and partnerOas > 0',
        'partnerGisTable1',
        partnerGisResultT1,
        'partnerGisResultT3',
        partnerGisResultT3
      )

      if (partnerGisResultT1 < partnerGisResultT3) {
        allResults.partner.gis.entitlement.result = partnerGisResultT3
        allResults.partner.gis.entitlement.type = EntitlementResultType.FULL
      } else {
        allResults.partner.gis.entitlement.result = partnerGisResultT1
        allResults.partner.gis.entitlement.type = EntitlementResultType.FULL

        if (
          !partnerGis.cardDetail.collapsedText.includes(
            translations.detailWithHeading.partnerEligible
          )
        ) {
          partnerGis.cardDetail.collapsedText.unshift(
            translations.detailWithHeading.partnerEligible
          )
        }
      }

      // add the amount calculated to the card.
      if (
        allResults.partner.gis.entitlement.result > 0 &&
        initialPartnerBenefitStatus !== PartnerBenefitStatus.NONE
      ) {
        if (allResults.client.gis.entitlement.result <= 0) {
          if (
            !allResults.client.gis.cardDetail.collapsedText.includes(
              translations.detailWithHeading.calculatedBasedOnIndividualIncome
            ) &&
            !allResults.partner.gis.cardDetail.collapsedText.includes(
              translations.detailWithHeading.calculatedBasedOnIndividualIncome
            )
          )
            allResults.partner.gis.cardDetail.collapsedText.unshift(
              translations.detailWithHeading.calculatedBasedOnIndividualIncome
            )
        }
      }

      consoleDev(
        '--- both are not eligible for alw - applicant oas = 0 & partner oas > 0 --- end'
      )
    }
  }

  // Finish with AFS entitlement.
  allResults.client.alws.entitlement = clientAlws.entitlement
  allResults.client.alws.cardDetail = clientAlws.cardDetail

  // Process all CardDetails
  allResults.client.oas.cardDetail =
    undefined === allResults.client.oas.cardDetail
      ? clientOas.cardDetail
      : allResults.client.oas.cardDetail

  allResults.client.gis.cardDetail =
    undefined === allResults.client.gis.cardDetail
      ? clientGis.cardDetail
      : allResults.client.gis.cardDetail

  allResults.client.alw.cardDetail =
    undefined === allResults.client.alw.cardDetail
      ? clientAlw.cardDetail
      : allResults.client.alw.cardDetail
}

function setValueForAllResults(
  allResults: BenefitResultsObjectWithPartner,
  prop: string,
  benefitName: string,
  benefit: BaseBenefit<EntitlementResultGeneric>
): void {
  allResults[prop][benefitName].eligibility = benefit.eligibility
  allResults[prop][benefitName].entitlement = benefit.entitlement
  allResults[prop][benefitName].cardDetail = benefit.cardDetail
}

//
//

function getSingleClientInput(
  input: ProcessedInputWithPartner,
  rawInput: Partial<RequestInput>,
  useTable1: boolean
): ProcessedInput {
  //
  // if useTable1 then force Table 1 over Table 3

  const incomeHelper = new IncomeHelper(
    rawInput.incomeAvailable,
    false,
    useTable1 ? rawInput.income : input.client.income.relevant,
    0,
    useTable1
      ? new MaritalStatusHelper(MaritalStatus.SINGLE)
      : new MaritalStatusHelper(MaritalStatus.PARTNERED)
  )

  const clientSingleInput: ProcessedInput = {
    income: incomeHelper,
    age: rawInput.age,
    receiveOAS: rawInput.receiveOAS,
    oasDeferDuration: rawInput.oasDeferDuration,
    oasDefer: rawInput.oasDefer,
    oasAge: rawInput.oasDefer ? rawInput.oasAge : 65,
    maritalStatus: useTable1
      ? new MaritalStatusHelper(MaritalStatus.SINGLE)
      : new MaritalStatusHelper(MaritalStatus.PARTNERED),
    livingCountry: new LivingCountryHelper(rawInput.livingCountry),
    legalStatus: new LegalStatusHelper(rawInput.legalStatus),
    livedOnlyInCanada: rawInput.livedOnlyInCanada,
    // if not livedOnlyInCanada, assume yearsInCanadaSince18 is 40
    yearsInCanadaSince18: rawInput.livedOnlyInCanada
      ? 40
      : rawInput.yearsInCanadaSince18,
    everLivedSocialCountry: rawInput.everLivedSocialCountry,
    invSeparated: rawInput.invSeparated,
    partnerBenefitStatus: useTable1
      ? new PartnerBenefitStatusHelper(rawInput.partnerBenefitStatus)
      : new PartnerBenefitStatusHelper(PartnerBenefitStatus.NONE),
  }

  return clientSingleInput
}

//
//

function getSinglePartnerInput(
  input: ProcessedInputWithPartner,
  rawInput: Partial<RequestInput>
): ProcessedInput {
  const incomeHelper = new IncomeHelper(
    true,
    false,
    rawInput.partnerIncome,
    0,
    new MaritalStatusHelper(MaritalStatus.SINGLE)
  )

  const partnerInput: ProcessedInput = {
    income: incomeHelper,
    age: rawInput.partnerAge,
    receiveOAS: rawInput.receiveOAS,
    oasDefer: false, // pass dummy data because we will never use this anyway
    oasDeferDuration: JSON.stringify({ months: 0, years: 0 }),
    oasAge: 65, // pass dummy data because we will never use this anyway
    maritalStatus: new MaritalStatusHelper(MaritalStatus.SINGLE),
    livingCountry: new LivingCountryHelper(rawInput.partnerLivingCountry),
    legalStatus: new LegalStatusHelper(rawInput.partnerLegalStatus),
    livedOnlyInCanada: rawInput.partnerLivedOnlyInCanada,
    yearsInCanadaSince18: rawInput.partnerLivedOnlyInCanada
      ? 40
      : rawInput.partnerYearsInCanadaSince18,
    everLivedSocialCountry: false, //required by ProcessedInput
    partnerBenefitStatus: input.partner.partnerBenefitStatus,
    invSeparated: rawInput.invSeparated,
  }

  return partnerInput
}
