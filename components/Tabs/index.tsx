import { Tab } from '@headlessui/react'
import { observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import { PropsWithChildren, useState } from 'react'
import { RootStore } from '../../client-state/store'
import {
  ResponseSuccess,
  ResponseError,
} from '../../utils/api/definitions/types'
import { FAQ } from '../FAQ'
import { ComponentFactory } from '../Forms/ComponentFactory'
import { useStore } from '../Hooks'
import { ResultsPage } from '../ResultsPage'

export const Tabs: React.FC<PropsWithChildren<any>> = observer((props) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
  const root: Instance<typeof RootStore> = useStore()

  return (
    <Tab.Group
      key={selectedTabIndex}
      defaultIndex={selectedTabIndex}
      onChange={(index) => {
        setSelectedTabIndex(index)
      }}
    >
      <Tab.List className={`border-b border-muted/20`}>
        <Tab
          className={({ selected }) =>
            selected
              ? 'bg-white font-semibold p-2.5 pt-1.5 border border-t-4 border-content/90 border-r-muted/20 border-b-muted/20 border-l-muted/20 mr-2'
              : 'bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 mr-2'
          }
        >
          Questions
        </Tab>
        <Tab
          className={({ selected }) =>
            selected
              ? 'results-tab bg-white font-semibold p-2.5 pt-1.5 border border-t-4 border-content/90 border-r-muted/20 border-b-muted/20  border-l-muted/20 mr-2'
              : 'results-tab bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 mr-2 disabled:cursor-not-allowed disabled:bg-[#949494]'
          }
        >
          Results
        </Tab>
        <Tab
          className={({ selected }) =>
            selected
              ? 'bg-white font-semibold p-2.5 pt-1.5 border border-t-4 border-content/90 border-r-muted/20 border-b-muted/20  border-l-muted/20'
              : 'bg-[#EBF2FC] font-semibold p-2.5 border border-muted/20 disabled'
          }
        >
          FAQ
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className="mt-10">
          <div className="md:container mt-14">
            <ComponentFactory
              data={props}
              selectedTabIndex={setSelectedTabIndex}
            />
          </div>
        </Tab.Panel>
        <Tab.Panel className="mt-10">
          <ResultsPage root={root} setSelectedTab={setSelectedTabIndex} />
        </Tab.Panel>
        <Tab.Panel className="mt-10">
          <FAQ />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
})
