import {
  IArrayType,
  IMaybe,
  IModelType,
  Instance,
  ISimpleType,
  ModelCreationType,
  types,
} from 'mobx-state-tree'
import { ExtractCFromProps } from 'mobx-state-tree/dist/internal'
import {
  EntitlementResultType,
  EstimationSummaryState,
  Language,
  LinkLocation,
  ResultKey,
} from '../utils/api/definitions/enums'
import { Form } from './models/Form'

export const EligibilityResult = types.model({
  detail: types.maybe(types.string),
  reason: types.maybe(types.string),
  result: types.maybe(types.enumeration(Object.values(ResultKey))),
})

export const EntitlementResult = types.model({
  type: types.maybe(types.enumeration(Object.values(EntitlementResultType))),
  result: types.maybe(types.number),
})

export const Eligibility = types.model({
  eligibility: types.maybe(EligibilityResult),
  entitlement: types.maybe(EntitlementResult),
})

export const OAS = Eligibility.named('OAS')
export const GIS = Eligibility.named('GIS')
export const AFS = Eligibility.named('AFS')
export const Allowance = Eligibility.named('Allowance')

export const SummaryLink = types.model({
  url: types.string,
  text: types.string,
  order: types.number,
  location: types.enumeration(Object.values(LinkLocation)),
})

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
    lang: types.enumeration(Object.values(Language)),
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
  }))
  .actions((self) => ({
    setActiveTab(num: number) {
      self.activeTab = num
    },
    setCurrentLang(lang: Language) {
      self.lang = lang
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
      self.summary = Summary.create(input)
    },
  }))
