import { BaseScraper, OutputItemGeneric, OutputItemGis } from './_base'

class PartneredAllowanceScraper extends BaseScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab4-${pageNo}.html`,
      outputFileName: 'partneredAllowance',
      numIterations: 45,
    })
  }

  getAllowance(row) {
    const allowanceStr = row.children[3].textContent
    const allowanceStrStripped = allowanceStr.replace(/\$\s?|(,*)/g, '')
    return parseFloat(allowanceStrStripped)
  }

  dataExtractor(row): OutputItemAllowance {
    const orig = super.dataExtractor(row) as OutputItemGis
    const allowance = this.getAllowance(row)
    return { ...orig, allowance }
  }
}

export interface OutputItemAllowance extends OutputItemGeneric {
  gis: number
  allowance: number
}

export default PartneredAllowanceScraper
