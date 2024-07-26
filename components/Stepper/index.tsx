/* eslint-disable jsx-a11y/anchor-is-valid */
// import PropTypes from "prop-types";
import React from 'react'
import { Button } from '../Forms/Button'

export function Stepper(props) {
  return (
    <div className="pt-3 pb-6 sm:pb-40">
      <div className="px-4">
        <h1 className="sm:pb-12 pb-9">
          <div className="text-[22px] leading-[33px] text-[#666666] font-display font-normal">
            {props.name}
          </div>
          <div className="heading1 pb-2">
            {props.step}: {props.heading}
          </div>
        </h1>
        {props.children}
        <div className="flex justify-between pt-14 sm:justify-start sm:pt-12">
          {props.previousProps && (
            <div className="mr-9">
              <Button
                id={props.previousProps?.id}
                text={props.previousProps?.text}
                style="primary"
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
                style="secondary"
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
