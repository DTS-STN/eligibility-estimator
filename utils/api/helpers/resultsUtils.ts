import { Translations } from '../../../i18n/api'
import { BenefitResultObject } from '../definitions/types'

export class ResultsProcessor {
  constructor(
    private readonly results: BenefitResultObject,
    private readonly translations: Translations
  ) {}

  process(): void {
    Object.keys(this.results).forEach((key) => {
      let result = this.results[key]
      const eligibilityText = this.translations.result[result.eligibilityResult]
      result.detail = `${eligibilityText}\nDetails: ${result.detail}`
    })
  }

  static processResultsObject(
    results: BenefitResultObject,
    translations: Translations
  ): void {
    const resultsProcessor = new ResultsProcessor(results, translations)
    resultsProcessor.process()
  }
}
