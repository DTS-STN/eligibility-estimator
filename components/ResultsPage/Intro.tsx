import { useRouter } from 'next/router'
import { WebTranslations } from '../../i18n/web'
import { Language } from '../../utils/api/definitions/enums'
import { useTranslation } from '../Hooks'

export const Intro: React.VFC<{
  hasPartner: boolean
  userAge: number
  estimateLength: number
  hasMultipleOasGis: boolean
  alreadyReceiving: boolean
}> = ({
  hasPartner,
  userAge,
  estimateLength,
  hasMultipleOasGis,
  alreadyReceiving,
}) => {
  const tsln = useTranslation<WebTranslations>()
  const language = useRouter().locale as Language

  return (
    <>
      <p dangerouslySetInnerHTML={{ __html: tsln.resultsPage.general }} />
      <h2 className="h2 my-8">{tsln.resultsPage.yourMonEstimateHeading}</h2>
      {estimateLength == 1 && (
        <p className="my-5">{tsln.resultsPage.changeInSituation}</p>
      )}
      {estimateLength > 1 && !hasPartner && (
        <p className="my-5">
          {tsln.resultsPage.youEstimateMayChange}{' '}
          {tsln.resultsPage.basedYourAge}. {tsln.resultsPage.changeInSituation}
        </p>
      )}
      {estimateLength > 1 && hasPartner && (
        <div>
          <p>
            {tsln.resultsPage.youEstimateMayChange}
            {':'}
          </p>
          <ul className="pl-[35px] ml-[20px] my-1 list-disc text-content">
            <li>
              {tsln.resultsPage.basedYourAge}
              {language == 'fr' ? ';' : ''}
            </li>
            <li>{tsln.resultsPage.basedYourPartner}</li>
          </ul>
          <p className="my-6">
            {userAge < 70 && hasMultipleOasGis
              ? tsln.resultsPage.ifYouChoseToDefer
              : ''}{' '}
            {tsln.resultsPage.changeInSituation}
          </p>
        </div>
      )}
    </>
  )
}
