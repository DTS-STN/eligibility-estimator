import Link from 'next/link'
import { Dispatch } from 'react'

export const ContactCTA: React.VFC<{ setSelectedTab: Dispatch<any> }> = ({
  setSelectedTab,
}) => (
  <p>
    For a more accurate assessment, you are encouraged to{' '}
    <Link
      href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html"
      passHref
    >
      <a className="text-default-text underline">contact Service Canada </a>
    </Link>
    and check out the{' '}
    <span
      className="underline text-default-text cursor-pointer"
      onClick={(e) => setSelectedTab(2)}
    >
      FAQ
    </span>{' '}
    on documents you may be required to provide.
  </p>
)
