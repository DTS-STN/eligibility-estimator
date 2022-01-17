import { BaseScraper } from './_base'

class PartneredNoOasScraper extends BaseScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab3-${pageNo}.html`,
      outputFileName: 'partneredNoOas',
      numIterations: 54,
    })
  }
}
export default PartneredNoOasScraper
