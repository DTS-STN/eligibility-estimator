import React, { useEffect, useState } from 'react'
import { Button } from '../Forms/Button'

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

export const PSDBox: React.VFC<{
  onUpdate: () => void
  isUpdating: boolean
  yearsToDefer: number | null
}> = ({ onUpdate, isUpdating, yearsToDefer }) => {
  const totalMonths = yearsToDefer * 12
  const currentDate = new Date()
  const [showUpdateButton, setShowUpdateButton] = useState(false)

  const [months, setMonths] = useState<number[]>([])
  const [years, setYears] = useState<number[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentDate.getMonth()
  )
  const [selectedYear, setSelectedYear] = useState<number>(
    currentDate.getFullYear()
  )

  const populateDropdowns = (totalMonths: number) => {
    const targetYear = currentDate.getFullYear() + Math.floor(totalMonths / 12) // Full years
    const remainingMonths = (currentDate.getMonth() + totalMonths) % 12 // Remaining months (modulo 12)
    const targetMonth =
      remainingMonths % 1 < 0.5
        ? Math.floor(remainingMonths)
        : Math.ceil(remainingMonths)

    let tempMonths: number[] = []
    let tempYears: number[] = []

    // Generate the range of years
    for (let year = currentDate.getFullYear(); year <= targetYear; year++) {
      tempYears.push(year)
    }

    const startMonth = currentDate.getMonth()

    if (tempYears.length === 1) {
      // Same year case
      for (let i = startMonth; i <= targetMonth; i++) {
        tempMonths.push(i)
      }
    } else {
      // Multiple years case
      if (selectedYear === currentDate.getFullYear()) {
        for (let i = startMonth; i < 12; i++) {
          tempMonths.push(i)
        }
      } else if (selectedYear === targetYear) {
        for (let i = 0; i <= targetMonth; i++) {
          tempMonths.push(i)
        }
      } else {
        tempMonths = months.map((_, index) => index) // All months for intermediate years
      }
    }

    setMonths(tempMonths)
    setYears(tempYears)
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)

    populateDropdowns(totalMonths)
  }

  useEffect(() => {
    populateDropdowns(totalMonths)
  }, [totalMonths, selectedYear])

  useEffect(() => {
    if (!months.includes(selectedMonth)) {
      setSelectedMonth(0)
    }
  }, [JSON.stringify(months)])

  // write a useEffect that listens to changes to selectedYear and selectedMonth and if they are different from current month and year make a hidden button appear
  useEffect(() => {
    if (
      selectedMonth !== currentDate.getMonth() ||
      selectedYear !== currentDate.getFullYear()
    ) {
      setShowUpdateButton(true)
    } else {
      setShowUpdateButton(false)
    }
  }, [selectedMonth, selectedYear])

  console.log('months', months)
  console.log('years', years)
  console.log('selectedMonth', selectedMonth)
  console.log('selectedYear', selectedYear)
  return (
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
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="inputStyles w-[108px]"
              // aria-invalid={!!props.hasError}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
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
            onClick={onUpdate}
          />
        )}
      </div>
    </div>
  )
}
