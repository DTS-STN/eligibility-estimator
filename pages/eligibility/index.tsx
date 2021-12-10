import { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Link from 'next/link'
import { Tab } from '@headlessui/react'
import { Layout } from '../../components/Layout'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { NeedHelpList } from '../../components/Layout/NeedHelpList'
import { Input } from '../../components/Forms/Input'
import { Alert } from '../../components/Alert'
import ProgressBar from '../../components/ProgressBar'
import { useState } from 'react'
import { BenefitResult } from '../../utils/api/definitions/types'
import { ResultKey } from '../../utils/api/definitions/enums'

const dataFetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const Eligiblity: NextPage = () => {
  const { query } = useRouter()
  const [oasResult, setOasResult] = useState<BenefitResult>(null)
  const [gisResult, setGisResult] = useState<BenefitResult>(null)

  // show progress under certain circumstances
  const showProgress = (() => {
    if (query && parseInt(query.income as string) > 129757) return false
    return true
  })()

  // formdata will come from form, going to need a handler function to pass into Component Factory and a useEffect to pull data once the [dependency] changes
  const params = Object.keys(query)
    .map((key) => key + '=' + query[key])
    .join('&')

  const { data, error } = useSWR(
    () => query && `api/calculateEligibility?${params && params}`,
    dataFetcher
  )

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
      <Tab.Group manual>
        <Tab.List>
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
                ? 'bg-white font-semibold p-2.5 pt-1.5 border border-t-4 border-content/90 border-r-muted/20 border-b-muted/20  border-l-muted/20'
                : 'bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 disabled'
            }
          >
            Results
          </Tab>
        </Tab.List>
        <Tab.Panels className="border-t border-muted/20">
          <Tab.Panel className="mt-10">
            {showProgress && (
              <ProgressBar
                sections={[
                  { title: 'Income Details', complete: true },
                  { title: 'Personal Information', complete: false },
                  { title: 'Legal Status', complete: false },
                ]}
              />
            )}
            {query && parseInt(query.income as string) > 129757 && (
              <Alert title="Likely not eligible for Benefits" type="danger">
                You currently do not appear to be eligiable for the OAS pension
                because your annual income is higher than 129,757 CAD.
              </Alert>
            )}
            <div className="grid grid-cols-3 gap-10 mt-9">
              <div className="col-span-2">
                {query && parseInt(query.income as string) > 129757 ? (
                  <div>
                    <h2 className="h2 mb-8">Income Details</h2>
                    <Input
                      type="number"
                      name="income"
                      label="What is your current annual net income in CanaDian Dollars"
                      value={query.income}
                      extraClasses="mt-6 mb-10"
                      disabled
                      required
                    />
                    <Link href="/" passHref>
                      <a className="btn btn-default px-8 py-3">Back</a>
                    </Link>
                  </div>
                ) : (
                  <ComponentFactory
                    data={data}
                    oas={setOasResult}
                    gis={setGisResult}
                  />
                )}
              </div>
              <NeedHelpList
                title="Need Help?"
                links={[
                  { label: 'OAS Overview', location: '#' },
                  {
                    label: 'Entitlements FAQ',
                    location: '#',
                  },
                ]}
              />
            </div>
          </Tab.Panel>
          <Tab.Panel className="mt-10">
            <div className="flex flex-col space-y-12">
              {oasResult && gisResult ? (
                <>
                  <ProgressBar
                    sections={[
                      { title: 'Income Details', complete: true },
                      { title: 'Personal Information', complete: true },
                      { title: 'Legal Status', complete: true },
                    ]}
                    estimateSection
                  />
                  <Alert title="Eligibility" type="info">
                    Based on the information you have provided, you are likely
                    eligible for the sample benefits.
                  </Alert>
                  <table>
                    <thead className="font-semibold text-content border-b border-content">
                      <tr className=" ">
                        <th>Sample Benefits</th>
                        <th>Eligibility</th>
                        <th>Estimated Monthly Amount (CAD)</th>
                      </tr>
                    </thead>
                    <tbody className="align-top">
                      <tr className="">
                        <td>Old Age Security (OAS)</td>
                        <td>
                          <p>{oasResult.eligibilityResult.replace('!', '')}</p>
                          {(oasResult.eligibilityResult ==
                            ResultKey.INELIGIBLE ||
                            oasResult.eligibilityResult ==
                              ResultKey.CONDITIONAL) && (
                            <p>Detail: {oasResult.detail}</p>
                          )}
                        </td>
                        <td>${oasResult.entitlementResult}</td>
                      </tr>
                      <tr className="bg-[#E8F2F4] ">
                        <td>Guaranteed Income Supplement (GIS)</td>
                        <p>{gisResult.eligibilityResult.replace('!', '')}</p>
                        {(gisResult.eligibilityResult == ResultKey.INELIGIBLE ||
                          gisResult.eligibilityResult ==
                            ResultKey.CONDITIONAL) && (
                          <p>Detail: {gisResult.detail}</p>
                        )}
                        <td>${gisResult.entitlementResult}</td>
                      </tr>
                      <tr className="border-t border-content font-semibold ">
                        <td colSpan={2}>Total Monthly Benefit Amount</td>
                        <td>
                          $
                          {oasResult.entitlementResult +
                            gisResult.entitlementResult}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>
                    For a more accurate assessment, you are encouraged to{' '}
                    <Link href="#" passHref>
                      <a className="text-default-text underline">
                        contact Service Canada{' '}
                      </a>
                    </Link>
                    and check out the FAQ on documents you may be required to
                    provide.
                  </p>
                  <div>
                    <h3 className="h3 mt-4">More Information</h3>
                    <p>links go here</p>
                  </div>
                </>
              ) : (
                <div className="flex place-content-center">
                  <p className="font-bold tracking-wide uppercase my-12">
                    Please fill out the form to view your Sample benefits
                    information
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  )
}

export default Eligiblity
