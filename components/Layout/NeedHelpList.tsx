export const NeedHelpList: React.VFC<{
  title: string
  links: { label: string; location: string }[]
}> = ({ title, links }) => (
  <div>
    <div className="p-8 bg-[#C8D6DD] rounded">
      <h2 className="h2">{title}</h2>
      <ul className="pl-5 list-disc">
        {links.map(({ label, location }, index) => (
          <li key={index}>
            <a href={location} className="text-default-text underline">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
)
