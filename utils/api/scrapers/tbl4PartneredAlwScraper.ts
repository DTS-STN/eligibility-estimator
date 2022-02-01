import { OutputItemGeneric, OutputItemGis, TableScraper } from './_baseTable'

class Tbl4PartneredAlwScraper extends TableScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab4-${pageNo}.html`,
      outputFileName: 'tbl4_partneredAlw',
      numIterations: 45,
    })
  }

  getAlw(row) {
    const alwStr = row.children[3].textContent
    const alwStrStripped = alwStr.replace(/\$\s?|(,*)/g, '')
    return parseFloat(alwStrStripped)
  }

  dataExtractor(row): OutputItemAlw {
    const orig = super.dataExtractor(row) as OutputItemGis
    const alw = this.getAlw(row)
    return { ...orig, alw }
  }
}

export interface OutputItemAlw extends OutputItemGeneric {
  gis: number
  alw: number
}

export default Tbl4PartneredAlwScraper
