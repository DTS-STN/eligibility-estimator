import { FieldKey } from '../api/definitions/fields'

export enum Steps {
  STEP_1 = 'step1',
  STEP_2 = 'step2',
  STEP_3 = 'step3',
  STEP_4 = 'step4',
  STEP_5 = 'step5',
}

// Types for QuestionsPage
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
