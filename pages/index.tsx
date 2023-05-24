import { Button } from '@dts-stn/service-canada-design-system'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useTranslation } from '../components/Hooks'
import { Layout } from '../components/Layout'
import { WebTranslations } from '../i18n/web'
import Head from 'next/head'
import { consoleDev } from '../utils/web/helpers/utils'

const AA_CUSTOMCLICK = 'data-gc-analytics-customclick'
const AA_BUTTON_CLICK_ATTRIBUTE =
  'ESDC-EDSC:Canadian OAS Benefits Est. Button Click'

const Home: NextPage<{ adobeAnalyticsUrl: string }> = ({
  adobeAnalyticsUrl,
}) => {
  const router = useRouter()
  const tsln = useTranslation<WebTranslations>()

  useEffect(() => {
    if (adobeAnalyticsUrl) {
      window.adobeDataLayer = window.adobeDataLayer || []
      window.adobeDataLayer.push({ event: 'pageLoad' })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        {adobeAnalyticsUrl ? <script src={adobeAnalyticsUrl} /> : ''}

        <meta name="description" content={tsln.meta.homeDescription} />
        <meta name="dcterms.description" content={tsln.meta.homeDescription} />

        <meta name="dcterms.accessRights" content="2" />
        <meta name="dcterms.service" content="ESDC-EDSC_DC-CD" />

        <meta property="og:title" content={tsln.introPageTitle} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://ep-be.alpha.service.canada.ca/${tsln._language}`}
        />
        <meta
          property="og:image"
          content="https://www.canada.ca/content/dam/decd-endc/images/sclabs/oas-benefits-estimator/overview.jpg"
        />
        <meta property="og:image:alt" content=" " />
        <meta
          property="og:description"
          content={tsln.meta.homeShortDescription}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tsln.introPageTitle} />
        <meta
          name="twitter:image"
          content="https://www.canada.ca/content/dam/decd-endc/images/sclabs/oas-benefits-estimator/overview.jpg"
        />
        <meta name="twitter:image:alt" content=" " />
        <meta
          name="twitter:description"
          content={tsln.meta.homeShortDescription}
        />
      </Head>
      <Layout title={tsln.introPageTitle}>
        <div className="mt-18">
          <p
            className="mb-4 sm:w-[65%]"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP1 }}
          />
          <h2 className="text-xs sm:h2 xs:mt-6 sm:mt-14 mb-2">
            {tsln.homePageHeader1}
          </h2>
          <p className="my-2">{tsln.youMayBeEligible}</p>
          <div className="inline-block sm:w-[500px] bg-light-green py-4 px-8">
            <div className="flex items-start mb-4">
              <div className="flex-none w-8 h-8">
                <Image
                  src="/green-check-mark.svg"
                  alt=""
                  height={30}
                  width={30}
                  layout="fixed"
                />
              </div>
              <p className="ml-2 grow">{tsln.atLeast60}</p>
            </div>
            <div className="flex items-start">
              <div className="flex-none w-8 h-8">
                <Image
                  src="/green-check-mark.svg"
                  alt=""
                  height={30}
                  width={30}
                  layout="fixed"
                />
              </div>
              <p className="ml-2 grow">{tsln.haveNetIncomeLess}</p>
            </div>
          </div>
          <h2 className="text-xs sm:h2 xs:mt-8 sm:mt-14 mb-2">
            {tsln.headerWhatToKnow}
          </h2>
          <p className="">{tsln.estimatorIncludeQuestionText}</p>
          <ul
            id="information-list"
            className="list-disc list-outside ml-5 xs:pr-3 w-full sm:w-3/5"
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
          <p className="xs:mt-4 sm:mt-12 xs:pr-3 w-full sm:w-[73%]">
            {tsln.youNeedEndingText}
          </p>
          <h2 className="text-xs sm:h2 mt-8 sm:mt-12 mb-2">
            {tsln.timeToCompleteText}
          </h2>
          <p className="sm:w-3/5">{tsln.estimatorTimeEstimate}</p>

          <div className="flex justify-start mt-8 sm:mt-12">
            <Button
              text={tsln.startBenefitsEstimator}
              styling="supertask"
              onClick={(e) => router.push('/eligibility')}
              className=" w-auto justify-center"
              attributes={{
                [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.startBenefitsEstimator}`,
              }}
            />
          </div>
          <h2 className="text-xs font-bold sm:h2 mt-12 sm:mt-16 mb-2">
            {tsln.whatBenefitsIncluded}
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
            <p>{tsln.gisDefinitionText}</p>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.learnMoreAboutGis }}
            />

            <h3 className="h3 mt-6 mb-2">{tsln.alw}</h3>
            <p>{tsln.alwDefinitionText}</p>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.learnMoreAboutAlw }}
            />

            <h3 className="h3 mt-6 mb-2">{tsln.afs}</h3>
            <p>{tsln.afsDefinitionText}</p>
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
            <p>{tsln.inflationInfo}</p>
            <p
              className="summary-link mt-8"
              dangerouslySetInnerHTML={{ __html: tsln.resultDefinition }}
            />

            <h2 className="text-xs sm:h2 mt-12 mb-2">{tsln.privacyHeading}</h2>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.privacyDefinition }}
            />
          </div>
        </div>
      </Layout>
      {adobeAnalyticsUrl ? (
        <script type="text/javascript">_satellite.pageBottom()</script>
      ) : (
        ''
      )}
    </>
  )
}

export const getStaticProps = async () => {
  consoleDev(
    'process.env.ADOBE_ANALYTICS_URL',
    process.env.ADOBE_ANALYTICS_URL
      ? process.env.ADOBE_ANALYTICS_URL.substring(0, 27)
      : 'not loaded'
  )

  return {
    props: {
      adobeAnalyticsUrl: process.env.ADOBE_ANALYTICS_URL,
    },
  }
}

export default Home
