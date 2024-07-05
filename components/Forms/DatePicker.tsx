import React, { useEffect } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import { Error } from './Error'

interface DatePickerProps {
  id?: string
  yearId?: string
  monthId?: string
  dayId?: string
  lang: string
  onMonthChange: React.ChangeEventHandler<HTMLSelectElement>
  onDayChange?: Function
  onYearChange?: Function
  hasDay?: Boolean
  hasYear?: Boolean
  day?: number
  month?: number
  year?: number
  maxDay?: number
  minYear?: number
  maxYear?: number
  hasLabel?: Boolean
  hasError?: Boolean
  labelProps?: FormLabelProps
  errorProps?: FormErrorProps
}

interface FormLabelProps {
  id?: string
  label: string
  required?: boolean
  infoText?: string
  helpText?: string
}

interface FormErrorProps {
  id?: string
  errorMessage: string
}

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  const tsln = useTranslation<WebTranslations>()
  const restrictNonNumbers = (e) => {
    const matcher = new RegExp(/[\D]/g)
    e.target.value = e.target.value.replaceAll(matcher, '')
  }
  const maxLength = (e) => {
    e.target.value =
      e.target.value.length > 4 ? e.target.value.slice(0, 4) : e.target.value
  }

  const monthValues = Array.from({ length: 12 }, (_, i) => (i + 1).toString())

  const _onDayChange = (e) => {
    restrictNonNumbers(e)
    props.onDayChange(e)
  }

  const _onYearChange = (e) => {
    restrictNonNumbers(e)
    maxLength(e)
    props.onYearChange(e)
  }

  useEffect(() => {
    // blur the input element on scroll instead of changing the value! Does not affect Keyboard input.
    const handleScroll = () => {
      const el = document.activeElement as HTMLInputElement
      if (el?.type === 'number') {
        el.blur()
      }
    }

    document.addEventListener('wheel', handleScroll)

    // remove event listener when component unmounts
    return () => document.removeEventListener('wheel', handleScroll)
  }, [])

  return (
    <>
      <div id={props.id} className="datePicker relative flex flex-wrap mt-2">
        <div className="flex flex-col">
          <label
            className="text-[#333333] font-medium text-[20px] leading-[22px]"
            htmlFor={props.monthId}
          >
            {tsln.datePicker.month}
          </label>
          <select
            id={props.monthId}
            defaultValue={props.month}
            onChange={props.onMonthChange}
            className="inputStyles"
          >
            {monthValues.map((mv, index) => (
              <option value={mv} key={`datePicker-month-option-${index}`}>
                {tsln.datePicker.months[mv]}
              </option>
            ))}
          </select>
        </div>
        {props.hasDay ? (
          <div className="flex flex-col sm:pl-24px pl-8px">
            <label htmlFor={props.dayId} className="form-date">
              {tsln.datePicker.day}
            </label>
            <input
              id={props.dayId}
              defaultValue={props.day}
              type="number"
              min={'1'}
              max={props.maxDay}
              onChange={_onDayChange}
              className="inputStyles"
            />
          </div>
        ) : null}
        {props.hasYear ? (
          <div className="flex flex-col sm:pl-24px pl-8px">
            <label
              htmlFor={props.yearId}
              className="text-[#333333] font-medium text-[20px] leading-[22px]"
            >
              {tsln.datePicker.year}
            </label>
            <input
              id={props.yearId}
              defaultValue={props.year}
              type="number"
              min={props.minYear}
              max={props.maxYear}
              pattern="[0-9]*"
              onChange={_onYearChange}
              onKeyUpCapture={restrictNonNumbers}
              className="inputStyles"
            />
          </div>
        ) : null}
      </div>
      {props.hasError ? (
        <Error errorMessage={props.errorProps.errorMessage} />
      ) : null}
    </>
  )
}
