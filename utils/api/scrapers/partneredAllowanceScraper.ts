import { BaseScraper } from './_base'

class PartneredAllowanceScraper extends BaseScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab4-${pageNo}.html`,
      outputFileName: 'partneredAllowance',
      numIterations: 44,
    })
  }
}
export default PartneredAllowanceScraper
