import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Input } from './Input'
import { Radio } from './Radio'
import { Select } from './Select'
import { debounce } from 'lodash'
import router, { useRouter } from 'next/router'
import { sortBy } from 'lodash'
import Link from 'next/link'
import { redirect } from 'next/dist/server/api-utils'

export const ComponentFactory: React.FC<{ data: any }> = ({ data }) => {
  let lastCategory = null
  const router = useRouter()
  const query = router.query

  const orderedFields = sortBy(data.fieldData, 'order')
  const [formState, setFormState] = useState(orderedFields)

  /**
   * Global change handler for the dynamic form elements in the eligbility form
   * @param e {ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>} the change even for the form elements
   */
  const handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => Promise<void> = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const formData = new FormData(
      document.querySelector('form[name="ee-form"]')
    )

    let qs = ''
    // Why is partnerReceivingOas in the entries if not in the form???
    for (const [key, value] of formData.entries()) {
      if (value == '') continue
      if (qs !== '') qs += '&'
      qs += `${key}=${value}`
    }

    //TODO: move this check to form submission
    //redirect to exit case if income is too high
    if (parseInt(formData.get('income') as string) > 129757)
      router.push(`/eligibility?${qs}`)

    const newFormData = await fetch(`api/calculateEligibility?${qs}`).then(
      (res) => res.json()
    )
    console.log(newFormData)
    if (!newFormData.error) {
      setFormState(newFormData.fieldData)
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
            {(field.type == 'number' || field.type == 'text') && (
              <div className="mb-10">
                <Input
                  type={field.type}
                  name={field.key}
                  label={field.label}
                  placeholder={field.placeholder ?? ''}
                  onChange={debounce(handleChange, 1000)}
                  defaultValue={query[field.key] ?? undefined}
                  required
                />
              </div>
            )}
            {field.type == 'dropdown' && (
              <div className="mb-12">
                <Select
                  options={field.values}
                  label={field.label}
                  keyForId={field.key}
                  onChange={handleChange}
                />
              </div>
            )}
            {(field.type == 'radio' || field.type == 'boolean') && (
              <div className="mb-12">
                <Radio
                  values={
                    field.type == 'boolean' ? ['Yes', 'No'] : field.values
                  }
                  keyForId={field.key}
                  label={field.label}
                  onChange={handleChange}
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
        <button type="submit" className="btn btn-primary w-40">
          Estimate
        </button>
      </div>
    </form>
  )
}
