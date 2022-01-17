import { types, IMaybe, ISimpleType, ModelCreationType } from 'mobx-state-tree'
import {
  ExtractCFromProps,
  IArrayType,
  IModelType,
  _NotCustomized,
} from 'mobx-state-tree/dist/internal'
import {
  EstimationSummaryState,
  ResultKey,
} from '../utils/api/definitions/enums'
import { Form } from './models/Form'

export const Eligibility = types.model({
  eligibilityResult: types.maybe(types.enumeration(Object.values(ResultKey))),
  entitlementResult: types.maybe(types.number),
  reason: types.maybe(types.string),
  detail: types.maybe(types.string),
})

export const OAS = Eligibility.named('OAS')
export const GIS = Eligibility.named('GIS')
export const AFS = Eligibility.named('AFS')
export const Allowance = Eligibility.named('Allowance')

export const SummaryLink = types.model({
  url: types.string,
  text: types.string,
  order: types.number,
})

export const Summary = types.model({
  state: types.maybe(types.enumeration(Object.values(EstimationSummaryState))),
  details: types.maybe(types.string),
  title: types.maybe(types.string),
  links: types.maybe(types.array(SummaryLink)),
})

export const RootStore = types
  .model({
    form: Form,
    oas: OAS,
    gis: GIS,
    afs: AFS,
    allowance: Allowance,
    summary: Summary,
    activeTab: types.optional(types.number, 0),
  })
  .views((self) => ({
    get totalEntitlementInDollars() {
      return (
        self.oas.entitlementResult +
        (self.gis.entitlementResult !== -1 ? self.gis.entitlementResult : 0) + // gis can return a -1 for an unavailable calculation, correct for this
        self.allowance?.entitlementResult +
        self.afs?.entitlementResult
      ).toFixed(2)
    },
  }))
  .actions((self) => ({
    setActiveTab(num: number) {
      self.activeTab = num
    },
    setOAS(
      input: ModelCreationType<
        ExtractCFromProps<{
          eligibilityResult: IMaybe<ISimpleType<ResultKey>>
          entitlementResult: IMaybe<ISimpleType<number>>
          reason: IMaybe<ISimpleType<string>>
          detail: IMaybe<ISimpleType<string>>
        }>
      >
    ) {
      self.oas = OAS.create(input)
    },
    setGIS(
      input: ModelCreationType<
        ExtractCFromProps<{
          eligibilityResult: IMaybe<ISimpleType<ResultKey>>
          entitlementResult: IMaybe<ISimpleType<number>>
          reason: IMaybe<ISimpleType<string>>
          detail: IMaybe<ISimpleType<string>>
        }>
      >
    ) {
      self.gis = GIS.create(input)
    },
    setAFS(
      input: ModelCreationType<
        ExtractCFromProps<{
          eligibilityResult: IMaybe<ISimpleType<ResultKey>>
          entitlementResult: IMaybe<ISimpleType<number>>
          reason: IMaybe<ISimpleType<string>>
          detail: IMaybe<ISimpleType<string>>
        }>
      >
    ) {
      self.afs = AFS.create(input)
    },
    setAllowance(
      input: ModelCreationType<
        ExtractCFromProps<{
          eligibilityResult: IMaybe<ISimpleType<ResultKey>>
          entitlementResult: IMaybe<ISimpleType<number>>
          reason: IMaybe<ISimpleType<string>>
          detail: IMaybe<ISimpleType<string>>
        }>
      >
    ) {
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
