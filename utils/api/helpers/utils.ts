import roundToTwo from './roundToTwo'

export const getDeferralIncrease = (months, baseAmount) => {
  const deferralIncreaseByMonth = 0.006 // the increase to the monthly payment per month deferred
  // the extra entitlement received because of the deferral
  return roundToTwo(months * deferralIncreaseByMonth * baseAmount)
}

export function getEligibleBenefits(benefits) {
  const newObj = {}
  for (const key in benefits) {
    if (benefits[key].eligibility?.result === 'eligible') {
      newObj[key] = benefits[key]
    }
  }
  return Object.keys(newObj).length === 0 ? null : newObj
}

export function getAgeArray(ages: number[]) {
  const [userAge, partnerAge] = ages
  const ageDiff = Math.abs(userAge - partnerAge)
  const result = []

  if (ageDiff > 5 && ages.some((age) => age < 60)) {
    while (!ages.some((age) => age === 60)) {
      let [userAge, partnerAge] = ages
      if (userAge > partnerAge && userAge < 65) {
        let diff = 65 - userAge
        userAge += diff
        partnerAge += diff
      } else if (userAge < partnerAge) {
        let diff = 60 - userAge
        userAge += diff
        partnerAge += diff
      } else {
        let diff = 60 - partnerAge
        userAge += diff
        partnerAge += diff
      }
      ages = [userAge, partnerAge]
      result.push(ages)
    }
  }

  while (!ages.every((age) => age >= 65)) {
    let [userAge, partnerAge] = ages
    if (userAge >= 65 || partnerAge >= 65) {
      if (userAge < partnerAge) {
        let diff = 65 - userAge
        userAge += diff
        partnerAge += diff
      } else {
        let diff = 65 - partnerAge
        userAge += diff
        partnerAge += diff
      }
    } else {
      const maxAge = Math.max(userAge, partnerAge)
      const diff = 65 - maxAge
      userAge += diff
      partnerAge += diff
    }
    ages = [userAge, partnerAge]
    result.push(ages)
  }

  return result
}

export function buildQuery(query, ageSet, ageFraction) {
  const newQuery = { ...query }
  const [userAge, partnerAge] = ageSet
  const [userFraction, partnerFraction] = ageFraction

  // CLIENT
  newQuery['age'] = String(userAge + userFraction)
  newQuery['partnerAge'] = String(partnerAge + partnerFraction)

  if (userAge >= 65) {
    addKeyValue(newQuery, 'receiveOAS', 'false')
  }

  if (query.livedOnlyInCanada === 'false' && query.yearsInCanadaSince18) {
    const newYrsInCanada = String(
      Math.min(
        40,
        65 - Math.floor(Number(query.age)) + Number(query.yearsInCanadaSince18)
      )
    )
    newQuery['yearsInCanadaSince18'] = newYrsInCanada
  }

  // PARTNER
  if (partnerAge >= 60) {
    addKeyValue(newQuery, 'partnerLegalStatus', 'yes')
    addKeyValue(newQuery, 'partnerLivingCountry', 'CAN')
    addKeyValue(newQuery, 'partnerLivedOnlyInCanada', 'true')
  }

  if (partnerAge >= 65) {
    addKeyValue(newQuery, 'partnerBenefitStatus', 'helpMe')
  }

  if (
    query.partnerLivedOnlyInCanada === 'false' &&
    query.partnerYearsInCanadaSince18
  ) {
    const ageLimit = partnerAge < 65 ? 65 : partnerAge
    const partnerNewYrsInCanada = String(
      Math.min(
        40,
        ageLimit -
          Math.floor(Number(query.partnerAge)) +
          Number(query.partnerYearsInCanadaSince18)
      )
    )
    newQuery['partnerYearsInCanadaSince18'] = partnerNewYrsInCanada
  }

  return newQuery
}

function addKeyValue(obj, key, val) {
  if (!obj.hasOwnProperty(key)) {
    obj[key] = val
  }
}
