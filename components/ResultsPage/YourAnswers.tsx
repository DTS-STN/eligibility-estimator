import { Link as DSLink } from '@dts-stn/decd-design-system'
import { Instance } from 'mobx-state-tree'
import { SummaryLink } from '../../client-state/store'
import { useRouter } from 'next/router'
import { useStore, useTranslation } from '../Hooks'
import { WebTranslations } from '../../i18n/web'
import { Locale } from '../../utils/api/definitions/enums'

export const YourAnswers: React.VFC<{
  title: string
  questions: Array<[ string, string ]>
}> = ({ title, questions }) => {
  const root = useStore()

  const tsln = useTranslation<WebTranslations>()
  const currentLocale = useRouter().locale

  const locale = currentLocale == 'en' ? Locale.EN : Locale.FR
  const answers = questions.filter( question => question[0] !== '_language')

  return (
    <div className="fz-10">
      <div className="p-8 bg-emphasis rounded mt-8 md:mt-0 md:max-w-[380px]">
        <h3 className="h3">{title}</h3>
        {console.log('all the translations', tsln.resultsQuestions)}
          {answers &&
            answers.map(([key,value], index) => (
              <div className='py-2' key={index}>
                {tsln.resultsQuestions[key]} <br />
                <strong>{value}</strong> &nbsp;
                <DSLink
                  id={`helpLink${index}`}
                  href=" " 
                  text="Edit"
                  target="_blank"
                />
              </div>
            ))}
      </div>
    </div>
  )
}
