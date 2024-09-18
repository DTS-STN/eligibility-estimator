import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

export const Intro: React.VFC<{
  hasPartner: boolean
  userAge: number
  estimateLength: number
  hasMultipleOasGis: boolean
}> = ({ hasPartner, userAge, estimateLength, hasMultipleOasGis }) => {
  const tsln = useTranslation<WebTranslations>()
  return (
    <>
      <p dangerouslySetInnerHTML={{ __html: tsln.resultsPage.general }} />
      <div className="h2 my-8">{tsln.resultsPage.yourMonEstimateHeading}</div>
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
          <p>{tsln.resultsPage.youEstimateMayChange}</p>
          <ul className="pl-[35px] ml-[20px] my-1 list-disc text-content">
            <li>{tsln.resultsPage.basedYourAge}</li>
            <li>{tsln.resultsPage.basedYourPartner}</li>
          </ul>
          <p className="my-6">
            {userAge > 70 && hasMultipleOasGis
              ? tsln.resultsPage.ifYouChoseToDefer
              : ''}{' '}
            {tsln.resultsPage.changeInSituation}
          </p>
        </div>
      )}
    </>
  )
}
