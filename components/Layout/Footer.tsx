import Image from 'next/image'
import styles from './Footer.module.css'

export const Footer = () => (
  <footer className="text-[14px]">
    <div
      className={`w-full h-auto bg-custom-blue-dark px-4 py-8 ${styles.footerBackground}`}
    >
      <div
        className="py-7 sm:container mx-auto"
        role="navigation"
        aria-labelledby="footerNav1"
      >
        <h3 className="sr-only" id="footerNav1">
          About government
        </h3>
        <ul className="flex flex-col text-xs lg:grid lg:grid-cols-2 xl:grid xl:grid-cols-3 lg:gap-1">
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              Contact us
            </a>
          </li>
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              News
            </a>
          </li>
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              Prime Minister
            </a>
          </li>
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              Departments and agencies
            </a>
          </li>
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              Treaties, laws and regulations
            </a>
          </li>
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              How government works
            </a>
          </li>
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              Public service and military
            </a>
          </li>
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              Government-wide reporting
            </a>
          </li>
          <li className="text-white w-64 md:w-56 lg:w-80 my-2.5 hover:underline">
            <a className="font-body" href="#">
              Open government
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="flex justify-between px-4 py-8 sm:container mx-auto">
      <ul className="flex flex-col md:flex-row md:space-x-6 list-disc px-4">
        <li>
          <a href="#">Social media</a>
        </li>

        <li>
          <a href="#">Mobile applications</a>
        </li>

        <li>
          <a href="#">About Canada.ca</a>
        </li>

        <li>
          <a href="#">Terms and conditions</a>
        </li>

        <li>
          <a href="#">Privacy</a>
        </li>
      </ul>
      <div className="hidden md:block">
        <Image
          width="200px"
          height="40px"
          src="/wmms-blk.svg"
          alt="Symbol of the Government of Canada"
        />
      </div>
    </div>
    <div className="flex justify-between">
      <div className="flex items-center md:hidden py-8 md:pt-0">
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
      </div>
      <div className="flex items-center px-4 md:hidden">
        <Image
          width="135px"
          height="45px"
          src="/wmms-blk.svg"
          alt="Symbol of the Government of Canada"
        />
      </div>
    </div>
  </footer>
)
