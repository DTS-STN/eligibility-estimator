import { MAX_OAS_INCOME } from '../../api/definitions/legalValues'

export const validateIncome = (income: number | string) => {
  let validIncome
  if (typeof income === 'string') {
    validIncome = parseInt(income)
  } else {
    validIncome = income
  }

  return validIncome > MAX_OAS_INCOME
}
