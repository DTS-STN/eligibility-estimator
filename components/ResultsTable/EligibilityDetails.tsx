import { Instance } from 'mobx-state-tree'
import { Eligibility } from '../../client-state/store'

type EligibilityType = Instance<typeof Eligibility>

export const EligibilityDetails: React.VFC<{
  eligibilityType: EligibilityType
}> = ({ eligibilityType }) => (
  <>
    {eligibilityType.eligibility.detail.split('\n').map((str, i) => (
      <p
        className=".question-link"
        key={i}
        className={i == 0 ? `inline` : ''}
        dangerouslySetInnerHTML={{ __html: str }}
      />
    ))}
  </>
)
