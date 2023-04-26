import { FormField } from '../../client-state/FormField'
import { FieldInputsObject } from '../../client-state/InputHelper'
import { WebTranslations } from '../../i18n/web'
import { Steps } from '../../utils/api/definitions/enums'
import { FieldConfig } from '../../utils/api/definitions/fields'
import {
  NextClickedObject,
  VisibleFieldsObject,
} from '../../utils/api/definitions/types'
import MainHandler from '../../utils/api/mainHandler'

/**
 * Builds the object representing the default inputs object.
 */
export function getDefaultInputs(
  allFieldConfigs: FieldConfig[]
): FieldInputsObject {
  return allFieldConfigs.reduce((result, value) => {
    if ('default' in value && value.default) {
      result[value.key] =
        typeof value.default === 'string' ? value.default : value.default.key
    }
    return result
  }, {})
}

/**
 * Gets the placeholder for the select component - either a default value attached to the field or currently selected option.
 */
export function getPlaceholderForSelect(
  field: FormField,
  tsln: WebTranslations
): string {
  const text: string = tsln.selectText[field.key]
  return text ?? tsln.selectText.default
}

/**
 * Builds the object representing the default set of visible fields.
 */
export function getDefaultVisibleFields(
  allFieldConfigs: FieldConfig[]
): VisibleFieldsObject {
  const defaultData = new MainHandler({}).results
  if ('visibleFields' in defaultData) {
    return allFieldConfigs.reduce((result, value) => {
      result[value.key] = defaultData.visibleFields.includes(value.key)
      return result
    }, {})
  }
}

/**
 * Builds the object representing the default visibility of errors.
 */
export function getErrorVisibility(fieldConfigs): VisibleFieldsObject {
  return fieldConfigs.reduce((result, value) => {
    result[value.key] = false
    return result
  }, {})
}

/**
 * Builds an object that represents whether the card's "Next" button has been pressed. Initially all the cards are set to "false"
 */
export function getNextClickedObj(): NextClickedObject {
  const result = {}
  for (const step in Steps) {
    result[Steps[step]] = false
  }
  return result
}
