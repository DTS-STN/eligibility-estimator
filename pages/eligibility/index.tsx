import { Tab } from '@headlessui/react'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import { Alert } from '../../components/Alert'
import { ConditionalLinks } from '../../components/ConditionalLinks'
import { ContactCTA } from '../../components/ContactCTA'
import { FAQ } from '../../components/FAQ'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { Input } from '../../components/Forms/Input'
import { useStore } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import { NeedHelpList } from '../../components/Layout/NeedHelpList'
import ProgressBar from '../../components/ProgressBar'
import { Tooltip } from '../../components/Tooltip/tooltip'
import {
  EstimationSummaryState,
  ResultKey,
} from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
import { validateIncome } from '../../utils/api/helpers/validator'
import { dataFetcher } from '../../utils/web/helpers/utils'
import { Instance } from 'mobx-state-tree'
import { RootStore, Form } from '../../client-state/store'
import { linearBuckets } from 'prom-client'
import { observer } from 'mobx-react'
import { ResultsTable } from '../../components/ResultsTable'

const Eligibility: NextPage = () => {
  const { query } = useRouter()
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)

  // check if income is too high to participate in calculation
  const incomeTooHigh = query && validateIncome(query.income as string)

  // show progress under certain circumstances
  const showProgress = (() => {
    return !incomeTooHigh
  })()

  // formdata will come from form, going to need a handler function to pass into Component Factory and a useEffect to pull data once the [dependency] changes
  const params = Object.keys(query)
    .map((key) => key + '=' + query[key])
    .join('&')

  const { data, error } = useSWR(
    () => query && `api/calculateEligibility?${params && params}`,
    dataFetcher
  )

  const root: Instance<typeof RootStore> = useStore()

  if (error)
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    )

  if (!data)
    return (
      <Layout>
        <div>Loading form...</div>
      </Layout>
    )

  return (
    <Layout>
      <Tab.Group
        key={selectedTabIndex}
        defaultIndex={selectedTabIndex}
        onChange={(index) => {
          setSelectedTabIndex(index)
        }}
      >
        <Tab.List
          className={`${!showProgress && 'hidden'} border-b border-muted/20`}
        >
          <Tab
            className={({ selected }) =>
              selected
                ? 'bg-white font-semibold p-2.5 pt-1.5 border border-t-4 border-content/90 border-r-muted/20 border-b-muted/20 border-l-muted/20 mr-2'
                : 'bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 mr-2'
            }
          >
            Questions
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? 'bg-white font-semibold p-2.5 pt-1.5 border border-t-4 border-content/90 border-r-muted/20 border-b-muted/20  border-l-muted/20 mr-2'
                : 'bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 disabled mr-2'
            }
          >
            Results
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? 'bg-white font-semibold p-2.5 pt-1.5 border border-t-4 border-content/90 border-r-muted/20 border-b-muted/20  border-l-muted/20'
                : 'bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 disabled'
            }
          >
            FAQ
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel className="mt-10">
            {showProgress && (
              <ProgressBar
                sections={[
                  {
                    title: 'Income Details',
                    complete: root.form.progress.income,
                  },
                  {
                    title: 'Personal Information',
                    complete: root.form.progress.personal,
                  },
                  {
                    title: 'Legal Status',
                    complete: root.form.progress.legal,
                  },
                ]}
              />
            )}
            {incomeTooHigh && (
              <Alert
                title="Annual net income"
                type={EstimationSummaryState.AVAILABLE_INELIGIBLE}
              >
                You currently do not appear to be eligible for the OAS pension
                because your annual income is higher than 129,757 CAD.
              </Alert>
            )}
            <div className="md:container grid grid-cols-1 md:grid-cols-3 gap-10 mt-14">
              <div className="col-span-2">
                {incomeTooHigh ? (
                  <div>
                    <h2 className="h2 mb-8">Income Details</h2>
                    <label
                      htmlFor=""
                      aria-label=""
                      data-testid="input-label"
                      className="text-content font-bold mb-12"
                    >
                      <span className="text-danger">*</span>
                      What is your current annual net income in Canadian
                      dollars?
                      <span className="text-danger font-bold ml-2">
                        (required)
                      </span>
                      <Tooltip field={'income'} />
                    </label>
                    <p>${query.income}</p>
                    <Link href="/" passHref>
                      <a className="btn btn-default px-8 py-3">Back</a>
                    </Link>
                  </div>
                ) : (
                  <ComponentFactory
                    data={data}
                    selectedTabIndex={setSelectedTabIndex}
                  />
                )}
              </div>
              <NeedHelpList
                title="Need Help?"
                links={[
                  {
                    label: 'OAS Overview',
                    location:
                      'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security.html',
                  },
                  {
                    label: 'Old Age Security: How much you could receive',
                    location:
                      'https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/benefit-amount.html',
                  },
                ]}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel className="mt-10">
            <div className="flex flex-col space-y-12">
              {root.summary.state &&
              root.summary.state !== EstimationSummaryState.MORE_INFO ? (
                <>
                  <ProgressBar
                    sections={[
                      { title: 'Income Details', complete: true },
                      { title: 'Personal Information', complete: true },
                      { title: 'Legal Status', complete: true },
                    ]}
                    estimateSection
                  />
                  <Alert title={root.summary.title} type={root.summary.state}>
                    {root.summary.details}
                  </Alert>
                  {root.summary.state === EstimationSummaryState.UNAVAILABLE ? (
                    <div className="mt-10">
                      <Image
                        src={'/people.png'}
                        width="1139"
                        height="443"
                        alt="People of all walks of life, happy together."
                      />
                    </div>
                  ) : (
                    <ResultsTable />
                  )}
                  {root.summary.state !==
                    EstimationSummaryState.UNAVAILABLE && (
                    <ContactCTA setSelectedTab={setSelectedTabIndex} />
                  )}
                  {root.summary?.links?.length && (
                    <ConditionalLinks links={root.summary.links} />
                  )}
                </>
              ) : (
                <div className="flex place-content-center">
                  <p className="font-semibold tracking-wide my-12">
                    Please answer the questions to view your benefits assessment
                    results
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>
          <Tab.Panel className="mt-10">
            <FAQ />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  )
}

export default observer(Eligibility)
