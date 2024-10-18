import * as XLSX from 'xlsx'
import {
  LegalStatus,
  LivingCountry,
  MaritalStatus,
  PartnerBenefitStatus,
} from '../../utils/api/definitions/enums'
import { calculateFutureYearMonth } from '../../utils/api/helpers/utils'

export function getTransformedPayloadByName(
  filePath: string,
  testName: string
): any | undefined {
  const data = readExcelData(filePath)
  const rowToTransform = data.find((row) => row['Scenario'] === testName) // Assuming "testName" column is represented by "Column1"

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
    income: Number(
      String(rowToTransform["User's Net Worldwide Income"]).replace(
        /[^0-9.-]+/g,
        ''
      )
    ),
    incomeWork: Number(
      String(rowToTransform['Exemption input']).replace(/[^0-9.-]+/g, '')
    ),
    age: rowToTransform['Age'],
    clientBirthDate: rowToTransform['Birth Year and Month'],
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
      rowToTransform['Marital Status (With or Without Partner, Widowed)']
    ),
    invSeparated: transformValue(rowToTransform['Inv Sep (Yes / No)']),
    livingCountry: transformLivingCountryValue(
      rowToTransform['Country of Residence (Canada, Not Canada)']
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
              rowToTransform['Age'],
              rowToTransform[
                '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
              ],
              rowToTransform['Birth Year and Month']
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
              rowToTransform['Age'],
              rowToTransform[
                '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
              ],
              rowToTransform['Birth Year and Month']
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
        : Number(
            String(rowToTransform["Partner's Net Worldwide Income"]).replace(
              /[^0-9.-]+/g,
              ''
            )
          ), // partner income
    partnerIncomeWork: Number(
      String(rowToTransform['Partner exemption input']).replace(
        /[^0-9.-]+/g,
        ''
      )
    ),
    partnerAge:
      rowToTransform['Partner Age'] === 'N/A'
        ? undefined
        : rowToTransform['Partner Age'],
    partnerBirthDate: rowToTransform['Partner Birth Year and Month']
      .toString()
      .includes(';')
      ? rowToTransform['Partner Birth Year and Month']
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
      rowToTransform['Partner Age'],
      rowToTransform[
        'Partner: # of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ],
      rowToTransform['Partner Birth Year and Month']
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
  age: number,
  value: number,
  birthDate: string,
  partner?: boolean
): string | undefined {
  if (value.toString().toUpperCase() === 'FULL') {
    return undefined
  } else if (value.toString().toUpperCase() === 'N/A') {
    return undefined
  } else if (value.toString().toLowerCase().includes('s')) {
    return String(value).split('s')[1]
  }
  return String(value)
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
  } else if (value.toUpperCase() === 'N/A') {
    return PartnerBenefitStatus.HELP_ME
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
