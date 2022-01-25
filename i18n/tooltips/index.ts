import { FieldKey } from '../../utils/api/definitions/fields'
import { Language } from '../api'
import en from './en'
import fr from './fr'

/**
 * A single Tooltip. If useTextFromKey is set, it will override text.
 */
export interface TooltipTranslation {
  heading: string
  text?: string
  useTextFromKey?: string
}

/**
 * All the Tooltips for all questions.
 */
export type TooltipTranslations = {
  [x in FieldKey]: TooltipTranslation
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
