import React from 'react'

export interface QuestionLabelProps {
  name: string
  type: string
  label: string
  helpText?: string
  requiredText?: string
  children?: React.ReactNode
}

export const QuestionLabel: React.FC<QuestionLabelProps> = ({
  name,
  type,
  label,
  requiredText,
  helpText,
  children,
}) => {
  return (
    <div className="mb-2.5">
      <label
        htmlFor={name}
        aria-label={name}
        data-testid={`${type}-label`}
        className="text-content font-bold inline mb-2.5"
      >
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </label>
      {requiredText && <span className="ml-2 font-medium">{requiredText}</span>}
      {children}
      {helpText && (
        <div
          className="ds-font-body ds-text-lg ds-leading-22px ds-font-medium ds-text-multi-neutrals-grey90a ds-mb-4"
          dangerouslySetInnerHTML={{ __html: helpText }}
        />
      )}
    </div>
  )
}
