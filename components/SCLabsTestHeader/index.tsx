import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const SCLabsTestHeader = () => {
  const tsln = useTranslation<WebTranslations>()
  return (
    <div className="bg-[#063056]">
      <div className="container mx-auto">
        <div className="flex items-center">
          <div className="block lg:flex py-4 text-small md:text-base">
            <div className="flex justify-between lg:block lg:w-max">
              <span
                className="text-white border block w-max px-4 py-1 my-auto leading-6"
                role="alert"
              >
                {tsln.testSiteTitle}
              </span>
            </div>
            <div className="lg:ml-4 xl:ml-8 xxl:ml-12">
              <p className="mt-5 lg:mt-auto text-white lg:ml-4 pt-1 my-auto lg:mb-0 lg:pb-1">
                {tsln.testSiteHeader}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
