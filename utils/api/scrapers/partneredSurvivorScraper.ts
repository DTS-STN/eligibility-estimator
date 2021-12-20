import { BaseScraper, OutputItemGeneric } from './_base'

class PartneredSurvivorScraper extends BaseScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab5-${pageNo}.html`,
      outputFileName: 'partneredSurvivor',
      numIterations: 57,
    })
  }

  dataExtractor(row): OutputItemAfs {
    const orig = super.dataExtractor(row)
    const afs = this.getCellValue(row)
    return { range: orig.range, afs }
  }
}

export interface OutputItemAfs extends OutputItemGeneric {
  afs: number
}

export default PartneredSurvivorScraper
