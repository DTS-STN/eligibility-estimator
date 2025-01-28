export const CustomCollapse = (props) => {
  const { id, title, children, datacy } = props
  return (
    <details
      key={id}
      id={id}
      className="my-6 text-h6 bg-white border"
      data-testid={`${id}-${props.dataTestId}`}
      data-cy={datacy}
    >
      <summary
        key={`summary-${id}`}
        className="border-none pl-0 text-multi-blue-blue70b mb-[15px] cursor-pointer select-none"
      >
        <span
          className="ml-[15px] underline"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </summary>
      <div className="border p-4">{children}</div>
    </details>
  )
}
