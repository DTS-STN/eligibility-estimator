import { Tab } from '@headlessui/react'
import { observer } from 'mobx-react'
import { Instance } from 'mobx-state-tree'
import { useRouter } from 'next/router'
import { RootStore } from '../../client-state/store'
import { WebTranslations } from '../../i18n/web'
import { ResponseSuccess } from '../../utils/api/definitions/types'
import { FAQ } from '../FAQ'
import { ComponentFactory } from '../Forms/ComponentFactory'
import { useStore, useTranslation } from '../Hooks'
import { ResultsPage } from '../ResultsPage'

export const Tabs: React.FC<ResponseSuccess> = observer((props) => {
  const root: Instance<typeof RootStore> = useStore()
  const tsln = useTranslation<WebTranslations>()
  const locale = useRouter().locale

  return (
    <Tab.Group
      key={root.activeTab}
      defaultIndex={root.activeTab}
      onChange={(index) => {
        root.setActiveTab(index)
        if (process.browser) {
          const win = window as Window &
            typeof globalThis & { adobeDataLayer: any; _satellite: any }
          const lang = locale == 'en' ? 'eng' : 'fra'
          const title =
            lang +
            '-sc labs-eligibility estimator-' +
            root.getTabNameForAnalytics(index)

          console.log(win._satellite.getVar('jsAbort'))
          console.log(title)

          win.adobeDataLayer.push({
            event: 'pageLoad',
            page: {
              title: title,
              language: lang,
              creator: 'Employment and Social Development Canada',
              accessRights: '2',
              service:
                'ESDC-EDSC_OldAgeBenefitsEstimator-EstimateurDePrestationsDeVieillesse',
            },
          })
        }
      }}
    >
      <Tab.List
        className={`flex flex-col md:flex-row gap-x-5 gap-y-4 pb-4 border-b border-form-border`}
        id="tabList"
      >
        <Tab
          className={({ selected }) =>
            selected
              ? 'bg-[#26374A] rounded text-white border border-[#2572B4] px-4 py-3 text-left md:text-center'
              : 'bg-white rounded text-muted border border-muted px-4 py-3 underline text-left md:text-center'
          }
        >
          {tsln.questions}
        </Tab>
        <Tab
          className={({ selected }) =>
            selected
              ? 'results-tab bg-[#26374A] rounded text-white border border-[#2572B4] px-4 py-3 text-left md:text-center'
              : 'results-tab bg-white rounded text-muted border border-muted px-4 py-3 underline text-left md:text-center'
          }
        >
          {tsln.results}
        </Tab>
        <Tab
          className={({ selected }) =>
            selected
              ? 'bg-[#26374A] rounded text-white border border-[#2572B4] px-4 py-3 text-left md:text-center'
              : 'bg-white rounded text-muted border border-muted px-4 py-3 underline text-left md:text-center'
          }
        >
          {tsln.faq}
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className="mt-10">
          <div className="md:container mt-14">
            <ComponentFactory data={props} />
          </div>
        </Tab.Panel>
        <Tab.Panel className="mt-10">
          <ResultsPage />
        </Tab.Panel>
        <Tab.Panel className="mt-10">
          <FAQ />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
})
