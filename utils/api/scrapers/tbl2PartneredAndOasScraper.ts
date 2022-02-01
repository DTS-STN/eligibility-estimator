import { TableScraper } from './_baseTable'

class Tbl2PartneredAndOasScraper extends TableScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab2-${pageNo}.html`,
      outputFileName: 'tbl2_partneredAndOas',
      numIterations: 33,
    })
  }
}

export default Tbl2PartneredAndOasScraper
