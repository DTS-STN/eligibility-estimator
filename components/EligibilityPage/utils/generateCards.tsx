import { Steps } from '../../../utils/api/definitions/enums'
import { Card, CardConfig } from '../../../utils/api/definitions/types'
import generateCardChildren from './generateCardChildren'
import { getKeyStepMap } from './'

export function generateCards(
  form,
  handleButtonOnChange,
  handleOnChange,
  submitForm,
  errorsVisible,
  keyStepMap,
  tsln
): Card[] {
  return Object.keys(keyStepMap).map((step: Steps, index) => {
    const cardConfig: CardConfig = keyStepMap[step]
    const children = generateCardChildren(
      form,
      step,
      cardConfig.keys,
      handleOnChange,
      errorsVisible,
      tsln
    )
    const card: Card = {
      id: step,
      title: cardConfig.title,
      buttonLabel: cardConfig.buttonLabel,
      buttonAttributes: cardConfig.buttonAttributes,
      children,
      buttonOnChange: () => {
        handleButtonOnChange(step)
      },
    }

    const keysLength = Object.keys(keyStepMap).length
    const processingLastCard = index === keysLength - 1
    if (processingLastCard) {
      return {
        ...card,
        buttonOnChange: (e) => {
          handleButtonOnChange(`step${keysLength}`)
          submitForm(e)
        },
      }
    }
    return card
  })
}
