import { BaseScraper } from './_base'

class SingleScraper extends BaseScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab1-${pageNo}.html`,
      outputFileName: 'single',
      numIterations: 53,
    })
  }
}
export default SingleScraper
