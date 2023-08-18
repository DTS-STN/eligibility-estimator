import { max, min } from 'lodash'
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

export function buildQuery(
  query,
  ageSet,
  deferralMeta, // client
  clientAlreadyOasEligible,
  partnerAlreadyEligible
) {
  const newQuery = { ...query }
  // console.log('input query', newQuery)
  // console.log(ageSet)
  const [userAge, partnerAge] = ageSet // 68, 65

  // CLIENT
  newQuery['age'] = String(userAge)
  if (userAge >= 65) {
    addKeyValue(newQuery, 'receiveOAS', 'false')
  }

  if (query.livedOnlyInCanada === 'false' && query.yearsInCanadaSince18) {
    if (clientAlreadyOasEligible) {
      if (deferralMeta.deferred) {
        // deferred scenario more beneficial
        newQuery['yearsInCanadaSince18'] = String(deferralMeta.residency)
        newQuery['oasDeferDuration'] = deferralMeta.length
      } else {
        newQuery['yearsInCanadaSince18'] = String(deferralMeta.residency)
      }
    } else {
      // just add residency
      const newYrsInCanada = Math.min(
        40,
        Number(userAge) - Number(query.age) + Number(query.yearsInCanadaSince18)
      )
      newQuery['yearsInCanadaSince18'] = String(Math.floor(newYrsInCanada))
    }

    // const newYrsInCanada = String(
    //   Math.min(
    //     40,
    //     65 - Math.floor(Number(query.age)) + Number(query.yearsInCanadaSince18)
    //   )
    // )
  } else {
    if (clientAlreadyOasEligible) {
      if (deferralMeta.deferred) {
        newQuery['oasDeferDuration'] = deferralMeta.length
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
    query.partnerYearsInCanadaSince18 &&
    !partnerAlreadyEligible
  ) {
    const ageLimit = partnerAge < 65 ? 65 : partnerAge

    const partnerNewYrsInCanada =
      Number(partnerAge) -
      Number(query.partnerAge) +
      Number(query.partnerYearsInCanadaSince18)

    // console.log('PARTNER NEW YEARS', partnerNewYrsInCanada)
    newQuery['partnerYearsInCanadaSince18'] = String(
      Math.floor(partnerNewYrsInCanada)
    )
  }

  //TODO - why yearsInCanada goes down by 1 year while partner years in canada works good

  //TODO put this somewhere
  // if (
  //   this.query.livedOnlyInCanada === 'false' &&
  //   this.query.yearsInCanadaSince18
  // ) {
  //   this.newQuery['yearsInCanadaSince18'] = String(
  //     Math.min(40, eliObj.yearsOfResAtEligibility)
  //   )
  // }

  console.log('newQuery before return', newQuery)
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
  livedOnlyInCanada = false
) {
  let age = ageAtStart
  let yearsInCanada = yearsInCanadaAtStart
  // console.log('age AT START', age)
  // console.log('yearsInCanada AT START', yearsInCanada)
  const minAgeEligibility = 65
  const minYearsOfResEligibility = 10

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

    // console.log('ageOfEligibility', ageOfEligibility)
    // console.log('yearsOfResAtEligibility', yearsOfResAtEligibility)
  }
  return {
    ageOfEligibility,
    yearsOfResAtEligibility: livedOnlyInCanada ? 40 : yearsOfResAtEligibility,
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
  // console.log('input TO CHECK', input)
  let deferralMonths = 0
  if (age > eliObj.ageOfEligibility) {
    // 65
    const deferralYears = Math.min(
      60,
      Math.min(70, age) - eliObj.ageOfEligibility
    )
    deferralMonths = deferralYears * 12
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
      : Math.min(40, Math.round(newYearsInCan))
    newInput['oasDeferDuration'] = JSON.stringify({
      months: Math.floor(deferralMonths),
      years: 0,
    })
  }

  return {
    canDefer,
    newInput,
    justBecameEligible,
  }
}
