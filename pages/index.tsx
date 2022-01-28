import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Alert } from '../components/Alert'
import { CurrencyField } from '../components/Forms/CurrencyField'
import { Layout } from '../components/Layout'
import { EstimationSummaryState } from '../utils/api/definitions/enums'

const Home: NextPage = (props) => {
  const router = useRouter()
  const [error, setError] = useState(null)
  return (
    <Layout>
      <div className="mt-18 text-content">
        <p className="mb-4 text-content">
          Canadian Old Age Benefits Estimator is a prototype. This is not a real
          service. Based on the information you provide, this will estimate your
          eligibility for the Old Age Security (OAS) and Guaranteed Income
          Supplement (GIS). If eligible to receive the benefit, the application
          will also estimate your monthly payment.{' '}
        </p>
        <p className="mb-4 text-content">
          This prototype covers four benefits programs:
        </p>
        <p className="mb-4 text-content">
          The Old Age Security (OAS) pension is a monthly payment you can get if
          you are 65 and older. In some cases, Service Canada will be able to
          automatically enroll you for the OAS pension. In other cases, you will
          have to apply for the Old Age Security pension. Service Canada will
          inform you if you have been automatically enrolled.
        </p>
        <p className="mb-4 text-content">
          In most cases, you do not have to apply to get this benefit.
        </p>
        <p className="mb-4 text-content">
          Guaranteed Income Supplement (GIS) is a monthly non-taxable benefit
          for OAS pension recipients who have a low income and are living in
          Canada.
        </p>
        <p className="mb-4 text-content">
          Allowance is a monthly benefit available to low-income individuals
          aged 60 to 64 whose spouse or common-law partner receives the
          Guaranteed Income Supplement.
        </p>
        <p className="mb-10 text-content">
          Allowance for the Survivor is a monthly benefit available to
          individuals aged 60 to 64 who have a low income, who are living in
          Canada, and whose spouse or common-law partner has passed away.{' '}
        </p>
      </div>

      <Alert title="Disclaimer" type={EstimationSummaryState.UNAVAILABLE}>
        Please be reminded that this is not a real service. It is a prototype.
        The results are estimates and not a final decision. For a more accurate
        assessment of your eligibility, contact{' '}
        <Link
          href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html"
          passHref
        >
          <a className="text-default-text underline" target="_blank">
            Service Canada
          </a>
        </Link>
        . The results are not financial advice. This application does not
        collect and does not save the information you have provided.
      </Alert>

      <button
        className="btn btn-primary w-28 mt-8"
        onClick={(e) => router.push('/eligibility')}
      >
        Next
      </button>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {},
  }
}

export default Home
