import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Input } from './Input'
import { Radio } from './Radio'
import { Select } from './Select'
import { debounce } from 'lodash'
import { useRouter } from 'next/router'
import { sortBy } from 'lodash'

export const ComponentFactory: React.FC<{ data: any }> = ({ data }) => {
  let lastCategory = null
  const { query } = useRouter()
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
      if (qs !== '') qs += '&'
      qs += `${key}=${value}`
    }
    const newFormData = await fetch(`api/calculateEligibility?${qs}`).then(
      (res) => res.json()
    )
    console.log(newFormData)
    if (!newFormData.error) {
      setFormState(newFormData.fieldData)
    } else {
      // show error label above error field? Need a way to tell the user
    }
  }

  return (
    <form name="ee-form" data-testid="ee-form" noValidate>
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
                  value={query[field.key] ?? undefined}
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
    </form>
  )
}
