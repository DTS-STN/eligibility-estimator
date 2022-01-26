import { Tab } from '@headlessui/react'
import { observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { RootStore } from '../../client-state/store'
import { Alert } from '../../components/Alert'
import { ConditionalLinks } from '../../components/ConditionalLinks'
import { ContactCTA } from '../../components/ContactCTA'
import { FAQ } from '../../components/FAQ'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { useMediaQuery, useStore } from '../../components/Hooks'
import { Layout } from '../../components/Layout'
import ProgressBar from '../../components/ProgressBar'
import { ResultsTable } from '../../components/ResultsTable'
import { EstimationSummaryState } from '../../utils/api/definitions/enums'
import {
  ResponseError,
  ResponseSuccess,
} from '../../utils/api/definitions/types'

const Eligibility: NextPage<ResponseSuccess | ResponseError> = (props) => {
  const { query } = useRouter()
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const isMobile = useMediaQuery(992)
  const root: Instance<typeof RootStore> = useStore()

  if ('error' in props) {
    return (
      <Layout>
        <div>{props.error}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Tab.Group
        key={selectedTabIndex}
        defaultIndex={selectedTabIndex}
        onChange={(index) => {
          setSelectedTabIndex(index)
        }}
      >
        <Tab.List className={`border-b border-muted/20`}>
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
                : 'bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 disabled mr-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-white'
            }
            disabled={root.form.validateIncome()}
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
            <div className="md:container mt-14">
              <ComponentFactory
                data={props}
                selectedTabIndex={setSelectedTabIndex}
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
                  <Alert
                    title={root.summary.title}
                    type={root.summary.state}
                    insertHTML
                  >
                    {root.summary.details}
                  </Alert>
                  {root.summary.state === EstimationSummaryState.UNAVAILABLE ? (
                    <div
                      className={`mt-10 w-full relative ${
                        !isMobile ? 'h-[450px]' : 'h-[180px]'
                      }`}
                    >
                      <Image
                        src={'/people.png'}
                        layout="fill"
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
                <div className="w-full">
                  <Alert
                    title={root.summary.title}
                    type={EstimationSummaryState.MORE_INFO}
                    insertHTML
                  >
                    {root.summary.details}
                  </Alert>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query

  const host = context.req.headers.host

  const params = Object.keys(query)
    .map((key) => key + '=' + query[key])
    .join('&')

  const path = `http://${host}/api/calculateEligibility?${params}`

  const res = await fetch(path)
  const data = await res.json()

  return {
    props: {
      ...data,
    },
  }
}

export default observer(Eligibility)
