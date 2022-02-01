import fs from 'fs'
import https from 'https'

export abstract class BaseScraper {
  protected readonly logHeader: string

  protected constructor(protected readonly outputFileName: string) {
    this.logHeader = `${this.outputFileName}:`.padEnd(22)
  }

  fetchPage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      https
        .get(url, (resp) => {
          let data = ''
          // A chunk of data has been received.
          resp.on('data', (chunk) => {
            data += chunk
          })
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
            resolve(data)
          })
        })
        .on('error', (err) => {
          reject('Error: ' + err.message)
        })
    })
  }

  /**
   * A sanitizer function able to be used for many elements, specifically text like "Less than $10,000".
   * Takes a string and returns a number.
   */
  static sanitizeFnStandard(input: string): number {
    const sanitized = input
      .replace(/Less than/g, '')
      .replace(/\$/g, '')
      .replace(/,/g, '')
      .replace(/ /g, '')
    return parseFloat(sanitized)
  }

  async main() {
    return undefined
  }

  saveAndComplete(data: any) {
    const jsonStr = JSON.stringify(data, null, 2)
    const filename = `./utils/api/scrapers/output/${this.outputFileName}.json`
    fs.writeFileSync(filename, `${jsonStr}\n`, { flag: 'w' })

    console.log(`${this.logHeader} Complete!`)
  }
}
