import { FormField } from '../client-state/FormField'
import { FieldType } from '../utils/api/definitions/fields'
import { Radio } from './Forms/Radio'

interface FieldProps {
  field: FormField
  tsln: { required: string }
  handleOnChange: (field: FormField, value: any) => void
}

const FieldFactory: React.FC<FieldProps> = ({
  field,
  tsln,
  handleOnChange,
}) => {
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
    default:
      return null
  }
}

export default FieldFactory
