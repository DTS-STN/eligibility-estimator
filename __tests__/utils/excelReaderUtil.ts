import { calculateAge } from '../../utils/api/helpers/utils'
import * as XLSX from 'xlsx'
import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
} from '../../utils/api/definitions/enums'

export function getTransformedPayloadByName(
  filePath: string,
  testName: string
): any | undefined {
  const data = readExcelData(filePath)
  const rowToTransform = data.find((row) => row['Scenario'] === testName) // Assuming "testName" column is represented by "Column1"

  //console.log('Extracted rowToTransform:', rowToTransform)

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
  let payload: Record<string, any> = {
    income: roundedIncome(rowToTransform["User's Net Worldwide Income"]),
    age: rowToTransform['Age '],
    clientBirthDate: rowToTransform['Birth Year and Month']
      .toString()
      .includes(';')
      ? calculateAge(
          extractValue(rowToTransform['Birth Year and Month'], 1),
          extractValue(rowToTransform['Birth Year and Month'], 0)
        )
      : undefined,
    receiveOAS: transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]),
    oasDeferDuration:
      rowToTransform['Delay (# of Years and Months)'] === 'N/A'
        ? undefined
        : '{"years":' +
          extractValue(rowToTransform['Delay (# of Years and Months)'], 0) +
          ',"months":' +
          extractValue(rowToTransform['Delay (# of Years and Months)'], 1) +
          '}',
    //oasDefer: false, // no longer used.
    //oasAge: 0,
    maritalStatus: transformMaritalStatusValue(
      rowToTransform['Marital Status\n(With or Without Partner, Widowed)']
    ),
    invSeparated: transformValue(rowToTransform['Inv Sep (Yes / No)']),
    livingCountry: transformLivingCountryValue(
      rowToTransform['Country of Residence\n(Canada, Not Canada)']
    ), // country code
    legalStatus: transformLegalStatusValue(
      rowToTransform['Legal Status (Yes / No)']
    ),
    livedOnlyInCanada: transformLiveOnlyCanadaValue(
      rowToTransform[
        '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ]
    ),
    yearsInCanadaSince18:
      transformLiveOnlyCanadaValue(
        rowToTransform[
          '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
        ]
      ) !== 'true'
        ? transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]) ===
            'false' ||
          transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]) === undefined
          ? transformYearsInCanadaSinceOAS18Value(
              rowToTransform[
                '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
              ]
            )
          : undefined
        : undefined,
    yearsInCanadaSinceOAS:
      transformLiveOnlyCanadaValue(
        rowToTransform[
          '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
        ]
      ) !== 'true'
        ? transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]) === 'true'
          ? transformYearsInCanadaSinceOAS18Value(
              rowToTransform[
                '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
              ]
            )
          : undefined
        : undefined,
    //everLivedSocialCountry: false, // check with vero
    everLivedSocialCountry: undefined,
    partnerBenefitStatus: transformPartnerBenefitStatusValue(
      rowToTransform["Partner Rec'ing OAS (Yes / No / IDK)"]
    ),
    partnerIncome:
      rowToTransform["Partner's Net Worldwide Income"] === 'N/A'
        ? undefined
        : rowToTransform["Partner's Net Worldwide Income"], // partner income
    partnerAge:
      rowToTransform["Partner's Age (Years and months)"] === 'N/A'
        ? undefined
        : rowToTransform["Partner's Age (Years and months)"],
    partnerBirthDate: rowToTransform['Partner Birth Year and Month']
      .toString()
      .includes(';')
      ? calculateAge(
          extractValue(rowToTransform['Partner Birth Year and Month'], 1),
          extractValue(rowToTransform['Partner Birth Year and Month'], 0)
        )
      : undefined,
    partnerLivingCountry: transformLivingCountryValue(
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
  payload = Object.fromEntries(
    Object.entries(payload).filter(
      ([key, value]) => value !== undefined && value !== ''
    )
  )

  return payload
}

function transformValue(value: string): string | undefined {
  if (value.toString().toUpperCase() === 'YES') {
    return 'true'
  } else if (value.toString().toUpperCase() === 'NO') {
    return 'false'
  }

  return undefined
}

function transformLivingCountryValue(value: string): string | undefined {
  if (value.toString().toUpperCase() === 'CANADA') {
    return LivingCountry.CANADA
  } else if (value.toString().toUpperCase() === 'NOT CANADA') {
    return LivingCountry.AGREEMENT
  }

  return undefined
}

function transformYearsInCanadaSinceOAS18Value(
  value: number,
  partner?: boolean
): string | undefined {
  if (value.toString().toUpperCase() === 'FULL') {
    return undefined
  } else if (value.toString().toUpperCase() === 'N/A') {
    return undefined
  } else if (value.toString().toLowerCase().includes('s')) {
    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()
    value =
      value +
      Math.floor(
        (currentYear - 1900) * 12 +
          currentMonth -
          ((2023 - 1900) * 12 + 10) / 12
      )
    return String(value)
  }
  return String(value) // Number(value)
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

function transformLiveOnlyCanadaValue(value: string): string | undefined {
  if (value.toString().toUpperCase() === 'FULL') {
    return 'true'
  } else if (value.toString().toUpperCase() === 'N/A') {
    return undefined
  }
  return 'false'
}

function roundedIncome(numberToRound: number): string {
  const roundedNumber = numberToRound //.toFixed(2)
  return String(roundedNumber)
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
  return undefined
}

function extractValue(value: string, pos: number): number {
  if (value) {
    const parts = value.split(';')
    if (parts.length > 1 && parts[1].trim().length > 0) {
      if (pos > 0) {
        return +parts[pos].trim()[0]
      }
      return +parts[pos].trim()
    }
    return +value
  }
}
