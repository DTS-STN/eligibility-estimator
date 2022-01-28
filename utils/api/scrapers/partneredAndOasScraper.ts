import { BaseScraper } from './_base'

class PartneredAndOasScraper extends BaseScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab2-${pageNo}.html`,
      outputFileName: 'partneredAndOas',
      numIterations: 33,
    })
  }
}
export default PartneredAndOasScraper
