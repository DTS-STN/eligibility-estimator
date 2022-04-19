import { BaseScraper } from './_base'

export class LegalValuesScraperJson extends BaseScraper {
  private JSON_URL: string =
    'https://www.canada.ca/content/dam/esdc-edsc/documents/services/benefits/pensions/cpp/oas/oas-amounts-en.json'
  constructor() {
    super('legalValuesJson')
  }

  /**
   * Accepts a JSON object, iterates through all its properties, and sanitizes it to a sane state.
   * Specifically, converts strings with commas into typical numbers.
   */
  private static sanitizeObject(jsonObject: object): object {
    const newObject = {}
    for (const key in jsonObject) {
      const data: object | string = jsonObject[key]
      newObject[this.sanitizeKey(key)] =
        typeof data === 'object'
          ? this.sanitizeObject(data)
          : this.sanitizeFnStandard(data) ?? data
    }
    return newObject
  }

  /**
   * Fixes typos in the source file, and moves to consistent variable naming using camelCase instead of underscore_syntax.
   */
  private static sanitizeKey(key: string) {
    return key
      .replace(/lastupdated/g, 'lastUpdated')
      .replace(/topup/g, 'topUp')
      .replace(/-\w/g, (x) => x[1].toUpperCase())
  }

  async main() {
    console.log(`${this.logHeader} Starting...`)
    const jsonString = await this.fetchPage(this.JSON_URL)
    const jsonObject = JSON.parse(jsonString)
    const jsonSanitized = LegalValuesScraperJson.sanitizeObject(jsonObject)
    this.saveAndComplete(jsonSanitized)
    console.log(`${this.logHeader} Final results: `, jsonSanitized)
  }
}

export default LegalValuesScraperJson
