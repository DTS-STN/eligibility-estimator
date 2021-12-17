import { ChangeEvent, Dispatch, useState } from 'react'
import { Input } from './Input'
import { Radio } from './Radio'
import { CustomSelect } from './Select'
import Select, { InputActionMeta } from 'react-select'
import { debounce, has } from 'lodash'
import { useRouter } from 'next/router'
import { sortBy } from 'lodash'
import type {
  BenefitResult,
  ResponseSuccess,
} from '../../utils/api/definitions/types'
import { FieldData } from '../../utils/api/definitions/fields'
import { Tooltip } from '../Tooltip/tooltip'
import { validateIncome } from '../../utils/api/helpers/validator'

// can probably use .env for this
const API_URL = `api/calculateEligibility`
let formCompletion = {}

export const ComponentFactory: React.VFC<{
  data: ResponseSuccess
  oas: Dispatch<BenefitResult>
  gis: Dispatch<BenefitResult>
  allowance: Dispatch<BenefitResult>
  afs: Dispatch<BenefitResult>
  setProgress: Dispatch<any>
  selectedTabIndex: Dispatch<number>
}> = ({ data, oas, gis, allowance, afs, selectedTabIndex, setProgress }) => {
  let lastCategory = null

  const router = useRouter()
  const query = router.query
  formCompletion = { ...query }

  const orderedFields = sortBy(data.fieldData, 'order')
  const [formState, setFormState] = useState(orderedFields)

  /**
   * send a GET request to the API, appended with query string data
   * @param queryString the query string to append to the API's get request
   */
  const sendAPIRequest = (queryString: string) => {
    fetch(`${API_URL}?${queryString}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          console.log(data)
          setFormState(data.fieldData)

          oas(data.oas)
          gis(data.gis)
          allowance(data.allowance)
          afs(data.afs)

          //set Progress
          checkCompletion(data.fieldData, formCompletion, setProgress)
        } else {
          // handle error - validate per field once validation designs are complete
        }
      })
  }

  /**
   * Global change handler for the dynamic form elements in the eligibility form
   */
  const handleChange = async () => {
    const formData = retrieveFormData()
    if (!formData) return
    const qs = buildQueryStringFromFormData(formData)

    // client cannot use calculator, their income is too high
    if (validateIncome(formData.get('income') as string))
      router.push(`/eligibility?${qs}`)

    sendAPIRequest(qs)
  }

  return (
    <form name="ee-form" data-testid="ee-form" action="/eligibility">
      {formState.map((field) => {
        const content = (
          <div key={field.key} className="">
            {field.category != lastCategory && (
              <h2 className="h2 mb-8">{field.category}</h2>
            )}
            {field.type == 'number' && (
              <div className="mb-10">
                <Input
                  type={field.type}
                  name={field.key}
                  label={field.label}
                  placeholder={field.placeholder ?? ''}
                  onChange={debounce(handleChange, 1000)}
                  defaultValue={formCompletion[field.key]}
                  data-category={field.category}
                  required
                />
              </div>
            )}
            {field.type == 'dropdown' && (
              <div className="mb-12">
                <span className="text-danger">* </span>
                <span className="font-semibold inline-block mb-1.5">
                  <span className="mb-1.5 font-semibold text-content">
                    {field.label}
                  </span>
                  <span className="text-danger font-bold ml-2">(required)</span>
                  <Tooltip field={field.key} />
                </span>
                <Select
                  styles={{
                    container: (styles) => ({
                      ...styles,
                      width: '320px',
                      fontSize: '20px',
                    }),
                    input: (styles) => ({
                      ...styles,
                      boxShadow: 'none',
                    }),
                  }}
                  className="rselect"
                  isSearchable
                  isClearable
                  placeholder="Select from..."
                  defaultValue={
                    field.values.map((opt) => ({
                      value: opt,
                      label: opt,
                    }))[0]
                  }
                  name={field.key}
                  options={field.values.map((opt) => ({
                    value: opt,
                    label: opt,
                  }))}
                  onChange={(newValue, _action) => {
                    if (!newValue) return

                    const formData = retrieveFormData()
                    if (!formData) return

                    // react select calls this function THEN updates the internal representation of the form so the form element is always out of sync
                    //This just stuff the form with the correct information, pverwriting the internal bad state.
                    formData.set(field.key, newValue.value)
                    const queryString = buildQueryStringFromFormData(formData)

                    sendAPIRequest(queryString)
                  }}
                />
              </div>
            )}
            {(field.type == 'radio' || field.type == 'boolean') && (
              <div className="mb-12">
                <Radio
                  name={field.key}
                  values={
                    field.type == 'boolean' ? ['Yes', 'No'] : field.values
                  }
                  keyforid={field.key}
                  label={field.label}
                  onChange={handleChange}
                  category={field.category}
                  defaultValue={formCompletion[field.key]}
                  required
                />
              </div>
            )}
          </div>
        )
        lastCategory = field.category

        return content
      })}

      <div className="flex flex-row gap-x-8 mt-20">
        <button
          type="button"
          className="btn btn-default w-40"
          onClick={(e) => router.push('/')}
        >
          Back
        </button>
        <button type="reset" className="btn btn-default w-40">
          Clear
        </button>
        <button
          type="submit"
          className="btn btn-primary w-40"
          onClick={(e) => {
            handleChange()
            selectedTabIndex(1)
          }}
        >
          Estimate
        </button>
      </div>
    </form>
  )
}

/**
 * Checks the completion fo the form
 *
 * @param fields The fields retrieved from the API
 * @param formCompletion the global form completion state
 * @param setProgress a Dispathc that will set the progress bar's state
 */
const checkCompletion = (
  fields: FieldData[],
  formCompletion: any,
  setProgress: any
) => {
  const personal = fields
    .filter(
      (field) =>
        field.category == 'Personal Information' ||
        field.category == 'Partner Details'
    )
    .map((p) => p.key)
  const personalComplete = personal.every((item) => formCompletion[item])

  const legal = fields
    .filter((field) => field.category == 'Legal Status')
    .map((p) => p.key)
  const legalComplete = legal.every((item) => formCompletion[item])

  setProgress({ personal: personalComplete, legal: legalComplete })
}

/**
 * Builds a query string to the API
 *
 * @param formData Data residing in the eligibility estimator form
 * @param updateFormCompletion optionally update global form completion state
 * @returns
 */
const buildQueryStringFromFormData = (
  formData: FormData,
  updateFormCompletion = true
) => {
  let qs = ''
  for (const [key, value] of formData.entries()) {
    if (value == '') {
      continue
    }

    // build query string
    if (qs !== '') qs += '&'
    qs += `${key}=${value}`

    // update global for completion state
    if (updateFormCompletion) formCompletion[key] = value
  }
  return qs
}

/**
 * Retrieves a form's internal representation of itself.
 *
 * @param formName The form to retrieve, if no option given it will attempt to retrieve the ee-form
 * @returns the eligibility estimator's form data
 */
const retrieveFormData = (formName = 'form[name="ee-form"]') => {
  const form: HTMLFormElement = document.querySelector(formName)
  if (!form) return

  return new FormData(form)
}
