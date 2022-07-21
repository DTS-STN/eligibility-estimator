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
        className="border-none pl-0 ds-text-multi-blue-blue70b mb-[10px] ds-underline ds-cursor-pointer ds-select-none"
      >
        <span className="ml-[5px]">{title}</span>
      </summary>
      <div className="border-none">{children}</div>
    </details>
  )
}
