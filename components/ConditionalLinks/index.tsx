import Link from 'next/link'
import React from 'react'
import type { Link as InfoLink } from '../../utils/api/definitions/types'
import { useTranslation } from '../Hooks'

export const ConditionalLinks: React.VFC<{ links: InfoLink[] }> = ({
  links,
}) => {
  const moreInfo = useTranslation<string>('moreInfoHeader')
  return (
    <>
      <h2 className="h2 mt-8">{moreInfo}</h2>
      <ul className="list-disc !mt-3">
        {links.map((link, index) => (
          <li key={index} className="ml-10 text-default-text underline">
            <Link href={link.url} passHref>
              <a>{link.text}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
