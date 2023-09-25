interface DateProps {
  id?: string
  label: string
  date: string
}

export const Date = ({ id, label, date }: DateProps) => {
  const dateFormatted = date ? date.replace(/^(.{4})(.{2})/gm, '$1-$2-') : 'NA'
  return (
    <dl id={id} className="font-[400] text-[16px] leading-[23px]">
      <dt className="inline">{label}</dt>
      <dd className="inline">
        {dateFormatted === 'NA' ? (
          <time>{` ${dateFormatted}`}</time>
        ) : (
          <time dateTime={dateFormatted}>{` ${dateFormatted}`}</time>
        )}
      </dd>
    </dl>
  )
}
