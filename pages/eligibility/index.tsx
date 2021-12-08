import { GetServerSideProps, NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'
import { NeedHelpList } from '../../components/Layout/NeedHelpList'

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
      <div className="grid grid-cols-3 gap-10 mt-9">
        <div className="col-span-2">
          <ComponentFactory data={data} />
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
