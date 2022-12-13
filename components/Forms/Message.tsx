import { Message as DSMessage } from '@dts-stn/service-canada-design-system'

interface MessageProps {
  id: string
  alert_icon_id: string
  alert_icon_alt_text: string
  type: 'warning' | 'info' | 'success' | 'danger'
  message_heading: string
  message_body: string | React.ReactNode | React.ReactNode[]
  asHtml?: boolean
  whiteBG?: boolean
}

export const Message: React.VFC<MessageProps> = ({
  id,
  alert_icon_id,
  alert_icon_alt_text,
  type,
  message_heading,
  message_body,
  asHtml,
  whiteBG,
}) => {
  return (
    <div className={`msg-container border-${type}`}>
      <DSMessage
        id={id}
        alert_icon_id={alert_icon_id}
        alert_icon_alt_text={alert_icon_alt_text}
        type={type}
        message_heading={message_heading}
        message_body={message_body}
        asHtml={asHtml}
        whiteBG={whiteBG}
      />
    </div>
  )
}
