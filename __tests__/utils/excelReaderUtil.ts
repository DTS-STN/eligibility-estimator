import { faBullseye } from '@fortawesome/free-solid-svg-icons'
import { any, boolean } from 'joi'
import * as XLSX from 'xlsx'
import { getLogger } from '../../logging/log-util'
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
    incomeAvailable:
      rowToTransform["User's Net Worldwide Income"] === 'N/A' ||
      rowToTransform["User's Net Worldwide Income"] === ''
        ? false
        : true, // Replace 'N/A' or empty with false
    income: rowToTransform["User's Net Worldwide Income"],
    age: rowToTransform['Age '],
    oasDefer:
      rowToTransform['Delay (# of Years)'] === 'N/A' ||
      rowToTransform['Delay (# of Years)'] === ''
        ? false
        : true, // Replace 'N/A' or empty with false
    oasAge: 65,
    receiveOAS: transformValue(rowToTransform["Rec'ing OAS (Yes / No)"]),
    oasDeferDuration:
      rowToTransform['Delay (# of Years)'] === 'N/A' ||
      rowToTransform['Delay (# of Years)'] === ''
        ? undefined
        : '{"years":' +
          extractValueBeforeSemicolon(rowToTransform['Delay (# of Years)']) +
          ',"months":' +
          extractFirstCharacterAfterSemicolon(
            rowToTransform['Delay (# of Years)']
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
    yearsInCanadaSince18:
      rowToTransform[
        '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ] === 'N/A' ||
      rowToTransform[
        '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ] === 'Full'
        ? undefined
        : rowToTransform[
            '# of years resided in Canada after age 18 (Full, 40, 10, etc.)'
          ],
    everLivedSocialCountry: false, // check with vero
    partnerBenefitStatus:
      rowToTransform["Partner Rec'ing OAS (Yes / No / IDK)"] === 'N/A' ||
      rowToTransform["Partner Rec'ing OAS (Yes / No / IDK)"] === ''
        ? undefined
        : transformPartnerBenefitStatusValue(
            rowToTransform["Partner Rec'ing OAS (Yes / No / IDK)"]
          ),
    partnerIncomeAvailable:
      rowToTransform["Partner's Net Worldwide Income"] === 'N/A' ||
      rowToTransform["Partner's Net Worldwide Income"] === ''
        ? false
        : true, // Convert to true if value exists
    partnerIncome:
      rowToTransform["Partner's Net Worldwide Income"] === 'N/A' ||
      rowToTransform["Partner's Net Worldwide Income"] === ''
        ? undefined
        : rowToTransform["Partner's Net Worldwide Income"], // partner income
    partnerAge:
      rowToTransform["Partner's Age"] === 'N/A' ||
      rowToTransform["Partner's Age"] === ''
        ? undefined
        : rowToTransform["Partner's Age"],
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
    partnerYearsInCanadaSince18:
      rowToTransform[
        'Partner: # of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ] === 'N/A' ||
      rowToTransform[
        'Partner: # of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ] === '' ||
      rowToTransform[
        'Partner: # of years resided in Canada after age 18 (Full, 40, 10, etc.)'
      ] === 'Full'
        ? undefined
        : rowToTransform[
            'Partner: # of years resided in Canada after age 18 (Full, 40, 10, etc.)'
          ],
  }
  console.log('payload:', payload)
  return payload
}

function transformValue(value: string): boolean | undefined {
  if (value === 'Yes') {
    return true
  } else if (value === 'No') {
    return false
  }

  return undefined
}

function transformLivingContryValue(value: string): string | undefined {
  if (value === 'Canada') {
    return LivingCountry.CANADA
  } else if (value === 'Not Canada') {
    return LivingCountry.AGREEMENT
  }

  return undefined
}

function transformLegalStatusValue(value: string): string | undefined {
  if (value === 'Yes') {
    return LegalStatus.YES
  } else if (value === 'No') {
    return LegalStatus.NO
  }
  return undefined
}

function transformMaritalStatusValue(value: string): string | undefined {
  if (value === 'With') {
    return MaritalStatus.PARTNERED
  } else if (value === 'Without') {
    return MaritalStatus.SINGLE
  } else if (value === 'Widowed' || value === 'Widow') {
    return MaritalStatus.WIDOWED
  }
  return undefined
}

function transformLiveOnlyCanadaValue(value: string): boolean | undefined {
  if (value === 'Full') {
    return true
  } else if (value === 'N/A') {
    return undefined
  }
  return false
}

function transformPartnerBenefitStatusValue(value: string): String | undefined {
  if (value === 'Yes') {
    return PartnerBenefitStatus.OAS
  } else if (value === 'N/A') {
    return undefined
  }
  return PartnerBenefitStatus.HELP_ME
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
