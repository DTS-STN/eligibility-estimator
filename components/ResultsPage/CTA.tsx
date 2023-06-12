import React from 'react'
import { Button } from '@dts-stn/service-canada-design-system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons'
export interface ICTAProps {
  heading: string
  body: string
  ButtonProps: typeof Button.propTypes
  containerClass?: string
}

export function CTA({
  heading,
  body,
  ButtonProps,
  containerClass = '',
}: ICTAProps) {
  return (
    <div className="ds-bg-multi-blue-blue2 ds-p-3" data-testid="ds-cta">
      <div className={`ds-flex ds-flex-row ${containerClass}`}>
        <div className="ds-flex ds-flex-col ds-w-[60px] ds-shrink-0">
          <FontAwesomeIcon
            icon={faPiggyBank}
            className="w-[60px]"
            size="2xl"
            style={{ color: '#2E5274' }}
          />
          <div className="ds-flex-grow ds-divide-x-2 ds-divide-multi-blue-blue60a ds-flex ds-flex-row ds-justify-center ds-mt-3">
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="ds-pt-0 ds-pl-5">
          <h3 className={`ds-heading2 ds-text-multi-neutrals-grey100`}>
            {heading}
          </h3>
          <p className="ds-body">{body}</p>
          <Button
            styling="primary"
            className="ds-my-3"
            type="button"
            {...ButtonProps}
          />
        </div>
      </div>
    </div>
  )
}
