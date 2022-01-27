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
import { ResultsPage } from '../../components/ResultsPage'
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
                : 'bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 mr-2 disabled:cursor-not-allowed disabled:bg-[#949494]'
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
              <ResultsPage root={root} setSelectedTab={setSelectedTabIndex} />
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
