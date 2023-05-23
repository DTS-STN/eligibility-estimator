import roundToTwo from './roundToTwo'

export const getDeferralIncrease = (years, baseAmount) => {
  const deferralIncreaseByMonth = 0.006 // the increase to the monthly payment per month deferred
  const deferralIncreaseByYear = deferralIncreaseByMonth * 12 // the increase to the monthly payment per year deferred
  // the extra entitlement received because of the deferral
  return roundToTwo(years * deferralIncreaseByYear * baseAmount)
}
