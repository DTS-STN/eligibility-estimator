import { GetServerSideProps, NextPage } from 'next'
import { Layout } from '../../components/Layout'
import { useRouter } from 'next/router'
import useSWR from 'swr'

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
  console.log(data.allFields)

  return (
    <Layout>
      <pre>{data.allFields.join(', ')}</pre>
    </Layout>
  )
}

export default Eligiblity
