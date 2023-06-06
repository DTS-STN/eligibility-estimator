import React from 'react'

export interface QuestionLabelProps {
  name: string
  type: string
  label: string
  helpText?: string
  requiredText?: string
  fieldId?: string
}

export const QuestionLabel: React.FC<QuestionLabelProps> = ({
  name,
  type,
  label,
  requiredText,
  helpText,
  fieldId,
}) => {
  return (
    <>
      <label
        htmlFor={fieldId}
        data-testid={`${type}-label`}
        className="text-content font-bold inline mb-2.5 mr-2"
      >
        <span dangerouslySetInnerHTML={{ __html: label }} />
        &nbsp;
        {requiredText && (
          <span className="font-medium ml-2">{requiredText}</span>
        )}
      </label>
      {helpText && (
        <div
          id={fieldId && `help-text-${fieldId}`}
          className="ds-font-body block ds-text-lg ds-font-medium ds-text-multi-neutrals-grey90a ds-mb-4"
          dangerouslySetInnerHTML={{ __html: helpText }}
        />
      )}
    </>
  )
}
