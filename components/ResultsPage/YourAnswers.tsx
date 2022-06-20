import { Link as DSLink } from '@dts-stn/decd-design-system'
import { useRouter } from 'next/router'
import { useTranslation } from '../Hooks'
import { WebTranslations } from '../../i18n/web'
import { livingCountry as enCountry } from '../../i18n/api/countries/en'
import { livingCountry as frCountry } from '../../i18n/api/countries/fr'
import en from '../../i18n/api/en'
import fr from '../../i18n/api/fr'
//import {  } from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'

export const YourAnswers: React.VFC<{
  title: string
  questions: Array<[string, string]>
}> = ({ title, questions }) => {
  const tsln = useTranslation<WebTranslations>()
  const currentLocale = useRouter().locale

  const answers = questions.filter((question) => question[0] !== '_language')
  const answersKeys = answers.map(([key, _]) => key)

  function getLivingCountry(country: string): { key: string; text: string } {
    if (country === undefined) return undefined
    if (currentLocale == 'en')
      return enCountry.find((val) => val.key === country)
    else return frCountry.find((val) => val.key === country)
  }

  function getLegalStatus(status: string): { key: string; text: string } {
    if (status === undefined) return undefined
    if (currentLocale == 'en')
      return en.questionOptions.legalStatus.find((val) => val.key === status)
    else return fr.questionOptions.legalStatus.find((val) => val.key === status)
  }

  function getMaritalStatus(status: string): { key: string; text: string } {
    if (status === undefined) return undefined
    if (currentLocale == 'en')
      return en.questionOptions.maritalStatus.find((val) => val.key === status)
    else
      return fr.questionOptions.maritalStatus.find((val) => val.key === status)
  }

  function getPartnerBenefitStatus(status: string): {
    key: string
    text: string
  } {
    if (status === undefined) return undefined
    if (currentLocale == 'en')
      return en.questionOptions.partnerBenefitStatus.find(
        (val) => val.key === status
      )
    else
      return fr.questionOptions.partnerBenefitStatus.find(
        (val) => val.key === status
      )
  }

  if (answersKeys.length === 0)
    return (
      <div className="fz-10">
        <div className="p-8 bg-emphasis rounded mt-8 md:mt-0 md:max-w-[380px]">
          <h3 className="h3">{title}</h3>
          <div className="py-4">No answers found</div>
        </div>
      </div>
    )

  let fieldValue: string = ''
  let fieldYearsValue: string = ''

  if (answersKeys.length !== 0)
    return (
      <div className="fz-10">
        <div className="p-8 bg-emphasis rounded mt-8 md:mt-0 md:max-w-[380px]">
          <h3 className="h3">{title}</h3>

          {answersKeys.map((field, index) => {
            fieldValue = ''
            fieldYearsValue = ''

            {
              ;(() => {
                switch (field) {
                  case FieldKey.LEGAL_STATUS:
                    fieldValue = getLegalStatus(answers[index][1]).text
                    break
                  case FieldKey.LIVING_COUNTRY:
                    fieldValue = getLivingCountry(answers[index][1]).text
                    break
                  case FieldKey.MARITAL_STATUS:
                    fieldValue = getMaritalStatus(answers[index][1]).text
                    break
                  case FieldKey.PARTNER_BENEFIT_STATUS:
                    fieldValue = getPartnerBenefitStatus(answers[index][1]).text
                    break
                  case FieldKey.LIVED_OUTSIDE_CANADA:
                  case FieldKey.PARTNER_LIVED_OUTSIDE_CANADA:
                    fieldValue = answers[index][1]
                    fieldYearsValue =
                      answers[
                        answersKeys.indexOf(FieldKey.YEARS_IN_CANADA_SINCE_18)
                      ][1]
                    break
                  default:
                    fieldValue = answers[index][1]
                }
              })()
            }

            return (
              // field 'Years in Canada' is display with the answer 'Lived Outside Canada'

              field !== FieldKey.YEARS_IN_CANADA_SINCE_18 &&
                field !== FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18 ? (
                // process answer 'Lived Outside Canada'

                field === FieldKey.LIVED_OUTSIDE_CANADA ||
                field === FieldKey.PARTNER_LIVED_OUTSIDE_CANADA ? (
                  answers[index][1] === 'true' ? (
                    <div
                      key={index}
                      className="py-4 border-b-2 border-info-border"
                    >
                      {tsln.resultsQuestions[answers[index][0]]} <br />
                      <strong>{tsln.yes}</strong> &nbsp;
                      <DSLink
                        id={`helpLink${answers[index][0]}`}
                        href="/eligibility#liveOutsideCanada-0"
                        text="Edit"
                        target="_self"
                      />
                      <br />
                      <strong>{fieldYearsValue}</strong> &nbsp;
                      {Number(fieldYearsValue) > 1
                        ? tsln.years
                        : tsln.year}{' '}
                      &nbsp;
                      <DSLink
                        id={`helpLink${answers[index][0]}`}
                        href="/eligibility#yearsInCanadaSince18"
                        text="Edit"
                        target="_self"
                      />
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="py-4 border-b-2 border-info-border"
                    >
                      {tsln.resultsQuestions[answers[index][0]]} <br />
                      <strong>{tsln.no}</strong>
                      <DSLink
                        id={`helpLink${answers[index][0]}`}
                        href="/eligibility#react-select-3-live-region"
                        text="Edit"
                        target="_self"
                      />
                    </div>
                  )
                ) : (
                  // default display for all others types of answers

                  <div
                    key={index}
                    className="py-4 border-b-2 border-info-border"
                  >
                    {tsln.resultsQuestions[answers[index][0]]} <br />
                    <strong>{fieldValue}</strong> &nbsp;
                    <DSLink
                      id={`helpLink${answers[index][0]}`}
                      href="/eligibility#age"
                      text="Edit"
                      target="_self"
                    />
                  </div>
                )
              ) : (
                // do nothing when the field is 'Years in Canada'
                <span key={index}> </span>
              )
            )
          })}
        </div>
      </div>
    )
}
