import React from 'react'
import { TooltipTranslation } from '../../i18n/tooltips'
import { Tooltip } from '../Tooltip/tooltip'

export interface QuestionLabelProps {
  name: string
  type: string
  label: string
  helpText?: string
  requiredText?: string
  fieldId?: string
  dynamicContent?: TooltipTranslation
}

export const QuestionLabel: React.FC<QuestionLabelProps> = ({
  name,
  type,
  label,
  requiredText,
  helpText,
  fieldId,
  dynamicContent,
}) => {
  return (
    <>
      <label
        htmlFor={fieldId}
        data-testid={`${type}-label`}
        className="font-bold block mb-2 mr-2"
      >
        <span dangerouslySetInnerHTML={{ __html: label }} />
        &nbsp;
        {requiredText && (
          <span className="font-medium ml-2">{requiredText}</span>
        )}
      </label>
      <Tooltip field={name} dynamicContent={dynamicContent} />
      {helpText && (
        <div
          id={fieldId && `help-text-${fieldId}`}
          className="font-body block text-lg font-medium text-multi-neutrals-grey90a mb-4"
          dangerouslySetInnerHTML={{ __html: helpText }}
        />
      )}
    </>
  )
}
