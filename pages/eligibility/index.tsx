import { Tab } from '@headlessui/react'
import { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import { Alert } from '../../components/Alert'
import { FAQ } from '../../components/FAQ'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { Input } from '../../components/Forms/Input'
import { Layout } from '../../components/Layout'
import { NeedHelpList } from '../../components/Layout/NeedHelpList'
import ProgressBar from '../../components/ProgressBar'
import { Tooltip } from '../../components/Tooltip/tooltip'
import { ResultKey } from '../../utils/api/definitions/enums'
import { BenefitResult } from '../../utils/api/definitions/types'
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
              <Alert title="Annual net income" type="danger">
                You currently do not appear to be eligible for the OAS pension
                because your annual income is higher than 129,757 CAD .
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
                        <Link
                          href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html"
                          passHref
                        >
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
                            <Link
                              href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments.html"
                              passHref
                            >
                              <a>Old Age Security Payment Amounts</a>
                            </Link>
                          </li>
                          <li className="ml-12 text-default-text underline">
                            <Link
                              href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/payments/tab1-1.html"
                              passHref
                            >
                              <a>Guaranteed Income Supplement (GIS) amounts</a>
                            </Link>
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
                          <Link
                            href={
                              'https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'
                            }
                            passHref
                          >
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
                          alt="A diverse group of Canadians"
                        />
                      </div>
                      <div>
                        <h2 className="h2 mt-8">More Information</h2>
                        <ul className="list-disc">
                          <li className="ml-12 text-default-text underline">
                            <Link
                              passHref
                              href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/eligibility.html"
                            >
                              <a target="_blank">
                                You may qualify for the Allowance program
                              </a>
                            </Link>
                          </li>
                          <li className="ml-12 text-default-text underline">
                            <Link
                              passHref
                              href="https://www.canada.ca/en/services/benefits/publicpensions/cpp/old-age-security/guaranteed-income-supplement/allowance-survivor.html"
                            >
                              <a target="_blank">
                                You may qualify for the Allowance for Survivor
                                program
                              </a>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
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

export default Eligibility
