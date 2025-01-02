import React from 'react'
import { Button } from '../Forms/Button'

export const PSDBox: React.VFC<{
  onUpdate: () => void
  isUpdating: boolean
}> = ({ onUpdate, isUpdating }) => {
  // function that calculates age

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
              defaultValue={1}
              // onChange={props.onMonthChange}
              className="inputStyles w-[108px]"
              // aria-invalid={!!props.hasError}
            >
              <option value="1">Jan.</option>
              <option value="2">Feb.</option>
              <option value="3">Mar.</option>
              <option value="4">Apr.</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">Aug.</option>
              <option value="9">Sept.</option>
              <option value="10">Oct.</option>
              <option value="11">Nov.</option>
              <option value="12">Dec.</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label
              className="text-[#333333] text-base font-[700]"
              htmlFor="psd-year"
            >
              Year
            </label>
            <select className="inputStyles w-[108px]">
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
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
