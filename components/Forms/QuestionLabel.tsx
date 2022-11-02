import React from 'react'

export interface QuestionLabelProps {
  name: string
  label: string
  helpText?: string
  requiredText?: string
}

export const QuestionLabel: React.FC<QuestionLabelProps> = ({
  name,
  label,
  requiredText,
  helpText,
}) => {
  return (
    <div className="mb-2.5">
      <label
        htmlFor={name}
        aria-label={name}
        data-testid="number-input-label"
        className="text-content font-bold inline mb-2.5"
      >
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </label>
      {requiredText && <span className="ml-2 font-medium">{requiredText}</span>}
      {helpText && (
        <div
          className="ds-font-body ds-text-lg ds-leading-22px ds-font-medium ds-text-multi-neutrals-grey90a ds-mb-4"
          dangerouslySetInnerHTML={{ __html: helpText }}
        />
      )}
    </div>
  )
}
