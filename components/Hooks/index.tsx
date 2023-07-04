import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { webDictionary, WebTranslations } from '../../i18n/web'

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
  const newLocale = locale === 'default' ? 'en' : locale
  if (key) {
    return webDictionary[newLocale][key]
  }
  return webDictionary[newLocale]
}
