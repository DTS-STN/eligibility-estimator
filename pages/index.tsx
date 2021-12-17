import type { NextPage } from 'next'
import Link from 'next/link'
import { Alert } from '../components/Alert'
import { Input } from '../components/Forms/Input'
import { Layout } from '../components/Layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="mt-18 text-content">
        <p className="mb-4 text-content">
          This prototype is an online, web-based application that enables people
          to plan their finances for the 60-65+ phase of life. By answering a
          limited number of questions regarding age, legal and relationship
          status and income level, the client will be made aware of the the
          benefit they may be qualified to receive and an estimated dollar value
          for their monthly payment.{' '}
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
        <p className="mb-4 text-content">
          Allowance for the Survivor is a monthly benefit available to
          individuals aged 60 to 64 who have a low income, who are living in
          Canada, and whose spouse or common-law partner has passed away.{' '}
        </p>
        <h2 className="h2 mt-10">Income details</h2>
      </div>
      <form action="/eligibility" className="mb-10">
        <Input
          type="text"
          name="income"
          label="What is your current annual net income in Canadian dollars"
          placeholder="$20,000"
          required
        />
        <div className="mt-10 flex space-x-5">
          <button type="reset" className="btn-default btn w-28">
            Clear
          </button>
          <button className="btn btn-primary w-28">Next</button>
        </div>
      </form>
      <Alert title="Disclaimer" type="warning">
        These results are rough estimates. For a more accurate assessment of
        your eligibility, please contact{' '}
        <Link
          href="https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html"
          passHref
        >
          <a className="text-default-text underline" target="_blank">
            Service Canada
          </a>
        </Link>
        . The results should not be considered financial advice. This
        application does not collect information that would enable personal
        identification.
      </Alert>
    </Layout>
  )
}

export default Home
