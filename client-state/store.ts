import {
  getSnapshot,
  IArrayType,
  IMaybe,
  IModelType,
  Instance,
  ISimpleType,
  ModelCreationType,
  types,
} from 'mobx-state-tree'
import { ExtractCFromProps, SnapshotIn } from 'mobx-state-tree/dist/internal'
import {
  EntitlementResultType,
  EstimationSummaryState,
  Language,
  LinkIcon,
  LinkLocation,
  ResultKey,
} from '../utils/api/definitions/enums'
import { Form } from './models/Form'

export const EligibilityResult = types.model({
  detail: types.maybe(types.string),
  reason: types.maybe(types.string),
  result: types.maybe(types.enumeration(Object.values(ResultKey))),
})

export const DeferralResult = types.model({
  increase: types.maybe(types.number),
  years: types.maybe(types.number),
})

export const EntitlementResult = types.model({
  type: types.maybe(types.enumeration(Object.values(EntitlementResultType))),
  result: types.maybe(types.number),
  resultAt75: types.maybe(types.number),
  clawback: types.maybe(types.number),
  deferral: types.maybe(DeferralResult),
})

export const CollapsedText = types.model({
  heading: types.string,
  text: types.string,
})

export const SummaryLink = types.model({
  url: types.string,
  text: types.string,
  order: types.number,
  location: types.enumeration(Object.values(LinkLocation)),
  icon: types.maybe(types.enumeration(Object.values(LinkIcon))),
})

export const CardDetail = types.model({
  mainText: types.string,
  collapsedText: types.maybe(types.array(CollapsedText)),
  links: types.maybe(types.array(SummaryLink)),
})

export const BenefitResult = types.model({
  benefitKey: types.maybe(types.string),
  eligibility: types.maybe(EligibilityResult),
  entitlement: types.maybe(EntitlementResult),
  cardDetail: types.maybe(CardDetail),
})

export const OAS = BenefitResult.named('OAS')
export const GIS = BenefitResult.named('GIS')
export const AFS = BenefitResult.named('AFS')
export const Allowance = BenefitResult.named('Allowance')

export const Summary = types
  .model({
    state: types.maybe(
      types.enumeration(Object.values(EstimationSummaryState))
    ),
    details: types.maybe(types.string),
    title: types.maybe(types.string),
    links: types.maybe(types.array(SummaryLink)),
    entitlementSum: types.maybe(types.number),
  })
  .views((self) => ({
    get zeroEntitlements(): boolean {
      return self.entitlementSum == 0
    },
    get nextStepsLinks(): Instance<typeof SummaryLink>[] {
      return self.links
        ? self.links.filter(
            (link) => link.location === LinkLocation.RESULTS_APPLY
          )
        : null
    },
    get needHelpLinks() {
      return self.links
        ? self.links.filter(
            (link) =>
              link.location === LinkLocation.STANDARD ||
              link.location === LinkLocation.QUESTIONS_ONLY
          )
        : []
    },
    get moreInfoLinks() {
      return self.links
        ? self.links.filter(
            (link) =>
              link.location === LinkLocation.STANDARD ||
              link.location === LinkLocation.RESULTS_ONLY
          )
        : []
    },
  }))

export const RootStore = types
  .model({
    form: types.maybe(Form),
    oas: types.maybe(OAS),
    gis: types.maybe(GIS),
    afs: types.maybe(AFS),
    allowance: types.maybe(Allowance),
    summary: types.maybe(Summary),
    activeTab: types.optional(types.number, 0),
    // a [key, value] array of the user's form inputs
    inputs: types.array(types.array(types.string)),
    // the language of the data currently stored in the state
    langData: types.enumeration(Object.values(Language)),
    // the language of the client's browser
    langBrowser: types.enumeration(Object.values(Language)),
  })
  .views((self) => ({
    getTabNameForAnalytics(index: number) {
      if (index == 0) {
        return 'questions'
      } else if (index == 1) {
        return 'results'
      } else if (index == 2) {
        return 'faq'
      }
      return 'unknown'
    },
    // converts the input data from an array to an object
    getInputObject() {
      let input = {}
      for (const field of self.inputs) {
        input[field[0]] = field[1]
      }
      console.log('generated input object', input)
      return input
    },
    getResultArray() {
      return [self.oas, self.gis, self.allowance, self.afs]
    },
    // getResultObject() {
    //   return {
    //     oas: self.oas,
    //     gis: self.gis,
    //     alw: self.allowance,
    //     afs: self.afs,
    //   }
    // },
  }))
  .actions((self) => ({
    setActiveTab(num: number) {
      self.activeTab = num
    },
    setLangData(lang: Language) {
      console.log('set langData to', lang)
      self.langData = lang
    },
    setLangBrowser(lang: Language) {
      console.log('set langBrowser to', lang)
      self.langBrowser = lang
    },
    setOAS(input) {
      self.oas = OAS.create(input)
    },
    setGIS(input) {
      self.gis = GIS.create(input)
    },
    setAFS(input) {
      self.afs = AFS.create(input)
    },
    setAllowance(input) {
      self.allowance = Allowance.create(input)
    },
    setInputs(input) {
      console.log('set inputs to', input)
      self.inputs = input
    },
    setSummary(
      input: ModelCreationType<
        ExtractCFromProps<{
          state: IMaybe<ISimpleType<EstimationSummaryState>>
          details: IMaybe<ISimpleType<string>>
          title: IMaybe<ISimpleType<string>>
          links: IMaybe<
            IArrayType<
              IModelType<
                {
                  url: ISimpleType<string>
                  text: ISimpleType<string>
                  order: ISimpleType<number>
                },
                {}
              >
            >
          >
          entitlementSum: IMaybe<ISimpleType<number>>
        }>
      >
    ) {
      const newSummary = Summary.create(input)
      // we will only update the summary if there is a difference, otherwise we will trigger an unnecessary re-render
      if (JSON.stringify(self.summary) !== JSON.stringify(newSummary)) {
        console.log('updating summary')
        self.summary = newSummary
      } else console.log('not updating summary')
    },
    saveStoreState() {
      if (typeof window !== 'undefined') {
        const snapshot = getSnapshot(self)
        window.sessionStorage.setItem('store', JSON.stringify(snapshot))
        console.log('saved snapshot', snapshot)
      }
    },
    bootstrapStoreState(store: SnapshotIn<typeof RootStore>) {
      self.form = Form.create(store.form)
      self.oas = OAS.create(store.oas)
      self.gis = GIS.create(store.gis)
      self.allowance = Allowance.create(store.allowance)
      self.afs = AFS.create(store.afs)
      self.summary = Summary.create(store.summary)
      console.log('loading store with inputs', store.inputs)
      self.inputs = store.inputs
      console.log(`loading store with langData ${store.langData}`)
      if (store.langData) self.langData = store.langData
    },
  }))
