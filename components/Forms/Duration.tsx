import { FC, InputHTMLAttributes } from 'react'
import { QuestionLabel } from './QuestionLabel'

interface DurationProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  helpText?: string
  baseOnChange: (newValue: string) => void
  requiredText?: string
  error?: string
}

const Duration: FC<DurationProps> = ({
  name,
  label,
  helpText,
  baseOnChange,
  requiredText,
  error,
}) => {
  return (
    <fieldset>
      <legend>
        <QuestionLabel
          name={name}
          type="date"
          label={label}
          requiredText={requiredText}
          helpText={helpText}
          fieldId={`enter-${name}`}
        />
      </legend>
      <div>TEST</div>
    </fieldset>
  )
}

export default Duration
