import { FC } from 'react'
import { WebTranslations } from '../../i18n/web'
import { useTranslation } from '../Hooks'

interface AgeProps {
  age: string
  name: string
}

const Age: FC<AgeProps> = ({ age, name }) => {
  const tsln = useTranslation<WebTranslations>()
  const getLabel = () => {
    if (name === 'age') {
      return tsln._language === 'en' ? 'You are:' : 'Vous avez :'
    } else if (name === 'partnerAge') {
      return tsln._language === 'en' ? 'Your partner is:' : 'Votre conjoint a :'
    }
  }
  return (
    <>
      <p>{getLabel()}</p>
      <div>
        {Math.floor(Number(age))}{' '}
        {tsln._language === 'en' ? 'years old' : 'ans'}
      </div>
    </>
  )
}

export default Age
