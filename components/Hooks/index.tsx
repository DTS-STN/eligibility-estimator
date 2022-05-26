import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'
import { webDictionary, WebTranslations } from '../../i18n/web'
import { RootStoreContext } from '../Contexts'

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

export function useStore() {
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
    if (typeof window !== undefined && window.matchMedia) {
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

export function useTranslation<T = string | WebTranslations>(key?: string): T {
  const { locale } = useRouter()
  if (key) {
    return webDictionary[locale][key]
  }
  return webDictionary[locale]
}
