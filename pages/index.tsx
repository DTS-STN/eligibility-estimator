import { Button } from '../components/Forms/Button'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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

  const [isCanadaDotCa, setIsCanadaDotCa] = useState(false)

  useEffect(() => {
    if (typeof window !== undefined) {
      const hostName = window.location.hostname
      setIsCanadaDotCa(hostName.includes('.canada.ca'))
    }
  }, [])

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

        <meta property="og:title" content={tsln.introPageTitle} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={
            isCanadaDotCa
              ? `https://estimateursv-oasestimator.service.canada.ca/${tsln._language}`
              : `https://ep-be.alpha.service.canada.ca/${tsln._language}`
          }
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
        <div className="mt-18 sm:w-[65%]">
          <p
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: tsln.homePageP1 }}
          />
          <h2 className="text-xs sm:h2 xs:mt-8 sm:mt-14 mb-2">
            {tsln.headerWhatToKnow}
          </h2>
          <p className="xs:mt-4 sm:mt-12 mb-4">{tsln.legaCitizenlText}</p>
          <p className="xs:mt-4 sm:mt-12">
            {tsln.estimatorIncludeQuestionText}
          </p>
          <ul
            id="information-list"
            className="list-disc list-outside ml-5 xs:pr-3 w-full"
          >
            <li dangerouslySetInnerHTML={{ __html: tsln.ageText }} />
            <li dangerouslySetInnerHTML={{ __html: tsln.netIncomeText }} />
            <li
              dangerouslySetInnerHTML={{ __html: tsln.residenceHistoryText }}
            />
            <li dangerouslySetInnerHTML={{ __html: tsln.maritalStatusText }} />
            <li dangerouslySetInnerHTML={{ __html: tsln.partnerText }} />
          </ul>

          <p className="mt-8 sm:mt-8">{tsln.estimatorTimeEstimate}</p>
          <p
            className="mt-8 sm:mt-8"
            dangerouslySetInnerHTML={{ __html: tsln.overviewDisclaimer }}
          />

          <div className="flex justify-start mt-8 sm:mt-12">
            <Button
              text={tsln.startBenefitsEstimator}
              style="primary"
              onClick={(e) => {
                router.push('/questions')
              }}
              custom="w-auto justify-center mb-4"
              attributes={{
                [AA_CUSTOMCLICK]: `${AA_BUTTON_CLICK_ATTRIBUTE}:${tsln.startBenefitsEstimator}`,
              }}
            />
          </div>

          <h2 className="text-xs sm:h2 mt-8">{tsln.aboutResultText}</h2>

          <div className="w-full mt-4">
            <p dangerouslySetInnerHTML={{ __html: tsln.inflationInfo }}></p>
            <p
              className="summary-link mt-8"
              dangerouslySetInnerHTML={{ __html: tsln.resultDefinition }}
            />

            <p className="mt-8">{tsln.notIncludeCPP}</p>
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.learnMoreAboutCpp }}
            />
          </div>

          <h2 className="text-xs sm:h2 mt-8">{tsln.privacyHeading}</h2>

          <div className="w-full mt-4">
            <p
              className="summary-link"
              dangerouslySetInnerHTML={{ __html: tsln.privacyDefinition }}
            />
            <details
              className="text-h6 border border-[#dddddd] rounded mb-1 mt-3"
              data-testid={`tooltip-shared`}
            >
              <summary
                key={`summary-shared`}
                className="text-[#295376] pt-2 pb-3 px-4 ds-cursor-pointer ds-select-none hover:text-[#0535D2]"
              >
                <span
                  className="hover:underline"
                  dangerouslySetInnerHTML={{ __html: tsln.usingSharedDevice }}
                  data-gc-analytics-customclick={`${AA_BUTTON_CLICK_ATTRIBUTE}: shared`}
                />
              </summary>
              <div
                className="ds-z-1 my-3 pl-6 text-multi-neutrals-grey100 leading-relaxed"
                data-testid="tooltip-text"
                id={`helpText-shared`}
                dangerouslySetInnerHTML={{ __html: tsln.usingSharedDeviceInfo }}
              />
            </details>
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
