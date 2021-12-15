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
   * Global change handler for the dynamic form elements in the eligbility form
   * @param e {ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>} the change event for the form elements
   */
  const handleChange = async () => {
    const form: HTMLFormElement = document.querySelector('form[name="ee-form"]')
    if (!form) return

    const formData = new FormData(form)

    // prepare GET request to send to backend
    let qs = ''
    for (const [key, value] of formData.entries()) {
      if (value == '') {
        continue
      }
      if (qs !== '') qs += '&'
      qs += `${key}=${value}`
      formCompletion[key] = value
    }

    //redirect to exit case if income is too high
    if (parseInt(formData.get('income') as string) > 129757)
      router.push(`/eligibility?${qs}`)

    const newFormData = await fetch(`api/calculateEligibility?${qs}`).then(
      (res) => res.json()
    )

    // if no error, set the formState to the retrieved set of fields
    if (!newFormData.error) {
      console.log(newFormData)
      setFormState(newFormData.fieldData)

      oas(newFormData.oas)
      gis(newFormData.gis)
      allowance(newFormData.allowance)
      afs(newFormData.afs)

      //set Progress
      checkCompletion(newFormData.fieldData, formCompletion, setProgress)
    } else {
      // handle error
    }
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
                    field.key == 'maritalStatus'
                      ? undefined
                      : field.values.map((opt) => ({
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

                    const form: HTMLFormElement = document.querySelector(
                      'form[name="ee-form"]'
                    )
                    if (!form) return

                    const formData = new FormData(form)

                    // prepare GET request to send to backend
                    let qs = ''
                    for (const [key, value] of formData.entries()) {
                      if (value == '' && key !== field.key) {
                        continue
                      }
                      if (qs !== '') qs += '&'
                      if (key == field.key) {
                        qs += `${key}=${newValue.value}`
                      } else {
                        qs += `${key}=${value}`
                      }
                      formCompletion[key] = value
                    }

                    fetch(`api/calculateEligibility?${qs}`)
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
                          checkCompletion(
                            data.fieldData,
                            formCompletion,
                            setProgress
                          )
                        }
                      })
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
