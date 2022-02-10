import { Instance } from 'mobx-state-tree'
import { useRouter } from 'next/router'
import React from 'react'
import { RootStore } from '../../client-state/store'
import { Language } from '../../utils/api/definitions/enums'

export const RootStoreContext = React.createContext<null | Instance<
  typeof RootStore
>>(null)

export function StoreProvider({ children }) {
  const router = useRouter()
  return (
    <RootStoreContext.Provider
      value={RootStore.create({
        form: {},
        oas: {},
        gis: {},
        afs: {},
        allowance: {},
        summary: {},
        lang: router.locale == 'en' ? Language.EN : Language.FR,
      })}
    >
      {children}
    </RootStoreContext.Provider>
  )
}
