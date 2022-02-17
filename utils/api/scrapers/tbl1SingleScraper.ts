import { TableScraper } from './_baseTable'

class Tbl1SingleScraper extends TableScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab1-${pageNo}.html`,
      outputFileName: 'tbl1_single',
      numIterations: 54,
    })
  }
}

export default Tbl1SingleScraper
