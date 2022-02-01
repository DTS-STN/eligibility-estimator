import { types, IMaybe, ISimpleType, ModelCreationType } from 'mobx-state-tree'
import {
  ExtractCFromProps,
  IArrayType,
  IModelType,
  _NotCustomized,
} from 'mobx-state-tree/dist/internal'
import {
  EstimationSummaryState,
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
  type: types.maybe(types.string),
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
  })
  .views((self) => ({
    get nextStepsLink() {
      return self.links.find(
        (link) => link.location === LinkLocation.RESULTS_APPLY
      )
    },
    get needHelpLinks() {
      return self.links.filter(
        (link) => link.location === LinkLocation.STANDARD
      )
    },
    get moreInfoLinks() {
      return self.links.filter(
        (link) => link.location !== LinkLocation.RESULTS_APPLY
      )
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
  })
  .views((self) => ({
    get totalEntitlementInDollars() {
      return (
        self.oas.entitlement.result +
        (self.gis.entitlement.result !== -1 ? self.gis.entitlement.result : 0) + // gis can return a -1 for an unavailable calculation, correct for this
        self.allowance?.entitlement.result +
        self.afs?.entitlement.result
      ).toFixed(2)
    },
  }))
  .actions((self) => ({
    setActiveTab(num: number) {
      self.activeTab = num
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
                {},
                _NotCustomized,
                _NotCustomized
              >
            >
          >
        }>
      >
    ) {
      self.summary = Summary.create(input)
    },
  }))
