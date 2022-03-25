import Link from 'next/link'

export const FAQE = () => (
  <div>
    <details>
      <summary>
        <h2 className="inline h3 mt-10">Old Age Security</h2>
      </summary>
      <details>
        <summary>
          Do I have to apply to start receiving my Old Age Security pension?
        </summary>
        <div className="p-4">
          <p>
            For many pensioners, your Old Age Security pension does not start
            automatically. You must apply for benefits. In April 2013, Service
            Canada implemented a process to automatically enroll seniors who are
            eligible to receive the Old Age Security pension. If you can be
            automatically enrolled, Service Canada will send you a notification
            letter the month after you turn 64. If you do not receive this
            letter, you must apply for your Old Age Security pension.
          </p>
        </div>
      </details>
      <details>
        <summary>Can I defer my Old Age Security (OAS) pension amount?</summary>
        <div className="p-4">
          <p>
            You are eligible to the Old Age Security pension at 65. Unlike the
            Canada Pension Plan (CPP), there is no option to take Old Age
            Security early, such as at age 60. However, you can defer it up to
            five years for an enhanced benefit. You&apos;ll receive 7.2% more
            each year (0.6% more each month) that you delay taking the Old Age
            Security. After age 70, there is no advantage in delaying your first
            payment. In fact, you risk losing benefits. If you are over the age
            of 70 and not receiving an Old Age Security pension, apply now.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Can I receive a retroactive payment if I&apos;m over 65?
        </summary>
        <div className="p-4">
          <p>
            If you are already over 65, you may be eligible to receive a
            retroactive payment for up to a maximum of 11 months from the date
            we receive your application. If you delayed receiving your Old Age
            Security pension you will not be able to receive retroactive payment
            during this period. You might also be eligible to receive extra
            payments based on your income such as Guaranteed Income Supplement,
            Allowance, Allowance for the Survivor.
          </p>
        </div>
      </details>

      <details>
        <summary>How can I qualify for full pension?</summary>
        <div className="p-4">
          <p>
            You can qualify for a full OAS pension if you have lived in Canada
            for at least 40 years after the age of 18. Otherwise, you will
            receive partial pension.
          </p>
        </div>
      </details>

      <details>
        <summary>What is a partial pension?</summary>
        <div className="p-4">
          <p>
            A partial pension is calculated at the rate of 1/40th of the full
            pension for each complete year of residence in Canada after age 18.
            The minimum period of residence necessary to qualify for a partial
            pension is 10 years.
          </p>
        </div>
      </details>

      <details>
        <summary>Is my Old Age Security taxable?</summary>
        <div className="p-4">
          <p>
            Yes. The basic Old Age Security pension is taxable and must be
            reported as income on your tax return. The Guaranteed Income
            Supplement and Allowance are not taxable. They must also be reported
            on your tax return. If your net world income exceeds the threshold
            amount $79,845 CAD for 2021, you must repay part or your entire Old
            Age Security pension. Please visit Service Canada for more details.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Is an Old Age Security pension indexed to an increase in prices?
        </summary>
        <div className="p-4">
          <p>
            Yes, the payment amounts for Old Age Security, Guaranteed Income
            Supplement, Allowance and Allowance for the Survivor are reviewed
            every three months (in January, April, July, and October) to reflect
            increases in the cost of living as measured by the Consumer Price
            Index.
          </p>
        </div>
      </details>
    </details>

    <details>
      <summary>
        <h2 className="inline h3 mt-10">Guaranteed Income Supplement</h2>
      </summary>

      <details>
        <summary>
          Do I continue receiving the Guaranteed Income Supplement if I leave
          Canada?
        </summary>
        <div className="p-4 space-y-4">
          <p>
            You cannot collect the Guaranteed Income Supplement if you are
            outside of Canada for more than 6 months. Service Canada compares
            information with the Canada Border Services Agency. If you leave
            Canada for more than 6 months while collecting the Guaranteed Income
            Supplement, we&apos;ll determine if you&apos;re eligible to those
            payments. If not, we&apos;ll calculate how much we overpaid you, and
            you will then have to repay that amount.
          </p>
          <p>
            Note: You could be fined for giving false, misleading, or purposely
            omitted information.
          </p>
        </div>
      </details>

      <details>
        <summary>My Guaranteed Income Supplement payment stopped, why?</summary>
        <div className="p-4">
          <ul className="list-disc">
            Your Guaranteed Income Supplement payment can stop for any of the
            following reasons:
            <li className="ml-12">You did not file a tax return by April 30</li>
            <li className="ml-12">
              by the end of June, you did not give us the information about your
              income (or in the case of a couple, Your income plus the income of
              your spouse/common-law partner) for the previous year
            </li>
            <li className="ml-12">
              You leave Canada for more than 6 consecutive months
            </li>
            <li className="ml-12">
              Your income (or in the case of a couple, your income plus the
              income of your spouse/common-law partner) is higher than what is
              allowed to receive the benefit
            </li>
            <li className="ml-12">
              You are in a federal prison for a sentence of 2 years or longer
            </li>
            <li className="ml-12">
              You die (it is important that someone notify us about your death
              to avoid overpayment)
            </li>
          </ul>
        </div>
      </details>
    </details>

    <details>
      <summary>
        <h2 className="inline h3 mt-10">Application</h2>
      </summary>

      <details>
        <summary>What are the required documents for my application?</summary>
        <div className="p-4 space-y-4">
          <p>
            <span className="font-bold">Proof of Birth:</span> If born inside or
            outside Canada, applicants are not required to give proof of date of
            birth. However, Service Canada may request it later.
          </p>
          <p>
            <span className="font-bold">Proof of Legal Status:</span> If born
            outside Canada, a certificate of Canadian citizenship,
            naturalization certificate, Canadian passport, or Canadian
            immigration documents (such as Record of Landing, permanent resident
            card or temporary resident permit) are required.
          </p>
          <p>
            <span className="font-bold">Proof of Marital Status:</span> If you
            are married, you must provide an original or certified copy of your
            marriage certificate. If you are in a common-law relationship,
            please provide a statutory declaration of your union and other proof
            of the relationship.
          </p>
          <ul className="list-disc">
            <p className="font-bold mb-4"> Proof of marriage can include:</p>
            <li className="ml-12">A marriage certificate</li>
            <li className="ml-12">
              An official copy or extract of the church, synagogue, mosque,
              temple, etc.
            </li>
            <li className="ml-12">
              A civil record of marriage as issued by a competent authority
            </li>
            <li className="ml-12">
              Marriage registration forms (if an official copy or extract of the
              record from Vita Statistics and registration number)
            </li>
            <li className="ml-12">
              A completed Statutory Declaration of Legal Marriage (ISP1809B).
            </li>
          </ul>
          <ul className="list-disc">
            <p className="font-bold mb-4">
              Proof of common-law union can include:
            </p>
            <li className="ml-12">
              Statutory Declaration of Common-law Union (ISP3004) must be
              witnessed by a Commissioner of Oaths (offered for free in a
              Service Canada Office)
            </li>
            <li className="ml-12">Certificate of Civil Union in Quebec</li>
            <li className="ml-12">
              Domestic Partners Certificate in Nova Scotia and Saskatchewan,
              Certificate of Common-Law Relationship in Manitoba, Adult
              Interdependent Partner Agreement in Alberta
            </li>
            <li className="ml-12">
              Marital status claimed on a current ISP benefit
            </li>
            <li className="ml-12">Income Tax and Benefit Returns</li>
            <li className="ml-12">Provincial registration forms</li>
            <li className="ml-12">
              Cohabitation or prenuptial agreement / joint wills or bank
              accounts
            </li>
          </ul>
        </div>
      </details>

      <details>
        <summary>What should I include in my annual net income?</summary>
        <div className="p-4">
          <p>
            You can find your total annual net income on line 236 of your tax
            return document. If you do not have tax filing income information,
            you may use an estimate of your income. If you have more than one
            source of income (e.g., salary, investment income, pension income),
            you should add all the net income estimates together before entering
            the total amount. Do not include any income from a partner or
            dependent.
          </p>
          <ul className="list-disc">
            Sources of income can include one or more of the following:
            <li className="ml-12">
              Pension Income such as: Employer pension benefits, Annuity
              payments, Alimony and maintenance payments, Employment insurance
              benefits, Disability benefits deriving from a private insurance
              plan, Any benefits under the Canada Pension Plan or Quebec pension
              Plan, Superannuation or pension payments or Employee&apos;s or
              worker&apos;s compensation in respect of an injury, disability or
              death.
            </li>
            <li className="ml-12">
              Employment Insurance (EI), Canada Emergency Response benefit and
              Provincial and territorial Worker&apos;s Compensation Board
              benefits
            </li>
            <li className="ml-12">
              Net Interest and Other Investment Income, including Foreign
              Dividends
            </li>
            <li className="ml-12">Canadian Dividends and Capital Gains</li>
            <li className="ml-12">Net Rental Income</li>
            <li className="ml-12">Net Employment Income</li>
            <li className="ml-12">Net Self-Employment Income</li>
            <li className="ml-12">
              Foreign income includes income from wages, employer pensions,
              social security benefits, dividends, investments, and rental
              income received from another country
            </li>
          </ul>
        </div>
      </details>

      <details>
        <summary>What is exempt as income?</summary>
        <div className="p-4">
          <ul className="list-disc">
            <li className="ml-12">
              Old Age Security, Guaranteed Income Supplement, Allowance or
              Allowance for the Survivor payments
            </li>
            <li className="ml-12">
              Canada Pension Plan or Quebec Pension Plan contributions and your
              Employment Insurance premiums
            </li>
            <li className="ml-12">
              Canada Pension Plan or Quebec Pension Plan contributions and your
              Employment Insurance premiums of net self-employment income
            </li>
            <li className="ml-12">
              Deductions, such as union dues, RRSP deduction, moving expenses
              and other employment expenses
            </li>
          </ul>
        </div>
      </details>

      <details>
        <summary>
          What are the eligible categories of legal status in Canada?
        </summary>
        <div className="p-4 space-y-4">
          <p>
            <span className="font-bold">Canadian citizen:</span> A individual is
            Canadian by birth (either born in Canada or born outside Canada to a
            Canadian citizen who was themselves either born in Canada or granted
            citizenship) or by applying for a grant of citizenship and have
            received Canadian citizenship.
          </p>
          <p>
            <span className="font-bold">
              A permanent resident or landed immigrant (non-sponsored
              immigrant):
            </span>
            An individual given permanent resident status by immigrating to
            Canada but is not a Canadian citizen.
          </p>
          <p>
            <span className="font-bold">
              A permanent resident or landed immigrant (sponsored immigrant):
            </span>
            An individual given permanent resident status under the Family
            Class, has an approved Canadian sponsor, but is not a Canadian
            citizen.
          </p>
          <p>
            <span className="font-bold">
              Temporary Resident Permit (formerly known as a Minister&apos;s
              Permit prior to June 2002)
            </span>
            - (formerly known as a Minister&apos;s Permit prior to June 2002): A
            permit that may be granted in exceptional circumstances to a person
            who does not meet the requirements of Canada&apos;s immigration law
            to enter or remain temporarily in Canada.
          </p>
          <p>
            <span className="font-bold">Temporary Resident Visa (TRV):</span> An
            individual may be granted permission to come to Canada for a
            temporary purpose as a visitor, a student or to work for a specified
            period that may be renewed. For instance, a work permit may be
            issued for an individual to work temporarily in Canada or a study
            permit may be issued for an individual to study temporarily at
            Canadian CEGEPs, colleges and universities.
          </p>
          <p>
            <span className="font-bold">Convention refugee</span> - A person who
            is outside of their home country or country where they normally live
            and fears returning to that country because of a well-founded fear
            of persecution for reasons of race, religion, nationality,
            membership in a particular social group or political opinion.
          </p>
          <p>
            <span className="font-bold">Order in Council</span> - issued by the
            Governor in Council to persons who are already in Canada but have no
            Legal Status.
          </p>
          <p>
            <span className="font-bold">Returning Permanent Resident</span> -
            prior to the introduction of the permanent resident card, this
            status is granted to people who were outside Canada for more than
            183 days but not intended to make a permanent home elsewhere.
          </p>
          <p>
            <span className="font-bold">Indian Status</span> - those who are
            registered as Indians according to the Indian Act, whether they are
            Canadian Citizens or not. This applies only to those who are
            registered and are members of a Canadian Indian band or Members of
            Canadian reserves. As such, they will have exactly the same rights
            as all Canadian citizens. This can only be used to confirm legal
            status. The residence requirements under the Old Age Security Act
            still need to be met.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Is there a difference between years of residence and presence in
          Canada?
        </summary>
        <div className="p-4">
          <p>
            In determining your residence, only actual residence and not periods
            of presence in Canada are counted.
            <br />
            <span className="font-bold">Residence</span>: Residence means that a
            person makes his home here and ordinarily lives in Canada.
            <br />
            <span className="font-bold">Presence</span>: Presence means that a
            person is physically present in any part of Canada.
          </p>
        </div>
      </details>

      <details>
        <summary>
          What countries have a social security agreement with Canada?
        </summary>
        <div className="p-4">
          <p>
            Canada has agreements with over 50 countries. To find out what
            countries these are, you can contact or visit the{' '}
            <Link
              href={
                'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/foreign-employees-employers/canada-s-social-agreements-other-countries.html'
              }
            >
              <a className="text-default-text underline" target="_blank">
                Government of Canada
              </a>
            </Link>{' '}
            website
          </p>
        </div>
      </details>

      <details>
        <summary>What happens if I lived or worked outside of Canada?</summary>
        <div className="p-4">
          <p>
            Canadians working outside Canada for Canadian employers may have
            their time working abroad counted as residence in Canada. To
            qualify, you must have returned to Canada within 6 months of ending
            employment or have turned 65 while still employed outside Canada.
            Under certain conditions, this provision may also apply to partners,
            dependents, students, and Canadians working abroad for international
            organizations.
          </p>
        </div>
      </details>

      <details>
        <summary>
          What can I do if I disagree with a decision made on my application?
        </summary>
        <div className="p-4">
          <p>
            If you disagree with a decision made on your application, you may
            ask to have the decision reviewed. You must request a
            reconsideration in writing within 90 days of receiving your decision
            letter. A review of you application will be made by Service Canada
            staff who were not involved in the original decision on your
            application.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Are benefits cancelled after a beneficiary&apos;s death?
        </summary>
        <div className="p-4 space-y-4">
          <p>
            If you&apos;re reading this following the loss of a loved one,
            please accept our condolences.
            <ul className="list-disc">
              When an Old Age Security (OAS) beneficiary dies, their benefits
              must be cancelled. Benefits are payable for the month in which the
              death occurs. Benefits received after that will have to be repaid.
              This includes the following benefits:
              <li className="ml-12">OAS pension</li>
              <li className="ml-12">Guaranteed Income Supplement</li>
              <li className="ml-12">Allowance</li>
              <li className="ml-12">Allowance for the Survivor</li>
            </ul>
            <p>
              Please contact
              <Link
                href="https://www.canada.ca/en/employment-social-development/corporate/contact.html"
                passHref
              >
                <a className="text-default-text underline" target="_blank">
                  Service Canada
                </a>
              </Link>
              as soon as possible to notify us of the date of death of the
              beneficiary. Please include the following information about the
              deceased beneficiary:
            </p>
            <ul className="list-disc">
              <li className="ml-12">Full name</li>
              <li className="ml-12">Date of birth</li>
              <li className="ml-12">Date of death</li>
              <li className="ml-12">Social Insurance Number (if known)</li>
              <li className="ml-12">Previous address</li>
              <li className="ml-12">
                Name and address of the estate or the person responsible for
                handling the deceased&apos;s affairs (if known)
              </li>
            </ul>
          </p>
        </div>
      </details>
    </details>

    <details>
      <summary>
        <h2 className="inline h3 mt-10">Canada Pension Plan (CPP)</h2>
      </summary>

      <details>
        <summary>What is The Canada Pension Plan (CPP)?</summary>
        <div className="p-4">
          <p>
            The Canada Pension Plan retirement pension is a monthly, taxable
            benefit that replaces part of your income when you retire. If you
            qualify, you&apos;ll receive this pension for the rest of your life.
            To qualify you must be at least 60 years old and have made at least
            one valid contribution.
          </p>
        </div>
      </details>

      <details>
        <summary>
          How does the Old Age Security (OAS) program differ from Canada Pension
          Plan (CPP) or Quebec Pension Plan (QPP)?
        </summary>
        <div className="p-4">
          <p>
            The Canada Pension Plan and Quebec Pension Plan are not funded by
            the Government, but through the contributions of employees and
            employers. To receive Canada Pension Plan or Quebec Pension Plan,
            you must have worked and contributed to either plan.
          </p>
        </div>
      </details>

      <details>
        <summary>
          How many years do you need to work to get the Canada Pension Plan
          (CPP)?
        </summary>
        <div className="p-4">
          <p>
            Everyone is entitled the Canada Pension Plan regardless of how many
            years you have worked. How much you receive depends on your earnings
            as well as your contributions.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Should I take my pension from the Canada Pension Plan at 60 or 65?
        </summary>
        <div className="p-4">
          <p>
            Deciding when to start collecting the Canada Pension Plan should be
            based on your finances, health, life expectancy and taxes. The main
            reason to delay your payments is that you will receive a larger
            benefit.
          </p>
        </div>
      </details>
    </details>
  </div>
)
