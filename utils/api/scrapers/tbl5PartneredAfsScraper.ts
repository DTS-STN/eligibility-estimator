import { OutputItemGeneric, TableScraper } from './_baseTable'

class Tbl5PartneredAfsScraper extends TableScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab5-${pageNo}.html`,
      outputFileName: 'tbl5_partneredAfs',
      numIterations: 58,
    })
  }

  dataExtractor(row: Element): OutputItemAfs {
    const orig = super.dataExtractor(row)
    const afs = this.getCellValue(row, 1)
    return { range: orig.range, afs }
  }
}

export interface OutputItemAfs extends OutputItemGeneric {
  afs: number
}

export default Tbl5PartneredAfsScraper
