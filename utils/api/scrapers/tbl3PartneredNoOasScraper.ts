import { TableScraper } from './_baseTable'

class Tbl3PartneredNoOasScraper extends TableScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab3-${pageNo}.html`,
      outputFileName: 'tbl3_partneredNoOas',
      numIterations: 54,
    })
  }
}

export default Tbl3PartneredNoOasScraper
