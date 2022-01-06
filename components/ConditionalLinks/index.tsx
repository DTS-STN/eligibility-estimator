import React from 'react'
import Link from 'next/link'
import type { Link as InfoLink } from '../../utils/api/definitions/types'

export const ConditionalLinks: React.VFC<{ links: InfoLink[] }> = ({
  links,
}) => (
  <>
    <h2 className="h2 mt-8">More Information</h2>
    <ul className="list-disc">
      {links.map((link, index) => (
        <li key={index} className="ml-12 text-default-text underline">
          <Link href={link.url} passHref>
            <a>{link.text}</a>
          </Link>
        </li>
      ))}
    </ul>
  </>
)
