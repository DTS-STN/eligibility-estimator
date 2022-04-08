import { BaseScraper } from './_base'

export class LegalValuesScraperJson extends BaseScraper {
  private JSON_URL: string =
    'https://www.canada.ca/content/dam/esdc-edsc/documents/services/benefits/pensions/cpp/oas/oas-amounts-en.json'
  constructor() {
    super('legalValuesJson')
  }

  private static sanitizeObject(input: object): object {
    console.log(`Got object `, input)
    for (const jsonObjectKey in input) {
      const data = input[jsonObjectKey]
      const type = typeof data
      console.log(jsonObjectKey, type)
      if (type === 'object') {
        LegalValuesScraperJson.sanitizeObject(data)
      } else {
        const sanitizedData = LegalValuesScraperJson.parseItem(data)
        if (!isNaN(sanitizedData)) input[jsonObjectKey] = sanitizedData
      }
    }
    return input
  }

  private static parseItem(data: string): number {
    return this.sanitizeFnStandard(data)
  }

  async main() {
    console.log(`${this.logHeader} Starting...`)
    const jsonString = await this.fetchPage(this.JSON_URL)
      .then((pageData) => {
        console.log(`${this.logHeader} Received ${pageData}`)
        return pageData
      })
      .catch((e) => {
        const err = `Failed scraping: ${e}`
        console.log(err)
        throw new Error(err)
      })
    const jsonObject = JSON.parse(jsonString)
    const jsonSanitized = LegalValuesScraperJson.sanitizeObject(jsonObject)

    this.saveAndComplete(jsonSanitized)
    console.log(`${this.logHeader} Final results: `, jsonSanitized)
  }
}

export default LegalValuesScraperJson
