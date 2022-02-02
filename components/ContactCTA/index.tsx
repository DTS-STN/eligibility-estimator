import Link from 'next/link'
import { Dispatch } from 'react'
import { useStore, useTranslation } from '../Hooks'

export const ContactCTA: React.VFC<{ setSelectedTab: Dispatch<any> }> = ({
  setSelectedTab,
}) => {
  const root = useStore()
  const contactCTA = useTranslation<string>('contactCTA')
  return (
    <>
      <p className="!mt-6 !md:mt-8">
        For a more accurate assessment, you are encouraged to contact{' '}
        <Link
          href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html"
          passHref
        >
          <a className="text-default-text underline">Service Canada</a>
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
      {root.summary?.nextStepsLink?.url && (
        <>
          <h2 className="h2 mt-8">Next steps</h2>
          <Link href={root.summary.nextStepsLink.url} passHref>
            <a className="btn btn-primary w-96" target="_blank">
              {root.summary.nextStepsLink.text}
            </a>
          </Link>
        </>
      )}
    </>
  )
}
