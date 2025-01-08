import React, { useEffect, useState } from 'react'
import { Button } from '../Forms/Button'

export const PSDBox: React.VFC<{
  onUpdate: () => void
  isUpdating: boolean
  yearsToDefer: number | null
}> = ({ onUpdate, isUpdating, yearsToDefer }) => {
  const totalMonths = Math.floor(yearsToDefer * 12)

  const [months, setMonths] = useState<string[]>([])
  const [years, setYears] = useState<number[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  )

  const populateDropdowns = (totalMonths: number) => {
    const currentDate = new Date()
    const futureDate = new Date()
    futureDate.setMonth(currentDate.getMonth() + totalMonths)

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

    let tempMonths: string[] = []
    let tempYears: number[] = []

    // Generate the range of years
    for (
      let year = currentDate.getFullYear();
      year <= futureDate.getFullYear();
      year++
    ) {
      tempYears.push(year)
    }

    // Generate months based on the range
    let startMonth = currentDate.getMonth()
    let endMonth = futureDate.getMonth()

    if (tempYears.length === 1) {
      // Same year case
      for (let i = startMonth; i <= endMonth; i++) {
        tempMonths.push(monthNames[i])
      }
    } else {
      // Multiple years case
      if (selectedYear === currentDate.getFullYear()) {
        for (let i = startMonth; i < 12; i++) {
          tempMonths.push(monthNames[i])
        }
      } else if (selectedYear === futureDate.getFullYear()) {
        for (let i = 0; i <= endMonth; i++) {
          tempMonths.push(monthNames[i])
        }
      } else {
        tempMonths = monthNames // All months for intermediate years
      }
    }

    setMonths(tempMonths)
    setYears(tempYears)
  }

  const handleYearChange = (year: number) => {
    setSelectedYear(year)
    // populateDropdowns(totalMonths)
  }

  useEffect(() => {
    populateDropdowns(totalMonths)
  }, [totalMonths, selectedYear])

  console.log('months', months)
  console.log('years', years)
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
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="inputStyles w-[108px]"
              // aria-invalid={!!props.hasError}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>
                  {month}
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
        <Button
          style="primary"
          custom="mt-6"
          type="button"
          text="Update estimate"
          imgHref={`/refresh-icon.svg`}
          alt="Update estimate"
          onClick={onUpdate}
        />
      </div>
    </div>
  )
}
