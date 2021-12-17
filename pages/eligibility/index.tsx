import { NextPage } from 'next'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Link from 'next/link'
import Image from 'next/image'
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
import { FAQ } from '../../components/FAQ'
import { validateIncome } from '../../utils/api/helpers/validator'

const dataFetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
}

const Eligibility: NextPage = () => {
  const { query } = useRouter()
  const [oas, setOAS] = useState<BenefitResult>(null)
  const [gis, setGIS] = useState<BenefitResult>(null)
  const [allowance, setAllowance] = useState<BenefitResult>(null)
  const [afs, setAFS] = useState<BenefitResult>(null)
  const [progress, setProgress] = useState({ personal: false, legal: false })
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)

  // check if income is too high to participate in calculation
  const incomeTooHigh = query && validateIncome(query.income as string)

  // show progress under certain circumstances
  const showProgress = (() => {
    if (incomeTooHigh) return false
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
      <Tab.Group
        key={selectedTabIndex}
        defaultIndex={selectedTabIndex}
        onChange={(index) => {
          if (index == 0) {
            setProgress({ legal: false, personal: false })
          }
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
                  { title: 'Income Details', complete: true },
                  {
                    title: 'Personal Information',
                    complete: progress.personal,
                  },
                  { title: 'Legal Status', complete: progress.legal },
                ]}
              />
            )}
            {incomeTooHigh && (
              <Alert title="Likely not eligible for Benefits" type="danger">
                You currently do not appear to be eligible for the OAS pension
                because your annual income is higher than 129,757 CAD. Please
                contact{' '}
                <Link href="#" passHref>
                  <a className="text-default-text underline">Service Canada</a>
                </Link>{' '}
                for more information.
              </Alert>
            )}
            <div className="grid md:grid-cols-3 gap-10 mt-14">
              <div className="col-span-2">
                {incomeTooHigh ? (
                  <div>
                    <h2 className="h2 mb-8">Income Details</h2>
                    <Input
                      type="text"
                      name="income"
                      label="What is your current annual net income in Canadian Dollars"
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
                    oas={setOAS}
                    gis={setGIS}
                    allowance={setAllowance}
                    afs={setAFS}
                    selectedTabIndex={setSelectedTabIndex}
                    setProgress={setProgress}
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
              {oas && gis ? (
                <>
                  <ProgressBar
                    sections={[
                      { title: 'Income Details', complete: true },
                      { title: 'Personal Information', complete: true },
                      { title: 'Legal Status', complete: true },
                    ]}
                    estimateSection
                  />
                  {(oas.eligibilityResult == ResultKey.ELIGIBLE &&
                    gis.eligibilityResult == ResultKey.ELIGIBLE) ||
                  (allowance &&
                    allowance.eligibilityResult == ResultKey.ELIGIBLE) ? (
                    <>
                      {' '}
                      <Alert title="Eligibility" type="info">
                        Based on the information you have provided, you are
                        likely eligible for the following benefits.
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
                              <p>{oas.eligibilityResult.replace('!', '')}</p>
                              <p>Details: {oas.detail}</p>
                            </td>
                            <td>${oas.entitlementResult}</td>
                          </tr>
                          <tr className="bg-[#E8F2F4]">
                            <td>Guaranteed Income Supplement (GIS)</td>
                            <td>
                              <p>{gis.eligibilityResult.replace('!', '')}</p>
                              <p>Details: {gis.detail}</p>
                            </td>
                            <td>${gis.entitlementResult}</td>
                          </tr>
                          <tr>
                            <td>Allowance</td>
                            <td>
                              <p>
                                {allowance &&
                                  allowance.eligibilityResult.replace('!', '')}
                              </p>
                              {allowance &&
                                (allowance.eligibilityResult ==
                                  ResultKey.INELIGIBLE ||
                                  allowance.eligibilityResult ==
                                    ResultKey.CONDITIONAL) && (
                                  <p>Details: {allowance.detail}</p>
                                )}
                            </td>
                            <td>${allowance && allowance.entitlementResult}</td>
                          </tr>
                          <tr className="bg-[#E8F2F4]">
                            <td>Allowance for Survivor</td>
                            <td>
                              <p>
                                {afs && afs.eligibilityResult.replace('!', '')}
                              </p>
                              {afs &&
                                (afs.eligibilityResult ==
                                  ResultKey.INELIGIBLE ||
                                  afs.eligibilityResult ==
                                    ResultKey.CONDITIONAL) && (
                                  <p>Details: {afs.detail}</p>
                                )}
                            </td>
                            <td>${afs && afs.entitlementResult}</td>
                          </tr>
                          <tr className="border-t border-content font-semibold ">
                            <td colSpan={2}>Total Monthly Benefit Amount</td>
                            <td>
                              $
                              {oas.entitlementResult +
                                gis.entitlementResult +
                                allowance?.entitlementResult +
                                afs?.entitlementResult}
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
                        and check out the FAQ on documents you may be required
                        to provide.
                      </p>
                      <div>
                        <h2 className="h2 mt-8">More Information</h2>
                        <ul className="list-disc">
                          <li className="ml-12 text-default-text underline">
                            Old Age Security Payment Amounts
                          </li>
                          <li className="ml-12 text-default-text underline">
                            Guaranteed Income Supplement (GIS) amounts
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <Alert title="Eligibility" type="warning">
                        <div>
                          <p>
                            Based on the information provided, you are
                            encouraged to contact Service Canada using the link
                            below:
                          </p>
                          <Link href={'#'} passHref>
                            <a className="text-default-text underline">
                              Contact Service Canada
                            </a>
                          </Link>
                        </div>
                      </Alert>
                      <div className="pt-12">
                        <Image
                          src="/people.png"
                          width="1139px"
                          height="443px"
                          alt="A diverse group of Candians"
                        />
                      </div>
                      <div>
                        <h2 className="h2 mt-8">More Information</h2>
                        <ul className="list-disc">
                          <li className="ml-12 text-default-text underline">
                            You may qualify for the Allowance for Survivor
                            program{' '}
                          </li>
                          <li className="ml-12 text-default-text underline">
                            You may qualify for the Allowance program{' '}
                          </li>
                          <li className="ml-12 text-default-text underline">
                            Guaranteed Income Supplement (GIS) and Allowance
                            amounts {' '}
                          </li>
                          <li className="ml-12 text-default-text underline">
                            Old Age Security: How much you could receive if you
                            have lived in Canada less than 40 years{' '}
                          </li>
                          <li className="ml-12 text-default-text underline">
                            Guaranteed Income Supplement: Do you qualify{' '}
                          </li>
                          <li className="ml-12 text-default-text underline">
                            Lived or living outside Canada - Pensions and
                            benefits - Overview{' '}
                          </li>
                          <li className="ml-12 text-default-text underline">
                            Old Age Security: Do you qualify{' '}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
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
          <Tab.Panel className="mt-10">
            <FAQ />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Layout>
  )
}

export default Eligibility
