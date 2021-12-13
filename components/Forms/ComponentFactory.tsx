import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { Input } from './Input'
import { Radio } from './Radio'
import { Select } from './Select'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { sortBy } from 'lodash'
import type {
  BenefitResult,
  ResponseSuccess,
  ResponseError,
} from '../../utils/api/definitions/types'

export const ComponentFactory: React.VFC<{
  data: ResponseSuccess
  oas: Dispatch<BenefitResult>
  gis: Dispatch<BenefitResult>
  allowance: Dispatch<BenefitResult>
  afs: Dispatch<BenefitResult>
  estimate: Dispatch<boolean>
  selectedTabIndex: Dispatch<number>
}> = ({ data, oas, gis, allowance, afs, estimate, selectedTabIndex }) => {
  let lastCategory = null

  const router = useRouter()
  const query = router.query

  const orderedFields = sortBy(data.fieldData, 'order')
  const [formState, setFormState] = useState(orderedFields)

  /**
   * Global change handler for the dynamic form elements in the eligbility form
   * @param e {ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>} the change even for the form elements
   */
  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    }
  }

  return (
    <form
      name="ee-form"
      data-testid="ee-form"
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
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
                  defaultValue={query[field.key] ?? undefined}
                  data-category={field.category}
                  required
                />
              </div>
            )}
            {field.type == 'dropdown' && (
              <div className="mb-12">
                <Select
                  options={field.values}
                  label={field.label}
                  keyforid={field.key}
                  onChange={handleChange}
                  data-category={field.category}
                />
              </div>
            )}
            {(field.type == 'radio' || field.type == 'boolean') && (
              <div className="mb-12">
                <Radio
                  values={
                    field.type == 'boolean' ? ['Yes', 'No'] : field.values
                  }
                  keyforid={field.key}
                  label={field.label}
                  onChange={handleChange}
                  category={field.category}
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
          type="button"
          className="btn btn-primary w-40"
          onClick={(e) => {
            selectedTabIndex(1)
          }}
        >
          Estimate
        </button>
      </div>
    </form>
  )
}

const retrieveDistinctCategories = (data: any) => {
  const flags = {}
  const distinctCategories = data.filter(function (entry) {
    if (flags[entry.category]) {
      return false
    }
    flags[entry.category] = true
    return true
  })
  return distinctCategories
}

const isFormElementFilled = (
  formElement: HTMLInputElement | HTMLSelectElement
): boolean => {
  if (formElement.value !== '') return true
  return true
}
