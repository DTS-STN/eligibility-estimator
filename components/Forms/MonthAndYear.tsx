import { DatePicker } from '@dts-stn/service-canada-design-system'
import { debounce } from 'lodash'
import { ChangeEvent, InputHTMLAttributes, useEffect } from 'react'
import { useSessionStorage } from 'react-use'
import { WebTranslations } from '../../i18n/web'
import { BenefitHandler } from '../../utils/api/benefitHandler'
import { useTranslation } from '../Hooks'

export interface MonthAndYearProps
  extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  baseOnChange: (newValue: string) => void
}

type IAgeDateInput = {
  month: string
  year?: string
}

export const MonthAndYear: React.VFC<MonthAndYearProps> = ({
  name,
  label,
  helpText,
  baseOnChange,
}) => {
  const tsln = useTranslation<WebTranslations>()

  const [ageDateInput, setAgeDateInput]: [
    IAgeDateInput,
    (value: IAgeDateInput) => void
  ] = useSessionStorage('ageDateInput', { month: '1' })

  const dateOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const fieldId = e.target.id
    const fieldToSet = fieldId === 'datePickerYear' ? 'year' : 'month'
    setAgeDateInput({ ...ageDateInput, [fieldToSet]: e.target.value })
  }

  useEffect(() => {
    if (ageDateInput.year && ageDateInput.month) {
      baseOnChange(
        String(
          BenefitHandler.calculateAge(
            Number(ageDateInput.month),
            Number(ageDateInput.year)
          )
        )
      )
    }
  }, [ageDateInput])

  return (
    <>
      <DatePicker
        id={name}
        month={Number(ageDateInput.month)}
        year={Number(ageDateInput.year)}
        hasLabel
        // hasError={false}
        hasDay={false}
        formLabelProps={{
          helpText,
          // id: 'requiredWithInfo',
          // infoText:
          //   'Required label style with information icon. You can hide by clicking on icon again.',
          label,
          // required: true,
        }}
        // formErrorProps={{
        //   errorMessage: 'This is how form error will be displayed',
        //   id: 'formErrorId',
        // }}
        // onDayChange={function noRefCheck() {}}
        onMonthChange={dateOnChange}
        onYearChange={debounce(dateOnChange, 500)}
        lang={tsln._language}
        // maxYear={2050}
        // minYear={1999}
      />
    </>
  )
}
