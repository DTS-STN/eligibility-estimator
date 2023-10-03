import { consoleDev } from '../../web/helpers/utils'
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

export function getAgeArray(residencyData) {
  let [userAge, partnerAge] = [
    residencyData.client.age,
    residencyData.partner.age,
  ]
  let [userRes, partnerRes] = [
    residencyData.client.res,
    residencyData.partner.res,
  ]

  // Early return if any element is missing
  if ([userAge, partnerAge, userRes, partnerRes].some((el) => isNaN(el)))
    return []

  const result = []

  function yearsUntilOAS(age, residency) {
    if (age >= 65 && residency >= 10) {
      return null
    }

    let ageDiff = Math.max(0, 65 - age)
    let residencyDiff = Math.max(0, 10 - residency)
    return Math.max(ageDiff, residencyDiff)
  }

  function yearsUntilALW(age, residency) {
    if ((age >= 60 && age <= 64 && residency >= 10) || age > 64) {
      return null
    }

    let ageDiff = Math.max(0, 60 - age)
    let residencyDiff = Math.max(0, 10 - residency)

    if (age + residencyDiff > 64) {
      return null
    }

    return Math.max(ageDiff, residencyDiff)
  }

  while (true) {
    let cALW = yearsUntilALW(userAge, userRes)
    let cOAS = yearsUntilOAS(userAge, userRes)
    let pALW = yearsUntilALW(partnerAge, partnerRes)
    let pOAS = yearsUntilOAS(partnerAge, partnerRes)

    let arr = [cALW, cOAS, pALW, pOAS]
    if (arr.every((el) => el === null)) break

    const years = Math.min(...arr.filter((num) => num !== null))
    userAge += years
    partnerAge += years
    userRes += years
    partnerRes += years
    result.push([userAge, partnerAge])
  }

  return result
}

export function getAgeArray3(residencyData) {
  let [userAge, partnerAge] = [
    residencyData.client.age,
    residencyData.partner.age,
  ]
  let [userRes, partnerRes] = [
    residencyData.client.res,
    residencyData.partner.res,
  ]

  const resLimit = 10
  const result = []

  // Early return if any element is missing
  if ([userAge, partnerAge, userRes, partnerRes].some((el) => isNaN(el)))
    return []

  // Helper function to check ALW eligibility
  function isEligibleForALW(age, residency, partnerOASEligibility) {
    return (
      age >= 60 && age < 65 && residency >= resLimit && partnerOASEligibility
    )
  }

  // Helper function to check OAS eligibility
  function isEligibleForOAS(age, residency) {
    return age >= 65 && residency >= resLimit
  }

  // Tracking initial eligibility
  let userPrevEligibility = [
    isEligibleForALW(
      userAge,
      userRes,
      isEligibleForOAS(partnerAge, partnerRes)
    ),
    isEligibleForOAS(userAge, userRes),
  ]

  let partnerPrevEligibility = [
    isEligibleForALW(
      partnerAge,
      partnerRes,
      isEligibleForOAS(userAge, userRes)
    ),
    isEligibleForOAS(partnerAge, partnerRes),
  ]

  // Iterate until both are eligible for OAS
  while (
    !(
      isEligibleForOAS(userAge, userRes) &&
      isEligibleForOAS(partnerAge, partnerRes)
    )
  ) {
    // Increase age and residency for both user and partner
    userAge++
    userRes++
    partnerAge++
    partnerRes++

    // Check current eligibility
    const userCurrEligibility = [
      isEligibleForALW(
        userAge,
        userRes,
        isEligibleForOAS(partnerAge, partnerRes)
      ),
      isEligibleForOAS(userAge, userRes),
    ]

    const partnerCurrEligibility = [
      isEligibleForALW(
        partnerAge,
        partnerRes,
        isEligibleForOAS(userAge, userRes)
      ),
      isEligibleForOAS(partnerAge, partnerRes),
    ]

    // If eligibility changed for either person, add to result
    if (
      userCurrEligibility.join() !== userPrevEligibility.join() ||
      partnerCurrEligibility.join() !== partnerPrevEligibility.join()
    ) {
      result.push([userAge, partnerAge])
    }

    // Update previous eligibility
    userPrevEligibility = userCurrEligibility
    partnerPrevEligibility = partnerCurrEligibility
  }

  return result
}

export function getAgeArray2(ages: number[]) {
  // {66.42: 40, 60.92: 10} == [70.5, 65]
  // uALW: null
  // uOAS: null
  // pALW: null
  // pOAS: 4.08

  // {68.75: 12, 59.25: 40} == [69.5,60], [74.5,65]
  // uALW: null     // uALW: null
  // uOAS: null     // uOAS: null
  // pALW: 0.75     // pALW: null
  // pOAS: 5.75     // pOAS: 5

  // {70: 15, 64: 8} -> (72:17, 66:10) == [72,66]
  // {70: 15, 66: 8} -> (72:17, 68:10) == [72,68]
  // {70.5: 15, 64.5: 8} -> [72.5, 66.5]
  // 60: 9, 65: 10 -> 61: 10, 66: 11 -> 65: 14, 70: 15 == [61, 66], [65, 70]

  // uALW: 1      // uALW: null (if already ALW eligible return null) // uALW: null
  // uOAS: 5      // uOAS: 4                                          // uOAS: null
  // pALW: null   // pALW: null                                       // pALW: null
  // pOAS: null   // pOAS: null                                       // pOAS: null

  // 45: 1, 62: 20 -> (48: 4, 65: 23), (60: 16, 77: 35), (65: 21, 82:42) == [48, 65], [60, 77], [65, 82]

  // how to determine next milestone
  // if under 65
  // increase age and res by 1

  // noone eligible -> client will eligible first -> then a year later partner will be eligible -> EVERYONE ELIGIBLE FOR OAS, DONE
  // {68: 5, 69: 4} -> (73: 10, 74: 9) -> (74: 11, 75: 10) => [73, 74], [74, 75]

  // 53, 59 -> (60,66), (65,71)
  // 53:2, 59:1 -> (54:3, 60:2), (59: 8, 65: 7), (60: 9, 66:8) -> (61:10, 67:9) -> (62:11, 68:10) -> (65:14, 71:13) == [62, 68], [65,71]
  const [userAge, partnerAge] = ages
  const ageDiff = Math.abs(userAge - partnerAge)

  const result = []

  // while both res are below 10
  // add 1 to everything

  if (ageDiff > 5 && ages.some((age) => age < 60)) {
    while (!ages.some((age) => age === 60)) {
      // should be "until some age is not over 60"
      let [userAge, partnerAge] = ages
      if (userAge > partnerAge && userAge < 65) {
        // make this 65 user oas eligibility age
        let diff = 65 - userAge // client oas eligibility age - user age
        userAge += diff
        partnerAge += diff
      } else if (userAge < partnerAge) {
        let diff = 60 - userAge // user ALW eli age instead of 60
        userAge += diff
        partnerAge += diff
      } else {
        let diff = 60 - partnerAge // partner ALW age instead of 60
        userAge += diff
        partnerAge += diff
      }
      ages = [userAge, partnerAge]
      result.push(ages)
    }
  }

  while (!ages.every((age) => age >= 65)) {
    // while both are not eligible
    let [userAge, partnerAge] = ages
    if (userAge >= 65 || partnerAge >= 65) {
      if (userAge < partnerAge) {
        let diff = 65 - userAge // partner OAS eligibility age instead of 65
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

export function buildQuery(
  query,
  ageSet,
  clientDeferralMeta,
  partnerDeferralMeta,
  clientAlreadyOasEligible,
  partnerAlreadyOasEligible,
  clientLockResidence,
  partnerLockResidence
) {
  const newQuery = { ...query }
  const [userAge, partnerAge] = ageSet // 68, 65

  // CLIENT
  newQuery['age'] = String(userAge)
  if (userAge >= 65) {
    addKeyValue(newQuery, 'receiveOAS', 'false')
  }

  if (query.livedOnlyInCanada === 'false' && query.yearsInCanadaSince18) {
    if (clientAlreadyOasEligible) {
      if (clientDeferralMeta.deferred) {
        // deferred scenario more beneficial
        newQuery['yearsInCanadaSince18'] = String(clientDeferralMeta.residency)
        newQuery['oasDeferDuration'] = clientDeferralMeta.length
      } else {
        newQuery['yearsInCanadaSince18'] = String(clientDeferralMeta.residency)
      }
    } else {
      if (clientLockResidence) {
        newQuery['yearsInCanadaSince18'] = String(
          Math.floor(clientLockResidence)
        )
      } else {
        // just add residency
        const newYrsInCanada = Math.min(
          40,
          Number(userAge) -
            Number(query.age) +
            Number(query.yearsInCanadaSince18)
        )
        newQuery['yearsInCanadaSince18'] = String(Math.floor(newYrsInCanada))
      }
    }

    // const newYrsInCanada = String(
    //   Math.min(
    //     40,
    //     65 - Math.floor(Number(query.age)) + Number(query.yearsInCanadaSince18)
    //   )
    // )
  } else {
    if (clientAlreadyOasEligible) {
      if (clientDeferralMeta.deferred) {
        newQuery['oasDeferDuration'] = clientDeferralMeta.length
      }
    }
  }

  // PARTNER
  newQuery['partnerAge'] = String(partnerAge)

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
    const increaseResidence = !partnerAlreadyOasEligible

    // const ageLimit = partnerAge < 65 ? 65 : partnerAge

    const partnerNewYrsInCanada =
      Number(partnerAge) -
      Number(query.partnerAge) +
      Number(query.partnerYearsInCanadaSince18)

    newQuery['partnerYearsInCanadaSince18'] = String(
      Math.floor(
        increaseResidence
          ? partnerLockResidence
            ? Math.floor(partnerLockResidence)
            : partnerNewYrsInCanada
          : Number(partnerDeferralMeta.residency)
      )
    )
  }

  return newQuery
}

function addKeyValue(obj, key, val) {
  if (!obj.hasOwnProperty(key)) {
    obj[key] = val
  }
}

/**
 * Accepts a numerical month+year, and returns the number of years since then.
 * This can and will return a decimal value, such as "65.5"!
 */
export function calculateAge(birthMonth: number, birthYear: number): number {
  if (birthMonth === null || birthYear === null) return null

  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  let ageMonths: number
  let ageYears = currentYear - birthYear

  if (currentMonth >= birthMonth) {
    ageMonths = currentMonth - birthMonth
  } else {
    ageYears -= 1
    ageMonths = 12 + (currentMonth - birthMonth)
  }

  return ageYears + Number((ageMonths / 12).toFixed(2))
}

export function OasEligibility(
  ageAtStart,
  yearsInCanadaAtStart,
  livedOnlyInCanada = false,
  livingCountry = 'CAN'
) {
  let age = ageAtStart
  let yearsInCanada = yearsInCanadaAtStart
  const minAgeEligibility = 65
  const minYearsOfResEligibility = livingCountry === 'CAN' ? 10 : 20

  let ageOfEligibility
  let yearsOfResAtEligibility

  if (age >= minAgeEligibility && yearsInCanada >= minYearsOfResEligibility) {
    const yearsPastEligibility = Math.min(
      age - minAgeEligibility,
      yearsInCanada - minYearsOfResEligibility
    )
    ageOfEligibility = age - yearsPastEligibility
    yearsOfResAtEligibility = yearsInCanada - yearsPastEligibility
  } else if (
    age < minAgeEligibility ||
    yearsInCanada < minYearsOfResEligibility
  ) {
    while (
      age < minAgeEligibility ||
      yearsInCanada < minYearsOfResEligibility
    ) {
      age++
      yearsInCanada++
    }
    ageOfEligibility = Math.floor(age)
    yearsOfResAtEligibility = Math.round(
      ageOfEligibility - ageAtStart + yearsInCanadaAtStart
    )
  }

  return {
    ageOfEligibility,
    yearsOfResAtEligibility: livedOnlyInCanada
      ? 40
      : Math.floor(yearsOfResAtEligibility),
  }
}

export function AlwsEligibility(age, yearsInCanada) {
  const minAgeEligibility = 60
  const maxAgeEligibility = 64
  const minYearsOfResEligibility = 10

  let ageOfEligibility
  let yearsOfResAtEligibility

  if (age < minAgeEligibility || yearsInCanada < minYearsOfResEligibility) {
    while (
      age < minAgeEligibility ||
      yearsInCanada < minYearsOfResEligibility
    ) {
      age++
      yearsInCanada++
    }
    ageOfEligibility = age > maxAgeEligibility ? null : age
    yearsOfResAtEligibility = yearsInCanada
  }

  return {
    ageOfEligibility,
    yearsOfResAtEligibility,
  }
}

export function evaluateOASInput(input) {
  let canDefer = false
  let justBecameEligible = false
  const age = input.age // 66.42
  const yearsInCanada = input.yearsInCanadaSince18
  const eliObj = OasEligibility(age, yearsInCanada)
  const ageDiff = age - eliObj.ageOfEligibility
  let newInput = { ...input }

  let deferralMonths = 0
  if (age > eliObj.ageOfEligibility) {
    // 65
    const deferralYears = Math.min(
      60,
      Math.min(70, age) - eliObj.ageOfEligibility
    )
    deferralMonths = Math.max(0, deferralYears * 12)
  }

  if (age === eliObj.ageOfEligibility && age < 70) {
    justBecameEligible = true
  }

  const newYearsInCan =
    age > eliObj.ageOfEligibility
      ? input.yearsInCanadaSince18 - ageDiff
      : input.yearsInCanada + ageDiff

  if (deferralMonths !== 0 && !input.receiveOAS) {
    canDefer = true
    newInput['inputAge'] = input.age
    newInput['age'] = eliObj.ageOfEligibility
    newInput['receiveOAS'] = true
    newInput['yearsInCanadaSince18'] = input.livedOnlyInCanada
      ? 40
      : Math.min(40, Math.floor(newYearsInCan))
    newInput['oasDeferDuration'] = JSON.stringify({
      months: Math.round(deferralMonths),
      years: 0,
    })
    consoleDev(
      '#5 oasDefer',
      newInput['oasDeferDuration'],
      'months',
      deferralMonths
    )
  }

  return {
    canDefer,
    newInput,
    justBecameEligible,
  }
}
