import fs from 'fs'
import https from 'https'
import { JSDOM } from 'jsdom'

export class BaseScraper {
  private readonly tableUrl: (pageNo: number) => string
  private readonly outputFileName: string
  private readonly numIterations: number
  private readonly logHeader

  constructor(props) {
    this.tableUrl = props.tableUrl
    this.outputFileName = props.outputFileName
    this.numIterations = props.numIterations
    this.logHeader = `${this.outputFileName}:`.padEnd(20)
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
    const gisStr = row.children[1].textContent
    const gisStrStripped = gisStr.replace(/\$\s?|(,*)/g, '')
    return parseFloat(gisStrStripped)
  }

  dataExtractor(row): OutputItem {
    const incomeRangeStr = row.children[0].textContent
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
  parseTable(data: string): OutputItem[] {
    const { document } = new JSDOM(data).window
    const rows = document.querySelector('.table tbody').children
    const intervals = []
    for (let i = 0; i < rows.length; i++) {
      intervals.push(this.dataExtractor(rows[i]))
    }
    return intervals
  }

  async main() {
    let remaining = this.numIterations
    console.log(`${this.logHeader} Loading ${remaining} pages...`)
    const promises = []
    for (let i = 1; i <= this.numIterations; i++) {
      const pageUrl = this.tableUrl(i)
      promises.push(
        this.fetchPage(pageUrl).then((pageData) => {
          remaining = remaining - 1
          console.log(`${this.logHeader} ${remaining} pages remaining`)
          return {
            index: i,
            tableData: this.parseTable(pageData),
          }
        })
      )
    }
    const parsedTables = await Promise.all(promises)
    parsedTables.sort((a, b) => a.index - b.index)
    const tableData = []
    parsedTables.forEach((result) => tableData.push(...result.tableData))

    const jsonStr = JSON.stringify(tableData, null, 2)
    const filename = `./utils/api/scrapers/output/${this.outputFileName}.json`
    fs.writeFileSync(filename, jsonStr, { flag: 'w' })

    console.log(`${this.logHeader} Complete!`)
  }
}

interface Range {
  low: number
  high: number
}

export interface OutputItem {
  range: Range
  gis: number
  // interval: number
}
