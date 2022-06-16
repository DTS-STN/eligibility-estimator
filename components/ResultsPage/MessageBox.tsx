import { Link as DSLink } from '@dts-stn/decd-design-system'
import Image from 'next/image'
import React from 'react'

export const MessageBox: React.VFC<{
  title: string
  eligible: boolean
  eligibleText: string
  children: React.ReactNode
  links: Array<{ icon: string; url: string; text: string; alt: string }>
}> = ({ title, eligible, eligibleText, children, links }) => {
  const eligibleFlag = (
    <span
      className={`p-1 ml-2 border-left border-l-4 font-semibold text-small ${
        eligible
          ? ' border-success bg-[#D8EECA] '
          : ' border-[#EE7100] bg-[#F9F4D4] '
      }`}
    >
      {' '}
      {eligibleText}{' '}
    </span>
  )

  return (
    <div className="my-6 py-6 px-8 border border-[#6F6F6F] rounded">
      <h3 className="h4">
        {title} {eligibleFlag}{' '}
      </h3>

      <div
        className={`${eligible ? '' : 'bg-[#F9F4D4] font-semibold'} py-1 px-10`}
      >
        {' '}
        {children}{' '}
      </div>

      {links &&
        links.map(({ text, url, icon, alt }, index) => (
          <div
            key={index}
            className="pt-4 mt-4 grid grid-cols-8 text-content w-1/2"
          >
            <div className="col-span-1" key={index}>
              {icon === 'info' ? (
                <Image src="/info.png" alt={alt} width="30" height="44" />
              ) : (
                ''
              )}
              {icon === 'link' ? (
                <Image src="/link.png" alt={alt} width="30" height="44" />
              ) : (
                ''
              )}
              {icon === 'note' ? (
                <Image src="/note.png" alt={alt} width="30" height="44" />
              ) : (
                ''
              )}
            </div>
            <div className="col-span-7">
              <DSLink id={`link${index}`} href={url} text={text} />
            </div>
          </div>
        ))}
    </div>
  )
}
