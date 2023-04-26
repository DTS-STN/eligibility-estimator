import { Steps } from '../api/definitions/enums'
import { FieldKey } from '../api/definitions/fields'

// Types for EligibilityPage
export type NextClickedObject = {
  [x in Steps]?: boolean
}

export type CardChildren = JSX.Element[]

export type StepValidity = { [x in Steps]?: { isValid: boolean } }

export type CardConfig = {
  title: string
  buttonLabel: string
  keys: FieldKey[]
  buttonAttributes: Object
}

export type Card = {
  children: CardChildren
  id: string
  title: string
  buttonLabel: string
  buttonAttributes: Object
  buttonOnChange?: (e) => void
}

export type VisibleFieldsObject = {
  [key in FieldKey]?: boolean
}
