import React from 'react'
import { TooltipTranslation } from '../../i18n/tooltips'
import { Tooltip } from '../Tooltip/tooltip'

export interface QuestionLabelProps {
  name: string
  id?: string
  type: string
  label: string
  helpText?: string
  requiredText?: string
  fieldId?: string
  dynamicContent?: TooltipTranslation
}

export const QuestionLabel: React.FC<QuestionLabelProps> = ({
  name,
  id,
  type,
  label,
  requiredText,
  helpText,
  fieldId,
  dynamicContent,
}) => {
  console.log('name', name)
  console.log('id', id)
  console.log('type', type)
  console.log('label', label)
  console.log('requiredText', requiredText)
  console.log('helpText', helpText)
  console.log('fieldId', fieldId)
  console.log('dynamicContent', dynamicContent)
  return (
    <>
      <label
        id={id}
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
