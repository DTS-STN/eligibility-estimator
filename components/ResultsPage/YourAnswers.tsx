import { Link as DSLink } from '@dts-stn/decd-design-system'
import { useRouter } from 'next/router'
import { useStore, useTranslation } from '../Hooks'
import { WebTranslations } from '../../i18n/web'
import { livingCountry as enCountry } from '../../i18n/api/countries/en'
import { livingCountry as frCountry } from '../../i18n/api/countries/fr'
import en from '../../i18n/api/en'
import fr from '../../i18n/api/fr'
import { Locale } from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'



export const YourAnswers: React.VFC<{
  title: string
  questions: Array<[ string, string ]>
}> = ({ title, questions }) => {
  const root = useStore()

  const tsln = useTranslation<WebTranslations>()
  
  const currentLocale = useRouter().locale
  const locale = currentLocale == 'en' ? Locale.EN : Locale.FR

  const answers = questions.filter( question => question[0] !== '_language')
  const answersKeys = answers.map(([key,_]) => key)

  function getLivingCountry(country: string): {key: string,text: string} {
    if (country === undefined) return undefined
    if (currentLocale == 'en') 
      return enCountry.find((val) => val.key === country )
    else 
      return frCountry.find((val) => val.key === country )
  }

  function getLegalStatus(status: string): {key: string,text: string} {
    if (status === undefined) return undefined
    if (currentLocale == 'en') 
      return en.questionOptions.legalStatus.find((val) => val.key === status )
    else 
      return fr.questionOptions.legalStatus.find((val) => val.key === status )
  }

  function getMaritalStatus(status: string): {key: string,text: string} {
    if (status === undefined) return undefined
    if (currentLocale == 'en') 
      return en.questionOptions.maritalStatus.find((val) => val.key === status )
    else 
      return fr.questionOptions.maritalStatus.find((val) => val.key === status )
  }

  function getPartnerBenefitStatus(status: string): {key: string,text: string} {
    if (status === undefined) return undefined
    if (currentLocale == 'en') 
      return en.questionOptions.partnerBenefitStatus.find((val) => val.key === status )
    else 
      return fr.questionOptions.partnerBenefitStatus.find((val) => val.key === status )
  }

  console.log('answersKeys length = ', answersKeys.length)

  if (answersKeys.length === 0) 
  return (
    <div className="fz-10">
      <div className="p-8 bg-emphasis rounded mt-8 md:mt-0 md:max-w-[380px]">
        <h3 className="h3">{title}</h3>
        <div className='py-4'>
          No answers found
        </div>
      </div>
    </div>
  )

  if (answersKeys.length !== 0) 
  return (
    <div className="fz-10">
      <div className="p-8 bg-emphasis rounded mt-8 md:mt-0 md:max-w-[380px]">
        <h3 className="h3">{title}</h3>
        {console.log('all the translations', tsln.resultsQuestions)}
        {console.log('anskeys = ', answersKeys)}

        {/* Age */}
        {(answersKeys.indexOf(FieldKey.AGE) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.AGE)][0]]} <br />
            <strong>{answers[answersKeys.indexOf(FieldKey.AGE)][1]}</strong> &nbsp;
            <DSLink
              id={`helpLink${answers[answersKeys.indexOf(FieldKey.AGE)][0]}`}
              href=" " 
              text="Edit"
              target="_blank"
            />
          </div>
        )}

        {/* Income */}
        {(answersKeys.indexOf(FieldKey.INCOME) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.INCOME)][0]]} <br />
            <strong>{answers[answersKeys.indexOf(FieldKey.INCOME)][1]}</strong> &nbsp;
            <DSLink
              id={`helpLink${answers[answersKeys.indexOf(FieldKey.INCOME)][0]}`}
              href=" " 
              text="Edit"
              target="_blank"
            />
          </div>
        )}

        {/* Legal Status */}
        {(answersKeys.indexOf(FieldKey.LEGAL_STATUS) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.LEGAL_STATUS)][0]]} <br />
            <strong>{getLegalStatus(answers[answersKeys.indexOf(FieldKey.LEGAL_STATUS)][1]).text}</strong> &nbsp;
            <DSLink
              id={`helpLink${answers[answersKeys.indexOf(FieldKey.LEGAL_STATUS)][0]}`}
              href=" " 
              text="Edit"
              target="_blank"
            />
          </div>
        )}

        {/* Residence */}
        {( answersKeys.indexOf(FieldKey.LIVING_COUNTRY) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.LIVING_COUNTRY)][0]]} <br />
            <strong>{getLivingCountry(answers[answersKeys.indexOf(FieldKey.LIVING_COUNTRY)][1]).text}</strong> &nbsp;
            <DSLink
              id={`helpLink${answers[answersKeys.indexOf(FieldKey.LIVING_COUNTRY)][0]}`}
              href=" " 
              text="Edit"
              target="_blank"
            />
          </div>
        )}

        {/* Lived outside of Canada */}
        {(answersKeys.indexOf(FieldKey.LIVED_OUTSIDE_CANADA) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.LIVED_OUTSIDE_CANADA)][0]]} <br />
            {answers[answersKeys.indexOf(FieldKey.LIVED_OUTSIDE_CANADA)][1] === 'true' ? (
              <>
                <div>
                  <strong>{tsln.yes}</strong> &nbsp;
                  <DSLink
                    id={`helpLink${answers[answersKeys.indexOf(FieldKey.LIVING_COUNTRY)][0]}`}
                    href=" " 
                    text="Edit"
                    target="_blank"
                  />
                  <br />
                  <strong>{answers[answersKeys.indexOf(FieldKey.YEARS_IN_CANADA_SINCE_18)][1]}</strong> &nbsp;
                  {Number(answers[answersKeys.indexOf(FieldKey.YEARS_IN_CANADA_SINCE_18)][1]) > 1 ? tsln.years : tsln.year} &nbsp;
                  <DSLink
                    id={`helpLink${answers[answersKeys.indexOf(FieldKey.LIVING_COUNTRY)][0]}`}
                    href=" " 
                    text="Edit"
                    target="_blank"
                  />
                </div>
              </>
            ) : (
              <>
                <strong>tsln.no</strong>
                <DSLink
                  id={`helpLink${answers[answersKeys.indexOf(FieldKey.LIVING_COUNTRY)][0]}`}
                  href=" " 
                  text="Edit"
                  target="_blank"
                />
              </>
            )}
          </div>
        )}

        {/* Marital Status */}
        {(answersKeys.indexOf(FieldKey.MARITAL_STATUS) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.MARITAL_STATUS)][0]]} <br />
            {console.log(answers[answersKeys.indexOf(FieldKey.MARITAL_STATUS)][1])}
            <strong>{getMaritalStatus(answers[answersKeys.indexOf(FieldKey.MARITAL_STATUS)][1]).text}</strong> &nbsp;
            <DSLink
              id={`helpLink${answers[answersKeys.indexOf(FieldKey.MARITAL_STATUS)][0]}`}
              href=" " 
              text="Edit"
              target="_blank"
            />
          </div>
        )}

        {/* Partner's Income */}
        {( answersKeys.indexOf(FieldKey.PARTNER_INCOME) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.PARTNER_INCOME)][0]]} <br />
            <strong>{answers[answersKeys.indexOf(FieldKey.PARTNER_INCOME)][1]}</strong> &nbsp;
            <DSLink
              id={`helpLink${answers[answersKeys.indexOf(FieldKey.PARTNER_INCOME)][0]}`}
              href=" " 
              text="Edit"
              target="_blank"
            />
          </div>
        )}

        {/* Partner's Old Age Benefit */}
        {(answersKeys.indexOf(FieldKey.PARTNER_INCOME) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.PARTNER_INCOME)][0]]} <br />
            <strong>{getPartnerBenefitStatus(answers[answersKeys.indexOf(FieldKey.PARTNER_BENEFIT_STATUS)][1]).text}</strong> &nbsp;
            <DSLink
              id={`helpLink${answers[answersKeys.indexOf(FieldKey.PARTNER_BENEFIT_STATUS)][0]}`}
              href=" " 
              text="Edit"
              target="_blank"
            />
          </div>
        )}

        {/* Partner's Legal Status */}
        {(answersKeys.indexOf(FieldKey.PARTNER_LEGAL_STATUS) > 0 && 
          <div className='py-4 border-b-2 border-info-border'>
            {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.PARTNER_LEGAL_STATUS)][0]]} <br />
            <strong>{getLegalStatus(answers[answersKeys.indexOf(FieldKey.PARTNER_LEGAL_STATUS)][1]).text}</strong> &nbsp;
            <DSLink
              id={`helpLink${answers[answersKeys.indexOf(FieldKey.PARTNER_LEGAL_STATUS)][0]}`}
              href=" " 
              text="Edit"
              target="_blank"
            />
          </div>
        )}

        {/* Partner's Lived Outside of Canada */}
        {(answersKeys.indexOf(FieldKey.PARTNER_LIVING_COUNTRY) > 0 &&
          <div className='py-4 border-b-2 border-info-border'>
          {tsln.resultsQuestions[answers[answersKeys.indexOf(FieldKey.PARTNER_LIVING_COUNTRY)][0]]} <br />
            {answers[answersKeys.indexOf(FieldKey.LIVED_OUTSIDE_CANADA)][1] === 'true' ? (
              <>
                <div>
                  <strong>{tsln.yes}</strong> &nbsp;
                  <DSLink
                    id={`helpLink${answers[answersKeys.indexOf(FieldKey.PARTNER_LIVING_COUNTRY)][0]}`}
                    href=" " 
                    text="Edit"
                    target="_blank"
                  />
                  <br />
                  <strong>{answers[answersKeys.indexOf(FieldKey.YEARS_IN_CANADA_SINCE_18)][1]}</strong> &nbsp;
                  {Number(answers[answersKeys.indexOf(FieldKey.YEARS_IN_CANADA_SINCE_18)][1]) > 1 ? tsln.years : tsln.year} &nbsp;
                  <DSLink
                    id={`helpLink${answers[answersKeys.indexOf(FieldKey.PARTNER_LIVING_COUNTRY)][0]}`}
                    href=" " 
                    text="Edit"
                    target="_blank"
                  />
                </div>
              </>
            ) : (
              <>
                <strong>tsln.no</strong>
                <DSLink
                  id={`helpLink${answers[answersKeys.indexOf(FieldKey.PARTNER_LIVING_COUNTRY)][0]}`}
                  href=" " 
                  text="Edit"
                  target="_blank"
                />
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
