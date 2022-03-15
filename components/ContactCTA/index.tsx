import Link from 'next/link'
import { WebTranslations } from '../../i18n/web'
import { useStore, useTranslation } from '../Hooks'

export const ContactCTA: React.VFC = () => {
  const root = useStore()
  const tsln = useTranslation<WebTranslations>()

  return (
    <>
      <p
        id="faqLink"
        className="!mt-6 !md:mt-8 summary-link"
        dangerouslySetInnerHTML={{ __html: tsln.contactCTA }}
      />

      {root.summary?.nextStepsLinks && (
        <div className="flex flex-col">
          {root.summary.nextStepsLinks.map((link, index) => (
            <>
              {index == 0 && (
                <>
                  <h2 className="h2">{tsln.applyHeader}</h2>
                  <p>{tsln.applyText}</p>
                </>
              )}
              <Link key={index} href={link.url} passHref>
                <a
                  className="btn btn-primary !mt-5 whitespace-normal md:whitespace-nowrap md:px-8 md:max-w-[400px]"
                  target="_blank"
                  role="navigation"
                  aria-label={`${tsln.applyForLabel} ${link.text}`}
                >
                  {link.text}
                </a>
              </Link>
            </>
          ))}
        </div>
      )}
    </>
  )
}
