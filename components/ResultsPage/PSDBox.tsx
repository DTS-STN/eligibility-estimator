import React, { useEffect, useState } from 'react'
import { getTargetDate, OasEligibility } from '../../utils/api/helpers/utils'
import { Button } from '../Forms/Button'

// Residence is 5 years
// current age    GAP1     eliAge    GAP2    PSDAge
//    58y7m       6y5m       65       5y       70
// We need to calculate both "maxRes" and "maxDeferral"

// maxRes           original res + gaps
//const totalMonths = 5*12 + (6*12 + 5)  + 5*12 = 197 months

//residence = Math.floor(totalMonths / 12)
//deferral = totalMonths % 12

// maxDeferral
// residence = whole years of GAP1
// deferral = GAP2

// All that's needed is the PSD age from the psd component and a flag that this is a "psd calc"
// Then, when running the calc - "no deferral" and "deferral" OAS calculations will take the flag and work a little bit differently

// In the results page, we need to iterate over client future results and find the first occurence of OAS. THIS is the OAS that we will replace with the PSD results
// Then we have to keep track at what location did we find the first occurence of OAS and replace the partner future results at the same location

const monthNames = [
  'Jan.',
  'Feb.',
  'Mar.',
  'Apr.',
  'May',
  'June',
  'July',
  'Aug.',
  'Sept.',
  'Oct.',
  'Nov.',
  'Dec.',
]

const calculatePsdAge = (
  currentAge: number,
  targetMonth: number,
  targetYear: number
) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() // Months are 0-indexed in JS, so add 1

  // Calculate the total number of months elapsed between the current date and the target date
  const monthsElapsed =
    (targetYear - currentYear) * 12 + (targetMonth - currentMonth)

  // Convert monthsElapsed into years (with decimals)
  const ageAtTargetDate = currentAge + monthsElapsed / 12

  // Return the calculated age rounded to two decimal places
  return parseFloat(ageAtTargetDate.toFixed(2))
}

const getFirstEligibleDate = (currentAge: number, ageOfEligibility: number) => {
  const currentDate = new Date() // Get the current date (today's date)

  // If the user is already eligible, return the current month and year
  if (currentAge >= ageOfEligibility) {
    return {
      month: currentDate.getMonth(), // Convert zero-based month to one-based (1 = January)
      year: currentDate.getFullYear(),
    }
  }

  // Calculate the years and months until eligibility
  const yearsToEligibility = ageOfEligibility - currentAge // Calculate how many years until eligible
  const wholeYears = Math.floor(yearsToEligibility) // Get the whole number of years
  const remainingMonths = Math.round((yearsToEligibility - wholeYears) * 12) // Convert fractional part to months

  // Calculate the month and year of eligibility
  const eligibilityYear = currentDate.getFullYear() + wholeYears // Add whole years to the current year
  const eligibilityMonth = currentDate.getMonth() + remainingMonths // Add remaining months to the current month

  // Handle overflow if eligibilityMonth exceeds 11 (e.g., December = 11)
  const finalMonth = eligibilityMonth % 12 // Ensure the month wraps around (0 = January, 11 = December)
  const finalYear = eligibilityYear + Math.floor(eligibilityMonth / 12) // Increment the year if months overflow

  return {
    month: finalMonth,
    year: finalYear,
  }
}

export const PSDBox: React.VFC<{
  onUpdate: (psdAge: number, maxEliAge: number) => void
  inputObj: any
  isUpdating: boolean
}> = ({ onUpdate, inputObj, isUpdating }) => {
  const age = Number(inputObj.age)
  const yearsInCanada =
    inputObj.livedOnlyInCanada === 'true'
      ? 40
      : Number(inputObj.yearsInCanadaSince18) ||
        Number(inputObj.yearsInCanadaSinceOAS)

  const clientEliObj = OasEligibility(
    Number(inputObj.age),
    yearsInCanada,
    JSON.parse(inputObj.livedOnlyInCanada),
    inputObj.livingCountry
  )

  const maxEliAge = Math.max(clientEliObj.ageOfEligibility, age)
  const yearsToDeferMax = maxEliAge >= 70 ? null : 70 - maxEliAge
  const totalMonths = yearsToDeferMax * 12

  const receiveOAS = inputObj?.receiveOAS === 'true'
  const showPSD = !receiveOAS && yearsToDeferMax

  const [showUpdateButton, setShowUpdateButton] = useState(false)
  const [months, setMonths] = useState<number[]>([])
  const [years, setYears] = useState<number[]>([])

  const firstEligibleDate = getFirstEligibleDate(
    Number(inputObj.age),
    clientEliObj.ageOfEligibility
  )

  const [selectedMonth, setSelectedMonth] = useState<number>(
    firstEligibleDate.month
  )

  const [selectedYear, setSelectedYear] = useState<number>(
    firstEligibleDate.year
  )

  const [baseMonth, setBaseMonth] = useState<number>(firstEligibleDate.month)

  const [baseYear, setBaseYear] = useState<number>(firstEligibleDate.year)

  const psdAge = calculatePsdAge(age, selectedMonth, selectedYear)

  const populateDropdowns = () => {
    const targetDate = getTargetDate(70, +inputObj.age)

    const targetYear = targetDate.year
    const targetMonth = targetDate.month

    let tempMonths: number[] = []
    let tempYears: number[] = []

    // Generate the range of years
    for (let year = firstEligibleDate.year; year <= targetYear; year++) {
      tempYears.push(year)
    }

    if (tempYears.length === 1) {
      // Same year case
      for (let i = firstEligibleDate.month; i <= targetMonth; i++) {
        tempMonths.push(i)
      }
    }

    if (selectedYear === firstEligibleDate.year) {
      for (let i = firstEligibleDate.month; i < 12; i++) {
        tempMonths.push(i)
      }
    } else if (selectedYear === targetYear) {
      for (let i = 0; i <= targetMonth; i++) {
        tempMonths.push(i)
      }
    } else {
      for (let i = 0; i <= 11; i++) {
        tempMonths.push(i)
      }
    }

    setMonths(tempMonths)
    setYears(tempYears)
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)

    populateDropdowns()
  }

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month)

    populateDropdowns()
  }

  useEffect(() => {
    populateDropdowns()
  }, [totalMonths, selectedYear])

  useEffect(() => {
    if (!months.includes(selectedMonth)) {
      setSelectedMonth(months[0])
    }
  }, [JSON.stringify(months)])

  // write a useEffect that listens to changes to selectedYear and selectedMonth and if they are different from current month and year make a hidden button appear
  useEffect(() => {
    if (selectedMonth !== baseMonth || selectedYear !== baseYear) {
      setShowUpdateButton(true)
    } else {
      setShowUpdateButton(false)
    }
  }, [selectedMonth, selectedYear])

  const handleUpdateClick = () => {
    setBaseMonth(selectedMonth)
    setBaseYear(selectedYear)
    setShowUpdateButton(false)
    onUpdate(psdAge, maxEliAge)
  }

  return (
    showPSD && (
      <div className="fz-10">
        <div
          className={`py-2 sm:p-8 sm:bg-emphasis rounded mt-8 md:mt-0 md:max-w-[360px] ${
            isUpdating ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <h3 className="h3">Change your pension start date</h3>
          <p className="text-[20px] leading-[30px]">
            You can delay until age 70. For each month you wait, your pension
            increases by 0.6%.
          </p>

          <div className="datePicker relative flex flex-wrap mt-4">
            <div className="flex flex-col">
              <label
                className="text-[#333333] text-base font-[700]"
                htmlFor="psd-month"
              >
                Month
              </label>
              <select
                id="psd-month"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                className="inputStyles w-[108px]"
                // aria-invalid={!!props.hasError}
              >
                {months.map((month, index) => (
                  <option key={index} value={months[index]}>
                    {monthNames[month]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label
                className="text-[#333333] text-base font-[700]"
                htmlFor="psd-year"
              >
                Year
              </label>
              <select
                id="psd-year"
                className="inputStyles w-[108px]"
                value={selectedYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
              >
                {years.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {showUpdateButton && (
            <Button
              style="primary"
              custom="mt-6"
              type="button"
              text="Update estimate"
              imgHref={`/refresh-icon.svg`}
              alt="Update estimate"
              onClick={handleUpdateClick}
            />
          )}
        </div>
      </div>
    )
  )
}
