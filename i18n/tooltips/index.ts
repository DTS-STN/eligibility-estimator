import { Language } from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import en from './en'
import fr from './fr'

/**
 * A single Tooltip. If useDataFromKey is set, it will override text and heading.
 */
export interface TooltipTranslation {
  heading?: string
  text?: string
  useDataFromKey?: string
}

/**
 * All the Tooltips for all questions.
 */
export type TooltipTranslations = {
  [x in FieldKey]?: TooltipTranslation
}

/**
 * Given a language, returns all Tooltip data.
 */
export function getTooltipTranslations(
  language: Language
): TooltipTranslations {
  switch (language) {
    case Language.EN:
      return en
    case Language.FR:
      return fr
  }
}
