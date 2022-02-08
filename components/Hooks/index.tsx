import { Instance } from 'mobx-state-tree'
import { useCallback, useContext, useEffect, useState } from 'react'
import { RootStore } from '../../client-state/store'
import { dictionaryList } from '../../i18n'
import { LanguageContext, RootStoreContext } from '../Contexts'

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

export function useStore(): Instance<typeof RootStore> {
  const store = useContext(RootStoreContext)
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider')
  }
  return store
}

export const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false)

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true)
    } else {
      setTargetReached(false)
    }
  }, [])

  useEffect(() => {
    if (process.browser) {
      const media = window.matchMedia(`(max-width: ${width - 1}px)`)
      media.addEventListener('change', updateTarget)

      // Check on mount (callback is not called until a change occurs)
      if (media.matches) {
        setTargetReached(true)
      }

      return () => media.removeEventListener('change', updateTarget)
    }
  }, [width, updateTarget])

  return targetReached
}

export const useWindowWidth = () => {
  const [width, setWidth] = useState(0)
  const handleResize = () => setWidth(window.innerWidth)
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [width])
  return width
}
