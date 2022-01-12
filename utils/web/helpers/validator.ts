const MAX_ALLOWED_INCOME = 129757

export const validateIncome = (income: number | string) => {
  let validIncome
  if (typeof income === 'string') {
    validIncome = parseInt(income)
  } else {
    validIncome = income
  }

  return validIncome > MAX_ALLOWED_INCOME
}
