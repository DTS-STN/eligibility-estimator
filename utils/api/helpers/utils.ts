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
  let age = ageAtStart // 66
  let yearsInCanada = yearsInCanadaAtStart //20
  const minAgeEligibility = 65
  const minYearsOfResEligibility = livingCountry === 'CAN' ? 10 : 20
  console.log('livingCountry', livingCountry)
  console.log('minYearsOfResEligibility', minYearsOfResEligibility)
  let ageOfEligibility
  let yearsOfResAtEligibility

  const ageJuly2013 = calculate2013Age(age)

  console.log('ageJuly2013 INSIDE OAS ELIGIBILITY', ageJuly2013)

  if (age >= minAgeEligibility && yearsInCanada >= minYearsOfResEligibility) {
    console.log('AGE DIFF', age, minAgeEligibility, age - minAgeEligibility)
    console.log(
      'years in CANADA DIFF',
      yearsInCanada,
      minYearsOfResEligibility,
      yearsInCanada - minYearsOfResEligibility
    )
    const yearsPastEligibility = Math.min(
      age - minAgeEligibility, // 66 - 65
      yearsInCanada - minYearsOfResEligibility //
    )

    console.log('yearsPastEligibility', yearsPastEligibility)
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

function calculate2013Age(currentAge) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const birthYear = currentYear - Math.floor(currentAge)
  const birthMonth =
    currentMonth - Math.round((currentAge - Math.floor(currentAge)) * 12)

  let adjustedYear = birthYear
  let adjustedMonth = birthMonth
  if (birthMonth <= 0) {
    adjustedYear -= 1
    adjustedMonth += 12
  }

  const ageInJuly2013 = 2013 - adjustedYear + (7 - adjustedMonth) / 12
  return parseFloat(ageInJuly2013.toFixed(2))
}

export function evaluateOASInput(input) {
  let canDefer = false
  let justBecameEligible = false
  const age = input.age // 66.42
  const ageJuly2013 = calculate2013Age(age)
  console.log('ageJuly2013', ageJuly2013)
  const yearsInCanada = input.yearsInCanadaSince18
  let eliObj = OasEligibility(age, yearsInCanada) // this is how we calculate eliObj under normal circumscantes. Need a new one for when July2013 rule is used
  console.log('eliObj', eliObj)
  const ageDiff = age - eliObj.ageOfEligibility
  let newInput = { ...input }

  let deferralMonths
  if (ageJuly2013 < 65) {
    if (age > eliObj.ageOfEligibility) {
      // 65
      const deferralYears = Math.min(
        60,
        Math.min(70, age) - eliObj.ageOfEligibility
      )
      deferralMonths = Math.max(0, deferralYears * 12)
    }
  } else if (ageJuly2013 >= 70) {
    deferralMonths = 0
  } else {
    const July2013YearsInCanada = 9 // something
    eliObj = OasEligibility(ageJuly2013, July2013YearsInCanada)
    // if eliObj.age > 70, deferralMonths = 0
    deferralMonths = Math.round((70 - ageJuly2013) * 12)
  }

  if (age === eliObj.ageOfEligibility && age < 70) {
    justBecameEligible = true
  }

  const newYearsInCan =
    age > eliObj.ageOfEligibility
      ? input.yearsInCanadaSince18 - ageDiff
      : input.yearsInCanada + ageDiff

  console.log('deferralMonths', deferralMonths)
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
