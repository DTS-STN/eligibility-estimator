import { GetServerSideProps, NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { ComponentFactory } from '../../components/Forms/ComponentFactory'

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
        <section>
          {/* This will be a dynamic list of links eventually */}
          <div className="p-8 bg-[#dcdfe1]">
            <h2 className="h2">Need help?</h2>
            <ul>
              <li>
                <a href="#">OAS Overview</a>
              </li>
              <li>
                <a href="#">Old age security: how much you could receive?</a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Eligiblity
