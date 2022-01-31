import Link from 'next/link'
import { Dispatch } from 'react'

export const ContactCTA: React.VFC<{ setSelectedTab: Dispatch<any> }> = ({
  setSelectedTab,
}) => (
  <>
    <p className="!mt-6 !md:mt-8">
      For a more accurate assessment, you are encouraged to{' '}
      <Link
        href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html"
        passHref
      >
        <a className="text-default-text underline">contact Service Canada</a>
      </Link>{' '}
      and check out the{' '}
      <span
        className="underline text-default-text cursor-pointer"
        onClick={(e) => setSelectedTab(2)}
      >
        FAQ
      </span>{' '}
      on documents you may be required to provide.
    </p>
    <h2 className="h2 mt-8">Next steps</h2>
    <Link
      href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/apply.html"
      passHref
    >
      <a className="btn btn-primary w-96" target="_blank">
        Click here to apply
      </a>
    </Link>
  </>
)
