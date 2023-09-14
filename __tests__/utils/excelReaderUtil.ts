import { faBullseye } from '@fortawesome/free-solid-svg-icons'
import { any, boolean, number } from 'joi'
import { isUndefined } from 'lodash'
import * as XLSX from 'xlsx'
import { getLogger } from '../../logging/log-util'
import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
} from '../../utils/api/definitions/enums'
import { MonthsYears } from '../../utils/api/definitions/types'
import { consoleDev } from '../../utils/web/helpers/utils'

export function getTransformedPayloadByName(
  filePath: string,
  testName: string
): any | undefined {
  const data = readExcelData(filePath)
  const rowToTransform = data.find((row) => row['Scenario'] === testName) // Assuming "testName" column is represented by "Column1"

  console.log('Extracted rowToTransform:', rowToTransform)

  if (rowToTransform) {
    const transformedPayload = createTransformedPayload(rowToTransform)
    return transformedPayload
  }

  return undefined
}

function readExcelData(filePath: string): string[] {
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const jsonData: string[] = XLSX.utils.sheet_to_json(sheet, { range: 1 })
  return jsonData
}

function createTransformedPayload(rowToTransform: string): Record<string, any> {
  const payload: Record<string, any> = {
    /*  incomeAvailable:
      rowToTransform["User's Net Worldwide Income"] === 'N/A' ? false : true, // Replace 'N/A' or empty with false*/
    income: roundedIncome(rowToTransform["User's Net Worldwide Income"]),
    age: rowToTransform['Age '],
    /*oasDefer:
      rowToTransform['Delay (# of Years and Months)'] === 'N/A' ? false : true, // Replace 'N/A' or empty with false
    oasAge: claculOasAge(
      extractFirstCharacterAfterSemicolon(
        rowToTransform['Delay (# of Years and Months)']
      )
    ),*/
    receiveOAS: transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]),
    oasDeferDuration:
      rowToTransform['Delay (# of Years and Months)'] === 'N/A'
        ? undefined
        : '{"years":' +
          extractValueBeforeSemicolon(
            rowToTransform['Delay (# of Years and Months)']
          ) +
          ',"months":' +
          extractFirstCharacterAfterSemicolon(
            rowToTransform['Delay (# of Years and Months)']
          ) +
          '}',
    maritalStatus: transformMaritalStatusValue(
      rowToTransform['Marital Status\r\n(With or Without Partner, Widowed)']
    ),
    invSeparated: transformValue(rowToTransform['Inv Sep (Yes / No)']),
    livingCountry: transformLivingContryValue(
      rowToTransform['Country of Residence\r\n(Canada, Not Canada)']
    ), // country code
    legalStatus: transformLegalStatusValue(
      rowToTransform['Legal Status (Yes / No)']
    ),
    livedOnlyInCanada: transformLiveOnlyCanadaValue(
      rowToTransform[
        '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ]
    ),
    yearsInCanadaSinceOAS:
      transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]) === true
        ? transformYearsInCanadaSinceOAS18Value(
            rowToTransform[
              '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
            ]
          )
        : undefined,
    yearsInCanadaSince18:
      transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]) === false ||
      transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]) === undefined
        ? transformYearsInCanadaSinceOAS18Value(
            rowToTransform[
              '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
            ]
          )
        : undefined,
    //everLivedSocialCountry: false, // check with vero
    partnerBenefitStatus: transformPartnerBenefitStatusValue(
      rowToTransform["Partner Rec'ing OAS (Yes / No / IDK)"]
    ),
    /* partnerIncomeAvailable:
      rowToTransform["Partner's Net Worldwide Income"] === 'N/A' ? false : true, // Convert to true if value exists*/
    partnerIncome:
      rowToTransform["Partner's Net Worldwide Income"] === 'N/A'
        ? undefined
        : rowToTransform["Partner's Net Worldwide Income"], // partner income
    partnerAge:
      rowToTransform["Partner's Age (Years and months)"] === 'N/A'
        ? undefined
        : rowToTransform["Partner's Age (Years and months)"],
    partnerLivingCountry: transformLivingContryValue(
      rowToTransform["Partner's Country of Residence (Canada, Not Canada)"]
    ), // country code
    partnerLegalStatus: transformLegalStatusValue(
      rowToTransform["Partner's Legal Status (Yes / No)"]
    ),
    partnerLivedOnlyInCanada: transformLiveOnlyCanadaValue(
      rowToTransform[
        'Partner: # of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ]
    ),
    partnerYearsInCanadaSince18: transformYearsInCanadaSinceOAS18Value(
      rowToTransform[
        'Partner: # of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ]
    ),
  }
  console.log('payload:', payload)
  return payload
}

function transformValue(value: string): boolean | undefined {
  if (value.toString().toUpperCase() === 'YES') {
    return true
  } else if (value.toString().toUpperCase() === 'NO') {
    return false
  }

  return undefined
}

function transformLivingContryValue(value: string): string | undefined {
  if (value.toString().toUpperCase() === 'CANADA') {
    return LivingCountry.CANADA
  } else if (value.toString().toUpperCase() === 'NOT CANADA') {
    return LivingCountry.AGREEMENT
  }

  return undefined
}

function transformYearsInCanadaSinceOAS18Value(
  value: string
): number | undefined {
  if (value.toString().toUpperCase() === 'FULL') {
    return 40
  } else if (value.toString().toUpperCase() === 'N/A') {
    return undefined
  }

  return Number(value)
}

function transformLegalStatusValue(value: string): string | undefined {
  if (value.toString().toUpperCase() === 'YES') {
    return LegalStatus.YES
  } else if (value.toString().toUpperCase() === 'NO') {
    return LegalStatus.NO
  }
  return undefined
}

function transformMaritalStatusValue(value: string): string | undefined {
  if (value.toString().toUpperCase() === 'WITH') {
    return MaritalStatus.PARTNERED
  } else if (value.toString().toUpperCase() === 'WITHOUT') {
    return MaritalStatus.SINGLE
  } else if (
    value.toString().toUpperCase() === 'WIDOWED' ||
    value.toString().toUpperCase() === 'WIDOW'
  ) {
    return MaritalStatus.WIDOWED
  }
  return undefined
}

function transformLiveOnlyCanadaValue(value: string): boolean | undefined {
  if (value.toString().toUpperCase() === 'FULL') {
    return true
  } else if (value.toString().toUpperCase() === 'N/A') {
    return undefined
  }
  return false
}

function claculOasAge(durationStr: string): number | undefined {
  let oasAge = 65
  if (durationStr && durationStr.toString().toUpperCase() !== 'N/A') {
    const duration: MonthsYears = JSON.parse(durationStr)
    if (duration.months === undefined && duration.years === undefined) {
      oasAge
    } else {
      const durationFloat = duration.years + duration.months / 12
      oasAge = 65 + durationFloat
    }
  }
  return oasAge
}
function roundedIncome(numberToRound: number): number {
  const roundedNumber = numberToRound.toFixed(2)
  return Number(roundedNumber)
}

function claculYearsInCanadaSince18(
  yearsInCanadaSince18: string,
  oasDeferDuration: string
): number | undefined {
  const yearsInCanada = Number(yearsInCanadaSince18)
  if (oasDeferDuration && oasDeferDuration.toString().toUpperCase() !== 'N/A') {
    const deferralDuration: MonthsYears = JSON.parse(oasDeferDuration)
    if (
      deferralDuration.months === undefined &&
      deferralDuration.years === undefined
    ) {
      return yearsInCanada
    } else {
      consoleDev('oasDeferDuration: ' + oasDeferDuration)

      const deferralYrs = deferralDuration.years
      const deferralMonths = deferralDuration.months

      return yearsInCanada - (deferralYrs + deferralMonths / 12)
    }
  }
  return yearsInCanada
}

function transformPartnerBenefitStatusValue(value: string): String {
  // TODO call the partnerbenefit helper

  if (value.toUpperCase() === 'YES') {
    return PartnerBenefitStatus.OAS_GIS
  } else if (value.toUpperCase() === 'IDK'.toUpperCase()) {
    return PartnerBenefitStatus.HELP_ME
  } else if (value.toUpperCase() === 'NO') {
    return PartnerBenefitStatus.NONE
  }
  return PartnerBenefitStatus.NONE
}

function extractValueBeforeSemicolon(value: string): string {
  if (value) {
    const parts = value.split(';')
    if (parts.length > 1 && parts[1].trim().length > 0) {
      return parts[0].trim()
    }
  }
  return value
}

function extractFirstCharacterAfterSemicolon(value: string): string {
  if (value) {
    const parts = value.split(';')
    if (parts.length > 1 && parts[1].trim().length > 0) {
      return parts[1].trim()[0]
    }
  }
  return value
}
