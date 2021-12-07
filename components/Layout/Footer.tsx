import styles from './Footer.module.css'
import Image from 'next/image'

export const Footer = () => (
  <footer className="text-[14px]">
    <div
      className={`w-full h-auto bg-custom-blue-dark ${styles.footerBackground}`}
    >
      <div
        className="py-7 container mx-auto"
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
    <div className="my-8">
      <div className="container mx-auto flex justify-between items-center">
        <nav className="">
          <ul className="flex flex-row list-disc space-x-6">
            <li className="list-none">
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
        </nav>
        <div>
          <Image
            width="200px"
            height="40px"
            src="/wmms-blk.svg"
            alt="Symbol of the Government of Canada"
          />
        </div>
      </div>
    </div>
  </footer>
)
