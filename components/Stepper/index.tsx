/* eslint-disable jsx-a11y/anchor-is-valid */
// import PropTypes from "prop-types";
import React from 'react'
import { WebTranslations } from '../../i18n/web'
import { Button } from '../Forms/Button'
import { useTranslation } from '../Hooks'

// Stepper props
export interface StepperProps {
  id: string
  name: string
  title: string
  children: React.ReactNode
  previousProps?: {
    id: string
    text: string
    onClick: () => void
  }
  nextProps?: {
    id: string
    text: string
    onClick: () => void
    buttonAttributes: Object
  }
  activeStep: number
}

export function Stepper(props: StepperProps) {
  const tsln = useTranslation<WebTranslations>()
  return (
    <div className="pt-3 pb-6 sm:pb-40">
      <div>
        <div className="sm:pb-8 pb-4">
          <div className="text-[22px] leading-relaxed text-[#666666] font-header-gc font-normal">
            {props.name}
          </div>
          <h1 className="steps-title pb-2">{props.title}</h1>
        </div>
        {props.children}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4 pt-14 sm:pt-12">
          {props.previousProps && props.activeStep !== 1 && (
            <div className="mr-9 flex-shrink-0 w-auto">
              <Button
                id={props.previousProps?.id}
                text={props.previousProps?.text}
                style="secondary"
                data-testid={props.previousProps?.id}
                onClick={props.previousProps?.onClick}
                custom="w-auto"
              />
            </div>
          )}
          {props.nextProps && (
            <div className="flex-shrink-0 w-auto">
              <Button
                id={props.nextProps?.id}
                text={props.nextProps?.text}
                style="primary"
                data-testid={props.nextProps?.id}
                onClick={props.nextProps?.onClick}
                attributes={props.nextProps?.buttonAttributes}
                custom="w-auto"
              />
            </div>
          )}
        </div>
        {props.activeStep === 1 && (
          <p
            dangerouslySetInnerHTML={{ __html: tsln.stepper.navWarning }}
            className="mt-[24px]"
          ></p>
        )}
      </div>
    </div>
  )
}
