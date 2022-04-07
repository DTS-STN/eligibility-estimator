import { JSDOM } from 'jsdom'
import { BaseScraper } from './_base'

/**
 * All the keys we plan on scraping and parsing.
 */
export enum ScraperKeys {
  MAX_OAS_ENTITLEMENT = 'MAX_OAS_ENTITLEMENT',
  OAS_RECOVERY_TAX_CUTOFF = 'OAS_RECOVERY_TAX_CUTOFF',
  MAX_OAS_INCOME = 'MAX_OAS_INCOME',
  MAX_GIS_INCOME_SINGLE = 'MAX_GIS_INCOME_SINGLE',
  MAX_GIS_INCOME_PARTNER_OAS = 'MAX_GIS_INCOME_PARTNER_OAS',
  MAX_GIS_INCOME_PARTNER_ALW = 'MAX_GIS_INCOME_PARTNER_ALW',
  MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW = 'MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW',
  MAX_ALW_INCOME = 'MAX_ALW_INCOME',
  MAX_AFS_INCOME = 'MAX_AFS_INCOME',
}

/**
 * Each ScraperConfig represents one piece of data to be pulled.
 */
interface ScraperConfig {
  pageUrl: string

  /**
   * Get this using the following steps:
   * 1. Find the element with the text you want using Inspect Element.
   * 2. Once you've identified the text you want, right click it, and under Copy select Selector.
   */
  selector: string

  /**
   * Sanitizes the parsed data into a number. If not provided, a default sanitizer will be used.
   */
  sanitizeFn?: (string: string) => number
}

/**
 * The final output. This is the structure of the generated JSON file.
 */
export type OutputItemLegalValues = {
  [x in ScraperKeys]: number
}

export class LegalValuesScraper extends BaseScraper {
  private readonly scraperConfigs: { [x in ScraperKeys]: ScraperConfig }

  constructor() {
    super('legalValues')

    // warning: the selectors here are very delicate, if things move around on the page, there will be issues.
    this.scraperConfigs = {
      /**
       * The OAS entitlement maximum monthly amount. Updates periodically.
       * Note that in July 2022, there is a change expected where ages over 75 will receive 10% more. That is not implemented here yet.
       */
      [ScraperKeys.MAX_OAS_ENTITLEMENT]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html',
        selector: '[headers=tbl1-6]',
      },
      /**
       * OAS Recovery Tax. Updates periodically. Not used yet.
       */
      [ScraperKeys.OAS_RECOVERY_TAX_CUTOFF]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/recovery-tax.html',
        selector:
          'body > main > div:nth-child(2) > div > table > tbody > tr:nth-child(1) > td:nth-child(3)',
      },
      /**
       * Income maximums. Updates periodically.
       */
      [ScraperKeys.MAX_OAS_INCOME]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
        selector:
          'body > main > div:nth-child(2) > section:nth-child(11) > table.table.table-bordered.text-right > tbody > tr:nth-child(2) > td:nth-child(2)',
      },
      [ScraperKeys.MAX_GIS_INCOME_SINGLE]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
        selector:
          'body > main > div:nth-child(2) > section:nth-child(11) > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(3)',
      },
      [ScraperKeys.MAX_GIS_INCOME_PARTNER_OAS]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
        selector:
          'body > main > div:nth-child(2) > section:nth-child(11) > table:nth-child(5) > tbody  tr:nth-child(2) > td:nth-child(3)',
      },
      [ScraperKeys.MAX_GIS_INCOME_PARTNER_ALW]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
        selector:
          'body > main > div:nth-child(2) > section:nth-child(11) > table:nth-child(5) > tbody > tr:nth-child(4) > td:nth-child(3)',
      },
      [ScraperKeys.MAX_GIS_INCOME_PARTNER_NO_OAS_NO_ALW]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
        selector:
          'body > main > div:nth-child(2) > section:nth-child(11) > table:nth-child(5) > tbody > tr:nth-child(3) > td:nth-child(3)',
      },
      [ScraperKeys.MAX_ALW_INCOME]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
        selector:
          'body > main > div:nth-child(2) > section:nth-child(11) > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(3)',
      },
      [ScraperKeys.MAX_AFS_INCOME]: {
        pageUrl:
          'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html',
        selector:
          'body > main > div:nth-child(2) > section:nth-child(11) > table:nth-child(7) > tbody > tr:nth-child(2) > td:nth-child(3)',
      },
    }
  }

  /**
   * Takes a parsed document (part of the page HTML), uses the provided CSS selector,
   * then sanitizes that value into a number using the provided sanitizeFn.
   * If one is not provided, a default one will be used.
   */
  private static parseItem(data: string, config: ScraperConfig): number {
    const document: Document = new JSDOM(data).window.document
    const selectedData = document.querySelector(config.selector)
    if (!selectedData) throw new Error(`Selector was unable to parse any data`)
    const sanitizeFn: (string: string) => number =
      config.sanitizeFn ?? LegalValuesScraper.sanitizeFnStandard
    return sanitizeFn(selectedData.textContent)
  }

  async main() {
    console.log(`${this.logHeader} Starting...`)
    const promises = []
    for (const key in this.scraperConfigs) {
      const config = this.scraperConfigs[key]
      console.log(`${this.logHeader} Fetching ${key}...`)
      promises.push(
        this.fetchPage(config.pageUrl)
          .then((pageData) => {
            const value = LegalValuesScraper.parseItem(pageData, config)
            console.log(`${this.logHeader} Received ${value} for ${key}`)
            return { key, value }
          })
          .catch((e) => {
            const err = `Failed scraping ${key}: ${e}`
            console.log(err)
            throw new Error(err)
          })
      )
    }
    const successResults = {}
    const failedResults = []
    const promiseResults = await Promise.allSettled(promises)
    promiseResults.forEach((x) => {
      if (x.status === 'fulfilled') successResults[x.value.key] = x.value.value
      else if (x.status === 'rejected') failedResults.push(x.reason.message)
    })
    if (failedResults.length > 0) {
      console.log(
        `${this.logHeader} Failed to parse all items, scraping aborted:`,
        failedResults
      )
    } else {
      this.saveAndComplete(successResults)
      console.log(`${this.logHeader} Final results: `, successResults)
    }
  }
}

export default LegalValuesScraper
