import { useContext, useState } from 'react'
import { LanguageContext } from '../Contexts'
import { languageOptions, dictionaryList } from '../../i18n'

type StorageType = 'session' | 'local'

// Stuff's a user's data into the client side storage of the developer's choosing
export const useStorage = <T,>(
  type: StorageType,
  key: string,
  initialValue: T
) => {
  // NextJs renders component serverside and there is no window available there
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')()

  const store = type == 'local' ? 'localStorage' : 'sessionStorage'

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (isBrowser) {
        const item = window[store].getItem(key)
        return item ? JSON.parse(item) : initialValue
      }
      return ''
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)
      window[store].setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue] as const
}

// For text heavy components, just pull in the correct language's dictionary and use dot notation to get your values in the component
export const useTranslation = () => {
  const { userLanguage } = useContext(LanguageContext)

  // use current language to fetch the correct i18n data
  return dictionaryList[userLanguage]
}

// For one off text needs where you want a specific text value internationalized
export const useInternationalization = (key: string) => {
  const { userLanguage } = useContext(LanguageContext)
  if (dictionaryList[userLanguage] == undefined) return ''
  return dictionaryList[userLanguage][key]
}
