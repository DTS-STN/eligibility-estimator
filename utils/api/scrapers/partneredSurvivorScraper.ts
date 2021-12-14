import { BaseScraper } from './_base'

class PartneredSurvivorScraper extends BaseScraper {
  constructor() {
    super({
      tableUrl: (pageNo) =>
        `https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab5-${pageNo}.html`,
      outputFileName: 'partneredSurvivor',
      numIterations: 57,
    })
  }
}
export default PartneredSurvivorScraper
