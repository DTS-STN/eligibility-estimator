import { Button } from '@dts-stn/decd-design-system'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from '../components/Hooks'
import { Layout } from '../components/Layout'
import { WebTranslations } from '../i18n/web'
import { sendAnalyticsRequest } from '../utils/web/helpers/utils'

const Home: NextPage = () => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    // only run on mount on the client
    if (typeof window !== undefined) {
      const win = window as Window &
        typeof globalThis & { adobeDataLayer: any; _satellite: any }
      const lang = tsln.langLong
      const creator = tsln.creator
      const title = lang + '-sc labs-eligibility estimator-home'

      sendAnalyticsRequest(lang, title, creator, win)
    }
  })

  return (
    <>
      <Layout>
        <div className="mt-18">
          <p
            className="mb-4 md:w-3/5"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP1 }}
          />
          <h2 className="text-xs sm:h2 xs:mt-6 sm:mt-14 mb-2">
            {tsln.homePageHeader1}
          </h2>
          <p className="my-2">{tsln.youMayBeEligible}</p>
          {/* <p
            className="my-6"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP3 }}
          /> */}
          <div className="md:w-1/2 h-35 sm:h-20 bg-light-green py-2 px-8">
            <div className="flex">
              <img
                className="xs:mt-2 xs:h-5"
                src="/green-check-mark.svg"
                alt={'green check mark'}
              />
              <p className="ml-2">{tsln.atleast60}</p>
            </div>
            <div className="flex">
              <img
                className="xs:mt-2 xs:h-5"
                src="/green-check-mark.svg"
                alt={'green check mark'}
              />
              <p className="ml-2">{tsln.haveNetIncomeLess}</p>
            </div>
          </div>
          <h2 className="text-xs sm:h2 xs:mt-8 sm:mt-14 mb-2">
            {tsln.headerWhatToKnow}
          </h2>
          <p className="mt-3 mb-8 font-bold  md:w-3/5">{tsln.pleaseNodeText}</p>
          <p className="">{tsln.estimatorIncludeQuestionText}</p>
          <ul
            id="information-list"
            className="list-disc list-outside ml-5 w-full sm:w-3/5"
          >
            <li dangerouslySetInnerHTML={{ __html: tsln.ageText }} />
            <li dangerouslySetInnerHTML={{ __html: tsln.netIncomeText }} />
            <li dangerouslySetInnerHTML={{ __html: tsln.legalStatusText }} />
            <li
              dangerouslySetInnerHTML={{ __html: tsln.residenceHistoryText }}
            />
            <li dangerouslySetInnerHTML={{ __html: tsln.maritalStatusText }} />
            <li dangerouslySetInnerHTML={{ __html: tsln.partnerText }} />
          </ul>

          <h2 className="text-xs sm:h2 mt-8 sm:mt-12 mb-2">
            {tsln.timeToCompleteText}
          </h2>
          <p className="sm:w-3/5">{tsln.estimatorTake5mins}</p>

          <div className="flex justify-start mt-8 sm:mt-12">
            <Button
              text={tsln.startBenefitsEstimator}
              styling="supertask"
              onClick={(e) => router.push('/eligibility')}
              className=" w-auto justify-center"
            />
          </div>
          <h2 className="text-xs font-bold sm:h2 mt-12 sm:mt-16 mb-2">
            {tsln.whatBenefitsTheEstimatorIsFor}
          </h2>

          <div className="w-full sm:w-3/5">
            <h3 className="h3 mt-3 mb-2">{tsln.oas}</h3>
            <p>{tsln.benefitAvailable}</p>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{
                __html: tsln.learnMoreAboutOldAgeSecurity,
              }}
            />

            <h3 className="h3 mt-6 mb-2">{tsln.gis}</h3>
            <p>{tsln.gisDefinationText}</p>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.learnMoreAboutGIS }}
            />

            <h3 className="h3 mt-6 mb-2">{tsln.alw}</h3>
            <p>{tsln.alwDefinationText}</p>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.learnMoreAboutAlw }}
            />

            <h3 className="h3 mt-6 mb-2">{tsln.afs}</h3>
            <p>{tsln.afsDefinationText}</p>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.learnMoreAboutAfs }}
            />

            <p className="mt-8">{tsln.notIncludeCPP}</p>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.learnMoreAboutCpp }}
            />

            <h2 className="text-xs sm:h2 mt-12 mb-2">{tsln.aboutResultText}</h2>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.resultDefination }}
            />

            <h2 className="text-xs sm:h2 mt-12 mb-2">{tsln.privacyHeading}</h2>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.privacyDefination }}
            />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Home
