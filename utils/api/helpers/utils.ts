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

  //when partner does not have Legal status residenciy is 0
  if (userAge >= 65 && partnerRes === 0) return []

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
        const newYrsInCanada =
          query.livingCountry == 'CAN'
            ? Math.min(
                40,
                Number(userAge) -
                  Number(query.age) +
                  Number(query.yearsInCanadaSince18)
              )
            : query.yearsInCanadaSince18
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
      query.partnerLivingCountry === 'CAN'
        ? Number(partnerAge) -
          Number(query.partnerAge) +
          Number(query.partnerYearsInCanadaSince18)
        : query.partnerYearsInCanadaSince18

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

    ageOfEligibility =
      yearsInCanadaAtStart < minYearsOfResEligibility ? age : Math.floor(age)

    yearsOfResAtEligibility =
      livingCountry == 'CAN'
        ? Math.round(ageOfEligibility - ageAtStart + yearsInCanadaAtStart)
        : yearsInCanadaAtStart
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

export function evaluateOASInput(input, formAge) {
  let canDefer = false
  let justBecameEligible = false
  const age = input.age // 66.42
  const ageJuly2013 = calculate2013Age(age, input.clientBirthDate)

  console.log('ageJuly2013', ageJuly2013)

  const yearsInCanada = input.yearsInCanadaSince18

  let eliObj = OasEligibility(
    age,
    yearsInCanada,
    input.livedOnlyInCanada,
    input.livingCountry.value
  )

  console.log('eliObj', eliObj) // calculates age of eligibility as well as years of residence at eligibility

  let newInput = { ...input }

  let deferralMonths
  if (
    ageJuly2013 >= 70 ||
    eliObj.ageOfEligibility >= 70 ||
    age < eliObj.ageOfEligibility
  ) {
    deferralMonths = 0
  } else {
    // Eligibility age is between 65-70 here
    if (ageJuly2013 >= eliObj.ageOfEligibility) {
      // Cannot defer from the time they became eligible but only from July 2013 (must use residency and age from July 2013 to calculate OAS with deferral)
      const ageDiff = ageJuly2013 - eliObj.ageOfEligibility
      const newRes = Math.floor(eliObj.yearsOfResAtEligibility + ageDiff)
      eliObj = {
        ageOfEligibility: ageJuly2013,
        yearsOfResAtEligibility: newRes,
      }
      deferralMonths = (70 - ageJuly2013) * 12
    } else {
      // They became eligible after July 2013 -> use age and residency as is (at the time they became eligible for OAS)
      deferralMonths = (Math.min(70, age) - eliObj.ageOfEligibility) * 12

      // If the client selected an Start_Date_for_OAS then
      //   IF Client age >= 65 add ALL futureMonths to the deferral months
      //   If Client age < 65 futureMonths will be converted into years and months discarting any months after 65
      //      Example: client age is 45.6 wants oas as of 65.6 => 240 months However at 65 he only have 234 montsh or 19 yrs and 6 months
      //
      // if (!input.whenToStartOAS) {
      //   let futureMonths = input.startDateForOAS * 12 * -1

      //   if (formAge >= 65) {
      //     deferralMonths = deferralMonths + futureMonths
      //   } else {
      //     eliObj.yearsOfResAtEligibility =
      //       eliObj.yearsOfResAtEligibility + Math.floor(65 - formAge)
      //     deferralMonths = ((65 - formAge) * 12) % 12
      //   }
      // }
    }
  }

  if (age === eliObj.ageOfEligibility && age < 70) {
    justBecameEligible = true
  }

  if (deferralMonths !== 0 && !input.receiveOAS) {
    canDefer = true
    newInput['inputAge'] = input.age
    newInput['age'] = eliObj.ageOfEligibility
    newInput['receiveOAS'] = true
    newInput['yearsInCanadaSince18'] = input.livedOnlyInCanada
      ? 40
      : Math.min(40, Math.floor(eliObj.yearsOfResAtEligibility))
    newInput['oasDeferDuration'] = JSON.stringify({
      months: Math.max(Math.round(deferralMonths), 0),
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

export function calculate2013Age(currentAge, birthDate?) {
  if (birthDate) {
    const parts = birthDate.split(';')
    const birthYear = parseInt(parts[0], 10)
    const birthMonth = parseInt(parts[1], 10)

    const comparisonYear = 2013
    const comparisonMonth = 7 // July

    let age = comparisonYear - birthYear
    const monthDifference = comparisonMonth - birthMonth

    const monthAge = monthDifference / 12
    age += monthAge

    return parseFloat(age.toFixed(2))
  } else {
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

export function calculateFutureYearMonth(birthYear, birthMonth, age) {
  // Calculate the number of full years and additional months
  var fullYears = Math.floor(age)
  var additionalMonths = Math.floor((age - fullYears) * 12)

  // Calculate the future year and month
  var futureYear = birthYear + fullYears
  var futureMonth = birthMonth + additionalMonths

  // Adjust for month overflow (if futureMonth > 12)
  if (futureMonth > 12) {
    futureYear += Math.floor(futureMonth / 12)
    futureMonth = futureMonth % 12
  }

  // If futureMonth is 0, it means the month is December of the previous year
  if (futureMonth === 0) {
    futureYear -= 1
    futureMonth = 12
  }

  return {
    year: futureYear,
    month: futureMonth,
  }
}
