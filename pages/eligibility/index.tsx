import { NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Link from 'next/link'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { NeedHelpList } from '../../components/Layout/NeedHelpList'
import { Input } from '../../components/Forms/Input'
import { Alert } from '../../components/Alert'

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
            <ComponentFactory data={data} />
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
    </Layout>
  )
}

export default Eligiblity
