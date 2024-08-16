import { debounce } from 'lodash'
import { FormField } from '../client-state/FormField'
import { FieldKey, FieldType } from '../utils/api/definitions/fields'
import { CurrencyField } from './Forms/CurrencyField'
import Duration from './Forms/Duration'
import { MonthAndYear } from './Forms/MonthAndYear'
import { Radio } from './Forms/Radio'

interface FieldProps {
  field: FormField
  metaData?: { [key: string]: any }
  tsln: { required: string }
  handleOnChange: (field: FormField, value: any) => void
}

const FieldFactory: React.FC<FieldProps> = ({
  field,
  metaData = {},
  tsln,
  handleOnChange,
}) => {
  console.log('field', field.key)
  console.log('metaData', metaData)
  switch (field.config.type) {
    case FieldType.RADIO:
      return (
        <Radio
          name={field.key}
          checkedValue={field.value}
          values={field.config.values}
          keyforid={field.key}
          label={field.config.label}
          requiredText={tsln.required}
          onChange={(e) => handleOnChange(field, e.target.value)}
          helpText={field.config.helpText}
          setValue={(val) => handleOnChange(field, val)}
          error={null}
        />
      )
    // Add cases for other field types here
    case FieldType.DATE:
      return (
        <MonthAndYear
          name={field.key}
          age={field.value}
          label={field.config.label}
          helpText={field.config.helpText}
          baseOnChange={(newValue) => handleOnChange(field, newValue)}
          requiredText={tsln.required}
          error={null} // error={formError}
        />
      )
    case FieldType.DURATION:
      return (
        <Duration
          name={field.key}
          age={field.inputs.age}
          ageDate={metaData.ageDate}
          label={field.config.label}
          helpText={field.config.helpText}
          baseOnChange={(newValue) => handleOnChange(field, newValue)}
          requiredText={tsln.required}
          error={null} // error={formError}
        />
      )
    case FieldType.CURRENCY:
      return (
        <CurrencyField
          type={field.config.type}
          name={field.key}
          label={
            field.key === 'income'
              ? metaData.incomeLabel
              : field.key === 'partnerIncome'
              ? metaData.partnerIncomeLabel
              : field.config.label
          }
          onChange={debounce((e) => handleOnChange(field, e.target.value), 100)}
          placeholder={field.config.placeholder ?? ''}
          value={
            field.key === FieldKey.INCOME_WORK ||
            field.key === FieldKey.PARTNER_INCOME_WORK
              ? field.config.default
              : field.value
          }
          helpText={field.config.helpText}
          requiredText={
            field.key === FieldKey.INCOME ||
            field.key === FieldKey.PARTNER_INCOME
              ? tsln.required
              : ''
          }
          error={null}
          dynamicContent={
            field.key === 'income'
              ? metaData.incomeTooltip
              : field.key === 'partnerIncome'
              ? metaData.partnerIncomeTooltip
              : undefined
          }
        />
      )
    default:
      return null
  }
}

export default FieldFactory
