/* eslint-disable jsx-a11y/anchor-is-valid */
// import PropTypes from "prop-types";
import React from 'react'
import { Button } from '../Forms/Button'

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
  }
  activeStep: number
}

export function Stepper(props: StepperProps) {
  return (
    <div className="pt-3 pb-6 sm:pb-40">
      <div className="px-4">
        <h1 className="sm:pb-8 pb-9">
          <div className="text-[22px] leading-[33px] text-[#666666] font-display font-normal">
            {props.name}
          </div>
          <div className="steps-title pb-2">{props.title}</div>
        </h1>
        {props.children}
        <div className="flex justify-between sm:justify-start  pt-14 sm:pt-12">
          {props.previousProps && props.activeStep !== 1 && (
            <div className="mr-9">
              <Button
                id={props.previousProps?.id}
                text={props.previousProps?.text}
                style="secondary"
                data-testid={props.previousProps?.id}
                // iconAltText={props.previousProps?.iconAltText}
                onClick={props.previousProps?.onClick}
                // styling={props.previousProps?.styling}
              />
            </div>
          )}
          {props.nextProps && (
            <div>
              <Button
                id={props.nextProps?.id}
                text={props.nextProps?.text}
                style="primary"
                data-testid={props.nextProps?.id}
                // iconAltText={props.nextProps?.iconAltText}
                onClick={props.nextProps?.onClick}
                // styling={props.nextProps?.styling}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Stepper.defaultProps = {
  href: '#',
}
