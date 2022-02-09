import Image from 'next/image'
import Link from 'next/link'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'
import styles from './Footer.module.css'

export const Footer = () => {
  const tsln = useTranslation<WebTranslations>()
  return (
    <footer className="text-[14px]">
      <div
        className={`w-full h-auto px-4 py-8 bg-custom-blue-dark ${styles.footerBackground}`}
      >
        <div
          className="sm:container mx-auto"
          role="navigation"
          aria-labelledby="footerNav1"
        >
          <h3 className="sr-only" id="footerNav1">
            {tsln.footerlink8}
          </h3>
          <ul className="flex flex-col text-xs md:grid md:grid-cols-3 md:gap-1">
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink1}
              </a>
            </li>
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink6}
              </a>
            </li>
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink2}
              </a>
            </li>
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink7}
              </a>
            </li>
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink3}
              </a>
            </li>
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink8}
              </a>
            </li>
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink4}
              </a>
            </li>
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink9}
              </a>
            </li>
            <li className="text-white w-64 md:w-56 lg:w-80 hover:underline">
              <a className="font-body" href="#">
                {tsln.footerlink5}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between px-4 py-8 sm:container mx-auto">
        <ul className="flex flex-col md:flex-row md:space-x-6 list-disc px-4 text-[#284162]">
          <li className="md:list-none">
            <a href="#">{tsln.socialLink1}</a>
          </li>
          <li>
            <a href="#">{tsln.socialLink2}</a>
          </li>
          <li>
            <a href="#">{tsln.socialLink3}</a>
          </li>
          <li>
            <a href="#">{tsln.socialLink4}</a>
          </li>
          <li>
            <a href="#">{tsln.socialLink5}</a>
          </li>
        </ul>
        <div className="hidden md:block">
          <Image
            width="200px"
            height="40px"
            src="/wmms-blk.svg"
            alt={tsln.govt}
          />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="md:hidden py-8 md:pt-0">
          <Link href="#elig" passHref>
            <a className="flex items-center">
              <p className="px-4">Top of page</p>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </span>
            </a>
          </Link>
        </div>
        <div className="flex items-center px-4 md:hidden">
          <Image
            width="135px"
            height="45px"
            src="/wmms-blk.svg"
            alt={tsln.govt}
          />
        </div>
      </div>
    </footer>
  )
}
