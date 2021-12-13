import fs from 'fs'
import https from 'https'
import { JSDOM } from 'jsdom'

export class BaseScraper {
  private readonly tableUrl: (pageNo: number) => string
  private readonly outputFileName: string
  private readonly numIterations: number

  constructor(props) {
    this.tableUrl = props.tableUrl
    this.outputFileName = props.outputFileName
    this.numIterations = props.numIterations
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

  getIncomeRange(incomeRangeStr: string): Range {
    const range = incomeRangeStr.split(' - ')
    const regExp = /\$\s?|(,*)/g // strip money formatting characters
    const low = range[0].replace(regExp, '')
    const high = range[1].replace(regExp, '')

    return { low: parseFloat(low), high: parseFloat(high) }
  }

  // getIncomeInterval(incomeRangeStr: string) {
  //   let { high, low } = this.getIncomeRange(incomeRangeStr)
  //   return high + 0.01 - low
  // }

  getGis(row) {
    let gisStr = row.children[1].textContent
    gisStr = gisStr.replace(/\$\s?|(,*)/g, '')
    return parseFloat(gisStr)
  }

  dataExtractor(row): OutputItem {
    let incomeRangeStr = row.children[0].textContent
    return {
      range: this.getIncomeRange(incomeRangeStr),
      // interval: this.getIncomeInterval(incomeRangeStr),
      gis: this.getGis(row),
    }
  }

  /* Returns an array of things. One thing per row
   * Composable function
   *
   * data = HTML string of the page
   * extractor = function that takes in a "row" and spits out a thing
   *
   * returns [thing, thing, thing]
   */
  tableParser(data: string): OutputItem[] {
    const { document } = new JSDOM(data).window
    let rows = document.querySelector('.table tbody').children
    let intervals = []
    for (let i = 0; i < rows.length; i++) {
      intervals.push(this.dataExtractor(rows[i]))
    }
    return intervals
  }

  async main() {
    let tableData = []

    for (let i = 1; i <= this.numIterations; i++) {
      console.log(`${this.outputFileName}: ${i}/${this.numIterations}`)
      let pageUrl = this.tableUrl(i)
      let page = await this.fetchPage(pageUrl)
      let data = this.tableParser(page)
      tableData.push(data)
    }

    tableData = tableData.flat()
    let jsonStr = JSON.stringify(tableData, null, 2)
    let filename = `./utils/api/scrapers/output/${this.outputFileName}.json`
    fs.writeFileSync(filename, jsonStr, { flag: 'w' })
    console.log(`Finished building file: ${this.outputFileName}.json`)
  }
}

interface Range {
  low: number
  high: number
}

interface OutputItem {
  range: Range
  gis: number
  // interval: number
}
