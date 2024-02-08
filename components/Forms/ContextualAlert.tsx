/* eslint-disable @next/next/no-img-element */

interface ContextualAlertProps {
  id: string
  heading: string
  body: Body
  type: AlertType
  iconId: string
  iconAltText: string
  asHtml?: boolean
}

type AlertType = 'warning' | 'info' | 'success' | 'danger'
type Body = string | React.ReactElement | React.ReactElement[]

const ALERT_MAPPINGS = {
  warning: {
    img: '/warning_img.svg',
    color: '#EE7100',
  },
  danger: {
    img: '/danger_img.svg',
    color: '#BC3331',
  },
  info: {
    img: '/info_img.svg',
    color: '#269ABC',
  },
  success: {
    img: '/success_img.svg',
    color: '#278400',
  },
}

export const ContextualAlert: React.FC<ContextualAlertProps> = ({
  id,
  heading,
  body,
  type,
  iconId,
  iconAltText,
  asHtml,
}) => {
  const alertType = ALERT_MAPPINGS[type].img
  const alertColor = ALERT_MAPPINGS[type].color

  const headingClass =
    'font-header-gc font-[700] text-[24px] leading-[26px] text-[#333333]'
  const bodyClass =
    'font-sans font-[400] text-[20px] leading-[33px] text-[#333333] pt-2'

  return (
    <div id={id} className="relative min-w-290px ml-[24px]">
      <div className="absolute top-3.5 -left-2.5 bg-white py-1">
        <img
          id={iconId}
          src={alertType}
          alt={iconAltText}
          className="h-6 w-6"
        />
      </div>
      <div
        style={{ borderColor: alertColor }}
        className={`overflow-auto border-l-4 pl-[24px] py-[16px] leading-8`}
      >
        {asHtml ? (
          <h2
            className={headingClass}
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        ) : (
          <h2 className={headingClass}>{heading}</h2>
        )}
        {asHtml && typeof body === 'string' ? (
          <div
            className={bodyClass}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <div className={bodyClass}>{body}</div>
        )}
      </div>
    </div>
  )
}
