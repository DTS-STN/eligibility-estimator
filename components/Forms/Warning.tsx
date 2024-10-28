interface WarningAlertProps {
  id: string
  heading: string
  body: Body
  asHtml?: boolean
}
type Body = string | React.ReactElement | React.ReactElement[]

export const WarningAlert: React.FC<WarningAlertProps> = ({
  id,
  heading,
  body,
  asHtml,
}) => {
  return (
    <div id={id} className="alert-box">
      {asHtml ? (
        <h2
          className="font-header-gc font-[700] text-[25.31px] leading-[32px] text-gray-900"
          dangerouslySetInnerHTML={{ __html: heading }}
        />
      ) : (
        <h2 className="font-header-gc font-[700] text-[25.31px] leading-[32px] text-gray-900">
          {heading}
        </h2>
      )}

      {asHtml && typeof body === 'string' ? (
        <div
          className=" leading-[24px] mt-2"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      ) : (
        <div className=" leading-[24px] mt-2">{body}</div>
      )}
    </div>
  )
}

export default WarningAlert
