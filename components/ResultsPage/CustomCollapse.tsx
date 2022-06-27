export const CustomCollapse = (props) => {
  const { id, title, children } = props
  return (
    <details
      key={id}
      id={id}
      className="my-6 text-h6 border-none"
      data-testid={`${id}-${props.dataTestId}`}
    >
      <summary
        key={`summary-${id}`}
        className="border-none pl-0 ds-text-multi-blue-blue70b ds-underline ds-py-5px ds-cursor-pointer ds-select-none"
      >
        {title}
      </summary>
      <div className="border-none">{children}</div>
    </details>
  )
}
