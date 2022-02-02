import React from 'react'
import { RootStore } from '../../client-state/store'
import { Instance } from 'mobx-state-tree'

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
