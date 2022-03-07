import { JSDOM } from 'jsdom'
import roundToTwo from '../helpers/roundToTwo'
import { BaseScraper } from './_base'
import { OutputItemAlw } from './tbl4PartneredAlwScraper'
import { OutputItemAfs } from './tbl5PartneredAfsScraper'

export class TableScraper extends BaseScraper {
  private readonly tableUrl: (pageNo: number) => string
  private readonly numIterations: number

  constructor(props) {
    super(props.outputFileName)
    this.tableUrl = props.tableUrl
    this.numIterations = props.numIterations
  }

  getIncomeRange(incomeRangeStr: string): Range {
    const range = incomeRangeStr.split(' - ')
    const low = TableScraper.sanitizeFnStandard(range[0])
    const high = TableScraper.sanitizeFnStandard(range[1])
    const interval = roundToTwo(high - low + 0.01)
    return { low, high, interval }
  }

  getCellValue(row: Element, colNum: number): number {
    const cell = row.children[colNum]
    if (!cell) return undefined
    const gisStr = cell.textContent
    return TableScraper.sanitizeFnStandard(gisStr)
  }

  dataExtractor(row: Element): OutputItem {
    const incomeRangeStr = row.children[0].textContent
    return {
      range: this.getIncomeRange(incomeRangeStr),
      gis: this.getCellValue(row, 1),
      combinedOasGis: this.getCellValue(row, 2),
    }
  }

  /* Takes a parsed document (part of the page HTML), uses the provided dataExtractor
   * to transform that row into a string, and returns an array containing all parsed rows.
   */
  parseTable(data: string): OutputItem[] {
    const document: Document = new JSDOM(data).window.document
    const rows = document.querySelector('.table tbody').children
    const intervals = []
    for (let i = 0; i < rows.length; i++) {
      intervals.push(this.dataExtractor(rows[i]))
    }
    return intervals
  }

  async main() {
    console.log(`${this.logHeader} Starting...`)
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

    this.saveAndComplete(tableData)
  }
}

interface Range {
  low: number
  high: number
  interval: number
}

export type OutputItem = OutputItemGis | OutputItemAlw | OutputItemAfs

export interface OutputItemGeneric {
  range: Range
}

export interface OutputItemGis extends OutputItemGeneric {
  gis: number
  combinedOasGis: number
}
