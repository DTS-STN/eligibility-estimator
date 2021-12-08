export const Select: React.VFC<{
  keyForId: string
  label: string
  options: any[]
}> = ({ keyForId, label, options }) => {
  return (
    <>
      <label htmlFor={keyForId}>{label}</label>
      <select name={keyForId} id={keyForId} className="form-control">
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </>
  )
}
