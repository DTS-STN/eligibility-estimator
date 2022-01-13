import React from 'react'
import { useStorage } from '../Hooks'
import { RootStore } from '../../client-state/store'
import { Instance } from 'mobx-state-tree'

export const LanguageContext = React.createContext({
  userLanguage: 'en',
  userLanguageChange: (selected) => void 0,
})

export function LanguageProvider({ children }) {
  const [userLanguage, setUserLanguage] = useStorage<string>(
    'local',
    'lang',
    'en'
  )

  return (
    <LanguageContext.Provider
      value={{
        userLanguage,
        userLanguageChange: (selected) => setUserLanguage(selected),
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const RootStoreContext = React.createContext<null | Instance<
  typeof RootStore
>>(null)

export function StoreProvider({ children }) {
  return (
    <RootStoreContext.Provider
      value={RootStore.create({
        form: {},
        oas: {},
        gis: {},
        afs: {},
        allowance: {},
        summary: {},
      })}
    >
      {children}
    </RootStoreContext.Provider>
  )
}
